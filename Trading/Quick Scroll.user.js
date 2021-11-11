// ==UserScript==
// @name         Doc: Quick Scroll
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.4
// @description  Quickly scroll down the page to the mis-trade on the screen if one exists.
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
// Depreciation
document.body.appendChild((() => {
	const pTag = document.createElement('p');
	pTag.innerHTML = '<b>Depreciated | Doc: Quick Scroll</b><br>This script is now depreciated as it\'s functionality has been merged with Doc: View Trades v3.7'
		+ '<br>Delete this script to make this message disappear. Make sure you at least have v3.7 of Doc: View Trades for the functionality.</a>'
	pTag.style.position = 'fixed';
	pTag.style.bottom = '1em';
	pTag.style.right = '1em';
	pTag.style.backgroundColor = '#ff4d6a';
	pTag.style.padding = '1em';
	pTag.style.borderRadius = '0.5em';
	pTag.style.color = '#f2f2f2'
	pTag.style.fontSize = '12px';
	return pTag;
})());