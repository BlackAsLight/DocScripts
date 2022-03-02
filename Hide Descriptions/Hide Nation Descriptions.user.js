// ==UserScript==
// @name         Doc: Hide Nation Descriptions
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
// @description  Hides Nation's Descriptions set up by the user. Why? Because some people like to make them excessively long.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_NationDescription'))
	return;
document.body.append(CreateElement('div', divTag => {
	divTag.id = 'Doc_NationDescription';
	divTag.style.display = none;
}));

const descDivTag = document.getElementById('descCollapseDiv');

// Hide Nation Description By Default.
descDivTag.style.display = 'none';

// Only insert buttons if the Nation actually has a Description.
if (descDivTag.children[0].childElementCount) {
	// Insert button to toggle between Show/Hide Nation's Description.
	descDivTag.parentElement.insertBefore((() => {
		const divTag = document.createElement('div');
		divTag.style.display = 'block';
		divTag.style.paddingBottom = '1em';
		divTag.style.textAlign = 'center';
		divTag.appendChild((() => {
			const buttonTag = CreateButton('Show Description!');
			buttonTag.id = 'Doc_Button';
			return buttonTag;
		})());
		return divTag;
	})(), descDivTag);

	// Insert second button to Hide Nation's Description.
	descDivTag.insertBefore((() => {
		const divTag = document.createElement('div');
		divTag.style.textAlign = 'center';
		divTag.appendChild(CreateButton('Hide Description!'));
		return divTag;
	})(), descDivTag.children[1]);
}

// Remove Game's Nation Description Hide Button if User has it enabled.
const descButtonTag = document.getElementById('descCollapseBtn');
if (descButtonTag) {
	descButtonTag.remove();
}

// Function to Create Button to Show and Hide Nation's Description.
function CreateButton(text) {
	const buttonTag = document.createElement('button');
	buttonTag.style.backgroundColor = '#337AB7';
	buttonTag.style.color = '#FFFFFF';
	buttonTag.style.padding = '1em';
	buttonTag.style.borderRadius = '6px';
	buttonTag.innerText = text;
	buttonTag.onclick = ButtonClick;
	return buttonTag;
}

// Function to Switch between Displaying and Hiding the Nation's Description.
function ButtonClick() {
	if (descDivTag.style.display == 'none') {
		document.getElementById('Doc_Button').innerText = 'Hide Description!';
		descDivTag.style.display = '';
	}
	else {
		document.getElementById('Doc_Button').innerText = 'Show Description!';
		descDivTag.style.display = 'none';
	}
}