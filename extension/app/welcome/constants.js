var WELCOME_PAGE = "welcome.html";
var WELCOME_SESSION_DATA_KEY = "welcomeData";
var WELCOME_TAB_CONFIG = {
  pageHtml: WELCOME_PAGE,
  sessionDataKey: WELCOME_SESSION_DATA_KEY,
  logLabel: "Click Repeater"
};
var WELCOME_PIN_WATCH_CONFIG = {
  pinStatusChangedMessageType: "PIN_STATUS_CHANGED"
};

// Bridge for background-context ES modules; harmless no-op as a classic script.
globalThis.WELCOME_PAGE = WELCOME_PAGE;
globalThis.WELCOME_SESSION_DATA_KEY = WELCOME_SESSION_DATA_KEY;
globalThis.WELCOME_TAB_CONFIG = WELCOME_TAB_CONFIG;
globalThis.WELCOME_PIN_WATCH_CONFIG = WELCOME_PIN_WATCH_CONFIG;
