
function render() {
  refs.list.innerHTML = "";
  const defaultMacro = getDefaultMacro();
  refs.defaultName.textContent = defaultMacro ? defaultMacro.name : "Не задан";
  refs.defaultEditBtn.innerHTML = iconSet.squarePen;
  refs.defaultEditBtn.disabled = macros.length === 0;

  if (macros.length === 0) {
    const emptyRow = document.createElement("li");
    emptyRow.className = "macro-row";
    emptyRow.textContent = "Список пуст. Нажмите NEW macros, чтобы создать первый.";
    refs.list.append(emptyRow);
    syncPopupHeight();
    return;
  }

  for (const macro of macros) {
    const displayMovesEnabled = getDisplayMovesValue(macro);
    const displayMovesTitle = displayMovesEnabled ? "Display moves: on" : "Display moves: off";
    const displayMovesIcon = displayMovesEnabled ? iconSet.eye : iconSet.eyeOff;
    const displayMovesClassName = displayMovesEnabled ? "" : "display-moves-off";
    const row = document.createElement("li");
    row.className = "macro-row";
    row.innerHTML = `
      <div class="macro-main">
        <button class="icon-btn" type="button" data-action="run" data-id="${macro.id}" title="Запуск режима исполнения">${iconSet.play}</button>
        <span class="macro-name ${macro.id === defaultMacroId ? "default" : ""}">${macro.name}</span>
      </div>
      <div class="macro-actions">
        <button class="icon-btn ${displayMovesClassName}" type="button" data-action="toggle-display-moves" data-id="${macro.id}" title="${displayMovesTitle}" aria-label="${displayMovesTitle}">${displayMovesIcon}</button>
        <button class="icon-btn" type="button" data-action="edit" data-id="${macro.id}" title="Редактировать">${iconSet.squarePen}</button>
        <button class="icon-btn" type="button" data-action="delete" data-id="${macro.id}" title="Удалить">${iconSet.trash}</button>
      </div>
    `;
    refs.list.append(row);
  }

  syncPopupHeight();
}

function setStatus(text) {
  refs.status.textContent = text;
  syncPopupHeight();
}

function openEditModal(macroId) {
  if (macroId !== null) {
    const macro = macros.find((item) => item.id === macroId);
    if (!macro) {
      setStatus("Macros не найден.");
      return;
    }

    state.modalMode = "edit";
    state.editMacroId = macro.id;
    refs.editModalTitle.textContent = "Редактирование macros";
    refs.editName.value = macro.name;
    refs.editRepeats.value = String(macro.repeats ?? 1);
    setEditDisplayMoves(getDisplayMovesValue(macro));
    renderEditSteps(Array.isArray(macro.steps) ? macro.steps : []);
    refs.editModal.classList.remove("hidden");
    syncPopupHeight();
    return;
  }

  state.modalMode = "create";
  state.editMacroId = null;
  refs.editModalTitle.textContent = "Создание macros";
  refs.editName.value = buildDefaultMacroName();
  refs.editRepeats.value = "1";
  setEditDisplayMoves(false);
  renderEditSteps([]);
  refs.editModal.classList.remove("hidden");
  syncPopupHeight();
}

function closeEditModal() {
  state.modalMode = null;
  state.editMacroId = null;
  refs.editModal.classList.add("hidden");
  syncPopupHeight();
}

function openDeleteModal(macroId) {
  const macro = macros.find((item) => item.id === macroId);
  if (!macro) {
    return;
  }

  state.deleteMacroId = macroId;
  refs.deleteMacroName.textContent = macro.name;
  refs.deleteModal.classList.remove("hidden");
  syncPopupHeight();
}

function closeDeleteModal() {
  state.deleteMacroId = null;
  refs.deleteModal.classList.add("hidden");
  syncPopupHeight();
}

function openRecordModeModal() {
  refs.recordModeModal.classList.remove("hidden");
  syncPopupHeight();
}

function closeRecordModeModal() {
  refs.recordModeModal.classList.add("hidden");
  syncPopupHeight();
}

