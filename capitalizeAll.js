function capitalizeSelected(element) {
  let {selectionStart, selectionEnd} = element;
  console.log(element.type);

  //element.value is for textarea and input elements
  //innerHTML is for div elements (contentEditable divs)
  let string = element.value || element.innerHTML;
  
  //innerHTML is also a thing. An element may have element.value, .innerText, .innerHTML. 
  //Need to know a way to locate the string content.
  //selectionStart and selectionEnd are undefined for element.innerHTML
  let prefix = string.substring(0, selectionStart);
  let infix = string.substring(selectionStart, selectionEnd);
  let postfix = string.substring(selectionEnd);

  chrome.storage.local.set({prevState: string }, () => {
    if(element.value) {
      element.value = prefix + infix.toUpperCase() + postfix;
    }
    else if(element.innerHTML) {
      element.innerHTML = prefix + infix.toUpperCase() + postfix;
    }
  });
}

capitalizeSelected(document.activeElement);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.todo);
});