export const RECORDING_SESSION_KEY = "recording_session";
export const EXECUTION_STATE_KEY = "execution_state";
export const EXECUTION_LAST_EVENT_KEY = "execution_last_event";
export const CHECK_STATE_KEY = "check_state";
export const CLICKS_STORAGE_KEY = "clicks_list";
export const BADGE_BACKGROUND_COLOR = "#012292";
export const BADGE_TEXT_COLOR = [255, 255, 255, 255];
export const ACTIVE_BADGE_TEXT = "◉";
export const CREATE_BADGE_BACKGROUND_COLOR = "#dc2626";
export const RUN_BADGE_BACKGROUND_COLOR = BADGE_BACKGROUND_COLOR;
export const CHECK_BADGE_BACKGROUND_COLOR = "#0f766e";
export const BADGE_ANIMATION_STEPS = 40;
export const BADGE_ANIMATION_STEP_MS = 25;
export const CREATE_BADGE_TEXT_COLORS = [
  [255, 255, 255, 255],
  [250, 204, 21, 255],
  [185, 28, 28, 255]
];
export const RUN_BADGE_TEXT_COLORS = [
  [255, 255, 255, 255],
  [1, 34, 146, 255]
];
export const SCENARIO_SPEED_VALUES = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 4, 8];

export function normalizeExecutionSpeed(speed) {
  const value = Number(speed);
  return SCENARIO_SPEED_VALUES.includes(value) ? value : 1;
}
