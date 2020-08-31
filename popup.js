'use strict'
chrome.storage.local.get(['prevStates'], (result) => {
  let item = document.createElement('div');
  item.className = 'prevStatesContainer';
  let prevStatesArray = result.prevStates;

  for(let i = 0; i < prevStatesArray.length; i++) {
    let newElement = document.createElement('div');
    newElement.innerHTML = prevStatesArray[i];
    item.appendChild(newElement);
    item.appendChild(document.createElement('hr'));
  }
  document.body.appendChild(item);
});