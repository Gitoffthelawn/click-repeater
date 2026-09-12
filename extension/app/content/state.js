const BASE_EXECUTION_SPEED_PROFILE = {
  moveIntervalMs: 15,
  beforeDownMs: 200,
  holdMs: 200,
  afterUpMs: 1,
  stepMs: 100
};
const SCENARIO_SPEED_VALUES = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 4, 8];

const VIEWPORT_EDGE_PADDING = 2;
const TRACKER_DEFAULT_SIZE = 36;
const TRACKER_ACTIVE_SIZE = 54;
const TRACKER_DEFAULT_COLOR = "#012292";
const TRACKER_ACTIVE_COLOR = "#012292";
const TRACKER_ACTIVE_DURATION_MS = 50;
const TRACKER_ELEMENT_ID = "__click_repeater_tracker";

const executionState = {
  isRunning: false,
  stopRequested: false,
  unloadDuringRun: false,
  token: 0,
  lastPoint: null,
  lastTarget: null,
  trackMoves: false,
  executionSpeed: 1,
  soundVolume: "volume-1",
  clickSound: true
};

const trackerState = {
  motionElement: null,
  element: null,
  pulseTimerId: null
};

const recordingState = {
  isActive: false
};

let isRecordingClickListenerAttached = false;
let isRecordingKeyboardListenerAttached = false;
let isExecutionClickListenerAttached = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeExecutionSpeed(speed) {
  const value = Number(speed);
  return SCENARIO_SPEED_VALUES.includes(value) ? value : 1;
}

function scaleTimingMs(baseMs, speed) {
  return Math.max(1, Math.ceil(baseMs / normalizeExecutionSpeed(speed)));
}

function getExecutionSpeedProfile(speed = executionState.executionSpeed) {
  const speedMultiplier = normalizeExecutionSpeed(speed);
  return {
    moveIntervalMs: scaleTimingMs(BASE_EXECUTION_SPEED_PROFILE.moveIntervalMs, speedMultiplier),
    beforeDownMs: scaleTimingMs(BASE_EXECUTION_SPEED_PROFILE.beforeDownMs, speedMultiplier),
    holdMs: scaleTimingMs(BASE_EXECUTION_SPEED_PROFILE.holdMs, speedMultiplier),
    afterUpMs: scaleTimingMs(BASE_EXECUTION_SPEED_PROFILE.afterUpMs, speedMultiplier),
    stepMs: scaleTimingMs(BASE_EXECUTION_SPEED_PROFILE.stepMs, speedMultiplier)
  };
}

function sendRuntimeMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false });
        return;
      }

      resolve(response ?? { ok: false });
    });
  });
}
