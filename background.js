console.log("from background");

//create context menu in UI
chrome.contextMenus.create({
  id: "parentMenu",
  title: "Capitalizer",
  type: 'normal',
  contexts: ['editable'],
  //note that we use editable, not selection
});

//undo sub-contextMenu
chrome.contextMenus.create({
  id: "undo",
  parentId: "parentMenu",
  title: "Undo selected",
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
  title: "Capitalize each word",
  type: 'normal',
  contexts: ['editable'],
});

////per-sentence capitalize sub-contextMenu
chrome.contextMenus.create({
  id: "perSentence",
  parentId: "parentMenu",
  title: "Capitalize first word of each sentence",
  type: 'normal',
  contexts: ['editable'],
});

chrome.contextMenus.onClicked.addListener(e => {
  if(!e.selectionText) {return null;}

  switch(e.menuItemId) {
    case "capitalizeAll":
      chrome.tabs.executeScript(null, {
        file: "./content.js"
      });
      break;

    case "perWord":
      //
      break;

    case "perSentence":
      //
      break;
      
    default:
      return null;
  }
});