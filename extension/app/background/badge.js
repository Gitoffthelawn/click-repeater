
async function syncActionBadge() {
  clearShortcutHintTimer();

  const session = await readSession();
  if (session?.isActive) {
    await setActionBadgeText(CREATE_BADGE_TEXT);
    return;
  }

  const executionState = await getRuntimeExecutionState();
  if (executionState?.isRunning) {
    await setActionBadgeText(RUN_BADGE_TEXT);
    return;
  }

  await setActionBadgeText("");
}

async function showShortcutHintBadge() {
  const session = await readSession();
  const executionState = await getRuntimeExecutionState();
  if (session?.isActive || executionState?.isRunning) {
    await syncActionBadge();
    return;
  }

  clearShortcutHintTimer();
  await ext.action.setBadgeText({ text: SHORTCUT_HINT_BADGE_TEXT });
  await ext.action.setBadgeBackgroundColor({ color: SHORTCUT_HINT_BADGE_BACKGROUND_COLOR });
  if (typeof ext.action.setBadgeTextColor === "function") {
    await ext.action.setBadgeTextColor({ color: SHORTCUT_HINT_BADGE_TEXT_COLOR });
  }
  shortcutHintTimerId = setTimeout(() => {
    shortcutHintTimerId = null;
    void syncActionBadge();
  }, SHORTCUT_HINT_DURATION_MS);
}

async function startDefaultMacroFromTab(tabId) {
  if (!Number.isInteger(tabId)) {
    return { ok: false, error: "tab_id_required" };
  }

  const defaultMacroId = await readDefaultMacroId();
  if (!defaultMacroId) {
    return { ok: false, error: "default_macro_missing" };
  }

  const macros = await readMacros();
  const macro = macros.find((item) => item.id === defaultMacroId);
  if (!macro) {
    return { ok: false, error: "default_macro_missing" };
  }

  const steps = Array.isArray(macro.steps) ? macro.steps.filter((step) => typeof step === "string" && step.trim()) : [];
  const repeatsRaw = Number(macro.repeats);
  const repeats = Number.isFinite(repeatsRaw) && repeatsRaw > 0 ? Math.floor(repeatsRaw) : 1;
  return startExecutionOnTab({
    tabId,
    macroId: macro.id,
    macroName: typeof macro.name === "string" && macro.name.trim() ? macro.name.trim() : "macros",
    repeats,
    trackMoves: Boolean(macro.displayMoves ?? macro.trackMoves),
    steps
  });
}

