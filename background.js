chrome.runtime.onStartup.addListener(() => {
  //clear data from the last browser session
  chrome.storage.local.clear();
});

//CREATE CONTEXT MENU OPTION IN BROWSER UI ON RIGHTCLICK
chrome.contextMenus.create({
  id: "parentMenu",
  title: "ApexCase Capitalizer",
  type: 'normal',
  contexts: ['editable'],
  //note that we use editable, not selection
});

//undo sub-contextMenu
chrome.contextMenus.create({
  id: "undo",
  parentId: "parentMenu",
  title: "Undo last action",
  type: 'normal',
  contexts: ['editable'],
});

//capitalize everything sub-contextMenu
chrome.contextMenus.create({
  id: "capitalizeSelected",
  parentId: "parentMenu",
  title: "Capitalize entire selection",
  type: 'normal',
  contexts: ['editable'],
});

//per-word capitalize sub-contextMenu
chrome.contextMenus.create({
  id: "perWord",
  parentId: "parentMenu",
  title: "Capitalize first letter of each word",
  type: 'normal',
  contexts: ['editable'],
});

////per-sentence capitalize sub-contextMenu
chrome.contextMenus.create({
  id: "perSentence",
  parentId: "parentMenu",
  title: "Capitalize first letter of each sentence",
  type: 'normal',
  contexts: ['editable'],
});

//un-capitalize i.e. lowercase everything
chrome.contextMenus.create({
  id: "lowerSelected",
  parentId: "parentMenu",
  title: "Change entire selection to lowercase",
  type: 'normal',
  contexts: ['editable'],
});

chrome.contextMenus.onClicked.addListener(e => {
  //text must be selected by the user, except in the case of undo action
  if(!e.selectionText && e.menuItemId !== "undo") { 
    return null;
  }

  //find out which is the current tab (tabs[0].id)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //inject contentScript on current tab and then run a callback function
    chrome.tabs.executeScript(tabs[0].id, {file: "contentScript.js"}, function(){
      //send a message to contentScript.js telling which action to perform on active tab
      chrome.tabs.sendMessage(tabs[0].id, {todo: e.menuItemId});
    });
  });
});