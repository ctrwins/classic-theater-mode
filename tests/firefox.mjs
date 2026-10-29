import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(root, '.local', 'playwright-browsers');
const { firefox } = await import('playwright');
// web-ext is pinned: use Mozilla's own temporary-add-on installer over a
// loopback-only debugger, inside a new disposable test profile.
const { connect, findFreeTcpPort } = await import(new URL('./lib/firefox/remote.js', import.meta.resolve('web-ext')));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'dist/firefox/manifest.json'), 'utf8'));
await fs.mkdir(path.join(root, '.local'), { recursive: true });
const profile = await fs.mkdtemp(path.join(root, '.local', 'firefox-test-'));
const evidence = { testType: 'real Firefox extension with routed synthetic YouTube fixtures', checks: [], errors: [] };
let context;
let remote;
const bootstrap = `
  window.ytcfg = { data_: { EXPERIMENT_FLAGS: { kevlar_watch_grid: true, unrelated: 7 } } };
  window.firstRead = ytcfg.data_.EXPERIMENT_FLAGS.kevlar_watch_grid;
  document.addEventListener('DOMContentLoaded', () => {
    const watch = document.querySelector('ytd-watch-flexy');
    const button = document.querySelector('.ytp-size-button');
    button.addEventListener('click', () => watch.toggleAttribute('theater'));
    document.addEventListener('keydown', event => {
      if (event.key.toLowerCase() === 't' && event.target.tagName !== 'INPUT') watch.toggleAttribute('theater');
    });
  });
`;
const html = '<!doctype html><html><head><script src="/bootstrap.js"></script></head><body><ytd-watch-flexy><button class="ytp-size-button">Theater mode</button></ytd-watch-flexy><input aria-label="Comment"></body></html>';
try {
  const port = await findFreeTcpPort();
  context = await firefox.launchPersistentContext(profile, {
    headless: true,
    args: ['-start-debugger-server', String(port)],
    firefoxUserPrefs: {
      'devtools.debugger.remote-enabled': true,
      'devtools.debugger.prompt-connection': false,
      'devtools.debugger.force-local': true,
    },
  });
  context.setDefaultTimeout(10000);
  evidence.browserVersion = context.browser().version();
  remote = await connect(port);
  await remote.installTemporaryAddon(path.join(root, 'dist/firefox'));
  const addon = await remote.getInstalledAddon(manifest.browser_specific_settings.gecko.id);
  assert.equal(addon.id, manifest.browser_specific_settings.gecko.id);
  evidence.checks.push('Firefox installed the generated manifest and shared scripts');
  await context.route('**/*', route => route.fulfill(new URL(route.request().url()).pathname === '/bootstrap.js'
    ? { contentType: 'application/javascript', body: bootstrap }
    : { contentType: 'text/html', headers: { 'Content-Security-Policy': "script-src 'self'" }, body: html }));
  const page = await context.newPage();
  page.on('pageerror', error => evidence.errors.push(error.message));
  await page.goto('https://www.youtube.com/watch?v=fixture-one');
  assert.equal(await page.evaluate(() => window.firstRead), false);
  assert.equal(await page.evaluate(() => ytcfg.data_.EXPERIMENT_FLAGS.unrelated), 7);
  evidence.checks.push('MAIN-world layout interception before the first site script, under CSP');
  const theater = expected => page.waitForFunction(value => document.querySelector('ytd-watch-flexy').hasAttribute('theater') === value, expected);
  await page.locator('.ytp-size-button').click();
  await theater(true);
  // Let the storage write settle before tearing down the content-script world.
  await page.waitForTimeout(300);
  await page.reload();
  await theater(true);
  evidence.checks.push('real trusted button choice persists through a full reload');
  await page.locator('body').click({ position: { x: 500, y: 10 } });
  await page.keyboard.press('t');
  await theater(false);
  await page.waitForTimeout(300);
  await page.reload();
  await theater(false);
  // Force a conflicting site default: restoring false must actively undo it.
  await page.evaluate(() => {
    document.dispatchEvent(new Event('yt-navigate-start'));
    history.pushState({}, '', '/watch?v=fixture-two');
    document.querySelector('ytd-watch-flexy').setAttribute('theater', '');
    document.dispatchEvent(new Event('yt-navigate-finish'));
  });
  await theater(false);
  evidence.checks.push('T shortcut saves normal mode; SPA navigation restores that choice');
  await page.locator('input').fill('tt');
  await page.evaluate(() => document.querySelector('ytd-watch-flexy').setAttribute('fullscreen', ''));
  await page.locator('.ytp-size-button').click();
  await page.waitForTimeout(300);
  await page.reload();
  await page.evaluate(() => {
    document.dispatchEvent(new Event('yt-navigate-start'));
    document.querySelector('ytd-watch-flexy').setAttribute('theater', '');
    document.dispatchEvent(new Event('yt-navigate-finish'));
  });
  await theater(false);
  evidence.checks.push('typing and fullscreen-flag transitions do not overwrite the choice');
  await page.goto('https://www.youtube.com/shorts/fixture');
  await page.locator('.ytp-size-button').click();
  await page.waitForTimeout(300);
  await page.goto('https://www.youtube.com/watch?v=fixture-three');
  await page.evaluate(() => {
    document.dispatchEvent(new Event('yt-navigate-start'));
    document.querySelector('ytd-watch-flexy').setAttribute('theater', '');
    document.dispatchEvent(new Event('yt-navigate-finish'));
  });
  await theater(false);
  evidence.checks.push('Shorts does not overwrite the saved watch-page choice');
  for (const url of ['https://example.org/', 'https://m.youtube.com/watch?v=fixture']) {
    await page.goto(url);
    assert.equal(await page.evaluate(() => window.firstRead), true);
  }
  evidence.checks.push('no layout injection on other hosts or mobile YouTube');
  assert.deepEqual(evidence.errors, []);
  evidence.status = 'passed';
} catch (error) {
  evidence.status = 'failed';
  evidence.failure = error.message;
  throw error;
} finally {
  remote?.disconnect();
  if (context) await context.close();
  await fs.rm(profile, { recursive: true, force: true });
  evidence.temporaryProfileRemoved = true;
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  await fs.writeFile(path.join(root, 'test-results/firefox.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
}
