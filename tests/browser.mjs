import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const executablePath = process.env.BRAVE_EXECUTABLE || 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe';
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'classic-watch-test-'));
let context;
const evidence = { testType: 'real extension loading with synthetic config fixture', checks: [], errors: [] };
try {
  context = await chromium.launchPersistentContext(profile, {
    executablePath,
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--disable-extensions-except=${path.join(root, 'extension')}`, `--load-extension=${path.join(root, 'extension')}`],
  });
  evidence.browserVersion = context.browser()?.version();
  await context.route('**/*', route => {
    if (new URL(route.request().url()).pathname === '/bootstrap.js') {
      return route.fulfill({ contentType: 'application/javascript', body: `
        window.ytcfg = window.ytcfg || {};
        ytcfg.data_ = { EXPERIMENT_FLAGS: { web_side_rail_dismissible_panels: true,
          kevlar_watch_grid: true, disable_theater_mode: true, unrelated: 7 } };
        window.firstRead = ytcfg.data_.EXPERIMENT_FLAGS.web_side_rail_dismissible_panels;
      ` });
    }
    return route.fulfill({ contentType: 'text/html', headers: { 'Content-Security-Policy': "script-src 'self'" }, body: '<!doctype html><html><head><script src="/bootstrap.js"></script></head><body>Local test fixture, not YouTube content.</body></html>' });
  });
  const page = await context.newPage();
  page.on('pageerror', error => evidence.errors.push(error.message));
  await page.goto('https://www.youtube.com/watch?v=test-fixture');
  assert.equal(await page.evaluate(() => window.firstRead), false, 'manifest injects before site scripts');
  evidence.checks.push('document_start MAIN-world interception before first inline consumer, under CSP');
  const result = await page.evaluate(() => {
    history.pushState({}, '', '/watch?v=second-fixture');
    Object.assign(ytcfg.data_.EXPERIMENT_FLAGS, { kevlar_watch_grid: true, unrelated: 8 });
    return [ytcfg.data_.EXPERIMENT_FLAGS.kevlar_watch_grid, ytcfg.data_.EXPERIMENT_FLAGS.unrelated];
  });
  assert.deepEqual(result, [false, 8]);
  evidence.checks.push('same-document video navigation and later config writes');
  await page.goto('https://example.org/');
  assert.equal(await page.evaluate(() => window.firstRead), true);
  evidence.checks.push('no injection on other websites');
  await page.goto('https://m.youtube.com/watch?v=test-fixture');
  assert.equal(await page.evaluate(() => window.firstRead), true);
  evidence.checks.push('no injection on mobile YouTube');
  assert.deepEqual(evidence.errors, []);
  evidence.status = 'passed';
} finally {
  if (context) await context.close();
  await fs.rm(profile, { recursive: true, force: true });
  evidence.temporaryProfileRemoved = true;
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  await fs.writeFile(path.join(root, 'test-results/browser.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
}
