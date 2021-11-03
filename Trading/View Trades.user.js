// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      3.4
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @match        https://politicsandwar.com/nation/trade/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Global Variables
-------------------------*/
const sellColor = '#5cb85c';
const buyColor = '#337ab7';

// Gets User's current Resources.
const resources = (() => {
	const resources = ReplaceAll(document.getElementById('rssBar').children[0].children[0].children[0].innerText.trim().replaceAll('\n', ''), '  ', ' ')
		.replaceAll(',', '')
		.split(' ');
	return {
		money: parseFloat(resources[13]) - (localStorage.getItem('Doc_MinResource_Money') == null ? 0 : localStorage.getItem('Doc_MinResource_Money')),
		oil: parseFloat(resources[2]) - (localStorage.getItem('Doc_MinResource_Oil') == null ? 0 : localStorage.getItem('Doc_MinResource_Oil')),
		coal: parseFloat(resources[1]) - (localStorage.getItem('Doc_MinResource_Coal') == null ? 0 : localStorage.getItem('Doc_MinResource_Coal')),
		iron: parseFloat(resources[5]) - (localStorage.getItem('Doc_MinResource_Iron') == null ? 0 : localStorage.getItem('Doc_MinResource_Iron')),
		bauxite: parseFloat(resources[6]) - (localStorage.getItem('Doc_MinResource_Bauxite') == null ? 0 : localStorage.getItem('Doc_MinResource_Bauxite')),
		lead: parseFloat(resources[4]) - (localStorage.getItem('Doc_MinResource_Lead') == null ? 0 : localStorage.getItem('Doc_MinResource_Lead')),
		uranium: parseFloat(resources[3]) - (localStorage.getItem('Doc_MinResource_Uranium') == null ? 0 : localStorage.getItem('Doc_MinResource_Uranium')),
		food: parseFloat(resources[11]) - (localStorage.getItem('Doc_MinResource_Food') == null ? 0 : localStorage.getItem('Doc_MinResource_Food')),
		gasoline: parseFloat(resources[7]) - (localStorage.getItem('Doc_MinResource_Gasoline') == null ? 0 : localStorage.getItem('Doc_MinResource_Gasoline')),
		steel: parseFloat(resources[9]) - (localStorage.getItem('Doc_MinResource_Steel') == null ? 0 : localStorage.getItem('Doc_MinResource_Steel')),
		aluminum: parseFloat(resources[10]) - (localStorage.getItem('Doc_MinResource_Aluminum') == null ? 0 : localStorage.getItem('Doc_MinResource_Aluminum')),
		munitions: parseFloat(resources[8]) - (localStorage.getItem('Doc_MinResource_Munitions') == null ? 0 : localStorage.getItem('Doc_MinResource_Munitions')),
		credits: parseFloat(resources[0]) - (localStorage.getItem('Doc_MinResource_Credits') == null ? 0 : localStorage.getItem('Doc_MinResource_Credits'))
	};
})();

let myBuyOffers = {};
let mySellOffers = {};


/* User Configuration Settings
-------------------------*/
document.getElementById('leftcolumn').appendChild((() => {
	const codeTag = document.createElement('code');
	codeTag.innerHTML = `Load All Offers: <input id="loadOffers" type="checkbox" ${localStorage.Doc_LoadAllOffers == 'true' ? 'checked' : ''}>`;
	return codeTag;
})());
document.getElementById('loadOffers').onchange = () => {
	const inputTag = document.getElementById('loadOffers');
	if (inputTag.checked) {
		localStorage.Doc_LoadAllOffers = true;
	}
	else {
		localStorage.Doc_LoadAllOffers = false;
	}
	location.reload();
};

document.getElementById('leftcolumn').appendChild((() => {
	const codeTag = document.createElement('code');
	codeTag.innerHTML = `<button id="minResource">Min ${(() => {
		let args = location.search.slice(1).split('&');
		while (args.length) {
			const arg = args.shift().split('=');
			if (arg[0] == 'resource1') {
				if (arg[1].length) {
					return arg[1][0].toUpperCase() + arg[1].slice(1);
				}
				break;
			}
		}
		return 'Money';
	})()}</button>`;
	return codeTag;
})());
document.getElementById('minResource').onclick = () => {
	const resource = document.getElementById('minResource').textContent.split(' ')[1];
	const key = `Doc_MinResource_${resource}`;
	const currentMin = localStorage.getItem(key);
	const minAmount = (Math.round(parseFloat(prompt(`Min Resource for ${resource}:`, currentMin == null ? 0 : currentMin)) * 100) / 100).toString();
	if (minAmount != 'NaN') {
		if (minAmount != currentMin) {
			if (minAmount > 0) {
				localStorage.setItem(key, minAmount);
				location.reload();
			}
			else if (currentMin != null) {
				localStorage.removeItem(key);
				location.reload();
			}
		}
	}
};

