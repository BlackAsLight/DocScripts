// ==UserScript==
// @name         Doc: Hide Nation Descriptions
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.4
// @description  Hides Nation's Descriptions set up by the user. Why? Because some people like to make them excessively long.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
const descTag = document.getElementById('descCollapseDiv');

// Hide Nation Description By Default.
descTag.style.display = 'none';

// Only insert buttons if the Nation actually has a Description.
if (descTag.children[0].childElementCount) {
	// Insert button to toggle between Show/Hide Nation's Description.
	descTag.parentElement.insertBefore((() => {
		const divTag = document.createElement('div');
		divTag.style.display = 'block';
		divTag.style.paddingBottom = '1em';
		divTag.style.textAlign = 'center';
		divTag.appendChild((() => {
			const buttonTag = document.createElement('button');
			buttonTag.id = 'Doc_Button';
			buttonTag.style.backgroundColor = '#337AB7';
			buttonTag.style.color = '#FFFFFF';
			buttonTag.style.padding = '1em';
			buttonTag.style.borderRadius = '6px';
			buttonTag.innerText = 'Show Description!';
			buttonTag.onclick = buttonClick;
			return buttonTag;
		})());
		return divTag;
	})(), descTag);

	// Insert second button to Hide Nation's Description.
	descTag.insertBefore((() => {
		const divTag = document.createElement('div');
		divTag.style.textAlign = 'center';
		divTag.appendChild((() => {
			const buttonTag = document.createElement('button');
			buttonTag.style.backgroundColor = '#337AB7';
			buttonTag.style.color = '#FFFFFF';
			buttonTag.style.padding = '1em';
			buttonTag.style.borderRadius = '6px';
			buttonTag.innerText = 'Hide Description!';
			buttonTag.onclick = buttonClick;
			return buttonTag;
		})());
		return divTag;
	})(), descTag.children[1]);
}

// Function to Switch between Displaying and Hiding the Nation's Description.
function buttonClick() {
	if (descTag.style.display == 'none') {
		document.getElementById('Doc_Button').innerText = 'Hide Description!';
		descTag.style.display = '';
	}
	else {
		document.getElementById('Doc_Button').innerText = 'Show Description!';
		descTag.style.display = 'none';
	}
}