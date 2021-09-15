// ==UserScript==
// @name         Doc: Hide Nation Descriptions
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Hides Nation's Descriptions set up by the user. Why? Because some people like to make them excessively long.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
document.getElementById('descCollapseDiv').remove();

// Depreciation
(() => {
	let pTag = document.createElement('p');
	pTag.innerHTML = '<b>Depreciated | Doc: Hide Nation Descriptions</b><br>This version of Doc: Hide Nation Descriptions is now depreciated.'
		+ '<br><a style="color:inherit;text-decoration:underline;"target="_blank" href="https://github.com/BlackAsLight/DocScripts/raw/main/Hide%20Descriptions/Hide%20Nation%20Descriptions.user.js">Click here to install the updated version.</a>'
	pTag.style.position = 'fixed';
	pTag.style.bottom = '1em';
	pTag.style.right = '1em';
	pTag.style.backgroundColor = '#ff4d6a';
	pTag.style.padding = '1em';
	pTag.style.borderRadius = '0.5em';
	pTag.style.color = '#f2f2f2'
	pTag.style.fontSize = '12px';
	document.body.appendChild(pTag);
})();