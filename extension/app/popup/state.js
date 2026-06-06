const STORAGE_KEY = "macros_list";
const DEFAULT_MACRO_ID_KEY = "default_macro_id";
const macros = [];
let defaultMacroId = null;

const state = {
  modalMode: null,
  editMacroId: null,
  editMode: "position",
  pendingDeleteMacroId: null,
  executionPollTimer: null
};

const refs = {
  popup: document.querySelector(".popup-shell"),
  menu: document.querySelector(".popup-menu"),
  menuButtons: document.querySelectorAll(".popup-menu-btn"),
  pages: document.querySelectorAll("[data-page-content]"),
  list: document.getElementById("macros-list"),
  status: document.getElementById("status-line"),
  stopExecutionBtn: document.getElementById("stop-execution-btn"),
  newMacroBtn: document.getElementById("new-macro-btn"),
  editModal: document.getElementById("edit-modal"),
  editModalTitle: document.getElementById("edit-modal-title"),
  closeEditBtn: document.getElementById("close-edit-btn"),
  editNameField: document.getElementById("edit-name-field"),
  editName: document.getElementById("edit-name"),
  clearEditNameBtn: document.getElementById("clear-edit-name-btn"),
  editRepeats: document.getElementById("edit-repeats"),
  editDisplayMovesToggle: document.getElementById("edit-display-moves-toggle"),
  editDisplayMovesIcon: document.getElementById("edit-display-moves-icon"),
  editDisplayMovesLabel: document.getElementById("edit-display-moves-label"),
  editDisplayMoves: document.getElementById("edit-display-moves"),
  editDefaultToggle: document.getElementById("edit-default-toggle"),
  editDefaultIcon: document.getElementById("edit-default-icon"),
  editDefault: document.getElementById("edit-default"),
  editSteps: document.getElementById("edit-steps"),
  editModeToggle: document.getElementById("edit-mode-toggle"),
  editModeLabel: document.getElementById("edit-mode-label"),
  saveEditBtn: document.getElementById("save-edit-btn"),
  cancelEditBtn: document.getElementById("cancel-edit-btn"),
  modeModal: document.getElementById("mode-modal"),
  closeModeModalBtn: document.getElementById("close-mode-modal-btn"),
  modePositionBtn: document.getElementById("mode-position-btn"),
  modeElementBtn: document.getElementById("mode-element-btn")
};

const iconSet = globalThis.macrosRepeaterLucideIcons;
