import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

const script = new URL('../extension/view-preference.js', import.meta.url);
const key = 'classicTheaterMode';
const flush = async () => { for (let i = 0; i < 4; i++) await new Promise(resolve => setImmediate(resolve)); };

// Minimal browser boundary: execute the actual content script, without a real
// browser/profile, real time, or writing anything outside this process.
function boot(store = {}, options = {}) {
  const listeners = new Map();
  const observers = new Set();
  const timers = new Map();
  let clock = 0;
  let timerId = 0;
  let clicks = 0;
  let visible = true;
  let available = options.available !== false;
  const attrs = new Set(options.theater ? ['theater'] : []);
  const location = { pathname: '/watch', href: 'https://www.youtube.com/watch?v=one' };
  const notify = () => queueMicrotask(() => { for (const o of observers) o.callback([]); });
  const emit = (type, event = {}) => { for (const f of listeners.get(type) || []) f({ type, ...event }); };
  const button = {
    disabled: false,
    closest: selector => selector === '.ytp-size-button' ? button : null,
    getClientRects: () => visible ? [{}] : [],
    click(trusted = false) {
      emit('click', { isTrusted: trusted, target: button, composedPath: () => [button] });
      clicks++;
      attrs.has('theater') ? attrs.delete('theater') : attrs.add('theater');
      notify();
    },
  };
  const watch = {
    isConnected: true,
    hasAttribute: name => attrs.has(name),
    querySelector: selector => selector === '.ytp-size-button' ? button : null,
    contains: node => node === button,
  };
  const document = {
    documentElement: {}, fullscreenElement: null,
    querySelector: () => available ? watch : null,
    addEventListener(type, callback) { if (!listeners.has(type)) listeners.set(type, []); listeners.get(type).push(callback); },
  };
  const writes = [];
  let resolveRead;
  const storage = {
    get: () => options.deferredRead ? new Promise(resolve => { resolveRead = resolve; }) : Promise.resolve({ ...store }),
    set: async values => { writes.push({ ...values }); Object.assign(store, values); },
  };
  const context = vm.createContext({
    document, location,
    ...(options.firefox ? {
      browser: { storage: { local: storage } },
      // Firefox also exposes a chrome namespace; prefer its native Promise API.
      chrome: { storage: { local: { get() { throw new Error('callback-only chrome API'); } } } },
    } : { chrome: { storage: { local: storage } } }),
    queueMicrotask,
    MutationObserver: class { constructor(callback) { this.callback = callback; } observe() { observers.add(this); } disconnect() { observers.delete(this); } },
    setTimeout: (fn, delay = 0) => { const id = ++timerId; timers.set(id, { fn, at: clock + delay }); return id; },
    clearTimeout: id => timers.delete(id),
  });
  if (fs.existsSync(script)) vm.runInContext(fs.readFileSync(script, 'utf8'), context, { timeout: 1000 });
  return {
    document, watch, button, location, writes, notify, emit,
    get theater() { return attrs.has('theater'); },
    get clicks() { return clicks; },
    show() { available = true; notify(); },
    setVisible(value) { visible = value; notify(); },
    nativeMode(value) { value ? attrs.add('theater') : attrs.delete('theater'); notify(); },
    resolveRead(value) { resolveRead(value); },
    async advance(ms) {
      clock += ms;
      for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.fn(); }
      await flush();
    },
    navigate(path = '/watch', id = 'two') {
      emit('yt-navigate-start'); location.pathname = path; location.href = `https://www.youtube.com${path}?v=${id}`;
      attrs.delete('theater'); emit('yt-navigate-finish'); notify();
    },
  };
}

test('Firefox restores and saves through the native browser Promise API', async () => {
  const store = { [key]: true };
  const page = boot(store, { firefox: true });
  await flush();
  assert.equal(page.theater, true);
  assert.deepEqual(page.writes, []);
  page.button.click(true);
  await flush();
  assert.equal(store[key], false);
  const next = boot(store, { firefox: true, theater: true });
  await flush();
  assert.equal(next.theater, false);
});

