import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));

test('builds separate browser manifests around identical shared runtime files', () => {
  const result = spawnSync(process.execPath, ['tools/build.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const readManifest = target => JSON.parse(fs.readFileSync(path.join(root, 'dist', target, 'manifest.json')));
  const chromium = readManifest('chromium');
  const firefox = readManifest('firefox');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
  assert.equal(chromium.version, pkg.version);
  assert.equal(firefox.version, pkg.version);
  assert.equal(chromium.minimum_chrome_version, '111');
  assert.equal(chromium.browser_specific_settings, undefined);
  assert.equal(firefox.minimum_chrome_version, undefined);
  assert.equal(firefox.browser_specific_settings.gecko.id, 'classic-theater-mode@ctrwins.github.io');
  assert.equal(firefox.browser_specific_settings.gecko.strict_min_version, '140.0');
  assert.equal(firefox.browser_specific_settings.gecko_android?.strict_min_version, '142.0');
  assert.deepEqual(firefox.browser_specific_settings.gecko.data_collection_permissions, { required: ['none'] });
  assert.deepEqual(firefox.content_scripts, chromium.content_scripts);
  assert.deepEqual(firefox.permissions, ['storage']);
  assert.equal(firefox.update_url, undefined, 'AMO owns updates');
  assert.equal(firefox.browser_specific_settings.gecko.update_url, undefined);
  for (const target of ['chromium', 'firefox']) {
    const dir = path.join(root, 'dist', target);
    assert.deepEqual(fs.readdirSync(dir).sort(), ['LICENSE', 'icons', 'manifest.json', 'restore.js', 'view-preference.js']);
    for (const file of ['restore.js', 'view-preference.js', 'LICENSE', ...Object.values(chromium.icons)]) {
      assert.deepEqual(fs.readFileSync(path.join(dir, file)), fs.readFileSync(path.join(root, 'extension', file)), `${target}/${file}`);
    }
  }
});
