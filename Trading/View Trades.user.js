// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      3.8
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @match        https://politicsandwar.com/nation/trade/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Migration
-------------------------*/
(() => {
	const mig1 = localStorage.getItem('Doc_LoadAllOffers');
	if (mig1) {
		if (mig1 == 'true') {
			localStorage.setItem('Doc_VT_InfiniteScroll', true);
		}
		localStorage.removeItem('Doc_LoadAllOffers');
	}
	for (let i = 0; i < localStorage.length; ++i) {
		const key = localStorage.key(i);
		if (key.startsWith('Doc_ReturnToSender')) {
			const data = localStorage.getItem(key);
			localStorage.setItem(`Doc_VT_ReGain_${key.split('_')[2]}`, JSON.stringify({
				'bought': data.bought,
				'levels': [
					{
						'quantity': data.quantity,
						'price': data.price
					}
				]
			}));
			localStorage.removeItem(key);
		}
	}
})();

/* Global Variables
-------------------------*/
const sellColor = '#5cb85c';
const buyColor = '#337ab7';

const resources = (() => {
	const resources = ReplaceAll(document.getElementById('rssBar').children[0].children[0].children[0].textContent.trim().replaceAll('\n', ''), '  ', ' ').replaceAll(',', '').split(' ');
	return {
		Money: parseFloat(resources[13]) - MinAmount('Money'),
		Oil: parseFloat(resources[2]) - MinAmount('Oil'),
		Coal: parseFloat(resources[1]) - MinAmount('Coal'),
		Iron: parseFloat(resources[5]) - MinAmount('Iron'),
		Bauxite: parseFloat(resources[6]) - MinAmount('Bauxite'),
		Lead: parseFloat(resources[4]) - MinAmount('Lead'),
		Uranium: parseFloat(resources[3]) - MinAmount('Uranium'),
		Food: parseFloat(resources[11]) - MinAmount('Food'),
		Gasoline: parseFloat(resources[7]) - MinAmount('Gasoline'),
		Steel: parseFloat(resources[9]) - MinAmount('Steel'),
		Aluminum: parseFloat(resources[10]) - MinAmount('Aluminum'),
		Munitions: parseFloat(resources[8]) - MinAmount('Munitions'),
		Credits: parseFloat(resources[0]) - MinAmount('Credits')
	};
})();

const currentResource = (() => {
	let args = location.search.slice(1).split('&');
	while (args.length) {
		const arg = args.shift().split('=');
		if (arg[0] == 'resource1') {
			if (arg[1].length) {
				return arg[1][0].toUpperCase() + arg[1].slice(1).toLowerCase();
			}
			break;
		}
	}
	return 'Money';
})();

const marketType = MarketType();

let myOffers = {
	'Money': 0
};

/* User Configuration Settings
-------------------------*/
(() => {
	const leftColumn = document.getElementById('leftcolumn');

	// Toggle Infinite Scroll
	leftColumn.appendChild((() => {
		const codeTag = document.createElement('code');
		codeTag.innerText = 'Infinite Scroll: ';
		codeTag.appendChild((() => {
			const inputTag = document.createElement('input');
			inputTag.type = 'checkbox';
			if (localStorage.getItem('Doc_VT_InfiniteScroll')) {
				inputTag.checked = true;
			}
			inputTag.onchange = () => {
				if (inputTag.checked) {
					localStorage.setItem('Doc_VT_InfiniteScroll', true);
				}
				else {
					localStorage.removeItem('Doc_VT_InfiniteScroll');
				}
				location.reload();
			};
			return inputTag;
		})());
		return codeTag;
	})());

	// Set Min Amount
	leftColumn.appendChild((() => {
		const codeTag = document.createElement('code');
		codeTag.appendChild((() => {
			const buttonTag = document.createElement('button');
			buttonTag.innerText = `Min ${currentResource}`;
			buttonTag.onclick = () => {
				const currentMin = MinAmount(currentResource);
				const newMin = (Math.round(parseFloat(prompt(`Set the minimum amount of ${currentResource} that you would not like to sell:`, currentMin)) * 100) / 100).toString();
				if (newMin != 'NaN' && newMin != currentMin) {
					const key = `Doc_MinResource_${currentResource}`;
					if (newMin > 0) {
						localStorage.setItem(key, newMin);
						location.reload();
					}
					else if (currentMin > 0) {
						localStorage.removeItem(key);
						location.reload();
					}
				}
			};
			return buttonTag;
		})());
		return codeTag;
	})());
})();

