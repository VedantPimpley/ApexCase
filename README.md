# ApexCase - Text Capitalizer Extension

ApexCase is a browser extension which lets you easily change the capitalization of the text that's being edited. The simple UI lets the user quickly change the capitalization to match the intended tone and utility of the text.

![ApexCase](https://user-images.githubusercontent.com/57246364/91425009-33bd8780-e878-11ea-8acd-098ba45a8ac3.gif)

## Installation
[Get it from the Chrome Web Store : ApexCase Capitalizer](https://chrome.google.com/webstore/detail/apexcase-capitalizer/ijoemkoipbejbfmedlellkdidiopecfg?hl=en)

OR

* Download the project files.
* Open chrome://extensions/ in Google Chrome. 
* Click on 'Load Unpacked'. 
* Select the folder in which the files are downloaded.
* The extension will appear in the Chrome Extensions tab and can be used now.

## Description

ApexCase allows quick, easy and smooth text capitalization. Simply by selecting and right clicking on a block of editable text, and then clicking on a menu option, the user can change the case of the text. 

It can handle large amounts of text and can save a lot of time. This prevents the hassle of doing it manually or finding a website that does it for you. It keeps you in the writing flow, and effectively automates the irritating work. 

Consider these examples of its use:

1. If you had **written something informally but now you have to make it presentable for others**, you have to go and capitalize the start of each sentence to make it look good. This is tedious and repetitive. The 'Capitalize first letter of each sentence' feature will do it in one click.

2. We often work with **abbreviations and acronyms** in resumes, official communications, research papers etc. To capitalize the first letter of each word of the abbreviation, you have to move your cursor, hold shift to capitalize, type the letter and move on to the next letter. For a word like SONAR, that's 19 total inputs! The 'Capitalize first letter of each word' feature will do it for you.

3. When you want to **emphasize text or add emotions (joy, excitement, anger)** to the tone of your text, just select the text and hit the 'Capitalize entire selection' option. You won't have to rewrite the whole thing.

## Usage

### Context Menu
On a webpage, go to an input element. Select the text you wish to modify. Right click on it, and hover over the 'ApexCase Capitalizer' option. 
This will reveal a submenu with five options.

1. **Undo last action**: Reverts the last case-change action performed, along WITH any changes made to the text following that action. Do note that undo can only revert the last action, and this cannot be chained to do multiple undos.

2. **Capitalize entire selection**: All alphabets [a-z] will be replaced by their respective upper case alphabets.

3. **Capitalize first letter of each word**: Only the first letter of each word will be capitalized, leaving all the other characters as they are.

4. **Capitalize first letter of each sentence**: Only the first letter of the first word of each sentence will be capitalized, leaving all the other characters as they are. This is the generally the norm in English.

5. **Change entire selection to lowercase**: All capital alphabets [A-Z] will be replaced by their respective lower case alphabets.

### Popup page
![popup](https://user-images.githubusercontent.com/57246364/91857456-8edee800-ec85-11ea-8035-a80036324075.jpeg)
You can always find your previous input contents in the popup.

Clicking on the extension icon will reveal the popup. Here, the user can find many entries, each containing the text content of the input elements before they performed a case-change action in it. They are sorted by most recent first. While the undo feature can only go back one step, here the user can find and retrieve all their old text content from the time the browser was opened.

### Options page
Right clicking on the extension icon and clicking on 'Options' will open the options page.

It has two options related to the 'Capitalize first letter of each sentence' feature.
1. **Enable multiline mode:** On enabling it, a sentence starting on a new line (i.e. after the user pressed enter thereby inserting \n) will be considered to be a new sentence, even if the previous sentence didn't end with punctuation. As a result, it's first letter will be capitalized. This is enabled by default.

2. **Capitalize start of sentences beginning with quotation mark ("):** 
The word following an exclamation mark(!), period(.), question mark(?) is considered the start of a sentence. By enabling this option, the word following a quotation mark or double apostrophe (") will also be considered as the start of a new sentence. Thus, it's first letter too will be capitalized. This is disabled by default.

### Limitations
1. The extension may not be compatible with WYSIWYG editors online. 
2. Using the extension deletes the element's undo/redo history.

**Your previous text content can always be found in the popup window, so there is no risk of it being lost.** 

## Contributing
Pull requests are welcome. Please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.