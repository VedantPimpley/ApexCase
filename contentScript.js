//add message listener, it accepts 'todo' from background.js and calls serviceUserRequest()
chrome.runtime.onMessage.addListener(serviceUserRequest);

function serviceUserRequest(request, sender, sendResponse) {
  if(request.todo === "undo") {
    undoLastAction(document.activeElement);
  }
  else {
    transformText(document.activeElement, request.todo);
  }
}

//does the actual case-changing
function transformText(element, todo) {
  let selectionStart, selectionEnd = null;
  let string = null;

  //finds type of element: "div", "input", "textarea" etc.
  let elementType = element.nodeName.toLowerCase();

  //GET SELECTION BOUNDARIES
  if (elementType === "textarea" || elementType === "input") {
    //if the element is of type input or textarea, they have selectionStart and selectionEnd attributes
    selectionStart = element.selectionStart;
    selectionEnd = element.selectionEnd;
  }
  else {
    //if the element is a div,
    //divs do not have selectionStart and selectionEnd attributes
    //hence we use window.getSelection() to find the selection boundaries.
    //Also the user can select the text in reverse order (from back to front)
    //this if-else handles that.
    if(window.getSelection().anchorOffset < window.getSelection().focusOffset) {
      selectionStart = window.getSelection().anchorOffset;
      selectionEnd = window.getSelection().focusOffset;
    }
    else {
      selectionEnd = window.getSelection().anchorOffset;
      selectionStart = window.getSelection().focusOffset;
    }
  }

  //GET TEXT ELEMENT'S CONTENT
  //element.value is for textarea and input elements; innerText is for div elements (contentEditable divs)
  if (elementType === "textarea" || elementType === "input") {
    string = element.value;
  }
  else {
  //if the element is a div
    string = element.innerText;
  }
    
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
    case "perWord":
      newInfixString = infix.replace(/(?:^|[\.\?!\s])[a-z]/g, function(match) { return match.toUpperCase() });
      break;
    case "perSentence":
      //regex options can be set on the options.html page
      //multiline is true by default, quotation is false by default
      let pattern = null;
      chrome.storage.sync.get({ multiline: true, quotation: false}, function(options) {
        if(options.multiline && options.quotation) {
          pattern = /(?:^\s*|[\.\?!"]\s*)[a-z]/gm;
        }
        else if(options.multiline) {
          pattern = /(?:^\s*|[\.\?!]\s*)[a-z]/gm;
        }
        else if(options.quotation) {
          pattern = /(?:^\s*|[\.\?!"]\s*)[a-z]/g;
        }
        else {
          pattern = /(?:^\s*|[\.\?!]\s*)[a-z]/g;
        }

        newInfixString = infix.replace(pattern, function(match) { return match.toUpperCase() });
      });
      break;
    default:
      break;
  }

  //APPLY CHANGES TO DOM
  //Check if array prevStates exists (i.e. any capitalization action has been taken by now).
  chrome.storage.local.get(['prevStates'], (result) => {
    //If yes, append 'string' to the array's beginning. 
    //If not, create a new array initialized with 'string' in it and set that to prevStates
    let updatedPrevStates = Array.isArray(result.prevStates) ? [string, ...result.prevStates] : new Array(string);

    //Set updated value to localStorage so it can be used to perform undo later.
    chrome.storage.local.set({
      prevStates: updatedPrevStates
    }, () => {
      //Then apply the changes to the DOM depending on element type
      if (elementType === "textarea" || elementType === "input") {
        element.value = prefix + newInfixString + postfix;
      }
      else {
        element.innerText = prefix + newInfixString + postfix;
      }
    });
  });

  //Deselect selected text in browser
  //why? DOM loses focus of selected text (info about boundaries) after every action 
  //but on the user's page the text selection can remain
  //the user then may perform an action that will not work 
  //because selectionEnd and selectionStart are not available to the extension
  window.getSelection().removeAllRanges();


  //Remove listener after the work is done
  //if we don't do this, new listeners will go on being created after every capitalization action
  //and the corresponding function will run as many times as the number of listeners
  chrome.runtime.onMessage.removeListener(serviceUserRequest);
}

function undoLastAction(element) {
  let string = null;
  //GET TEXT ELEMENT'S CONTENT
  //element.value is for textarea and input elements; innerText is for div elements (contentEditable divs)
  let elementType = element.nodeName.toLowerCase();
  if (elementType === "textarea" || elementType === "input") {
    string = element.value;
  }
  else {
    //if the element is a div
    string = element.innerText;
  }
  
  chrome.storage.local.get(['prevStates'], function(result) {
    if(result.prevStates[0] === undefined || result.prevStates[0] === string) {
      alert("No new actions have been taken, hence undo is not possible.")
    }

    let response = true;
    //compare current and previous contents
    if(result.prevStates[0].toLowerCase() !== string.toLowerCase()) {
      response = confirm(
        "The text in this field may have changed since the last capitalization. "+
        "Or, you may be trying to undo the last action taken on a DIFFERENT input field. "+ 
        "If you click okay, the changes/new input in this field will be lost. Proceed?"
      );
    }

    //Apply undo to DOM using most-recent value from localStorage
    if(response) {
      if(elementType === "textarea" || elementType === "input") {
        element.value = result.prevStates[0];
      }
      else {
        element.innerText = result.prevStates[0];
      }
    }
  });

  //Remove listener after the work is done
  //if we don't do this, new listeners will go on being created after every capitalization action
  //and the corresponding function will run as many times as the number of listeners
  chrome.runtime.onMessage.removeListener(serviceUserRequest);
}