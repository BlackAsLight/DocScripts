// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @grant        none
// ==/UserScript==

'use strict';

if (document.getElementsByClassName('alert-success').length) {
	window.location = document.getElementsByClassName('alert-success')[0].children[1].children[0].href;
}
else {
	let args = window.location.search.slice(1).split('&');
	for (let i = 0; i < args.length; i++) {
		args[i] = args[i].split('=');
		if (args[i][0] == 'p') {
			document.getElementById('priceper').value = parseInt(args[i][1]);
		}
		else if (args[i][0] == 'q') {
			document.getElementById('amount').value = parseInt(args[i][1]);
		}
		else if (args[i][0] == 't') {
			let sellButton = document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[0];
			let buyButton = document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[1];
			if (args[i][1] == 's') {
				buyButton.style.display = 'none';
				sellButton.style.borderRadius = '6px';
				sellButton.type = 'submit';
				sellButton.name = 'submit';
				sellButton.value = 'Sell';
				sellButton.dataset.target = '';
			}
			else {
				sellButton.style.display = 'none';
				buyButton.style.borderRadius = '6px';
				buyButton.type = 'submit';
				buyButton.name = 'submit';
				buyButton.value = 'Buy';
				buyButton.dataset.target = '';
			}
		}
	}

	document.getElementById('showTopOffersBtn').onclick = () => {
		setTimeout(() => {
			let tables = Array.from(document.getElementById('topOffersSection').getElementsByClassName('nationtable'));
			for (let i = 0; i < 2; i++) {
				let table = tables.shift();
				let rows = Array.from(table.children[0].children);
				for (let j = 0; j < rows[0].childElementCount; j++) {
					rows[0].children[j].style = 'background: ' + (i ? '#2d6a9f' : '#3e8e3e');
				}
				rows.shift();
				for (let j = 0; j < rows.length; j++) {
					for (let k = 0; k < rows[j].childElementCount; k++) {
						let background = '';
						if (j % 2) {
							background = 'background: ' + (i ? '#9cc2e3;' : '#a6d8a6;');
						}
						if (k == 0) {
							rows[j].children[k].style = background + 'text-align: center;';
							rows[j].children[k].textContent = (() => {
								let date = new Date(rows[j].children[k].textContent);
								let text = '';
								if (date.getHours() < 10) {
									text += '0';
								}
								text += date.getHours() + ':';
								if (date.getMinutes() < 10) {
									text += '0';
								}
								text += date.getMinutes() + ' ';
								if (date.getDate() < 10) {
									text += '0';
								}
								text += date.getDate() + '/';
								switch (date.getMonth()) {
									case 0:
										text += 'Jan/';
										break;
									case 1:
										text += 'Feb/';
										break;
									case 2:
										text += 'Mar/';
										break;
									case 3:
										text += 'Apr/';
										break;
									case 4:
										text += 'May/';
										break;
									case 5:
										text += 'Jun/';
										break;
									case 6:
										text += 'Jul/';
										break;
									case 7:
										text += 'Aug/';
										break;
									case 8:
										text += 'Sep/';
										break;
									case 9:
										text += 'Oct/';
										break;
									case 10:
										text += 'Nov/';
										break;
									case 11:
										text += 'Dec/';
										break;
								}
								text += date.getFullYear();
								return text;
							})();
						}
						else {
							rows[j].children[k].style = background + 'text-align: right;';
						}
					}
				}
			}
		}, 500)
	};
}
