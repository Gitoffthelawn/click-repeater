const RECORDING_SESSION_KEY = "recording_session";
const EXECUTION_STATE_KEY = "execution_state";
const EXECUTION_LAST_EVENT_KEY = "execution_last_event";
const CHECK_STATE_KEY = "check_state";
const CLICKS_STORAGE_KEY = "clicks_list";
const DEFAULT_CLICK_ID_KEY = "default_click_id";
const BADGE_BACKGROUND_COLOR = "#012292";
const BADGE_TEXT_COLOR = "#ffffff";
const ACTIVE_BADGE_TEXT = "◉";
const CREATE_BADGE_BACKGROUND_COLOR = "#dc2626";
const RUN_BADGE_BACKGROUND_COLOR = BADGE_BACKGROUND_COLOR;
const CHECK_BADGE_BACKGROUND_COLOR = "#0f766e";
const BADGE_ANIMATION_STEPS = 40;
const BADGE_ANIMATION_STEP_MS = 25;
const CREATE_BADGE_TEXT_COLORS = [
  [255, 255, 255],
  [250, 204, 21],
  [185, 28, 28]
];
const RUN_BADGE_TEXT_COLORS = [
  [255, 255, 255],
  [1, 34, 146]
];
const SHORTCUT_HINT_BADGE_TEXT = "M";
const SHORTCUT_HINT_BADGE_BACKGROUND_COLOR = "#ffffff";
const SHORTCUT_HINT_BADGE_TEXT_COLOR = "#000000";
const SHORTCUT_HINT_DURATION_MS = 3000;
const SCENARIO_SPEED_VALUES = [0.1, 0.25, 0.5, 0.75, 1, 2, 4, 8];

let shortcutHintTimerId = null;
let badgeAnimationIntervalId = null;
let badgeAnimationFrame = 0;
let badgeAnimationMode = null;

function normalizeExecutionSpeed(speed) {
  const value = Number(speed);
  return SCENARIO_SPEED_VALUES.includes(value) ? value : 1;
}
