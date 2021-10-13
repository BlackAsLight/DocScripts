// ==UserScript==
// @name         Doc: Quick Scroll
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Quickly scroll down the page to the mis-trade on the screen if one exists.
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
if ((() => {
	let args = window.location.search.slice(1).split('&');
	let checkOne = false;
	let checkTwo = false;
	let checkThree = false;
	while (args.length) {
		const arg = args.shift().split('=');
		if (arg[0] == 'display') {
			if (arg[1] == 'world') {
				checkOne = true;
			}
		}
		else if (arg[0] == 'buysell') {
			if (!arg[1].length) {
				checkTwo = true;
			}
		}
		else if (arg[0] == 'resource1') {
			if (arg[1].length) {
				checkThree = true;
			}
		}
	}
	return checkOne && checkTwo && checkThree;
})()) {
	let rows = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
	let highestSell = 0;
	let lowestBuy = 50000000;
	while (rows.length) {
		const row = rows.shift();
		const cells = Array.from(row.children);
		const price = parseInt(cells[5].textContent.trim().split(' ')[0].replaceAll(',', ''));
		const offerIsSelling = cells[1].children.length == 1 ? true : false;
		if (offerIsSelling) {
			highestSell = Math.max(highestSell, price);
		}
		else {
			lowestBuy = Math.min(lowestBuy, price);
		}
		if (lowestBuy < highestSell) {
			// Jump!
			row.scrollIntoView({
				behavior: 'smooth',
                block: 'center'
			});
			break;
		}
	}
}