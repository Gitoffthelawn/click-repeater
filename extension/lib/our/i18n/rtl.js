var RTL_LOCALES = new Set(["ar"]);

function isRtlLocale(locale) {
  return RTL_LOCALES.has(locale);
}

// Bridge for background-context ES modules; harmless no-op as a classic script.
globalThis.RTL_LOCALES = RTL_LOCALES;
globalThis.isRtlLocale = isRtlLocale;
