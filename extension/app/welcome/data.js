var WELCOME_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="Click Repeater"><rect width="24" height="24" rx="3" fill="#012292"/><g fill="#ffffff" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></g></svg>';

var WELCOME_PUZZLE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg>';

var WELCOME_PIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>';

var WELCOME_ARROW_UP_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';

var WELCOME_HEART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>';

var WELCOME_GITHUB_URL = "https://github.com/md2it/browser-extension-click-repeater";

var WELCOME_ABOUT_SECTION_ICONS = {
  overview: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  capabilities: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11 12 14 22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  privacy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 17 6-6-6-6M12 19h8"/></svg>',
  statistics: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 17V9M18 17V5M8 17v-3M3 17v-1M3 21h18"/></svg>'
};

async function getLocaleForWelcome() {
  try {
    const data = await ext.storage.local.get("locale");
    return normalizeLocale(data?.locale) ?? "en";
  } catch {
    return "en";
  }
}

function buildWelcomeLocalePayload(locale) {
  function tl(key) {
    return TRANSLATIONS[locale]?.[key] ?? EN_MESSAGES[key] ?? key;
  }
  return {
    locale,
    dir: isRtlLocale(locale) ? "rtl" : "ltr",
    headerSubtitle: tl("panelSubtitle"),
    pinHeading: tl("welcomePin"),
    pinStep1: tl("welcomePinStep1"),
    pinStep2: tl("welcomePinStep2"),
    pinStep3: tl("welcomePinStep3"),
    aboutSections: [
      { heading: tl("aboutOverviewHeading"), iconHtml: WELCOME_ABOUT_SECTION_ICONS.overview, items: [{ text: tl("aboutOverview") }] },
      { heading: tl("aboutCapabilitiesHeading"), iconHtml: WELCOME_ABOUT_SECTION_ICONS.capabilities, items: ["aboutRecordsClicks", "aboutRepeatsClicks", "aboutPositionMode", "aboutVisualisation", "aboutRepeats", "aboutSpeed", "aboutDefaultShortcut"].map((key) => ({ text: tl(key) })) },
      { heading: tl("aboutPrivacyHeading"), iconHtml: WELCOME_ABOUT_SECTION_ICONS.privacy, items: ["noNetwork", "noCollection"].map((key) => ({ text: tl(key) })) },
      { heading: tl("aboutCodeHeading"), iconHtml: WELCOME_ABOUT_SECTION_ICONS.code, items: [{ text: tl("codeOnGithub"), href: WELCOME_GITHUB_URL }, { text: tl("credits") }] },
      { heading: tl("aboutStatisticsHeading"), iconHtml: WELCOME_ABOUT_SECTION_ICONS.statistics, items: [{ text: tl("aboutScenarioRuns").replace("{count}", "0") }] }
    ],
    aboutFooter: { productName: "Click Repeater", author: "md2it" },
    langAriaLabel: tl("language")
  };
}

function buildWelcomeData(locale, extensionName, options) {
  const isPinned = options?.isPinned === true;
  const perLocale = Object.fromEntries(
    LOCALES.map((code) => [code, buildWelcomeLocalePayload(code)])
  );
  const current = perLocale[locale];
  return {
    extensionName,
    locale,
    dir: current.dir,
    headerLogoSvg: WELCOME_ICON_SVG,
    headerTitle: "CLICK REPEATER",
    headerSubtitle: current.headerSubtitle,
    iconSvg: WELCOME_ICON_SVG,
    pinHeading: current.pinHeading,
    pinStep1: current.pinStep1,
    pinStep2: current.pinStep2,
    pinStep3: current.pinStep3,
    puzzleIcon: welcomeStepIcon(WELCOME_PUZZLE_SVG),
    pinIcon: welcomeStepIcon(WELCOME_PIN_SVG),
    arrowUpIcon: welcomeStepIcon(WELCOME_ARROW_UP_SVG, 84),
    pinHintIcon: welcomeStepIcon(WELCOME_PIN_SVG, 48),
    heartIcon: welcomeStepIcon(WELCOME_HEART_SVG, 56),
    isPinned,
    aboutSections: current.aboutSections,
    aboutFooter: current.aboutFooter,
    hasAbout: true,
    hasLocales: true,
    locales: [...LOCALES],
    localeLabels: LOCALE_LABELS,
    langAriaLabel: current.langAriaLabel,
    perLocale
  };
}
