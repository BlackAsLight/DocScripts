// ==UserScript==
// @name         Doc: Away Baseball
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Make Playing Away Games Better
// @author       BlackAsLight
// @match        https://politicsandwar.com/obl/play/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
window.onload = () => {
	// Refresh page if there are no available games.
	const aTag = Array.from(document.getElementsByTagName('a')).filter(x => x.textContent == 'Refresh')[0];
	if (aTag != undefined) {
		setTimeout(() => {
			window.location = 'https://politicsandwar.com/obl/play/';
		}, 3000);
	}

	// If a game is played...
	if (document.getElementsByClassName('nationtable').length > 2) {
		// Hide game details so page looks normal.
		let children = Array.from(document.getElementById('rightcolumn').children);
		for (let i = 0; i < 9; ++i) {
			children[3 + i].style.display = 'none';
		}
	}
}
