function lowerSelected(element) {
  let {selectionStart, selectionEnd} = element;

  let string = element.value;
  let prefix = string.substring(0, selectionStart);
  let infix = string.substring(selectionStart, selectionEnd);
  let postfix = string.substring(selectionEnd);

  chrome.storage.local.set({prevState: string }, () => {
    element.value = prefix + infix.toLowerCase() + postfix ;
  });
}

lowerSelected(document.activeElement);