/* Modify Page
-------------------------*/
(() => {
	// Modify existing Rows in the table.
	let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
	while (trTags.length) {
		const trTag = trTags.shift();
		try {
			ModifyRow(Array.from(trTag.children));
		}
		catch (e) {
			console.log(trTag);
			console.log(e);
		}
	}

	// Handle Re-sell/buy of resources for a profit.
	const pTag = (() => {
		const imgTag = Array.from(document.getElementsByTagName('img')).filter(x => x.alt == 'Success').shift();
		if (imgTag) {
			return imgTag.parentElement
		}
		return imgTag;
	})();
	if (pTag) {
		pTag.style.textAlign = 'center';
		const text = pTag.textContent.trim().replaceAll('  ', ' ').split(' ');
		if (text[2] == 'accepted') {
			const quantity = parseInt(text[8].replaceAll(',', ''));
			const price = parseInt(text[14].slice(1, -1).replaceAll(',', '')) / quantity;
			const bought = text[7] == 'bought';
			const key = `Doc_ReturnToSender_${text[9][0].toUpperCase() + text[9].slice(1, -1)}`;
			let data = JSON.parse(localStorage.getItem(key));
			let profit = 0;
			if (data) {
				console.log(1);
				if (data.bought != bought) {
					console.log(2);
					if ((!bought && price > data.price) || (bought && price < data.price)) {
						console.log(3);
						profit = Math.min(data.quantity, quantity) * Math.abs(data.price - price);
						data.profit += profit;
						data.quantity -= quantity;
						if (data.quantity > 0) {
							console.log(4);
							localStorage.setItem(key, JSON.stringify(data));
						}
						else {
							console.log(5);
							profit = data.profit;
							localStorage.removeItem(key);
						}
					}
				}
			}
			pTag.innerHTML += ` $${price.toLocaleString()}/ton.<div><a id="ReturnToSender">Re${bought ? 'sell' : 'buy'} this for a profit?</a>${profit > 0 ? ` | ${localStorage.getItem(key) ? '' : 'In Total '}Made $${profit.toLocaleString()} Profit.` : ''}</div>`;
			document.getElementById('ReturnToSender').onclick = () => {
				localStorage.setItem(key, JSON.stringify({
					'bought': bought,
					'quantity': quantity,
					'price': price,
					'profit': 0
				}));
				if ((() => {
					let args = location.search.slice(1).split('&');
					while (args.length) {
						const arg = args.shift().split('=');
						if (arg[0] == 'resource1') {
							if (arg[1].length) {
								return true;
							}
							break;
						}
					}
					return false;
				})()) {
					UpdateQuantities(quantity, price, bought);
				}
				const divTag = document.getElementById('ReturnToSender').parentElement;
				if (profit > 0) {
					divTag.innerHTML = `Made $${profit.toLocaleString()} Profit.`;
				}
				else {
					divTag.remove();
				}
			};
		}
	}

	// Add Market Links at hte top of the page.
	const formTag = Array.from(document.getElementById('rightcolumn').children).filter(tag => tag.tagName == 'FORM')[0];
	formTag.parentElement.insertBefore((() => {
		const pTagSub = document.createElement('p');
		pTagSub.style.textAlign = 'center';
		pTagSub.innerHTML = '<a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=oil&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/oil.png"> Oil</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=coal&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/coal.png"> Coal</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=iron&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/iron.png"> Iron</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=bauxite&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/bauxite.png"> Bauxite</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=lead&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/lead.png"> Lead</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=uranium&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/uranium.png"> Uranium</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/icons/16/steak_meat.png"> Food</a>'
			+ '<br><a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=gasoline&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/gasoline.png"> Gasoline</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=steel&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/steel.png"> Steel</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=aluminum&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/aluminum.png"> Aluminum</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=munitions&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/munitions.png"> Munitions</a>'
			+ ' | <a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=credits&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/icons/16/point_gold.png"> Credits</a>'
			+ '<br><a href="https://politicsandwar.com/index.php?id=26&display=nation&resource1=&buysell=&ob=date&od=DESC&maximum=100&minimum=0&search=Go">Personal Trades</a>';
		const resource = (() => {
			let args = location.search.slice(1).split('&');
			while (args.length) {
				const arg = args.shift().split('=');
				if (arg[0] == 'resource1') {
					if (arg[1].length) {
						return arg[1][0].toUpperCase() + arg[1].slice(1);
					}
					break;
				}
			}
			return null;
		})();
		if (resource) {
			const key = `Doc_ReturnToSender_${resource}`;
			if (localStorage.getItem(key)) {
				const data = JSON.parse(localStorage.getItem(key));
				pTagSub.innerHTML += `<div id="Forgotten">Still have ${data.quantity} ${resource} to ${data.bought ? 'sell' : 'buy'} at no ${data.bought ? 'less' : 'more'} than $${(data.price + (data.bought ? 1 : -1)).toLocaleString()}/ton | <a>Forget about it!</a>${data.profit > 0 ? ` | In Total Made $${data.profit.toLocaleString()} Profit.` : ''}</div>`;
				pTagSub.children[pTagSub.childElementCount - 1].onclick = () => {
					localStorage.removeItem(key);
					const divTag = document.getElementById('Forgotten');
					divTag.innerText = 'Forgotten... | Refreshing in 3s';
					setTimeout(() => {
						divTag.innerText = 'Forgotten... | Refreshing in 2s';
					}, 1000);
					setTimeout(() => {
						divTag.innerText = 'Forgotten... | Refreshing in 1s';
					}, 2000);
					setTimeout(() => {
						location.reload();
					}, 3000);
				};
			}
		}
		return pTagSub;
	})(), formTag);
	formTag.parentElement.insertBefore(document.createElement('hr'), formTag);
})();