test('restores a saved theater preference on a fresh page without rewriting storage', async () => {
  const page = boot({ [key]: true });
  await flush();
  assert.equal(page.theater, true);
  assert.equal(page.clicks, 1);
  assert.deepEqual(page.writes, []);
});

test('remembers explicit theater and normal choices across fresh page instances', async () => {
  const store = {};
  const first = boot(store);
  await flush();
  assert.equal(first.clicks, 0, 'no preference means leave YouTube alone');
  first.button.click(true);
  await flush();
  assert.equal(store[key], true);
  const second = boot(store);
  await flush();
  assert.equal(second.theater, true);
  second.button.click(true);
  await flush();
  assert.equal(store[key], false);
  const third = boot(store, { theater: true });
  await flush();
  assert.equal(third.theater, false);
  assert.deepEqual(third.writes, []);
});

test('restores the remembered choice after SPA navigation but leaves Shorts alone', async () => {
  const store = {};
  const page = boot(store);
  await flush();
  page.button.click(true);
  await flush();
  page.navigate();
  await flush();
  assert.equal(page.theater, true);
  const before = page.clicks;
  page.navigate('/shorts/example');
  await page.advance(300);
  assert.equal(page.clicks, before);
  assert.equal(store[key], true);
});

test('remembers the T shortcut without treating typing in a text field as a choice', async () => {
  const store = {};
  const page = boot(store);
  await flush();
  page.emit('keydown', { isTrusted: true, key: 't', target: { closest: () => null } });
  page.nativeMode(true);
  await flush();
  assert.equal(store[key], true);
  page.emit('keydown', { isTrusted: true, key: 't', target: { closest: () => ({}) } });
  page.nativeMode(false);
  await flush();
  assert.equal(store[key], true, 'typing must not overwrite the setting');
});

test('waits for a late player instead of losing the preference at startup', async () => {
  const page = boot({ [key]: true }, { available: false });
  await flush();
  assert.equal(page.clicks, 0);
  page.show();
  await flush();
  assert.equal(page.theater, true);
});

test('ignores fullscreen transitions and restores after leaving fullscreen', async () => {
  const store = { [key]: true };
  const page = boot(store);
  page.document.fullscreenElement = {};
  await flush();
  page.button.click(true);
  page.nativeMode(false);
  await flush();
  assert.deepEqual(page.writes, []);
  page.document.fullscreenElement = null;
  page.emit('fullscreenchange');
  await flush();
  assert.equal(page.theater, true);
  assert.equal(store[key], true);
});

test('a late storage read cannot override a newer manual choice', async () => {
  const store = {};
  const page = boot(store, { deferredRead: true });
  page.button.click(true);
  await flush();
  page.resolveRead({ [key]: false });
  await flush();
  assert.equal(page.theater, true);
  assert.equal(store[key], true);
});

test('synthetic clicks and expired keyboard intent never create a stored preference', async () => {
  const store = {};
  const page = boot(store);
  await flush();
  page.button.click();
  await flush();
  assert.deepEqual(store, {});
  page.emit('keydown', { isTrusted: true, key: 't', target: { closest: () => null } });
  await page.advance(2100);
  page.nativeMode(false);
  await flush();
  assert.deepEqual(store, {});
});

test('rapid explicit choices are stored in order, with only one boolean', async () => {
  const store = {};
  const page = boot(store);
  await flush();
  page.button.click(true);
  page.button.click(true);
  await flush();
  assert.deepEqual(store, { [key]: false });
  assert.deepEqual(page.writes, [{ [key]: true }, { [key]: false }]);
});

test('stops trying after three ineffective restores rather than toggling forever', async () => {
  const page = boot({ [key]: true });
  let attempts = 0;
  page.button.click = () => { attempts++; };
  await flush();
  for (let i = 0; i < 6; i++) await page.advance(300);
  assert.equal(attempts, 3);
});
