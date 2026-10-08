import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const scriptPath = new URL('../extension/restore.js', import.meta.url);
function boot(initial = {}) {
  const window = initial;
  const context = vm.createContext({ window });
  const source = fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, 'utf8') : '';
  vm.runInContext(source, context, { timeout: 1000 });
  return { window, context };
}

test('late YouTube config selects classic layout and preserves unrelated settings', () => {
  const { window } = boot();
  window.ytcfg = {};
  window.ytcfg.data_ = { EXPERIMENT_FLAGS: {
    web_side_rail_dismissible_panels: true,
    web_watch_imax_theater_mode: true,
    kevlar_watch_grid: true,
    kevlar_watch_fixie: true,
    disable_theater_mode: true,
    unrelated_feature: true,
    unrelated_number: 12,
  }, SOME_OTHER_CONFIG: 'preserved' };
  const flags = window.ytcfg.data_.EXPERIMENT_FLAGS;
  for (const key of ['web_side_rail_dismissible_panels', 'web_watch_imax_theater_mode',
    'kevlar_watch_grid', 'kevlar_watch_fixie', 'disable_theater_mode']) {
    assert.equal(flags[key], false, key);
  }
  assert.equal(flags.unrelated_feature, true);
  assert.equal(flags.unrelated_number, 12);
  assert.equal(window.ytcfg.data_.SOME_OTHER_CONFIG, 'preserved');
});

test('later merges and replacement flag objects cannot re-enable targeted layouts', () => {
  const { window } = boot();
  window.ytcfg = { data_: { EXPERIMENT_FLAGS: {} } };
  const flags = window.ytcfg.data_.EXPERIMENT_FLAGS;
  Object.assign(flags, { kevlar_watch_grid: true, video_quality_feature: 'hd' });
  assert.equal(flags.kevlar_watch_grid, false);
  assert.equal(flags.video_quality_feature, 'hd');
  window.ytcfg.data_.EXPERIMENT_FLAGS = { kevlar_watch_grid: true, other: 'next' };
  assert.equal(window.ytcfg.data_.EXPERIMENT_FLAGS.kevlar_watch_grid, false);
  assert.equal(window.ytcfg.data_.EXPERIMENT_FLAGS.other, 'next');
  window.ytcfg = { data_: { EXPERIMENT_FLAGS: { kevlar_watch_fixie: true } } };
  assert.equal(window.ytcfg.data_.EXPERIMENT_FLAGS.kevlar_watch_fixie, false);
});

test('existing config and yt.config_ aliases work without losing object identity', () => {
  const flags = { web_side_rail_dismissible_panels: true };
  const config = { EXPERIMENT_FLAGS: flags };
  const initial = { ytcfg: { data_: config }, yt: { config_: config } };
  const { window } = boot(initial);
  assert.equal(window.yt.config_, config);
  assert.equal(window.ytcfg.data_.EXPERIMENT_FLAGS, flags);
  assert.equal(flags.web_side_rail_dismissible_panels, false);
  window.yt.config_ = { EXPERIMENT_FLAGS: { disable_theater_mode: true } };
  assert.equal(window.yt.config_.EXPERIMENT_FLAGS.disable_theater_mode, false);
});

test('frozen flags, custom accessors and primitives fail safely without replacement', () => {
  const frozen = Object.freeze({ kevlar_watch_grid: true });
  const { window } = boot({ ytcfg: { data_: { EXPERIMENT_FLAGS: frozen } } });
  assert.equal(window.ytcfg.data_.EXPERIMENT_FLAGS, frozen);
  assert.equal(frozen.kevlar_watch_grid, true);
  window.ytcfg = null;
  window.ytcfg = { data_: 4 };
  assert.equal(window.ytcfg.data_, 4);
  let reads = 0;
  const accessorHost = {};
  const getter = () => { reads++; return {}; };
  Object.defineProperty(accessorHost, 'ytcfg', { get: getter, configurable: true });
  boot(accessorHost);
  assert.equal(Object.getOwnPropertyDescriptor(accessorHost, 'ytcfg').get, getter);
  assert.equal(reads, 0);
});

test('nonconfigurable config container can still supply mutable flags safely', () => {
  const config = { EXPERIMENT_FLAGS: { kevlar_watch_grid: true } };
  const ytcfg = {};
  Object.defineProperty(ytcfg, 'data_', { value: config, configurable: false });
  const { window } = boot({ ytcfg });
  assert.equal(window.ytcfg.data_, config);
  assert.equal(config.EXPERIMENT_FLAGS.kevlar_watch_grid, false);
});

test('serialization remains valid and no prototype APIs are modified', () => {
  const descriptors = Object.getOwnPropertyDescriptors(Object.prototype);
  const { window, context } = boot();
  const nativeStringify = vm.runInContext('JSON.stringify', context);
  window.ytcfg = { data_: { EXPERIMENT_FLAGS: { kevlar_watch_grid: true, volume: 55 } } };
  const flags = window.ytcfg.data_.EXPERIMENT_FLAGS;
  const serialized = JSON.parse(JSON.stringify(flags));
  assert.equal(serialized.kevlar_watch_grid, false);
  assert.equal(serialized.volume, 55);
  assert.equal(vm.runInContext('JSON.stringify', context), nativeStringify);
  assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), descriptors);
  assert.equal(Object.getOwnPropertyDescriptor(flags, 'kevlar_watch_grid').configurable, true);
});

test('manifest grants only a top-frame YouTube document-start script, no APIs', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../extension/manifest.json', import.meta.url)));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.content_scripts.length, 1);
  const script = manifest.content_scripts[0];
  assert.deepEqual(script.matches, ['https://www.youtube.com/*']);
  assert.equal(script.run_at, 'document_start');
  assert.equal(script.world, 'MAIN');
  assert.equal(script.all_frames, false);
  for (const name of ['permissions', 'host_permissions', 'background', 'web_accessible_resources', 'externally_connectable']) {
    assert.equal(manifest[name], undefined, name);
  }
});

test('manifest icons reference PNG files at the declared sizes', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../extension/manifest.json', import.meta.url)));
  assert.ok(manifest.icons, 'manifest must declare icons');
  assert.deepEqual(Object.keys(manifest.icons), ['16', '32', '48', '128']);
  for (const [size, file] of Object.entries(manifest.icons)) {
    const png = fs.readFileSync(new URL(`../extension/${file}`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
    assert.equal(png.subarray(12, 16).toString('ascii'), 'IHDR', file);
    assert.equal(png.readUInt32BE(16), Number(size), `${file}: width`);
    assert.equal(png.readUInt32BE(20), Number(size), `${file}: height`);
    assert.equal(png[25], 6, `${file}: RGBA transparency`);
  }
});
