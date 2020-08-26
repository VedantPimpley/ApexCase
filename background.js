chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.clear();
});

//create context menu in UI
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
  id: "capitalizeAll",
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
  title: "Capitalize first letter of first word in each sentence",
  type: 'normal',
  contexts: ['editable'],
});

//un-capitalize i.e. lowercase everything
chrome.contextMenus.create({
  id: "lowerAll",
  parentId: "parentMenu",
  title: "Change entire selection to lowercase",
  type: 'normal',
  contexts: ['editable'],
});

chrome.contextMenus.onClicked.addListener(e => {
  if(!e.selectionText && e.menuItemId !== "undo") {return null;}

  switch(e.menuItemId) {
    case "capitalizeAll":
      chrome.tabs.executeScript(null, {
        file: "./capitalizeAll.js"
      });
      break;

    case "lowerAll":
      chrome.tabs.executeScript(null, {
        file: "./lowerAll.js"
      });
      break;

    case "perWord":
      chrome.tabs.executeScript(null, {
        file: "./perWord.js"
      });
      break;

    case "perSentence":
      chrome.tabs.executeScript(null, {
        file: "./perSentence.js"
      });
      break;

    case "undo":
      chrome.tabs.executeScript(null, {
        file: "./undo.js"
      });
      break;

    default:
      return null;
  }
});