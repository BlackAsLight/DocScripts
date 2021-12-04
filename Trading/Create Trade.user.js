// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      1.6
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';

// If on Trade Successfully Made Page.
if (document.getElementsByClassName('alert-success').length) {
	let recursive = false;
	let args = location.search.slice(1).split('&');
	if (localStorage.Doc_IgnoreRecursive != 'true') {
		// Read Arguments to...
		for (let i = 0; i < args.length; ++i) {
			args[i] = args[i].split('=');
			// Update the Price in the URL.
			if (args[i][0] == 'p') {
				args[i][1] = localStorage.Doc_LastPrice;
			}
			// See if the Quantity listed is greater than 1,000,000.
			else if (args[i][0] == 'q') {
				const quantity = parseInt(args[i][1]);
				// If so subtract it and set recursive to true.
				if (quantity > 1000000) {
					args[i][1] = quantity - 1000000;
					recursive = true;
				}
			}
			args[i] = args[i].join('=');
		}
	}
	localStorage.Doc_Recursive = `${recursive}`;
	// If recursive is true then return to Create Trade Page.
	if (recursive) {
		location = location.origin + location.pathname + '?' + args.join('&');
	}
	// Otherwise Return to Market Page.
	else {
		// If User has the Infinite Scroll feature on from View Trade Script...
		if (localStorage.Doc_LoadAllOffers == 'true') {
			let args = document.getElementsByClassName('alert-success')[0].children[1].children[0].href.split('&');
			for (let i = 0; i < args.length; i++) {
				args[i] = args[i].split('=');
				// Then adjust the minimum value to zero so everything looks normal.
				if (args[i][0] == 'minimum') {
					args[i][1] = 0;
				}
				args[i] = args[i].join('=');
			}
			location = args.join('&');
		}
		// Otherwise just use whatever link the game suggested.
		else {
			location = document.getElementsByClassName('alert-success')[0].children[1].children[0].href;
		}
	}
}
// If of Create Trade Page.
else {
	document.getElementById('priceper').parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.scrollIntoView({
		behavior: 'smooth',
		block: 'center'
	});
	localStorage.Doc_IgnoreRecursive = 'false';
	let args = location.search.slice(1).split('&');
	let quantity;
	for (let i = 0; i < args.length; ++i) {
		args[i] = args[i].split('=');
		// Getting Price from URL to fill in.
		if (args[i][0] == 'p') {
			const price = parseInt(args[i][1]);
			let priceTag = document.getElementById('priceper');
			priceTag.value = price;
			// Logging Price in case Recursive gets activated.
			localStorage.Doc_LastPrice = `${price}`;
			priceTag.onchange = () => {
				localStorage.Doc_LastPrice = document.getElementById('priceper').value;
			};
		}
		// Getting Quantity from URL to fill in.
		else if (args[i][0] == 'q') {
			quantity = parseInt(args[i][1]);
			document.getElementById('amount').value = quantity > 1000000 ? 1000000 : quantity;
		}
		// Getting Type from URL to figure out which button to hide.
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
				DisableButton(sellButton);
				ButtonClicked(sellButton, quantity);
			}
			else {
				sellButton.style.display = 'none';
				buyButton.style.borderRadius = '6px';
				buyButton.type = 'submit';
				buyButton.name = 'submit';
				buyButton.value = 'Buy';
				buyButton.dataset.target = '';
				DisableButton(buyButton);
				ButtonClicked(buyButton, quantity);
			}
		}
	}

	// Code to format the Show Top Offers Table.
	// - Does anyone actually use that?
	document.getElementById('showTopOffersBtn').onclick = () => {
		setTimeout(() => {
			let tables = Array.from(document.getElementById('topOffersSection').getElementsByClassName('nationtable'));
			for (let i = 0; i < 2; ++i) {
				let table = tables.shift();
				let rows = Array.from(table.children[0].children);
				for (let j = 0; j < rows[0].childElementCount; j++) {
					rows[0].children[j].style = 'background: ' + (i ? '#2d6a9f' : '#3e8e3e');
				}
				rows.shift();
				for (let j = 0; j < rows.length; ++j) {
					for (let k = 0; k < rows[j].childElementCount; ++k) {
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

// Disables Button for 5 seconds if Recursive Feature is active.
function DisableButton(tag) {
	if (localStorage.Doc_Recursive == 'true') {
		tag.disabled = true;
		setTimeout(() => { tag.disabled = false; }, 5000);
		localStorage.Doc_Recursive = 'false';
	}
}

// Ignores Checking for Recursive if amount isn't what was prefilled.
function ButtonClicked(tag, quantity) {
	tag.onclick = () => {
		if ((quantity > 1000000 ? 1000000 : quantity) != parseInt(document.getElementById('amount').value)) {
			localStorage.Doc_IgnoreRecursive = 'true';
		}
	};
}