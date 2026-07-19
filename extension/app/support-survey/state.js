// `var` re-declarations: harmless merges with the classic-script globals from
// lib/our/api.js, lib/our/support-survey/logic.js and app/support-survey/constants.js
// when sharing a classic script scope (popup page); needed so this file also
// works when imported as an ES module in the background context.
var ext = globalThis.ext;
var createSupportSurveyLogic = globalThis.createSupportSurveyLogic;

const supportSurveyLogic = createSupportSurveyLogic({
  threshold: globalThis.SURVEY_THRESHOLD,
  cooldownMs: globalThis.SURVEY_COOLDOWN_MS,
});

function normalizeSupportSurveyState(raw) {
  const normalized = supportSurveyLogic.normalizeState(raw);
  return {
    ...normalized,
    completed:
      normalized.completed ||
      raw?.completedViaGithub === true ||
      raw?.completedViaStore === true,
  };
}

async function readSupportSurveyState() {
  try {
    const data = await ext.storage.local.get(globalThis.SURVEY_STORAGE_KEY);
    return normalizeSupportSurveyState(data?.[globalThis.SURVEY_STORAGE_KEY]);
  } catch {
    return supportSurveyLogic.createDefaultState();
  }
}

async function writeSupportSurveyState(state) {
  try {
    await ext.storage.local.set({
      [globalThis.SURVEY_STORAGE_KEY]: normalizeSupportSurveyState(state),
    });
    return true;
  } catch {
    return false;
  }
}

async function recordSuccessfulScenario() {
  const state = await readSupportSurveyState();
  const nextState = supportSurveyLogic.addSuccessfulActions(state);
  if (!(await writeSupportSurveyState(nextState))) return false;
  return supportSurveyLogic.canShow(nextState);
}

async function shouldShowSupportSurvey() {
  const state = await readSupportSurveyState();
  return supportSurveyLogic.canShow(state);
}

async function markSupportSurveyShown() {
  const state = await readSupportSurveyState();
  return writeSupportSurveyState(supportSurveyLogic.markShown(state));
}

async function deferSupportSurvey() {
  const state = await readSupportSurveyState();
  return writeSupportSurveyState(supportSurveyLogic.defer(state));
}

async function disableSupportSurveyForever() {
  const state = await readSupportSurveyState();
  return writeSupportSurveyState(supportSurveyLogic.disableForever(state));
}

async function completeSupportSurvey() {
  const state = await readSupportSurveyState();
  return writeSupportSurveyState(supportSurveyLogic.markCompleted(state));
}

// Bridge for background-context ES modules; harmless no-op as a classic script.
globalThis.recordSuccessfulScenario = recordSuccessfulScenario;
