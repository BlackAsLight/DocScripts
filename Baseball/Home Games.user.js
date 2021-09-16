// ==UserScript==
// @name         Doc: Home Baseball
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Make Hosting Games Better
// @author       BlackAsLight
// @match        https://politicsandwar.com/obl/host/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
window.onload = () => {
	// Refresh page if currently hosting a game.
	if (Array.from(document.getElementsByTagName('input')).filter(x => x.type == 'submit')[0].value == 'Cancel Home Game') {
		setTimeout(() => {
			window.location = 'https://politicsandwar.com/obl/host/';
		}, 3000);
	}
}