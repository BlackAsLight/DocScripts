// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      1.3
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
// Depreciation
(() => {
	let pTag = document.createElement('p');
	pTag.innerHTML = '<b>Depreciated | Doc: Create Trade</b><br>This version of Doc: Create Trades is now depreciated.'
		+ '<br><a style="color:inherit;text-decoration:underline;"target="_blank" href="https://github.com/BlackAsLight/DocScripts/raw/main/Trading/Create%20Trade.user.js">Click here to install the updated version.</a>'
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