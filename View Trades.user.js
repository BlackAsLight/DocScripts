// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      2.9
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @match        https://politicsandwar.com/nation/trade/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
// Depreciation
(() => {
	let pTag = document.createElement('p');
	pTag.innerHTML = '<b>Depreciated | Doc: View Trades</b><br>This version of Doc: View Trades is now depreciated.'
		+ '<br><a style="color:inherit;text-decoration:underline;"target="_blank" href="https://github.com/BlackAsLight/DocScripts/raw/main/Trading/View%20Trades.user.js">Click here to install the updated version.</a>'
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