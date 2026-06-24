function isTextEditableElement(element) {
  if (element instanceof HTMLTextAreaElement) {
    return !element.disabled && !element.readOnly;
  }

  if (!(element instanceof HTMLInputElement) || element.disabled || element.readOnly) {
    return false;
  }

  const textTypes = new Set([
    "email",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "url"
  ]);
  return textTypes.has(element.type);
}

function getEditableKeyboardTarget(target) {
  if (target instanceof Element && isTextEditableElement(target)) {
    return target;
  }

  if (target instanceof Element) {
    const editable = target.closest("[contenteditable]");
    if (editable instanceof HTMLElement && editable.isContentEditable) {
      return editable;
    }
  }

  return null;
}

function readEditableKeyboardState(target) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    return {
      kind: "form-field",
      value: target.value,
      selectionStart: Number.isInteger(target.selectionStart) ? target.selectionStart : target.value.length,
      selectionEnd: Number.isInteger(target.selectionEnd) ? target.selectionEnd : target.value.length
    };
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    return {
      kind: "contenteditable",
      value: target.textContent ?? ""
    };
  }

  return null;
}

function didEditableStateChange(target, previousState) {
  if (!previousState) {
    return false;
  }

  const currentState = readEditableKeyboardState(target);
  if (!currentState) {
    return false;
  }

  return currentState.value !== previousState.value ||
    currentState.selectionStart !== previousState.selectionStart ||
    currentState.selectionEnd !== previousState.selectionEnd;
}

function setFormFieldValue(target, value) {
  const prototype = target instanceof HTMLTextAreaElement
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor?.set) {
    descriptor.set.call(target, value);
    return;
  }

  target.value = value;
}

function setFormFieldSelection(target, start, end = start) {
  if (typeof target.setSelectionRange !== "function") {
    return;
  }

  try {
    target.setSelectionRange(start, end);
  } catch {
    // Some input types, such as number, do not expose text selection.
  }
}

function restoreEditableSelection(target, editState) {
  if (!editState || editState.kind !== "form-field") {
    return;
  }
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }
  if (target.value !== editState.value) {
    return;
  }

  const selectionStart = Number.isInteger(editState.selectionStart) ? editState.selectionStart : target.value.length;
  const selectionEnd = Number.isInteger(editState.selectionEnd) ? editState.selectionEnd : selectionStart;
  setFormFieldSelection(target, selectionStart, selectionEnd);
}

function dispatchEditableBeforeInput(target, inputType, data) {
  const beforeInputEvent = new InputEvent("beforeinput", {
    bubbles: true,
    cancelable: true,
    composed: true,
    inputType,
    data
  });

  if (!target.dispatchEvent(beforeInputEvent)) {
    return false;
  }

  return true;
}

function dispatchEditableBeforeInputNotice(target, inputType, data) {
  dispatchEditableBeforeInput(target, inputType, data);
}

function dispatchEditableInput(target, inputType, data) {
  target.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    cancelable: false,
    composed: true,
    inputType,
    data
  }));
  return true;
}

function runEditableCommandWithInputFallback(target, command, inputType, data = null) {
  let inputDispatched = false;
  const handleInput = () => {
    inputDispatched = true;
  };
  target.addEventListener("input", handleInput, true);
  let didEdit = false;
  try {
    didEdit = document.execCommand(command, false, data ?? undefined);
  } catch {
    didEdit = false;
  } finally {
    target.removeEventListener("input", handleInput, true);
  }

  if (didEdit && !inputDispatched) {
    dispatchEditableInput(target, inputType, data);
  }

  return didEdit;
}

function replaceFormFieldSelection(target, replacement, inputType) {
  const value = target.value;
  const selectionStart = Number.isInteger(target.selectionStart) ? target.selectionStart : value.length;
  const selectionEnd = Number.isInteger(target.selectionEnd) ? target.selectionEnd : selectionStart;
  const nextValue = `${value.slice(0, selectionStart)}${replacement}${value.slice(selectionEnd)}`;
  setFormFieldValue(target, nextValue);
  const caret = selectionStart + replacement.length;
  setFormFieldSelection(target, caret);
  target.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    cancelable: false,
    composed: true,
    inputType,
    data: replacement || null
  }));
}

function insertTextIntoEditable(target, text) {
  if (!text) {
    return false;
  }

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    dispatchEditableBeforeInputNotice(target, "insertText", text);
    replaceFormFieldSelection(target, text, "insertText");
    return true;
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    dispatchEditableBeforeInputNotice(target, "insertText", text);
    runEditableCommandWithInputFallback(target, "insertText", "insertText", text);
    return true;
  }

  return false;
}

function deleteBackwardFromEditable(target) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const value = target.value;
    const selectionStart = Number.isInteger(target.selectionStart) ? target.selectionStart : value.length;
    const selectionEnd = Number.isInteger(target.selectionEnd) ? target.selectionEnd : selectionStart;
    if (selectionStart === 0 && selectionEnd === 0) {
      return true;
    }
    dispatchEditableBeforeInputNotice(target, "deleteContentBackward", null);
    const deleteStart = selectionStart === selectionEnd ? Math.max(0, selectionStart - 1) : selectionStart;
    const nextValue = `${value.slice(0, deleteStart)}${value.slice(selectionEnd)}`;
    setFormFieldValue(target, nextValue);
    setFormFieldSelection(target, deleteStart);
    target.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: false,
      composed: true,
      inputType: "deleteContentBackward",
      data: null
    }));
    return true;
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    dispatchEditableBeforeInputNotice(target, "deleteContentBackward", null);
    runEditableCommandWithInputFallback(target, "delete", "deleteContentBackward");
    return true;
  }

  return false;
}

function deleteForwardFromEditable(target) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const value = target.value;
    const selectionStart = Number.isInteger(target.selectionStart) ? target.selectionStart : value.length;
    const selectionEnd = Number.isInteger(target.selectionEnd) ? target.selectionEnd : selectionStart;
    if (selectionStart === value.length && selectionEnd === value.length) {
      return true;
    }
    dispatchEditableBeforeInputNotice(target, "deleteContentForward", null);
    const deleteEnd = selectionStart === selectionEnd ? Math.min(value.length, selectionEnd + 1) : selectionEnd;
    const nextValue = `${value.slice(0, selectionStart)}${value.slice(deleteEnd)}`;
    setFormFieldValue(target, nextValue);
    setFormFieldSelection(target, selectionStart);
    target.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: false,
      composed: true,
      inputType: "deleteContentForward",
      data: null
    }));
    return true;
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    dispatchEditableBeforeInputNotice(target, "deleteContentForward", null);
    runEditableCommandWithInputFallback(target, "forwardDelete", "deleteContentForward");
    return true;
  }

  return false;
}
