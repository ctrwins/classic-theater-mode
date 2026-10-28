/* Local view preference. Runs in the extension's isolated world. */
(() => {
  'use strict';
  const key = 'classicTheaterMode';
  let desired;
  let loaded = false;
  let pending;
  let pendingTimer;
  let userInteracted = false;
  let scheduled = false;
  let restoring = false;
  let attempts = 0;
  let navigating = false;
  let restoreTimer;
  let writes = Promise.resolve();

  function currentWatch() {
    if (navigating || location.pathname !== '/watch') return null;
    const watch = document.querySelector('ytd-watch-flexy');
    return watch && !watch.hasAttribute('hidden') ? watch : null;
  }

  function fullscreen(watch) {
    return !!document.fullscreenElement || watch?.hasAttribute('fullscreen');
  }

  function forgetPending() {
    clearTimeout(pendingTimer);
    pending = undefined;
  }

  function saveChoice(watch) {
    desired = watch.hasAttribute('theater');
    const value = desired;
    forgetPending();
    // Serialize rapid choices so the last user action wins on disk too.
    writes = writes.then(() => chrome.storage.local.set({ [key]: value })).catch(() => {});
  }

  function reconcile() {
    const watch = currentWatch();
    if (!watch || fullscreen(watch)) { forgetPending(); return; }
    if (pending) {
      if (pending.watch !== watch) forgetPending();
      else if (watch.hasAttribute('theater') !== pending.before) saveChoice(watch);
      else return;
    }
    if (!loaded || typeof desired !== 'boolean' || restoring || attempts >= 3) return;
    if (watch.hasAttribute('theater') === desired) return;
    const button = watch?.querySelector('.ytp-size-button');
    if (!button || button.disabled || !button.getClientRects().length) return;
    // Use YouTube's own control instead of forging DOM layout attributes.
    // Bounded attempts avoid a toggle loop if YouTube's control changes.
    attempts++;
    restoring = true;
    button.click();
    restoreTimer = setTimeout(() => { restoring = false; schedule(); }, 250);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; reconcile(); });
  }

  function rememberIntent(event) {
    if (!event.isTrusted) return;
    const watch = currentWatch();
    if (!watch || fullscreen(watch)) return;
    if (event.type === 'keydown') {
      if (event.key?.toLowerCase() !== 't' || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
      if (event.target?.isContentEditable || event.target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')) return;
    } else {
      const button = event.target?.closest?.('.ytp-size-button');
      if (!button || !watch.contains(button)) return;
    }
    // Capture runs before the site's handler. Save only the resulting change,
    // not the initial default and not programmatic clicks from this script.
    if (pending && pending.watch === watch && watch.hasAttribute('theater') !== pending.before) saveChoice(watch);
    forgetPending();
    userInteracted = true;
    attempts = 3;
    pending = { watch, before: watch.hasAttribute('theater') };
    pendingTimer = setTimeout(forgetPending, 2000);
    schedule();
  }

  document.addEventListener('click', rememberIntent, true);
  document.addEventListener('keydown', rememberIntent, true);
  document.addEventListener('yt-navigate-start', () => {
    navigating = true;
    forgetPending();
    clearTimeout(restoreTimer);
    restoring = false;
  });
  document.addEventListener('yt-navigate-finish', () => {
    navigating = false;
    attempts = 0;
    schedule();
  });
  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ['theater', 'fullscreen', 'hidden'],
  });
  document.addEventListener('fullscreenchange', schedule);
  chrome.storage.local.get(key).then(values => {
    if (!userInteracted && typeof values[key] === 'boolean') desired = values[key];
  }).catch(() => {}).finally(() => { loaded = true; schedule(); });
})();
