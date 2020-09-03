//Add message listener. it accepts 'todo' from background.js and calls serviceUserRequest().
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

  //finds type of element: "div" (contenteditable div), "input", "textarea" etc.
  let elementType = element.nodeName.toLowerCase();


  //1. GET SELECTION BOUNDARIES
  if (elementType === "textarea" || elementType === "input") {
    //input or textarea elements have selectionStart and selectionEnd attributes
    selectionStart = element.selectionStart;
    selectionEnd = element.selectionEnd;
  }
  else {
    //div doesn't have above attributes
    //and div can have children nodes
    //hence we use getSelectionCharacterOffsetWithin() to find correct selection boundaries
    let selOffsets = getSelectionCharacterOffsetWithin( document.activeElement )
    selectionStart = selOffsets.start;
    selectionEnd = selOffsets.end;
  }


  //2. GET THE ENTIRE TEXT ELEMENT'S CONTENTS
  //textarea and input elements have element.value
  if (elementType === "textarea" || elementType === "input") {
    string = element.value;
  }
  else {
  //divs have element.innerText
    string = element.innerText;
  }
    

  //3. SPLIT THE STRING INTO 3 PARTS
  let prefix = string.substring(0, selectionStart); //before selection
  let infix = string.substring(selectionStart, selectionEnd); //selection
  let postfix = string.substring(selectionEnd); //after selection

  if(elementType !== "textarea" && elementType !== "input") {
    //In the case of divs, p, spans etc. I use a different function to get the selection [getSelectionCharacterOffsetWithin]
    //however in this function, newline(\n) is not counted as a character of the text
    //but innerText does count \n as a character in the text.
    //In order to correcly match the selection borders to the innerText string,
    //I offset the string by the number of \n characters encountered.

    let count1 = (prefix.match(/\n/g) || []).length;
    let count2 = (infix.match(/\n/g) || []).length;
    
    prefix = string.substring(0, selectionStart + count1);
    infix = string.substring(selectionStart + count1, selectionEnd + count1 + count2);
    postfix = string.substring(selectionEnd + count1 + count2);
  }


  //4. APPLY THE REQUESTED TRANSFORMATION ON THE SELECTED TEXT
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


  //5. APPLY CHANGES TO DOM
  chrome.storage.local.get(['prevStates'], (result) => {
    //Check if array 'prevStates' already exists
      //If yes, add 'string' as the array's first element
      //If not, create a new array 'prevStates' initialized with 'string'
    let updatedPrevStates = Array.isArray(result.prevStates) ? [string, ...result.prevStates] : new Array(string);

    //Set updated value to localStorage so it can be used to perform undo later.
    chrome.storage.local.set({ prevStates: updatedPrevStates }, () => {
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


  //1. GET TEXT ELEMENT'S CONTENT
  //element.value is for textarea and input elements; innerText is for div elements (contentEditable divs)
  let elementType = element.nodeName.toLowerCase();
  if (elementType === "textarea" || elementType === "input") {
    string = element.value;
  }
  else {
    //if the element is a div
    string = element.innerText;
  }
  

  //2. CHECK UNSAFE CONDITIONS
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
    

  //3. APPLY UNDO TO DOM
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

function getSelectionCharacterOffsetWithin(element) {
  let start = 0;
  let end = 0;
  let doc = element.ownerDocument || element.document;
  let win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
        let range = win.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        start = preCaretRange.toString().length;
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        end = preCaretRange.toString().length;
    }
  } else if ( (sel = doc.selection) && sel.type != "Control") {
      let textRange = sel.createRange();
      let preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToStart", textRange);
      start = preCaretTextRange.text.length;
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      end = preCaretTextRange.text.length;
  }
  return { start: start, end: end }
}