// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      3.2
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
		money: parseFloat(resources[13]),
		oil: parseFloat(resources[2]),
		coal: parseFloat(resources[1]),
		iron: parseFloat(resources[5]),
		bauxite: parseFloat(resources[6]),
		lead: parseFloat(resources[4]),
		uranium: parseFloat(resources[3]),
		food: parseFloat(resources[11]),
		gasoline: parseFloat(resources[7]),
		steel: parseFloat(resources[9]),
		aluminum: parseFloat(resources[10]),
		munitions: parseFloat(resources[8]),
		credits: parseFloat(resources[0])
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

	// Add Market Links at hte top of the page.
	const formTag = Array.from(document.getElementById('rightcolumn').children).filter(tag => tag.tagName == 'FORM')[0];
	formTag.parentElement.insertBefore((() => {
		const pTag = document.createElement('p');
		pTag.style.textAlign = 'center';
		pTag.innerHTML = '<a href="https://politicsandwar.com/index.php?id=90&display=world&resource1=oil&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go"><img src="https://politicsandwar.com/img/resources/oil.png"> Oil</a>'
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
		return pTag;
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
		// Is offer looking to buy resources from you?
		if (isSellOffer) {
			// Set button color.
			tdTags[6].children[0].children[5].style.backgroundColor = sellColor;

			// Get the max amount we're able to sell.
			const sellableQuantity = SellableQuantity(resource);

			// Update quantity if offer wants to buy more than you're able to sell.
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

// Calculate the amount that is sellable for the user.
function SellableQuantity(resource) {
	if (resource == 'food') {
		return Math.max(Math.floor(resources[resource]) - 5000, 0);
	}
	return Math.floor(resources[resource]);
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
		return Math.max(SellableQuantity(resource) - subQuantity, 0);
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