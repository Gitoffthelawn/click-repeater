function welcomeStepIcon(raw, size) {
  if (size === undefined) size = 14;
  return raw.replace("<svg ", '<svg width="' + size + '" height="' + size + '" ');
}

// Bridge for background-context ES modules; harmless no-op as a classic script.
globalThis.welcomeStepIcon = welcomeStepIcon;
