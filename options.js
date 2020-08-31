function save_options() {
  //multiline mode is enable for per sentence capitalization
  //if a sentence begins on a newline but the previous sentence didn't end with either one of ?!. 
  //then the current sentence's first word's first letter DOES get capitalized
  let enableMultiline = document.getElementById('multiline').checked;
  let isQuotationValidPunctuation = document.getElementById('quotation').checked;

  chrome.storage.sync.set({
    multiline: enableMultiline,
    quotation: isQuotationValidPunctuation
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value false for quotation and true for multiline
  chrome.storage.sync.get({
    multiline: false,
    quotation: false
  }, function(items) {
    document.getElementById('multiline').checked = items.multiline;
    document.getElementById('quotation').checked = items.quotation;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);