"use strict";
// probeDocumentOperability comes from probe.js, PROBE_DOCUMENT_OPERABILITY
// from content-probe.js; both are also loaded as classic content scripts, so
// they bridge these onto globalThis instead of using ES `export`.
const ext = globalThis.ext;
const probeDocumentOperability = globalThis.probeDocumentOperability;
const PROBE_DOCUMENT_OPERABILITY = globalThis.PROBE_DOCUMENT_OPERABILITY;

function scriptingTarget(tabId, frameId) {
  return frameId !== void 0 && frameId !== 0 ? { tabId, frameIds: [frameId] } : { tabId };
}
function messageOptions(frameId) {
  return frameId !== void 0 && frameId !== 0 ? { frameId } : void 0;
}
// Do not cache this result: navigation can change operability within the same tab.
export async function canOperateOnTab(tabId, frameId) {
  if (!Number.isInteger(tabId)) return false;
  try {
    const response = await ext.tabs.sendMessage(
      tabId,
      { type: PROBE_DOCUMENT_OPERABILITY },
      messageOptions(frameId),
    );
    if (response === true) return true;
    if (response === false) return false;
  } catch {
    // Fall through to scripting probe.
  }
  try {
    const [result] = await ext.scripting.executeScript({
      target: scriptingTarget(tabId, frameId),
      func: probeDocumentOperability,
    });
    return result?.result === true;
  } catch {
    // Communication failures cover restricted pages and missing host permissions.
    return false;
  }
}
