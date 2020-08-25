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
    let element = document.activeElement;


    let {selectionStart, selectionEnd} = element;

    // nothing is selected
    if (selectionStart === selectionEnd) return;

    let string = element.value;
    let prefix = string.substring(0, selectionStart);
    let infix = string.substring(selectionStart, selectionEnd);
    let postfix = string.substring(selectionEnd);

    let output = prefix + e.selectionText.toUpperCase() + postfix ;
    chrome.tabs.executeScript(null, {
      code: `document.activeElement.value+="${output}"`
    });

  }
});