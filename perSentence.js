function capitalizeFirstWordLetter(element) {
  let {selectionStart, selectionEnd} = element;

  let string = element.value;
  let prefix = string.substring(0, selectionStart);
  let infix = string.substring(selectionStart, selectionEnd);
  let postfix = string.substring(selectionEnd);

  chrome.storage.local.set({prevState: string }, () => {
    let result = infix.replace(/(?:^\s*|[\.\?!]\s*)[a-z]/g, function(match) { return match.toUpperCase() })
    element.value = prefix + result + postfix ;
  });
}

capitalizeFirstWordLetter(document.activeElement);