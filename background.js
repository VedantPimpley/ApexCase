console.log("from background");

//create context menu in UI
chrome.contextMenus.create({
  id: "capitalizer",
  title: "Capitalizer",
  type: 'normal',
  contexts: ['editable'],
  //by using 'editable' and not 'selection' here, the contextMenu only appears in editable elements such as a textfield
});

chrome.contextMenus.onClicked.addListener(e => {
  if(e.selectionText && e.menuItemId === "capitalizer") {
    chrome.tabs.executeScript(null, {
      file: "./content.js"
    });
  }
});