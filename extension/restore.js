/* Classic Theater Mode for YouTube — local, page-lifetime layout selection only. */
(() => {
  'use strict';

  // These switches still select the legacy watch renderer in YouTube's public
  // desktop bundle. Do not disable unrelated experiments or patch prototypes.
  const layoutFlags = [
    'kevlar_watch_grid',
    'kevlar_watch_fixie',
    'web_side_rail_dismissible_panels',
    'web_watch_imax_theater_mode',
    'disable_theater_mode',
  ];
  const observed = new WeakMap();
  const isObject = value => value !== null &&
    (typeof value === 'object' || typeof value === 'function');

  // Hook only these config paths. All descriptors remain configurable; custom
  // accessors and frozen/non-configurable properties are left intact. No polls.
  function observeValue(target, key, transform) {
    if (!isObject(target)) return;
    let keys = observed.get(target);
    if (!keys) observed.set(target, keys = new Set());
    if (keys.has(key)) return;
    keys.add(key);
    try {
      const descriptor = Object.getOwnPropertyDescriptor(target, key);
      if (descriptor && !Object.hasOwn(descriptor, 'value')) return;
      if (descriptor && !descriptor.configurable) {
        if (isObject(descriptor.value)) transform(descriptor.value);
        return;
      }
      if (!descriptor && !Object.isExtensible(target)) return;
      let value = transform(descriptor?.value);
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get() { return value; },
        set(next) { value = transform(next); },
      });
    } catch {
      // A changed site or incompatible descriptor must never break the page.
    }
  }

  function patchFlags(flags) {
    if (isObject(flags)) {
      for (const key of layoutFlags) observeValue(flags, key, () => false);
    }
    return flags;
  }
  function patchConfig(config) {
    observeValue(config, 'EXPERIMENT_FLAGS', patchFlags);
    return config;
  }
  observeValue(window, 'ytcfg', config => {
    observeValue(config, 'data_', patchConfig);
    return config;
  });
  observeValue(window, 'yt', yt => {
    observeValue(yt, 'config_', patchConfig);
    return yt;
  });
})();
