chrome.contextMenus.create({
  id: "capitalizer",
  title: "Capitalizer",
  type: 'normal',
  contexts: ['editable'],
  //by using 'editable' and not 'selection' here, the contextMenu only appears in editable elements such as a textfield
});

let capitalizerFunc = clickData => {
  if(clickData.selectionText && clickData.menuItemId === "capitalizer") {
    let temp = clickData.selectionText.toUpperCase();
    alert(temp);
    alert(document.activeElement.value);

    chrome.tabs.executeScript({
      code: 'document.activeElement.value=' + temp
    });

  }
}

chrome.contextMenus.onClicked.addListener(capitalizerFunc);