function openDefaultModal() {
  if (macros.length === 0) {
    setStatus("Список macros пуст.");
    return;
  }

  refs.defaultRadioList.innerHTML = "";
  for (const macro of macros) {
    const optionLabel = document.createElement("label");
    optionLabel.className = "default-radio-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "default-macro-id";
    input.value = macro.id;
    input.className = "default-radio-input";

    const box = document.createElement("span");
    box.className = "default-radio-box";
    box.setAttribute("aria-hidden", "true");

    const text = document.createElement("span");
    text.className = "default-radio-text";
    text.textContent = macro.name;

    optionLabel.append(input, box, text);
    refs.defaultRadioList.append(optionLabel);
  }

  const selectedId = defaultMacroId && macros.some((macro) => macro.id === defaultMacroId) ? defaultMacroId : macros[0].id;
  const radioInputs = refs.defaultRadioList.querySelectorAll("input[name='default-macro-id']");
  for (const input of radioInputs) {
    if (input.value === selectedId) {
      input.checked = true;
      break;
    }
  }
  refs.defaultModal.classList.remove("hidden");
  syncPopupHeight();
}

function closeDefaultModal() {
  refs.defaultModal.classList.add("hidden");
  syncPopupHeight();
}

function closeModalByEscape() {
  if (!refs.editModal.classList.contains("hidden")) {
    closeEditModal();
    setStatus("Редактирование отменено.");
    return true;
  }

  if (!refs.deleteModal.classList.contains("hidden")) {
    closeDeleteModal();
    setStatus("Удаление отменено.");
    return true;
  }

  if (!refs.defaultModal.classList.contains("hidden")) {
    closeDefaultModal();
    setStatus("Выбор дефолтного macros отменен.");
    return true;
  }

  if (!refs.recordModeModal.classList.contains("hidden")) {
    closeRecordModeModal();
    setStatus("Создание macros отменено.");
    return true;
  }

  return false;
}

async function startCreateMode(mode) {
  const activeTab = await getActiveTab();
  if (!activeTab || !Number.isInteger(activeTab.id)) {
    setStatus("Активная вкладка не найдена.");
    return;
  }

  const response = await sendRuntimeMessage({
    type: "recording-start",
    mode,
    tabId: activeTab.id,
    url: activeTab.url
  });

  if (!response?.ok) {
    setStatus("Не удалось запустить режим создания.");
    return;
  }

  closeRecordModeModal();
  window.close();
}

async function completeCreateModeIfNeeded() {
  const response = await sendRuntimeMessage({ type: "recording-stop" });
  if (!response?.ok || !response.hasSession) {
    return null;
  }

  const createdMacro = {
    id: createMacroId(),
    name: typeof response.macroName === "string" && response.macroName.trim() ? response.macroName : buildDefaultMacroName(),
    repeats: 1,
    displayMoves: false,
    trackMoves: false,
    steps: Array.isArray(response.steps) ? response.steps.filter((step) => typeof step === "string") : []
  };

  macros.unshift(createdMacro);
  await persistMacros();
  return createdMacro;
}

function renderEditSteps(steps) {
  refs.editSteps.innerHTML = "";

  if (steps.length === 0) {
    const li = document.createElement("li");
    li.className = "step-row";
    li.textContent = "Шаги отсутствуют.";
    refs.editSteps.append(li);
    syncPopupHeight();
    return;
  }

  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "step-row";
    li.innerHTML = `
      <span>${step}</span>
      <span class="step-actions">
        <button class="icon-btn" type="button" data-step-action="up" data-step-index="${index}" title="Переместить выше">↑</button>
        <button class="icon-btn" type="button" data-step-action="down" data-step-index="${index}" title="Переместить ниже">↓</button>
        <button class="icon-btn" type="button" data-step-action="delete" data-step-index="${index}" title="Удалить шаг">✕</button>
      </span>
    `;
    refs.editSteps.append(li);
  });

  syncPopupHeight();
}
