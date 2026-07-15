const surveyUiState = { step: null };

function openSurveyExternalUrl(url) {
  try { void ext.tabs.create({ url }); } catch {}
}

function isSupportSurveyOpen() {
  return Boolean(surveyUiState.step) && !refs.supportSurveyModal.classList.contains("hidden");
}

function setSurveyStep(step) {
  surveyUiState.step = step;
  refs.surveyStepUseful.classList.toggle("hidden", step !== "useful");
  refs.surveyStepThankYou.classList.toggle("hidden", step !== "thankyou");
  refs.surveyStepSorry.classList.toggle("hidden", step !== "sorry");
  const titleKey = step === "thankyou" ? "surveyThankYouTitle" : step === "sorry" ? "surveySorryTitle" : "surveyUsefulQuestion";
  refs.supportSurveyTitle.textContent = t(titleKey);
  refs.supportSurveyTitle.style.whiteSpace = "pre-line";
  if (step === "thankyou") refs.surveyRateStoreBtn.textContent = getSurveyStoreRateLabel();
  syncPopupHeight();
}

async function openSupportSurvey(step = "useful") {
  if (!(await shouldShowSupportSurvey())) return false;
  if (!(await markSupportSurveyShown())) return false;
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
  await deferSupportSurvey();
  closeSupportSurvey();
}

async function completeSupportSurveyViaGithub() {
  await completeSupportSurvey();
  openSurveyExternalUrl(SURVEY_GITHUB_URL);
  closeSupportSurvey();
}

async function completeSupportSurveyViaStore() {
  await completeSupportSurvey();
  openSurveyExternalUrl(getSurveyStoreUrl());
  closeSupportSurvey();
}

function bindSupportSurveyEvents() {
  refs.supportSurveyCloseBtn.addEventListener("click", () => void dismissSupportSurveyLater());
  refs.surveyAskLaterBtn.addEventListener("click", () => void dismissSupportSurveyLater());
  refs.surveyNeverAskBtn.addEventListener("click", () => void disableSupportSurveyForever().then(closeSupportSurvey));
  refs.surveyNoBtn.addEventListener("click", () => setSurveyStep("sorry"));
  refs.surveyYesBtn.addEventListener("click", () => setSurveyStep("thankyou"));
  refs.surveyLaterBtn.addEventListener("click", () => void dismissSupportSurveyLater());
  refs.surveyStarGithubBtn.addEventListener("click", () => void completeSupportSurveyViaGithub());
  refs.surveyRateStoreBtn.addEventListener("click", () => void completeSupportSurveyViaStore());
  refs.surveySendEmailBtn.addEventListener("click", () => openSurveyExternalUrl(SURVEY_FEEDBACK_EMAIL));
  refs.surveySorryLaterBtn.addEventListener("click", () => void dismissSupportSurveyLater());
  refs.surveySorryNeverAskBtn.addEventListener("click", () => void disableSupportSurveyForever().then(closeSupportSurvey));
}

async function refreshSupportSurveyAboutStatistic() {
  const target = document.getElementById("about-scenario-runs");
  if (!target) return;
  const state = await readSupportSurveyState();
  target.textContent = `${t("aboutYourActivity")}: ${t("aboutScenarioRuns", { count: state.actionCount })}`;
}

bindSupportSurveyEvents();
