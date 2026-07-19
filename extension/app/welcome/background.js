import { stopWelcomePinWatcher, watchWelcomePinStatus, openWelcomeTab } from "../../lib/our/welcome/background.js";
import { isActionOnToolbar } from "../../lib/our/pin.js";
import { getLocaleForWelcome, buildWelcomeData } from "./data.js";

const ext = globalThis.ext;
// WELCOME_TAB_CONFIG / WELCOME_PIN_WATCH_CONFIG come from app/welcome/constants.js,
// which is also loaded as a classic script on the welcome page, so it bridges
// these onto globalThis instead of using ES `export`.
const WELCOME_TAB_CONFIG = globalThis.WELCOME_TAB_CONFIG;
const WELCOME_PIN_WATCH_CONFIG = globalThis.WELCOME_PIN_WATCH_CONFIG;

export function stopWelcomePinWatcher2(tabId) {
  stopWelcomePinWatcher(tabId);
}

export function watchWelcomePinStatus2(tabId) {
  watchWelcomePinStatus(tabId, WELCOME_PIN_WATCH_CONFIG);
}

export async function showWelcome() {
  const locale = await getLocaleForWelcome();
  const manifest = ext.runtime.getManifest();
  const isPinned = await isActionOnToolbar(ext.action);
  await openWelcomeTab(
    WELCOME_TAB_CONFIG,
    buildWelcomeData(locale, manifest.name, { isPinned })
  );
}
