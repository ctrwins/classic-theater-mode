// Explicit opt-in network smoke test. Uses an empty, disposable Brave profile.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'classic-watch-live-'));
const evidence = { type: 'unsigned live YouTube smoke test', accountRegressionVerified: false };
let context;
try {
  context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.BRAVE_EXECUTABLE || 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
    headless: true, viewport: { width: 1920, height: 1080 },
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--mute-audio', `--disable-extensions-except=${path.join(root, 'extension')}`, `--load-extension=${path.join(root, 'extension')}`],
  });
  const page = await context.newPage();
  const response = await page.goto('https://www.youtube.com/watch?v=ZK3U92URi_c', { waitUntil: 'domcontentloaded', timeout: 45000 });
  evidence.httpStatus = response.status();
  const reject = page.getByRole('button', { name: /^(Alle ablehnen|Reject all)$/ });
  await page.waitForSelector('ytd-watch-flexy #movie_player', { state: 'visible', timeout: 30000 });
  // The consent overlay arrives asynchronously, after the player element.
  // A missing element immediately after DOMContentLoaded is not an opt-out.
  await reject.waitFor({ state: 'visible', timeout: 10000 }).catch(error => {
    if (error.name !== 'TimeoutError') throw error;
  });
  // Consent is a separate user decision, never inferred from test permission.
  if (await reject.isVisible()) {
    if (process.env.ALLOW_REJECT_CONSENT !== '1') throw new Error('Consent requires explicit approval; visual test not completed.');
    await reject.click();
    await reject.waitFor({ state: 'hidden', timeout: 15000 });
    evidence.consent = 'rejected with explicit approval in disposable profile';
  }
  await page.waitForFunction(() => document.querySelector('ytd-watch-flexy')?.active === true, null, { timeout: 15000 });
  await page.keyboard.press('t');
  await page.waitForFunction(() => document.querySelector('ytd-watch-flexy')?.hasAttribute('theater'), null, { timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('#full-bleed-container')?.getBoundingClientRect().width > innerWidth * 0.9, null, { timeout: 15000 });
  await page.waitForFunction(() => {
    const player = document.querySelector('#movie_player')?.getBoundingClientRect();
    const video = document.querySelector('#movie_player video');
    const controls = document.querySelector('#movie_player .ytp-chrome-bottom')?.getBoundingClientRect();
    return player && video && controls && video.videoWidth > 0 &&
      controls.width > innerWidth * 0.9 && Math.abs(video.getBoundingClientRect().height - player.height) < 3;
  }, null, { timeout: 20000 });
  evidence.layout = await page.evaluate(() => {
    const watch = document.querySelector('ytd-watch-flexy');
    const rect = selector => {
      const r = document.querySelector(selector)?.getBoundingClientRect();
      return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
    };
    return { element: watch.localName, theater: watch.hasAttribute('theater'), viewportWidth: innerWidth,
      fullBleed: rect('#full-bleed-container'), player: rect('#movie_player'),
      metadata: rect('ytd-watch-metadata'), flags: Object.fromEntries(
        ['kevlar_watch_grid','kevlar_watch_fixie','web_side_rail_dismissible_panels','web_watch_imax_theater_mode','disable_theater_mode'].map(k => [k, ytcfg.get('EXPERIMENT_FLAGS')[k]])) };
  });
  assert.ok(evidence.layout.player.width > evidence.layout.viewportWidth * 0.9);
  assert.ok(Object.values(evidence.layout.flags).every(value => value === false));
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  assert.equal(await reject.isVisible(), false, 'consent overlay must be absent');
  await page.waitForFunction(() => {
    const player = document.querySelector('#movie_player')?.getBoundingClientRect();
    const secondary = document.querySelector('ytd-watch-flexy #secondary')?.getBoundingClientRect();
    return player && secondary && secondary.y >= player.bottom;
  }, null, { timeout: 15000 });
  await page.screenshot({ path: path.join(root, 'test-results/live-theater.png'), animations: 'disabled' });
  // Known limitation: role-based consent detection has missed visible overlays.
  // Metrics alone must never imply successful visual/account verification.
  evidence.status = 'layout_metrics_only_visual_review_required';
} catch (error) {
  evidence.status = 'blocked_or_failed';
  evidence.error = error.message;
  throw error;
} finally {
  if (context) await context.close();
  await fs.rm(profile, { recursive: true, force: true });
  evidence.temporaryProfileRemoved = true;
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  await fs.writeFile(path.join(root, 'test-results/live.json'), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
}