/* Functions
-------------------------*/
function ReplaceAll(text, search, replace) {
	if (search == replace || replace.search(search) != -1) {
		throw 'Infinite Loop!';
	}
	while (text.indexOf(search) != -1) {
		text = text.replaceAll(search, replace);
	}
	return text;
}

function MinAmount(resource) {
	const amount = localStorage.getItem(`Doc_MinResource_${resource}`);
	if (amount) {
		return amount;
	}
	return 0;
}

function UpdateQuantities() {
	if (currentResource != 'Money') {
		const json = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
		if (json) {
			let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
			while (trTags.length) {
				const tdTags = Array.from(trTags.shift().children);
				if (tdTags[5].children[0].tagName == 'FORM') {
					if (json.bought == (tdTags[0].childElementCount == 1)) {
						const offerPrice = parseInt(tdTags[4].innerText.trim().split(' ')[0].replaceAll(',', ''));
						let quantity = 0;
						for (let i = 0; i < json.levels.length; ++i) {
							if ((json.bought && offerPrice > json.levels[i].price) || (!json.bought && offerPrice < json.levels[i].price)) {
								quantity += json.levels[i].quantity;
							}
						}
						const inputTag = tdTags[5].children[0].children[3];
						inputTag.value = Math.min(parseInt(inputTag.value), quantity);
					}
				}
			}
		}
	}
}

// NegOne = None
// Zero = Personal
// One = Alliance
// Two = World
function MarketType() {
	if (location.pathname.startsWith('/nation/trade/')) {
		if (location.pathname.endsWith('world')) {
			return 2;
		}
		if (location.pathname.endsWith('alliance')) {
			return 1;
		}
		if (location.pathname == '/nation/trade/') {
			return 0;
		}
		return -1;
	}
	let args = location.search.slice(1).split('&');
	while (args.length) {
		const arg = args.shift().split('=');
		if (arg[0] == 'display') {
			if (arg[1] == 'world') {
				return 2;
			}
			if (arg[1] == 'alliance') {
				return 1;
			}
			return 0;
		}
	}
	return 0;
}

function GetURL(min) {
	let args = location.search.slice(1).split('&');
	let minFound = false;
	let maxFound = false;
	for (let j = 0; j < args.length; ++j) {
		let arg = args[j].split('=');
		if (arg[0] == 'minimum') {
			minFound = true;
			arg[1] = min;
			args[j] = arg.join('=');
			if (maxFound) {
				break;
			}
		}
		else if (arg[0] == 'maximum') {
			maxFound = true;
			if (arg[1] != 100) {
				arg[1] = 100;
				args[j] = arg.join('=');
			}
			if (minFound) {
				break;
			}
		}
	}

	if (!minFound) {
		args.push(`minimum=${min}`);
	}
	if (!maxFound) {
		args.push('maximum=100');
	}

	return location.origin + location.pathname + '?' + args.join('&');
}

