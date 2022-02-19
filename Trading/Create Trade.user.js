// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      1.7
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
function Migrate(oldText, newText) {
	if (localStorage.getItem(oldText)) {
		localStorage.setItem(newText, localStorage.getItem(oldText));
		localStorage.removeItem(oldText);
	}
}

function TradeWasMade() {
	let recursive = false;
	const args = location.search.slice(1).split('&');

	if (!localStorage.getItem('Doc_CT_IgnoreRecursive')) {
		args.map(x => {
			x = x.split('=');
			if (x[0] === 'p') {
				const acceptedPrice = localStorage.getItem('Doc_CT_AcceptedPrice');
				if (acceptedPrice) {
					x[1] = acceptedPrice;
				}
				localStorage.removeItem('Doc_CT_AcceptedPrice');
			}
			else if (x[0] === 'q') {
				const quantity = parseInt(x[1]) - 1000000;
				if (quantity > 0) {
					x[1] = quantity;
					recursive = true;
				}
			}
			return x.join('=');
		});
	}

	if (recursive) {
		localStorage.setItem('Doc_CT_LastClicked', new Date().getTime());
		location = `${location.origin}${location.pathname}?${args.join('&')}`;
		return;
	}
	localStorage.removeItem('Doc_CT_IgnoreRecursive');
	if (localStorage.getItem('Doc_VT_InfiniteScroll')) {
		location = document.querySelectorAll('.alert-success a')[1].href.split('&').map(x => {
			if (x.startsWith('minimum=')) {
				return 'minimum=0';
			}
			return x;
		}).join('&');
		return;
	}
	location = document.querySelector('.alert-success a')[1].href;
}

function Buttons(tagA, tagB, value, quantity) {
	tagB.remove();
	tagA.style.borderRadius = '6px';
	tagA.type = 'submit';
	tagA.name = 'submit';
	tagA.value = value;
	tagA.dataset.target = '';
	const ticks = parseInt(localStorage.getItem('Doc_CT_LastClicked'));
	if (ticks) {
		const time = 5000 + ticks - new Date().getTime();
		if (time > 0) {
			setTimeout(() => { tagA.disabled = false; }, time);
			tagA.disabled = true;
			localStorage.removeItem('Doc_CT_LastClicked');
		}
	}
	tagA.onclick = () => {
		if (Math.min(quantity, 1000000) !== parseInt(document.querySelector('#amount').value)) {
			localStorage.setItem('Doc_CT_IgnoreRecursive', true);
			localStorage.removeItem('Doc_CT_AcceptedPrice');
		}
	};
}

function FillOutForm() {
	document.querySelector('#calc_resource_after_sell').scrollIntoView({
		behavior: 'smooth',
		block: 'center'
	});
	localStorage.removeItem('Doc_CT_IgnoreRecursive');
	let quantity;
	location.search.slice(1).split('&').forEach(x => {
		x = x.split('=');
		if (x[0] === 'p') {
			localStorage.setItem('Doc_CT_AcceptedPrice', x[1]);
			const inputTag = document.querySelector('#priceper');
			inputTag.value = x[1];
			inputTag.onchange = () => {
				localStorage.setItem('Doc_CT_AcceptedPrice', inputTag.value);
			};
		}
		else if (x[0] === 'q') {
			quantity = parseInt(x[1]);
			document.querySelector('#amount').value = Math.min(quantity, 1000000);
		}
		else if (x[0] === 't') {
			const sellTag = document.querySelector('.nationtable button');
			const buyTag = sellTag.nextElementSibling;
			if (x[1] === 's') {
				Buttons(sellTag, buyTag, 'Sell', quantity);
			}
			else {
				Buttons(buyTag, sellTag, 'Buy', quantity);
			}
		}
	});
}

// Does anyone actually use this?
async function FormatTopOffers() {
	while (!document.querySelector('#topOffersSection').childElementCount) {
		await new Promise(resolve => setTimeout(() => resolve(true), 50));
	}
	let countA = 0;
	document.querySelectorAll('#topOffersSection .nationtable').forEach(tableTag => {
		const trTags = [...tableTag.querySelectorAll('tr')];
		[...trTags.shift().children].forEach(thTag => {
			thTag.style.background = countA ? '#2d6a9f' : '#3e8e3e';
		});
		let countB = 0;
		trTags.forEach(trTag => {
			let countC = 0;
			[...trTag.children].forEach(tdTag => {
				if (countB % 2) {
					tdTag.style.background = countA ? '#9cc2e3' : '#a6d8a6';
				}
				if (countC) {
					tdTag.style.textAlign = 'right';
				}
				else {
					tdTag.style.textAlign = 'center';
					tdTag.textContent = (() => {
						let date = new Date(tdTag.textContent);
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
						text += ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()] + '/';
						text += date.getFullYear();
						return text;
					})();
				}
				++countC;
			});
			++countB;
		});
		++countA;
	});
}

function Main() {
	// Migration for Older Versions
	if (localStorage.getItem('Doc_IgnoreRecursive') === 'false') {
		localStorage.removeItem('Doc_IgnoreRecursive');
	}
	Migrate('Doc_IgnoreRecursive', 'Doc_CT_IgnoreRecursive');
	Migrate('Doc_LastPrice', 'Doc_CT_AcceptedPrice');
	if (localStorage.getItem('Doc_Recursive')) {
		localStorage.removeItem('Doc_Recursive');
	}

	if (document.querySelector('.alert-success')) {
		TradeWasMade();
	}
	else {
		FillOutForm();
		document.querySelector('#showTopOffersBtn').onclick = FormatTopOffers;
	}
}

Main();