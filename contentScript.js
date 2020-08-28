chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.todo);

  if(request.todo === "undo") {
    undoLastAction(document.activeElement);
  }
  else {
    transformText(document.activeElement, request.todo);
  }
});

//does the actual capitalization
function transformText(element, todo) {
  let selectionStart, selectionEnd = null;

  //GET SELECTION BOUNDARIES
  //if the element is of type input, textarea that has selectionStart and selectionEnd attributes
  // if (element is input) {
  selectionStart = element.selectionStart;
  selectionEnd = element.selectionEnd;
  // }
  // else {
  // //if the element is a div
  //   selectionStart = element.anchorOffset
  //   selectionEnd = element.focusOffset;
  // }

  //GET TEXT ELEMENT'S CONTENT
  //element.value is for textarea and input elements; innerHTML is for div elements (contentEditable divs)
  let string = element.value; 
  //|| element.innerHTML;
  
  //SPLIT THE STRING INTO 3 PARTS
  let prefix = string.substring(0, selectionStart);
  let infix = string.substring(selectionStart, selectionEnd);
  let postfix = string.substring(selectionEnd);
  
  //APPLY THE REQUESTED TRANSFORMATION ON THE SELECTED TEXT
  let newInfixString = null;
  switch(todo) {
    case "capitalizeSelected":
      newInfixString = infix.toUpperCase();
      break;
    case "lowerSelected":
      newInfixString = infix.toLowerCase();
      break;
    case "perSentence":
      newInfixString = infix.replace(/(?:^\s*|[\.\?!]\s*)[a-z]/g, function(match) { return match.toUpperCase() });
      break;
    case "perWord":
      newInfixString = infix.replace(/(?:^|[\.\?!\s])[a-z]/g, function(match) { return match.toUpperCase() });
      break;
    default:
      break;
  }

  //APPLY CHANGES TO DOM
  //Set existing value to localStorage so it can be used to perform undo later.
  chrome.storage.local.set({prevState: string }, () => {
    console.log("sS: "+selectionStart+",sE: "+selectionEnd+",pre:"+ prefix + ", post:" + postfix);

    if(element.value) {
      element.value = prefix + newInfixString + postfix;
    }
    // else if(element.innerHTML) {
    //   console.log(prefix + newInfixString + postfix);
    //   element.innerHTML = prefix + newInfixString + postfix;
    // }
  });
}

function undoLastAction(element) {

  //GET TEXT ELEMENT'S CONTENT
  //element.value is for textarea and input elements; innerHTML is for div elements (contentEditable divs)
  let string = element.value || element.innerHTML;
  
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

    //Apply undo to DOM using value from localStorage
    if(response) {
      if(element.value) {
        element.value = result.prevState;
      }
      else if(element.innerHTML) {
        element.innerHTML = result.prevState;
      }
    }
  });
}