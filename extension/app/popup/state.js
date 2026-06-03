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

const iconSet = {
  // Icons copied from official Lucide repository.
  play: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>',
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>',
  eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path d="m20 15-1.726-2.05" /><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" /></svg>',
  trash: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>',
  squarePen: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>'
};

