const SURVEY_STORAGE_KEY = "support_survey_state";
const SURVEY_THRESHOLD = 3;
const SURVEY_COOLDOWN_MS = 60 * 24 * 60 * 60 * 1000;
const SURVEY_GITHUB_URL = "https://github.com/md2it/browser-extension-click-repeater";
const SURVEY_CHROME_STORE_URL = "https://chromewebstore.google.com/detail/click-repeater/ojdgninjdijhhclanjlhaipehopjjmoo";
const SURVEY_FIREFOX_STORE_URL = "https://addons.mozilla.org/firefox/addon/click-repeater/";
const SURVEY_FEEDBACK_EMAIL = "mailto:contact@md2it.com";

const surveyUiState = {
  step: null
};

function createDefaultSurveyState() {
  return {
    successCount: 0,
    neverAsk: false,
    completedViaGithub: false,
    completedViaStore: false,
    lastShownAt: null
  };
}

function normalizeSurveyState(raw) {
  const defaults = createDefaultSurveyState();
  if (!raw || typeof raw !== "object") {
    return defaults;
  }

  const successCount = Number(raw.successCount);
  const lastShownAt = Number(raw.lastShownAt);
  return {
    successCount: Number.isFinite(successCount) && successCount >= 0 ? Math.floor(successCount) : defaults.successCount,
    neverAsk: Boolean(raw.neverAsk),
    completedViaGithub: Boolean(raw.completedViaGithub),
    completedViaStore: Boolean(raw.completedViaStore),
    lastShownAt: Number.isFinite(lastShownAt) && lastShownAt > 0 ? lastShownAt : null
  };
}

function shouldShowSurvey(state) {
  if (state.neverAsk || state.completedViaGithub || state.completedViaStore) {
    return false;
  }

  if (state.successCount < SURVEY_THRESHOLD) {
    return false;
  }

  if (state.lastShownAt !== null && Date.now() - state.lastShownAt < SURVEY_COOLDOWN_MS) {
    return false;
  }

  return true;
}

async function readSurveyState() {
  try {
    const data = await ext.storage.local.get(SURVEY_STORAGE_KEY);
    return normalizeSurveyState(data?.[SURVEY_STORAGE_KEY]);
  } catch {
    return createDefaultSurveyState();
  }
}

async function writeSurveyState(state) {
  try {
    await ext.storage.local.set({ [SURVEY_STORAGE_KEY]: normalizeSurveyState(state) });
    return true;
  } catch {
    return false;
  }
}

async function recordSuccessfulCompletion() {
  try {
    const state = await readSurveyState();
    state.successCount += 1;
    const shouldShow = shouldShowSurvey(state);
    if (!(await writeSurveyState(state))) {
      return { shouldShow: false };
    }

    return { shouldShow };
  } catch {
    return { shouldShow: false };
  }
}

function getSurveyStoreUrl() {
  if (typeof browser !== "undefined" && typeof chrome !== "undefined" && browser !== chrome) {
    return SURVEY_FIREFOX_STORE_URL;
  }

  return SURVEY_CHROME_STORE_URL;
}

function openSurveyExternalUrl(url) {
  try {
    void ext.tabs.create({ url });
  } catch {}
}

function isSupportSurveyOpen() {
  return Boolean(surveyUiState.step) && !refs.supportSurveyModal.classList.contains("hidden");
}

function setSurveyStep(step) {
  surveyUiState.step = step;
  refs.surveyStepUseful.classList.toggle("hidden", step !== "useful");
  refs.surveyStepThankYou.classList.toggle("hidden", step !== "thankyou");
  refs.surveyStepSorry.classList.toggle("hidden", step !== "sorry");

  const titleKey = step === "thankyou"
    ? "surveyThankYouTitle"
    : step === "sorry"
      ? "surveySorryTitle"
      : "surveyUsefulQuestion";
  refs.supportSurveyTitle.textContent = t(titleKey);
  syncPopupHeight();
}

async function openSupportSurvey(step = "useful") {
  const state = await readSurveyState();
  if (!shouldShowSurvey(state)) {
    return false;
  }

  state.lastShownAt = Date.now();
  if (!(await writeSurveyState(state))) {
    return false;
  }

  refs.supportSurveyModal.classList.remove("hidden");
  setSurveyStep(step);
  return true;
}

function closeSupportSurvey() {
  surveyUiState.step = null;
  refs.supportSurveyModal.classList.add("hidden");
  refs.surveyStepUseful.classList.remove("hidden");
  refs.surveyStepThankYou.classList.add("hidden");
  refs.surveyStepSorry.classList.add("hidden");
  syncPopupHeight();
}

async function dismissSupportSurveyLater() {
  const state = await readSurveyState();
  state.successCount = 0;
  await writeSurveyState(state);
  closeSupportSurvey();
}

async function disableSupportSurveyForever() {
  const state = await readSurveyState();
  state.neverAsk = true;
  await writeSurveyState(state);
  closeSupportSurvey();
}

async function completeSupportSurveyViaGithub() {
  const state = await readSurveyState();
  state.completedViaGithub = true;
  await writeSurveyState(state);
  openSurveyExternalUrl(SURVEY_GITHUB_URL);
  closeSupportSurvey();
}

async function completeSupportSurveyViaStore() {
  const state = await readSurveyState();
  state.completedViaStore = true;
  await writeSurveyState(state);
  openSurveyExternalUrl(getSurveyStoreUrl());
  closeSupportSurvey();
}

function handleSupportSurveyClose() {
  if (surveyUiState.step === "useful") {
    void dismissSupportSurveyLater();
    return;
  }

  if (surveyUiState.step === "thankyou" || surveyUiState.step === "sorry") {
    void dismissSupportSurveyLater();
  }
}

function bindSupportSurveyEvents() {
  refs.supportSurveyCloseBtn.addEventListener("click", () => {
    handleSupportSurveyClose();
  });

  refs.surveyAskLaterBtn.addEventListener("click", () => {
    void dismissSupportSurveyLater();
  });

  refs.surveyNeverAskBtn.addEventListener("click", () => {
    void disableSupportSurveyForever();
  });

  refs.surveyNoBtn.addEventListener("click", () => {
    setSurveyStep("sorry");
  });

  refs.surveyYesBtn.addEventListener("click", () => {
    setSurveyStep("thankyou");
  });

  refs.surveyLaterBtn.addEventListener("click", () => {
    void dismissSupportSurveyLater();
  });

  refs.surveyStarGithubBtn.addEventListener("click", () => {
    void completeSupportSurveyViaGithub();
  });

  refs.surveyRateStoreBtn.addEventListener("click", () => {
    void completeSupportSurveyViaStore();
  });

  refs.surveySendEmailBtn.addEventListener("click", () => {
    openSurveyExternalUrl(SURVEY_FEEDBACK_EMAIL);
  });

  refs.surveySorryLaterBtn.addEventListener("click", () => {
    void dismissSupportSurveyLater();
  });

  refs.surveySorryNeverAskBtn.addEventListener("click", () => {
    void disableSupportSurveyForever();
  });
}

bindSupportSurveyEvents();
