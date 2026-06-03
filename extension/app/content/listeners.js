
function handleExecutionClickInterrupt(event) {
  if (!event.isTrusted) {
    return;
  }

  executionState.stopRequested = true;
  stopExecutionClickListener();
  void chrome.runtime.sendMessage({ type: "execution-user-click-interrupt" });
}

function startExecutionClickListener() {
  if (isExecutionClickListenerAttached) {
    return;
  }

  document.addEventListener("click", handleExecutionClickInterrupt, true);
  isExecutionClickListenerAttached = true;
}

function stopExecutionClickListener() {
  if (!isExecutionClickListenerAttached) {
    return;
  }

  document.removeEventListener("click", handleExecutionClickInterrupt, true);
  isExecutionClickListenerAttached = false;
}

function handleRecordingClick(event) {
  if (!recordingState.isActive) {
    return;
  }

  if (recordingState.mode === "selectors") {
    const target = getEventElement(event);
    const selector = target ? buildSelector(target) : "";
    void chrome.runtime.sendMessage({
      type: "recording-click",
      selector
    });
    return;
  }

  void chrome.runtime.sendMessage({
    type: "recording-click",
    x: event.clientX,
    y: event.clientY
  });
}

function startRecordingClickListener(mode) {
  recordingState.isActive = true;
  recordingState.mode = mode === "selectors" ? "selectors" : "coordinates";

  if (isRecordingClickListenerAttached) {
    return;
  }

  document.addEventListener("click", handleRecordingClick, true);
  isRecordingClickListenerAttached = true;
}

function stopRecordingClickListener() {
  recordingState.isActive = false;

  if (!isRecordingClickListenerAttached) {
    return;
  }

  document.removeEventListener("click", handleRecordingClick, true);
  isRecordingClickListenerAttached = false;
}