async function InfiniteScroll() {
	if (marketType > 0 && localStorage.getItem('Doc_VT_InfiniteScroll')) {
		const pTags = Array.from(document.getElementsByClassName('center')).filter(x => x.tagName == 'P');
		const alreadyLoaded = (() => {
			const nums = pTags[4].textContent.split(' ')[1].split('-');
			if (nums[0] != 0) {
				// TODO: Cause Hell to fall down on such a moronic user!
				location.href = GetURL(0);
			};
			return parseInt(nums[1]);
		})();
		const pagesToLoad = (() => {
			const text = pTags[4].textContent.split(' ');
			text.splice(1, 2);
			pTags[4].innerText = text.join(' ');
			return Math.ceil((parseInt(text[1]) - alreadyLoaded) / 100);
		})();
		pTags[2].appendChild(pTags[3].children[4]);
		pTags[5].parentElement.removeChild(pTags[5]);
		if (alreadyLoaded < 50) {
			pTags[3].innerText = `Note: The game by default only loaded ${alreadyLoaded} trade offers.`;
			pTags[3].appendChild(document.createElement('br'));
			pTags[3].append('We strongly recommend going to your ');
			pTags[3].appendChild((() => {
				const aTag = document.createElement('a');
				aTag.target = '_blank';
				aTag.href = 'https://politicsandwar.com/account/#4';
				aTag.innerText = 'Account';
				return aTag;
			})());
			pTags[3].append(' settings and changing the default search results to 50,');
			pTags[3].appendChild(document.createElement('br'));
			pTags[3].append('or if this was a link provided by some bot, that you ask the maximum query in the link to be set to at least 50, preferably 100.');
		}
		else {
			pTags[3].parentElement.removeChild(pTags[3]);
		}

		if (pagesToLoad) {
			const tbodyTag = document.getElementsByClassName('nationtable')[0].children[0];
			for (let i = 0; i < pagesToLoad; ++i) {
				const url = GetURL(100 * i + alreadyLoaded);
				const doc = new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
				let trTags = Array.from(doc.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
				while (trTags.length) {
					const trTag = trTags.shift();
					try {
						ModifyRow(Array.from(trTag.children));
					}
					catch (e) {
						console.error(trTag);
						console.error(e);
					}
					tbodyTag.appendChild(trTag);
				}
			}
		}
	}
}

function ModifyRow(tdTags) {
	tdTags[0].remove();
	const resource = tdTags[4].children[0].getAttribute('title');
	const quantity = parseInt(tdTags[4].textContent.trim().replaceAll(',', ''));
	const price = parseInt(tdTags[5].textContent.trim().split(' ')[0].replaceAll(',', ''));
	const isSellOffer = tdTags[1].childElementCount == 1;

	if (myOffers[resource] == undefined) {
		myOffers[resource] = 0;
	}

	// Is this somebody else's offer that you can accept?
	if (tdTags[6].children[0].tagName == 'FORM') {
		tdTags[6].children[0].children[5].style.backgroundColor = isSellOffer ? sellColor : buyColor;
		if (isSellOffer) {
			if (quantity > resources[resource]) {
				tdTags[6].children[0].children[3].value = Math.max(Math.floor(resources[resource]), 0);
			}
		}
		else {
			if (quantity * price > resources.Money) {
				tdTags[6].children[0].children[3].value = Math.max(Math.floor(resources.Money / price), 0);
			}
		}
		tdTags[5].children[2].innerText = `$${(parseInt(tdTags[6].children[0].children[3].value) * price).toLocaleString()}`;
		AddOutbidMatchButtons(tdTags[5], resource, price, isSellOffer);
	}
	// Is this your offer?
	else if (tdTags[6].children[0].tagName == 'A') {
		AddTopUpButton(tdTags[5], resource, quantity, price, isSellOffer);
	}
	// This is a an offer that you cannot accept due to an embargo or is one of your accepted offers.
	else {
		const isBuyOffer = tdTags[2].childElementCount == 1;
		if (isSellOffer + isBuyOffer) {
			AddOutbidMatchButtons(tdTags[5], resource, price, isSellOffer);
		}
	}
}

function AddOutbidMatchButtons(cell, resource, price, isSellOffer) {
	cell.appendChild(document.createElement('br'));
	cell.appendChild((() => {
		const aTag = document.createElement('a');
		aTag.innerText = 'Outbid';
		if (localStorage.getItem('Doc_VT_InfiniteScroll')) {
			aTag.className = `Doc_Outbid_${isSellOffer ? 'S' : 'B'}_${resource}`;
		}
		else {
			const outbidLink = CreateOfferLink(resource, price + (isSellOffer ? 1 : -1), isSellOffer);
			//const matchLink = CreateOfferLink(resource, price, isSellOffer);
			if (outbidLink) {
				aTag.href = outbidLink;
			}
			else {
				aTag.className = 'Doc_RemoveLink';
			}
		}
		return aTag;
	})());
	cell.append(' | ');
	cell.appendChild((() => {
		const aTag = document.createElement('a');
		aTag.innerText = 'Match';
		if (localStorage.getItem('Doc_VT_InfiniteScroll')) {
			aTag.className = `Doc_Match_${isSellOffer ? 'S' : 'B'}_${resource}`;
		}
		else {
			const matchLink = CreateOfferLink(resource, price, isSellOffer);
			if (matchLink) {
				aTag.href = matchLink;
			}
			else {
				aTag.className = 'Doc_RemoveLink';
			}
		}
		return aTag;
	})());
}

function AddTopUpButton(cell, resource, quantity, price, isSellOffer) {
	cell.appendChild(document.createElement('br'));
	cell.appendChild((() => {
		const aTag = document.createElement('a');
		aTag.innerText = 'TopUp';
		if (localStorage.getItem('Doc_VT_InfiniteScroll')) {
			if (isSellOffer) {
				aTag.className = `Doc_TopUp_S_${resource}`;
				myOffers.Money += price * quantity;
			}
			else {
				aTag.className = `Doc_TopUp_B_${resource}`;
				myOffers[resource] += quantity;
			}
		}
		else {
			myOffers.Money = price * quantity;
			myOffers[resource] = quantity;
			const topupLink = CreateOfferLink(resource, price, isSellOffer);
			if (topupLink) {
				aTag.href = topupLink;
			}
			else {
				aTag.className = 'Doc_RemoveLink';
			}
			myOffers.Money = 0;
			myOffers[resource] = 0;
		}
		return aTag;
	})());
}

function CreateOfferLink(resource, price, isSellOffer) {
	const quantity = Math.max(Math.floor(isSellOffer ? (resources.Money - myOffers.Money) / price : resources[resource] - myOffers[resource]), 0);
	if (quantity > 0) {
		return `https://politicsandwar.com/nation/trade/create/?resource=${resource.toLowerCase()}&p=${price}&q=${quantity}&t=${isSellOffer ? 'b' : 's'}`;
	}
}

function Mistrade(num = 0) {
	if ((() => {
		let args = location.search.slice(1).split('&');
		let checkOne = false;
		let checkTwo = false;
		while (args.length) {
			const arg = args.shift().split('=');
			if (arg[0] == 'buysell') {
				if (!arg[1].length) {
					checkOne = true;
				}
			}
			else if (arg[0] == 'resource1') {
				if (arg[1].length) {
					checkTwo = true;
				}
			}
		}
		return marketType == 2 && checkOne && checkTwo;
	})()) {
		let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
		let highestSell = 0;
		let lowestBuy = 50000000;
		while (trTags.length) {
			const trTag = trTags.shift();
			const tdTags = Array.from(trTag.children);
			const price = parseInt(tdTags[5 - num].textContent.trim().split(' ')[0].replaceAll(',', ''));
			const offerIsSelling = tdTags[1 - num].childElementCount == 1;
			if (offerIsSelling) {
				highestSell = Math.max(highestSell, price);
			}
			else {
				lowestBuy = Math.min(lowestBuy, price);
			}
			if (lowestBuy < highestSell) {
				trTag.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
				const linkTag = Array.from(document.getElementsByTagName('link')).filter(x => x.href == 'https://politicsandwar.com/css/dark-theme.css')[0];
				if (linkTag) {
					linkTag.remove();
				}
				else {
					document.head.appendChild((() => {
						const linkTag = document.createElement('link');
						linkTag.rel = 'stylesheet';
						linkTag.href = 'https://politicsandwar.com/css/dark-theme.css';
						return linkTag;
					})());
				}
				document.body.appendChild((() => {
					const divTag = document.createElement('div');
					divTag.style.display = 'none';
					divTag.id = 'Doc_Scrolled';
					return divTag;
				})());
				return true;
			}
		}
	}
	return false;
}

function ReGain() {
	const pTag = (() => {
		const imgTag = Array.from(document.getElementsByTagName('img')).filter(x => x.alt == 'Success').shift();
		if (imgTag) {
			return imgTag.parentElement;
		}
	})();
	if (pTag) {
		pTag.style.textAlign = 'center';
		const text = ReplaceAll(pTag.textContent.trim(), '  ', ' ').split(' ');
		if (text[2] == 'accepted') {
			let quantity = parseInt(text[8].replaceAll(',', ''));
			const price = parseInt(text[14].slice(1, -1).replaceAll(',', '')) / quantity;
			const bought = text[7] == 'bought';
			const key = `Doc_VT_ReGain_${text[9][0].toUpperCase() + text[9].slice(1, -1).toLowerCase()}`;
			let data = JSON.parse(localStorage.getItem(key));
			let profit = 0;

			// Update Info if transaction was made in profit.
			if (data) {
				if (data.bought != bought) {
					for (let i = 0; i < data.levels.length; ++i) {
						if ((!bought && price > data.levels[i].price) || (bought && price < data.levels[i].price)) {
							profit += Math.min(data.levels[i].quantity, quantity) * Math.abs(data.levels[i].price - price);
							data.levels[i].quantity -= quantity;
							if (data.levels[i].quantity >= 0) {
								quantity = 0;
								break;
							}
							quantity = data.levels[i].quantity * -1;
						}
					}
					data.levels = data.levels.filter(x => x.quantity > 0);
					if (data.levels.length) {
						localStorage.setItem(key, JSON.stringify(data));
					}
					else {
						localStorage.removeItem(key);
					}
				}
			}

			pTag.innerHTML += ` $${price.toLocaleString()}/ton.`;
			// Add Re-Sell/Buy for Profit Button.
			pTag.appendChild(document.createElement('br'));
			data = JSON.parse(localStorage.getItem(key));
			if ((!data || data.bought == bought) && quantity) {
				pTag.appendChild((() => {
					const aTag = document.createElement('a');
					aTag.innerText = `Re${bought ? 'sell' : 'buy'} for Profit?`;
					aTag.onclick = () => {
						if (data) {
							let exists = false;
							for (let i = 0; i < data.levels.length; ++i) {
								if (data.levels[i].price == price) {
									exists = true;
									data.levels[i].quantity += quantity;
									break;
								}
							}
							if (!exists) {
								data.levels.push({
									'quantity': quantity,
									'price': price
								});
								data.levels.sort((x, y) => x.price - y.price);
								if (bought) {
									data.levels.reverse();
								}
							}
							localStorage.setItem(key, JSON.stringify(data));
						}
						else {
							localStorage.setItem(key, JSON.stringify({
								'bought': bought,
								'levels': [
									{
										'quantity': quantity,
										'price': price,
									}
								]
							}));
						}

						UpdateQuantities();
						pTag.removeChild(aTag);
						if (profit) {
							pTag.innerHTML = pTag.innerHTML.replaceAll(' | ', '');
						}
					};
					return aTag;
				})());
			}
			if ((!data || data.bought == bought) && profit && quantity) {
				pTag.append(' | ');
			}
			if (profit) {
				pTag.append(`Made $${profit.toLocaleString()} Profit.`);
			}
		}
		return true;
	}
	return false;
}

function MarketLinks() {
	const formTag = Array.from(document.getElementById('rightcolumn').children).filter(tag => tag.tagName == 'FORM')[0];
	formTag.parentElement.insertBefore((() => {
		const pTag = document.createElement('P');
		pTag.style.textAlign = 'center';
		pTag.appendChild(MarketLink('Oil'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Coal'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Iron'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Bauxite'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Lead'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Uranium'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Food'));
		pTag.appendChild(document.createElement('br'));
		pTag.appendChild(MarketLink('Gasoline'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Steel'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Aluminum'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Munitions'));
		pTag.append(' | ');
		pTag.appendChild(MarketLink('Credits'));
		pTag.appendChild(document.createElement('br'));
		pTag.appendChild((() => {
			const aTag = document.createElement('a');
			aTag.href = 'https://politicsandwar.com/index.php?id=26&display=nation&resource1=&buysell=&ob=date&od=DESC&maximum=100&minimum=0&search=Go';
			aTag.innerText = 'Personal Trades';
			return aTag;
		})());
		return pTag;
	})(), formTag);
	formTag.parentElement.insertBefore(document.createElement('hr'), formTag);
}

function MarketLink(resource) {
	const aTag = document.createElement('a');
	aTag.href = `https://politicsandwar.com/index.php?id=90&display=world&resource1=${resource.toLowerCase()}&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go`;
	aTag.appendChild((() => {
		const imgTag = document.createElement('img');
		if (resource == 'Food') {
			imgTag.src = 'https://politicsandwar.com/img/icons/16/steak_meat.png';
		}
		else if (resource == 'Credits') {
			imgTag.src = 'https://politicsandwar.com/img/icons/16/point_gold.png';
		}
		else {
			imgTag.src = `https://politicsandwar.com/img/resources/${resource.toLowerCase()}.png`;
		}
		return imgTag;
	})());
	aTag.append(` ${resource}${localStorage.getItem(`Doc_VT_ReGain_${resource}`) ? '*' : ''}`);
	return aTag;
}

function ReGainCurrentLevels() {
	if (currentResource != 'Money') {
		const data = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
		if (data) {
			const formTag = Array.from(document.getElementById('rightcolumn').children).filter(tag => tag.tagName == 'FORM')[0];
			formTag.parentElement.insertBefore((() => {
				const divTag = document.createElement('div');
				divTag.id = 'RegainLevelDiv';
				divTag.style.display = 'flex';
				divTag.style.flexDirection = 'row';
				divTag.style.flexWrap = 'wrap';
				divTag.style.justifyContent = 'space-around';
				divTag.style.alignContent = 'center';
				divTag.style.textAlign = 'center';
				for (let i = 0; i < data.levels.length; ++i) {
					divTag.appendChild((() => {
						const pTag = document.createElement('p');
						pTag.id = `RegainLevel${i}`;
						pTag.style.padding = '0.5em';
						pTag.style.margin = '0';
						pTag.innerText = `${data.bought ? 'Bought' : 'Sold'} ${data.levels[i].quantity.toLocaleString()} Ton${data.levels[i].quantity > 1 ? 's' : ''} @ $${data.levels[i].price.toLocaleString()}/ton | `;
						pTag.appendChild((() => {
							const aTag = document.createElement('a');
							aTag.innerText = 'Forget';
							aTag.onclick = () => {
								ForgetAboutIt(data.levels[i].price, i);
							};
							return aTag;
						})());
						return pTag;
					})());
				}
				if (data.levels.length > 1) {
					divTag.appendChild((() => {
						const aTag = document.createElement('a');
						aTag.style.padding = '0.5em';
						aTag.style.margin = '0';
						aTag.innerText = 'Forget All';
						aTag.onclick = () => {
							ForgetAboutIt(-1);
						};
						return aTag;
					})());
				}
				return divTag;
			})(), formTag);
			formTag.parentElement.insertBefore((() => {
				const hrTag = document.createElement('hr');
				hrTag.id = 'RegainLevelHr';
				return hrTag;
			})(), formTag);
		}
	}
}

function ForgetAboutIt(price, i) {
	const key = `Doc_VT_ReGain_${currentResource}`;
	if (price < 0) {
		localStorage.removeItem(key);
		document.getElementById('RegainLevelDiv').remove();
		document.getElementById('RegainLevelHr').remove();
	}
	else {
		let data = JSON.parse(localStorage.getItem(key));
		data.levels = data.levels.filter(x => x.price != price);
		if (data.levels.length) {
			localStorage.setItem(key, JSON.stringify(data));
			document.getElementById(`RegainLevel${i}`).remove();
		}
		else {
			localStorage.removeItem(key);
			document.getElementById('RegainLevelDiv').remove();
			document.getElementById('RegainLevelHr').remove();
		}
	}
	UpdateQuantities();
}

function MiddleScroll() {
	if ((() => {
		let args = location.search.slice(1).split('&');
		let checkOne = false;
		let checkTwo = false;
		while (args.length) {
			const arg = args.shift().split('=');
			if (arg[0] == 'buysell') {
				if (!arg[1].length) {
					checkOne = true;
				}
			}
			else if (arg[0] == 'resource1') {
				if (arg[1].length) {
					checkTwo = true;
				}
			}
		}
		return marketType > 0 && checkOne && checkTwo;
	})()) {
		let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children).slice(1);
		let favouringSelling = trTags[0].children[0].childElementCount == 1;
		let bestOffer = favouringSelling ? 0 : 50000000;
		let midTag;
		while (trTags.length) {
			const trTag = trTags.shift();
			const tdTags = Array.from(trTag.children);
			const price = parseInt(tdTags[4].textContent.trim().split(' ')[0].replaceAll(',', ''));
			const offerIsSelling = tdTags[0].childElementCount == 1;
			if (offerIsSelling == favouringSelling && ((offerIsSelling && bestOffer <= price) || (!offerIsSelling && bestOffer >= price))) {
				bestOffer = price;
				midTag = trTag;
			}
		}
		if (midTag) {
			midTag.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	}
}

function UpdateLinks() {
	for (let resource in myOffers) {
		if (resource == 'Money') {
			continue;
		}
		UpdateLinksFor(`Doc_Outbid_S_${resource}`, resource, true, 1);
		UpdateLinksFor(`Doc_Outbid_B_${resource}`, resource, false, -1);
		UpdateLinksFor(`Doc_Match_S_${resource}`, resource, true);
		UpdateLinksFor(`Doc_Match_B_${resource}`, resource, false);
		UpdateLinksFor(`Doc_TopUp_S_${resource}`, resource, true);
		UpdateLinksFor(`Doc_TopUp_B_${resource}`, resource, false);
	}
}

function UpdateLinksFor(className, resource, isSellOffer, modifyPrice = 0) {
	let aTags = Array.from(document.getElementsByClassName(className));
	while (aTags.length) {
		const aTag = aTags.shift();
		const link = CreateOfferLink(resource, parseInt(aTag.parentElement.textContent.split(' ')[1].replaceAll(',', '')) + modifyPrice, isSellOffer);
		if (link) {
			aTag.href = link;
		}
		else {
			aTag.className = 'Doc_RemoveLink';
		}
	}
}

function RemoveBadLinks() {
	for (let i = 0; i < 2; ++i) {
		let aTags = Array.from(document.getElementsByClassName('Doc_RemoveLink'));
		while (aTags.length) {
			const aTag = aTags.shift();
			const parentTag = aTag.parentElement;
			if (parentTag) {
				aTag.remove();
				parentTag.innerHTML = parentTag.innerHTML.replaceAll(' | ', '');
			}
		}
	}
}

/* Start
-------------------------*/
async function Main() {
	let mistradeExists = Mistrade();

	let trTags = (() => {
		let tags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children);
		const tag = tags.shift();
		tag.removeChild(tag.children[0]);
		return tags;
	})();
	while (trTags.length) {
		const trTag = trTags.shift();
		try {
			ModifyRow(Array.from(trTag.children));
		}
		catch (e) {
			console.error(trTag);
			console.error(e);
		}
	}

	const acceptedOffer = ReGain();
	MarketLinks();
	ReGainCurrentLevels();
	await InfiniteScroll();
	if (!mistradeExists) {
		mistradeExists = Mistrade(1);
		if (!(mistradeExists || acceptedOffer)) {
			MiddleScroll();
		}
	}
	UpdateQuantities();
	UpdateLinks();
	RemoveBadLinks();
}

if (marketType > -1) {
	Main();
}