
async function init() {
  await cleanupLegacyTrackMovesSetting();
  await readSettingsFromStorage();
  syncSettingsUI();
  await loadMacros();
  const createdMacro = await completeCreateModeIfNeeded();
  render();
  const executionStatus = await refreshExecutionStatus();
  if (createdMacro) {
    openEditModal(createdMacro.id);
    setStatus("Создание завершено. Проверьте и сохраните параметры macros.");
    return;
  }

  if (executionStatus?.lastEvent === "completed" && executionStatus.completedMacroName) {
    return;
  }

  if (executionStatus?.lastEvent === "stopped" && executionStatus.stoppedMacroName) {
    return;
  }

  if (executionStatus?.lastEvent === "failed" && executionStatus.failedMacroName) {
    return;
  }

  if (executionStatus?.state?.isRunning) {
    return;
  }

  setStatus("Нажмите NEW macros, чтобы запустить запись кликов.");
}

init();
