function capitalizeSelected(element) {
  let {selectionStart, selectionEnd} = element;

  let string = element.value;
  let prefix = string.substring(0, selectionStart);
  let infix = string.substring(selectionStart, selectionEnd);
  let postfix = string.substring(selectionEnd);

  chrome.storage.local.set({prevState: string }, () => {
    console.log('Prev state:'+ string);
    element.value = prefix + infix.toUpperCase() + postfix ;
  });
}

capitalizeSelected(document.activeElement);