(async () => {
	// If page is not displaying User's trade history AND User has Load All Offers set to TRUE then...
	if ((() => {
		if (location.pathname.startsWith('/nation/trade/')) {
			return false;
		}
		let args = location.search.slice(1).split('&');
		while (args.length) {
			const arg = args.shift().split('=');
			if (arg[0] == 'display') {
				if (arg[1] == 'alliance' || arg[1] == 'world') {
					return true;
				}
				return false;
			}
		}
		return false;
	})() && localStorage.Doc_LoadAllOffers == 'true') {
		// Get max offers that can be displayed on the page.
		const maxOffers = (() => {
			let args = location.search.slice(1).split('&');
			while (args.length) {
				const arg = args.shift().split('=');
				if (arg[0] == 'maximum') {
					return parseInt(arg[1]);
				}
			}
			return 50;
		})();

		// Get number of pages that need to be loaded.
		const pagesToLoad = (() => {
			// Get total offers that exist with the this type of search.
			// And while it's at it, make some edits to the filter options, located at the top of the page, and previous/next page buttons, located at the bottom.
			const totalOffers = (() => {
				const pTags = Array.from(document.getElementsByClassName('center')).filter(tag => tag.tagName == 'P');

				// Move Go button to the above row on page.
				pTags[2].appendChild(pTags[3].children[4]);

				// Get the relevant text at the bottom of the page saying number of offers in existence.
				const text = pTags[4].textContent.split(' ')
				text.splice(1, 2);
				pTags[4].innerText = text.join(' ');

				// Remove previous/next page buttons located at the bottom of the page.
				pTags[5].parentElement.removeChild(pTags[5]);

				// If User had page set to display less than 50 offers, insert note to tell them DO BETTER!
				if (maxOffers < 50) {
					pTags[3].innerHTML = `Note: The game just tried to only load ${maxOffers} trade offers.`
						+ '<br>We strongly recommend going to your <a target="_blank" href="https://politicsandwar.com/account/#4">Account</a> settings and changing the default search results to 50,'
						+ '<br>or if this was a link provided by some bot, that you ask the maximum query in the link be set to at least 50, preferably 100.';
				}
				// Else remove second row of filter options, located at the top of the page.
				else {
					pTags[3].parentElement.removeChild(pTags[3]);
				}

				return parseInt(text[1]);
			})();

			if (totalOffers > maxOffers) {
				return Math.ceil((totalOffers - maxOffers) / 100);
			}
			return 0;
		})();

		// Get tbody Tag for the table of offers.
		const tbodyTag = document.getElementsByClassName('nationtable')[0].children[0];
		for (let i = 0; i < pagesToLoad; ++i) {
			// Get URL for page.
			const url = (() => {
				let args = location.search.slice(1).split('&');

				// Find min and max values in URL.
				let minFound = false;
				let maxFound = false;
				for (let j = 0; j < args.length; ++j) {
					let arg = args[j].split('=');
					// Update min if found.
					if (arg[0] == 'minimum') {
						minFound = true;
						arg[1] = 100 * i + maxOffers;
						args[j] = arg.join('=');
					}
					// Update max if found and isn't already set to 100.
					else if (arg[0] == 'maximum') {
						maxFound = true;
						if (arg[1] != '100') {
							arg[1] = '100';
							args[j] = arg.join('=');
						}
					}
				}

				// If min not found in URL.
				if (!minFound) {
					args.push(`minimum=${100 * i + maxOffers}`);
				}
				// If max not found in URL.
				if (!maxFound) {
					args.push(`maximum=100`);
				}

				return location.origin + location.pathname + '?' + args.join('&');
			})();

			// Load Page.
			const doc = new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
			let trTags = Array.from(doc.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
			while (trTags.length) {
				const trTag = trTags.shift();
				try {
					ModifyRow(Array.from(trTag.children));
				}
				catch (e) {
					console.log(trTag);
					console.log(e);
				}
				tbodyTag.appendChild(trTag);
			}
		}
	}

	// Add links to all the buttons that were added.
	for (const resource in myBuyOffers) {
		UpdateLinks(resource, true);
	}
	for (const resource in mySellOffers) {
		UpdateLinks(resource, false);
	}

	const resource = (() => {
		let args = location.search.slice(1).split('&');
		while (args.length) {
			const arg = args.shift().split('=');
			if (arg[0] == 'resource1') {
				if (arg[1].length) {
					return arg[1][0].toUpperCase() + arg[1].slice(1);
				}
				break;
			}
		}
		return null;
	})();
	if (resource) {
		const data = JSON.parse(localStorage.getItem(`Doc_ReturnToSender_${resource}`));
		if (data) {
			UpdateQuantities(data.quantity, data.price, data.bought);
		}
	}
})();

/* Functions
-------------------------*/
function UpdateLinks(resource, isSellOffer) {
	let topUpTags = Array.from(document.getElementsByClassName(`Doc_TopUp_${isSellOffer ? 'S' : 'B'}_${resource}`))
	while (topUpTags.length) {
		const topUpTag = topUpTags.shift();
		const link = CreateLink(resource, parseInt(topUpTag.parentElement.textContent.split(' ')[1].replaceAll(',', '')), isSellOffer, isSellOffer ? 0 : mySellOffers[resource], isSellOffer ? myBuyOffers[resource] : 0);
		if (typeof link == 'string') {
			topUpTag.href = link;
		}
		else {
			topUpTag.remove();
		}
	}
	let outbidMatchTags = Array.from(document.getElementsByClassName(`Doc_OutbidMatch_${isSellOffer ? 'S' : 'B'}_${resource}`));
	while (outbidMatchTags.length) {
		const outbidMatchTag = outbidMatchTags.shift();
		FillOutbidMatch(outbidMatchTag, resource, parseInt(outbidMatchTag.parentElement.textContent.split(' ')[1].replaceAll(',', '')), isSellOffer, isSellOffer ? 0 : mySellOffers[resource], isSellOffer ? myBuyOffers[resource] : 0)
	}
}

function ModifyRow(tdTags) {
	const resource = tdTags[4].children[0].getAttribute('title').toLowerCase();
	const quantity = parseInt(tdTags[4].innerText.trim().replaceAll(',', ''));
	const price = parseInt(tdTags[5].innerText.trim().split(' ')[0].replaceAll(',', ''));
	const isSellOffer = tdTags[1].childElementCount == 1;

	if (myBuyOffers[resource] == undefined) {
		myBuyOffers[resource] = 0;
	}
	if (mySellOffers[resource] == undefined) {
		mySellOffers[resource] = 0;
	}

	// Is this somebody else's offer that you can accept?
	if (tdTags[6].children[0].tagName == 'FORM') {
		localStorage.getItem('Doc_')

		// Is offer looking to buy resources from you?
		if (isSellOffer) {
			// Set button color.
			tdTags[6].children[0].children[5].style.backgroundColor = sellColor;

			// Update quantity if offer wants to buy more than you're able to sell.
			const sellableQuantity = Math.floor(resources[resource]);
			if (quantity > sellableQuantity) {
				tdTags[6].children[0].children[3].value = Math.max(sellableQuantity, 0);
			}
		}
		// No? Offer is looking to sell resources to you.
		else {
			// Set button color.
			tdTags[6].children[0].children[5].style.backgroundColor = buyColor;

			// Update quantity if offer wants to sell more than you're able to buy.
			if (quantity * price > resources.money) {
				tdTags[6].children[0].children[3].value = Math.floor(resources.money / price);
			}
		}
		// Update total price since quantity might have been updated.
		tdTags[5].children[2].innerText = '$' + (parseInt(tdTags[6].children[0].children[3].value) * price).toLocaleString();
		AddOutbidMatchButtons(tdTags[5], resource, price, isSellOffer);

	}
	// No? Is this your offer?
	else if (tdTags[6].children[0].tagName == 'A') {
		// Add TopUp Button.
		const aTag = document.createElement('a');
		aTag.innerText = 'TopUp';

		// If User has Load All Offers set to TRUE add required className for link to be added later.
		if (localStorage.Doc_LoadAllOffers == 'true') {
			if (isSellOffer) {
				aTag.className = `Doc_TopUp_S_${resource}`;
				myBuyOffers[resource] += price * quantity;
			}
			else {
				aTag.className = `Doc_TopUp_B_${resource}`;
				mySellOffers[resource] += quantity;
			}
			tdTags[5].appendChild(document.createElement('br'));
			tdTags[5].appendChild(aTag);
		}
		// Else add link now.
		else {
			const link = CreateLink(resource, price, isSellOffer, quantity);
			if (typeof link == 'string') {
				aTag.href = link;
				tdTags[5].appendChild(document.createElement('br'));
				tdTags[5].appendChild(aTag);
			}
		}
	}
	// No? This is a trade offer by somebody who has embargoed you or one of your accepted trade offers.
	else if (tdTags[6].children[0].tagName == 'IMG') {
		const isBuyOffer = tdTags[2].childElementCount == 1;
		if (!(isSellOffer || isBuyOffer)) {
			return;
		}
		AddOutbidMatchButtons(tdTags[5], resource, price, isSellOffer);
	}
}

function UpdateQuantities(quantity, price, isSelling) {
	let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
	while (trTags.length) {
		const tdTags = Array.from(trTags.shift().children);
		if (tdTags[6].children[0].tagName == 'FORM') {
			const offerPrice = parseInt(tdTags[5].innerText.trim().split(' ')[0].replaceAll(',', ''));
			if (isSelling == (tdTags[1].childElementCount == 1)) {
				if ((isSelling && offerPrice > price) || (!isSelling && offerPrice < price)) {
					tdTags[6].children[0].children[3].value = Math.min(parseInt(tdTags[6].children[0].children[3].value), quantity);
				}
				else {
					tdTags[6].children[0].children[3].value = 0;
				}
			}
		}
	}
}

// Add area for Outbid and Match buttons to go.
function AddOutbidMatchButtons(tdTag, resource, price, isSellOffer) {
	tdTag.appendChild(document.createElement('br'));
	tdTag.appendChild((() => {
		const divTag = document.createElement('div');
		if (localStorage.Doc_LoadAllOffers == 'true') {
			divTag.className = `Doc_OutbidMatch_${isSellOffer ? 'S' : 'B'}_${resource}`;
		}
		else {
			FillOutbidMatch(divTag, resource, price, isSellOffer);
		}
		return divTag;
	})());
}

// Add Outbid and Match buttons to provided div.
function FillOutbidMatch(divTag, resource, price, isSellOffer, subQuantity = 0, subMoney = 0) {
	const outbidLink = CreateLink(resource, price + (isSellOffer ? 1 : -1), isSellOffer, subQuantity, subMoney);
	const matchLink = CreateLink(resource, price, isSellOffer, subQuantity, subMoney);
	if (typeof outbidLink == 'string') {
		const aTag = document.createElement('a');
		aTag.innerText = 'Outbid';
		aTag.href = outbidLink;
		divTag.appendChild(aTag);
	}
	if (typeof outbidLink == 'string' && typeof matchLink == 'string') {
		divTag.append(' | ');
	}
	if (typeof matchLink == 'string') {
		const aTag = document.createElement('a');
		aTag.innerText = 'Match';
		aTag.href = matchLink;
		divTag.appendChild(aTag);
	}
}

// Create link for Create Offer page.
function CreateLink(resource, price, isSellOffer, subQuantity = 0, subMoney = 0) {
	const quantity = (() => {
		if (isSellOffer) {
			return Math.floor((resources.money - subMoney) / price);
		}
		return Math.max(Math.floor(resources[resource]) - subQuantity, 0);
	})();
	if (quantity > 0) {
		return `https://politicsandwar.com/nation/trade/create/?resource=${resource}&p=${price}&q=${quantity}&t=${isSellOffer ? 'b' : 's'}`;
	}
	return undefined;
}

// Replace all instances of a string in some text with something else.
function ReplaceAll(text, search, replace) {
	if (search == replace || replace.search(search) != -1) {
		throw 'Infinite Loop!';
	}
	while (text.indexOf(search) != -1) {
		text = text.replaceAll(search, replace);
	}
	return text;
}