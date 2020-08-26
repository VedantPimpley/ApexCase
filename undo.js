function undoLatestAction(element) {
  // let {selectionStart, selectionEnd} = element;
  let string = element.value;
  
  chrome.storage.local.get(['prevState'], function(result) {
    let response = true;

    if(result.prevState === undefined) {
      alert("No actions have been taken, hence undo is not possible.")
    }
    if(result.prevState.toLowerCase() !== string.toLowerCase()) {
      response = confirm("Changes made after last capitalization will be lost. Are you sure?");
    }
    if(response) {
      element.value = result.prevState;
    }
  });
}

undoLatestAction(document.activeElement);