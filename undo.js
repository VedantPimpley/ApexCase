function undoLatestAction(element) {
  // let {selectionStart, selectionEnd} = element;
  let string = element.value;
  
  chrome.storage.local.get(['prevState'], function(result) {
    if(result.prevState === undefined || result.prevState === string) {
      alert("No actions have been taken, hence undo is not possible.")
    }

    let response = true;

    if(result.prevState.toLowerCase() !== string.toLowerCase()) {
      response = confirm(
        "The text in this field may have changed since the last capitalization. "+
        "Or, you may be trying to undo the last action taken on a DIFFERENT input field. "+ 
        "If you click okay, the changes/new input in this field will be lost. Proceed?"
      );
    }

    if(response) {
      element.value = result.prevState;
    }
  });
}

undoLatestAction(document.activeElement);