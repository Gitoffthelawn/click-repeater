function getKeyboardEventTarget() {
  const activeElement = document.activeElement;
  return activeElement instanceof Element ? activeElement : document;
}

function getKeyboardTargetBySelector(selector) {
  if (typeof selector !== "string" || !selector.trim()) {
    return null;
  }

  try {
    const target = document.querySelector(selector);
    return target instanceof Element ? target : null;
  } catch {
    return null;
  }
}

function getKeyboardActionTarget(action) {
  return getKeyboardTargetBySelector(action.targetSelector) || getKeyboardEventTarget();
}

function focusNextElement(backward) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "[contenteditable]"
  ].join(",");
  const elements = Array.from(document.querySelectorAll(selector))
    .filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
  if (!elements.length) {
    return false;
  }

  const activeElement = document.activeElement;
  const currentIndex = elements.indexOf(activeElement);
  const nextIndex = backward
    ? (currentIndex <= 0 ? elements.length - 1 : currentIndex - 1)
    : (currentIndex < 0 || currentIndex >= elements.length - 1 ? 0 : currentIndex + 1);
  elements[nextIndex].focus();
  return true;
}

function submitInputForm(target) {
  if (!(target instanceof HTMLInputElement) || !(target.form instanceof HTMLFormElement)) {
    return false;
  }

  if (typeof target.form.requestSubmit === "function") {
    target.form.requestSubmit();
    return true;
  }

  target.form.dispatchEvent(new Event("submit", {
    bubbles: true,
    cancelable: true
  }));
  return true;
}

function applyKeyboardDefaultEffect(action, target, keyboardEvent, previousEditState) {
  if (action.type !== "keydown" || action.ctrlKey || action.metaKey || action.altKey) {
    return;
  }

  const editableTarget = getEditableKeyboardTarget(target);
  if (!editableTarget && keyboardEvent.defaultPrevented) {
    return;
  }

  if (action.key === "Tab") {
    if (keyboardEvent.defaultPrevented) {
      return;
    }
    focusNextElement(action.shiftKey);
    return;
  }

  if ((action.key === "Enter" || action.key === " ") && target instanceof HTMLElement && !getEditableKeyboardTarget(target)) {
    target.click();
    return;
  }

  if (!editableTarget) {
    return;
  }
  if (didEditableStateChange(editableTarget, previousEditState)) {
    return;
  }

  if (action.key === "Backspace") {
    deleteBackwardFromEditable(editableTarget);
    return;
  }

  if (action.key === "Delete") {
    deleteForwardFromEditable(editableTarget);
    return;
  }

  if (action.key === "Enter") {
    if (editableTarget instanceof HTMLTextAreaElement || editableTarget.isContentEditable) {
      insertTextIntoEditable(editableTarget, "\n");
      return;
    }
    submitInputForm(editableTarget);
    return;
  }

  if (action.key.length === 1) {
    insertTextIntoEditable(editableTarget, action.key);
  }
}

function dispatchKeyboardAction(action) {
  const target = getKeyboardActionTarget(action);
  if (target instanceof HTMLElement) {
    target.focus();
  }
  restoreEditableSelection(target, action.editState);
  const editableTarget = getEditableKeyboardTarget(target);
  const previousEditState = editableTarget ? readEditableKeyboardState(editableTarget) : null;
  const event = new KeyboardEvent(action.type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    key: action.key,
    code: action.code,
    altKey: action.altKey,
    ctrlKey: action.ctrlKey,
    metaKey: action.metaKey,
    shiftKey: action.shiftKey,
    location: action.location,
    repeat: action.repeat,
    isComposing: action.isComposing
  });
  target.dispatchEvent(event);
  applyKeyboardDefaultEffect(action, target, event, previousEditState);
}
