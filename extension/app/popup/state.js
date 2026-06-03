const STORAGE_KEY = "macros_list";
const DEFAULT_MACRO_ID_KEY = "default_macro_id";
const macros = [];
let defaultMacroId = null;

const state = {
  modalMode: null,
  editMacroId: null,
  deleteMacroId: null,
  executionPollTimer: null
};

const refs = {
  popup: document.querySelector(".popup"),
  list: document.getElementById("macros-list"),
  status: document.getElementById("status-line"),
  defaultName: document.getElementById("default-macro-name"),
  defaultEditBtn: document.getElementById("default-macro-edit-btn"),
  stopExecutionBtn: document.getElementById("stop-execution-btn"),
  newMacroBtn: document.getElementById("new-macro-btn"),
  editModal: document.getElementById("edit-modal"),
  editModalTitle: document.getElementById("edit-modal-title"),
  editName: document.getElementById("edit-name"),
  editRepeats: document.getElementById("edit-repeats"),
  editDisplayMovesToggle: document.getElementById("edit-display-moves-toggle"),
  editDisplayMovesIcon: document.getElementById("edit-display-moves-icon"),
  editDisplayMoves: document.getElementById("edit-display-moves"),
  editSteps: document.getElementById("edit-steps"),
  deleteModal: document.getElementById("delete-modal"),
  deleteMacroName: document.getElementById("delete-macro-name"),
  saveEditBtn: document.getElementById("save-edit-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  confirmDeleteBtn: document.getElementById("confirm-delete-btn"),
  cancelDeleteBtn: document.getElementById("cancel-delete-btn"),
  recordModeModal: document.getElementById("record-mode-modal"),
  recordCoordsBtn: document.getElementById("record-coords-btn"),
  recordSelectorsBtn: document.getElementById("record-selectors-btn"),
  recordCancelBtn: document.getElementById("record-cancel-btn"),
  defaultModal: document.getElementById("default-modal"),
  defaultRadioList: document.getElementById("default-macro-radio-list"),
  saveDefaultBtn: document.getElementById("save-default-btn"),
  cancelDefaultBtn: document.getElementById("cancel-default-btn")
};

const iconSet = globalThis.macrosRepeaterLucideIcons;
