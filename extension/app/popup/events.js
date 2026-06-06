
refs.list.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    return;
  }

  const macroId = target.dataset.id;
  const action = target.dataset.action;
  if (!macroId || !action) {
    return;
  }

  if (action === "run") {
    void startExecution(macroId);
    return;
  }

  if (action === "edit") {
    openEditModal(macroId);
    return;
  }

  if (action === "set-default") {
    void setDefaultMacro(macroId, macroId !== defaultMacroId);
    return;
  }

  if (action === "toggle-display-moves") {
    const macro = macros.find((item) => item.id === macroId);
    if (!macro) {
      setStatus("Macros не найден.");
      return;
    }

    const nextDisplayMoves = !getDisplayMovesValue(macro);
    macro.displayMoves = nextDisplayMoves;
    macro.trackMoves = nextDisplayMoves;
    void persistMacros().then(() => {
      render();
      setStatus(`Display moves ${nextDisplayMoves ? "включен" : "выключен"} для "${macro.name}".`);
    });
    return;
  }

  if (action === "delete") {
    if (state.pendingDeleteMacroId === macroId) {
      void deleteMacro(macroId);
      return;
    }

    armDeleteButton(target, macroId);
  }
});

refs.list.addEventListener("pointerout", (event) => {
  const button = event.target.closest(".delete-btn-armed");
  if (!button || button.contains(event.relatedTarget)) {
    return;
  }

  clearDeleteConfirmation();
});

refs.list.addEventListener("change", (event) => {
  const input = event.target.closest("input[data-action='set-repeats']");
  if (!input) {
    return;
  }

  const macro = macros.find((item) => item.id === input.dataset.id);
  if (!macro) {
    setStatus("Macros не найден.");
    return;
  }

  normalizeRepeatInput(input);
  macro.repeats = Number(input.value);
  void persistMacros().then(() => {
    setStatus(`Repeat для "${macro.name}": ${macro.repeats}.`);
  });
});

refs.newMacroBtn.addEventListener("click", () => {
  void startCreateMode();
});

refs.stopExecutionBtn.addEventListener("click", () => {
  void stopExecution();
});

refs.editDisplayMovesToggle.addEventListener("click", () => {
  setEditDisplayMoves(!refs.editDisplayMoves.checked);
});

refs.editDefaultToggle.addEventListener("click", () => {
  setEditDefault(!refs.editDefault.checked);
});

refs.editRepeats.addEventListener("change", () => {
  normalizeRepeatInput(refs.editRepeats);
});

refs.editName.addEventListener("input", () => {
  if (refs.editName.value.trim()) {
    refs.editNameField.classList.remove("invalid");
  }
});

refs.clearEditNameBtn.addEventListener("click", () => {
  refs.editName.value = "";
  refs.editName.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches(".repeat-input") && ["e", "E", "+", "-", ".", ","].includes(event.key)) {
    event.preventDefault();
  }
});

refs.saveEditBtn.addEventListener("click", async () => {
  const name = refs.editName.value.trim();
  if (!name) {
    validateEditName();
    return;
  }

  const validRepeats = normalizeRepeats(refs.editRepeats.value);
  const displayMoves = Boolean(refs.editDisplayMoves.checked);

  if (state.modalMode === "edit" && state.editMacroId) {
    const macro = macros.find((item) => item.id === state.editMacroId);
    if (!macro) {
      setStatus("Macros не найден для сохранения.");
      closeEditModal();
      return;
    }

    macro.name = name;
    macro.repeats = validRepeats;
    macro.displayMoves = displayMoves;
    macro.trackMoves = displayMoves;
    macro.mode = state.editMode;
    if (!Array.isArray(macro.steps)) {
      macro.steps = [];
    }
    await persistMacros();
    const nextDefaultMacroId = refs.editDefault.checked ? macro.id : null;
    if (defaultMacroId === macro.id || nextDefaultMacroId === macro.id) {
      defaultMacroId = nextDefaultMacroId;
      await persistDefaultMacroId();
    }
    closeEditModal();
    render();
    setStatus("Macros обновлен.");
    return;
  }

  if (state.modalMode !== "create") {
    setStatus("Сохранение недоступно: режим не выбран.");
    return;
  }

  const createdMacro = {
    id: createMacroId(),
    name,
    repeats: validRepeats,
    displayMoves,
    trackMoves: displayMoves,
    mode: state.editMode,
    steps: []
  };
  macros.unshift(createdMacro);
  await persistMacros();
  if (refs.editDefault.checked) {
    defaultMacroId = createdMacro.id;
    await persistDefaultMacroId();
  }
  closeEditModal();
  render();
  setStatus("Macros сохранен и добавлен в список.");
});

refs.cancelEditBtn.addEventListener("click", () => {
  requestCloseEditModal();
});

refs.closeEditBtn.addEventListener("click", () => {
  requestCloseEditModal();
});

refs.editModal.addEventListener("click", (event) => {
  if (event.target === refs.editModal) {
    requestCloseEditModal();
  }
});

refs.editModeToggle.addEventListener("click", () => {
  openModeModal();
});

refs.modePositionBtn.addEventListener("click", () => {
  setEditMode("position");
  closeModeModal();
  renderEditSteps(getCurrentEditSteps());
});

refs.modeElementBtn.addEventListener("click", () => {
  setEditMode("element");
  closeModeModal();
  renderEditSteps(getCurrentEditSteps());
});

refs.closeModeModalBtn.addEventListener("click", () => {
  closeModeModal();
});

refs.modeModal.addEventListener("click", (event) => {
  if (event.target === refs.modeModal) {
    closeModeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  const didClose = closeModalByEscape();
  if (didClose) {
    event.preventDefault();
    event.stopPropagation();
  }
});

function closeModalByEscape() {
  if (!refs.modeModal.classList.contains("hidden")) {
    closeModeModal();
    return true;
  }

  if (!refs.editModal.classList.contains("hidden")) {
    requestCloseEditModal();
    return true;
  }

  return false;
}
