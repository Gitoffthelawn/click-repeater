
function trackerDefaultIconSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>';
}

function trackerClickIconSvg() {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/></svg>';
}

function applyTrackerStyle({ size, color }) {
  if (!(trackerState.element instanceof HTMLElement)) {
    return;
  }

  trackerState.element.style.width = `${size}px`;
  trackerState.element.style.height = `${size}px`;
  trackerState.element.style.color = color;
}

function setTrackerDefaultState() {
  if (!(trackerState.element instanceof HTMLElement)) {
    return;
  }

  applyTrackerStyle({ size: TRACKER_DEFAULT_SIZE, color: TRACKER_DEFAULT_COLOR });
  trackerState.element.innerHTML = trackerDefaultIconSvg();
}

function ensureTrackerElement() {
  if (!executionState.trackMoves) {
    return;
  }

  if (trackerState.element instanceof HTMLElement) {
    return;
  }

  const existing = document.getElementById(TRACKER_ELEMENT_ID);
  if (existing instanceof HTMLElement) {
    trackerState.element = existing;
    setTrackerDefaultState();
    return;
  }

  const element = document.createElement("div");
  element.id = TRACKER_ELEMENT_ID;
  element.style.position = "fixed";
  element.style.left = "0px";
  element.style.top = "0px";
  element.style.width = `${TRACKER_DEFAULT_SIZE}px`;
  element.style.height = `${TRACKER_DEFAULT_SIZE}px`;
  element.style.color = TRACKER_DEFAULT_COLOR;
  element.style.pointerEvents = "none";
  element.style.userSelect = "none";
  element.style.zIndex = "2147483647";
  element.style.transform = "translate(-50%, -50%)";
  element.style.transition = "left 16ms linear, top 16ms linear, width 50ms linear, height 50ms linear, color 50ms linear";
  element.innerHTML = trackerDefaultIconSvg();
  document.documentElement.append(element);
  trackerState.element = element;
  setTrackerDefaultState();
}

function removeTrackerElement() {
  if (trackerState.pulseTimerId !== null) {
    window.clearTimeout(trackerState.pulseTimerId);
    trackerState.pulseTimerId = null;
  }

  if (trackerState.element instanceof HTMLElement) {
    trackerState.element.remove();
    trackerState.element = null;
  }
}

function moveTracker(point) {
  if (!executionState.trackMoves) {
    return;
  }

  ensureTrackerElement();
  if (!(trackerState.element instanceof HTMLElement)) {
    return;
  }

  const normalized = normalizeViewportPoint(point);
  trackerState.element.style.left = `${normalized.x}px`;
  trackerState.element.style.top = `${normalized.y}px`;
}

function pulseTracker() {
  if (!executionState.trackMoves || !(trackerState.element instanceof HTMLElement)) {
    return;
  }

  if (trackerState.pulseTimerId !== null) {
    window.clearTimeout(trackerState.pulseTimerId);
    trackerState.pulseTimerId = null;
  }

  applyTrackerStyle({ size: TRACKER_ACTIVE_SIZE, color: TRACKER_ACTIVE_COLOR });
  trackerState.element.innerHTML = trackerClickIconSvg();
  trackerState.pulseTimerId = window.setTimeout(() => {
    setTrackerDefaultState();
    trackerState.pulseTimerId = null;
  }, TRACKER_ACTIVE_DURATION_MS);
}

function normalizeViewportPoint(point) {
  const maxX = Math.max(VIEWPORT_EDGE_PADDING, window.innerWidth - VIEWPORT_EDGE_PADDING);
  const maxY = Math.max(VIEWPORT_EDGE_PADDING, window.innerHeight - VIEWPORT_EDGE_PADDING);
  return {
    x: clamp(point.x, VIEWPORT_EDGE_PADDING, maxX),
    y: clamp(point.y, VIEWPORT_EDGE_PADDING, maxY)
  };
}
