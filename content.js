let element = document.activeElement;
let {selectionStart, selectionEnd} = element;

// nothing is selected
// if (selectionStart === selectionEnd)

let string = element.value;
let prefix = string.substring(0, selectionStart);
let infix = string.substring(selectionStart, selectionEnd);
let postfix = string.substring(selectionEnd);

element.value = prefix + infix.toUpperCase() + postfix ;