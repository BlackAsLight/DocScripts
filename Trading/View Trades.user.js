// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      6.3
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @match        https://politicsandwar.com/nation/trade/*
// @exclude      https://politicsandwar.com/nation/trade/create/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_ViewTrades')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', async divTag => {
	divTag.setAttribute('id', 'Doc_ViewTrades');
	divTag.style.setProperty('display', 'none');
	await Sleep(10000);
	divTag.remove();
}));

/* Global Variables
-------------------------*/
const nationID = [...document.querySelectorAll('.sidebar a')].filter(aTag => aTag.href.includes('nation/id=')).map(aTag => parseInt(aTag.href.slice(37)))[0];
const currentResource = Capitalize((location.search.slice(1).split('&').filter(arg => arg.startsWith('resource1='))[0] || '').slice(10)) || 'Money';
const ascOrder = (location.search.slice(1).split('&').filter(arg => arg.startsWith('od='))[0] || '').slice(3) !== 'DESC';
const token = (document.querySelector('input[name="token"]') || { value: null }).value;

const resourceBar = (() => {
	const resources = [...document.querySelectorAll('#resource-column .right')].map(tdTag => parseFloat(tdTag.textContent.replaceAll(',', '')));
	return {
		Money: resources[0],
		Oil: resources[3],
		Coal: resources[2],
		Iron: resources[6],
		Bauxite: resources[7],
		Lead: resources[5],
		Uranium: resources[4],
		Food: resources[1],
		Gasoline: resources[8],
		Steel: resources[10],
		Aluminum: resources[11],
		Munitions: resources[9],
		Credits: resources[12]
	};
})();

// None = -1
// Personal = 0
// Alliance = 1
// World = 2
const marketType = (() => {
	if (location.pathname.startsWith('/nation/trade/')) {
		if (location.pathname.endsWith('world')) {
			return 2;
		}
		if (location.pathname.endsWith('alliance')) {
			return 1;
		}
		if (location.pathname === '/nation/trade/') {
			return 0;
		}
		// E.g. Create Offer Page -|- The script wouldn't be injected in that specific case.
		return -1;
	}
	const type = (location.search.slice(1).split('&').filter(arg => arg.startsWith('display'))[0] || '').slice(8);
	if (type === 'world') {
		return 2;
	}
	if (type === 'alliance') {
		return 1;
	}
	// "type" is either 'nation' or an empty string as display had no value or isn't present in the URL.
	// The game defaults to the personal market in these situations.
	return 0;
})();

const myOffers = {
	Money: 0
};

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('strong', strongTag => strongTag.append('View Trades Config')));

	divTag.append(document.createElement('br'));
	divTag.append('InfiniteScroll: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.setAttribute('id', 'Doc_VT_InfiniteScroll');
		inputTag.setAttribute('type', 'checkbox');
		inputTag.checked = localStorage.getItem('Doc_VT_InfiniteScroll') ? true : false;
		inputTag.onchange = () => {
			if (document.querySelector('#Doc_VT_InfiniteScroll').checked) {
				localStorage.setItem('Doc_VT_InfiniteScroll', true);
			}
			else {
				localStorage.removeItem('Doc_VT_InfiniteScroll');
			}
			location.reload();
		};
	}));

	divTag.append(document.createElement('br'));
	divTag.append('Zero Accountability: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.setAttribute('id', 'Doc_VT_ZeroAccountability');
		inputTag.setAttribute('type', 'checkbox');
		inputTag.checked = localStorage.getItem('Doc_VT_ZeroAccountability') ? true : false;
		inputTag.onchange = () => {
			if (document.querySelector('#Doc_VT_ZeroAccountability').checked) {
				localStorage.setItem('Doc_VT_ZeroAccountability', true);
			}
			else {
				localStorage.removeItem('Doc_VT_ZeroAccountability');
			}
			UpdateLinks();
		};
	}));

	if (currentResource !== 'Money') {
		divTag.append(document.createElement('br'));
		divTag.append(CreateElement('button', buttonTag => {
			buttonTag.append(`Max ${currentResource}`);
			buttonTag.onclick = () => {
				const currentMax = MaxAmount(currentResource);
				const newMax = parseInt(prompt(`Set the maximum amount of ${currentResource} that you would like to offer when creating an offer:`, currentMax)).toString();
				if (newMax !== 'NaN' && newMax !== currentMax) {
					const key = `Doc_MaxResource_${currentResource}`;
					if (newMax > 0) {
						localStorage.setItem(key, newMax);
					}
					else if (currentMax > 0) {
						localStorage.removeItem(key);
					}
					UpdateLinks();
				}
			};
		}));
	}

	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		buttonTag.append(`Min ${currentResource}`);
		buttonTag.onclick = () => {
			const currentMin = MinAmount(currentResource);
			const newMin = (Math.round(parseFloat(prompt(`Set the minimum amount of ${currentResource} that you don't want to accidentally sell:`, currentMin)) * 100) / 100).toString();
			if (newMin != 'NaN' && newMin != currentMin) {
				const key = `Doc_MinResource_${currentResource}`;
				if (newMin > 0) {
					localStorage.setItem(key, newMin);
				}
				else if (currentMin > 0) {
					localStorage.removeItem(key);
				}
				UpdateQuantities();
				UpdateLinks();
			}
		};
	}));

	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('div', divTag => {
		divTag.append(CreateElement('strong', strongTag => strongTag.append('MarketView')));
		divTag.append(CreateElement('label', labelTag => {
			labelTag.setAttribute('for', 'both');
			labelTag.append('Both: ');
		}));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.setAttribute('id', 'both');
			inputTag.setAttribute('type', 'radio');
			inputTag.setAttribute('name', 'marketView');
			inputTag.checked = !localStorage.getItem('Doc_MarketView');
			inputTag.onchange = () => {
				localStorage.removeItem('Doc_MarketView');
				UpdateMarketLinks();
			};
		}));
		divTag.append(document.createElement('br'));
		divTag.append(CreateElement('label', labelTag => {
			labelTag.setAttribute('for', 'sell');
			labelTag.append('Sell: ');
		}));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.setAttribute('id', 'sell');
			inputTag.setAttribute('type', 'radio');
			inputTag.setAttribute('name', 'marketView');
			inputTag.checked = parseInt(localStorage.getItem('Doc_MarketView') || 1) ? false : true;
			inputTag.onchange = () => {
				localStorage.setItem('Doc_MarketView', 0);
				UpdateMarketLinks();
			};
		}));
		divTag.append(document.createElement('br'));
		divTag.append(CreateElement('label', labelTag => {
			labelTag.setAttribute('for', 'buy');
			labelTag.append('Buy: ');
		}));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.setAttribute('id', 'buy');
			inputTag.setAttribute('type', 'radio');
			inputTag.setAttribute('name', 'marketView');
			inputTag.checked = parseInt(localStorage.getItem('Doc_MarketView')) ? true : false;
			inputTag.onchange = () => {
				localStorage.setItem('Doc_MarketView', 1);
				UpdateMarketLinks();
			};
		}));
	}));
}));

/* Styling
-------------------------*/
document.head.append(CreateElement('style', styleTag => {
	/* Config
	-------------------------*/
	styleTag.append('.Doc_Config { text-align: center; padding: 0 1em; font-size: 0.8em; }');
	styleTag.append('.Doc_Config hr { margin: 0.5em 0; }');
	styleTag.append('.Doc_Config strong { font-size: 1.25em; }');
	styleTag.append('.Doc_Config input { margin: 0; }');
	styleTag.append('.Doc_Config button { font-size: inherit; font-weight: normal; padding: 0; }');
	styleTag.append('.Doc_Config div strong { display: block; }');
	styleTag.append('.Doc_Config div label { display: inline-block; font-weight: normal; margin: 0 0 0 25%; text-align: left; width: 25%; }');
	styleTag.append('.Doc_Config div input { display: inline-block; margin: 0 25% 0 0; width: 25%; }');

	/* Market Links
	-------------------------*/
	styleTag.append('#MarketLinks { text-align: center; }');
	styleTag.append('#MarketLinks a { cursor: pointer; }');
	styleTag.append('#MarketLinks form { display: none; }');

	/* ReGain
	-------------------------*/
	styleTag.append('#ReGain { text-align: center; }');
	styleTag.append('#RegainStats { text-align: center; }');

	/* Table
	-------------------------*/
	styleTag.append('#Offers { text-align: center; }');
	styleTag.append('#Offers hr { border: 0.25em solid #d9534f; margin: 0; }');
	styleTag.append('#Offers p { margin: 0; padding: 5px; }');
	styleTag.append('.Offer { align-items: center; display: grid; grid-gap: 1em; grid-template-areas: "Nations Nations Nations Nations Date Quantity Price Form" "Nations Nations Nations Nations Date Quantity Create Form"; grid-template-columns: repeat(8, 1fr); padding: 1em; }');
	styleTag.append('.Nations { align-items: center; display: grid; grid-gap: 1em; grid-template-areas: "Left Right"; grid-template-columns: repeat(2, 1fr); overflow-wrap: anywhere; }');
	styleTag.append('.Outline { outline-color: #d9534f; outline-style: solid; outline-width: 0.25em; }');
	// Media: 991px
	styleTag.append('@media only screen and (max-width: 991px) { ');
	styleTag.append('.Offer { grid-template-areas: "Nations Nations Date Quantity Price Form" "Nations Nations Date Quantity Create Form"; grid-template-columns: repeat(6, 1fr); }');
	styleTag.append('.Nations { grid-template-areas: "Left" "Right"; grid-template-columns: 1fr; }');
	styleTag.append('.Hide { display: none; }');
	styleTag.append(' }');
	// Media: 660px
	styleTag.append('@media only screen and (max-width: 660px) { ');
	styleTag.append('.Offer { grid-template-areas: "Nations Quantity Price Form" "Nations Date Create Form"; grid-template-columns: repeat(4, 1fr); }');
	styleTag.append(' }');
	// Media: 440px
	styleTag.append('@media only screen and (max-width: 440px) { ');
	styleTag.append('.Offer { grid-template-areas: "Nations Quantity Form" "Nations Price Form" "Nations Create Form" "Date Date Date"; grid-template-columns: repeat(3, 1fr); }');
	styleTag.append(' }');

	/* Table Form
	-------------------------*/
	styleTag.append('#Offers input { width: 100%; }');
	styleTag.append('.sOffer input[type="submit"] { background-color: rgb(92, 184, 92) !important; }');
	styleTag.append('.sOffer input[type="submit"]:hover, .sOffer input[type="submit"]:focus { background-color: hsl(120, 39%, 64%) !important; }');
	styleTag.append('.bOffer input[type="submit"] { background-color: rgb(51, 122, 183) !important; }');
	styleTag.append('.bOffer input[type="submit"]:hover, .bOffer input[type="submit"]:focus { background-color: hsl(208, 56%, 56%) !important; }');
	styleTag.append('.Offer button { background-color: rgb(217, 83, 79); color: rgb(255, 255, 255); font: inherit; margin: 2px; padding: 10px; text-decoration: none; width: 100%; }');
	styleTag.append('.Offer button:hover, .Offer button:focus { background-color: hsl(2, 64%, 63%); }');

	styleTag.append('.Offer button, .Offer input[type="submit"] { border-radius: 3px; transition: background-color 300ms ease; }');
}));

document.head.append(CreateElement('style', styleTag => {
	styleTag.setAttribute('id', 'GameTheme');
	UpdateTheme(styleTag);
}));

// Dark Theme 2.0 = 2
// Dark Theme 1.0 = 1
// Light Theme = 0
function GetTheme() {
	const links = [...document.querySelectorAll('link')].map(linkTag => linkTag.href);
	if (links.includes('https://politicsandwar.com/css/dark-theme-2.0-beta.css')) {
		return 2;
	}
	if (links.includes('https://politicsandwar.com/css/dark-theme.min.css')) {
		return 1;
	}
	return 0;
}

function SetTheme(theme) {
	if (theme) {
		document.head.append(CreateElement('link', linkTag => {
			linkTag.setAttribute('rel', 'stylesheet');
			linkTag.setAttribute('href', theme === 2 ? 'https://politicsandwar.com/css/dark-theme-2.0-beta.css' : 'https://politicsandwar.com/css/dark-theme.min.css');
		}));
	}
	else {
		[...document.querySelectorAll('link')].filter(linkTag => linkTag.href === 'https://politicsandwar.com/css/dark-theme-2.0-beta.css' || linkTag.href === 'https://politicsandwar.com/css/dark-theme.min.css')[0].remove();
	}
	UpdateTheme();
}

function UpdateTheme(styleTag = document.querySelector('#GameTheme')) {
	const theme = GetTheme();
	styleTag.textContent = '';
	if (theme === 2) {
		styleTag.append('.Offer:nth-child(2n + 1) { background: rgb(39, 42, 47); }');
		styleTag.append('.Offer:nth-child(2n) { background: rgb(34, 36, 39); }');
		styleTag.append('.Doc_Config { color: rgb(255, 255, 255); }');
		styleTag.append('.Doc_Config strong { color: rgb(91, 117, 254); }');
		styleTag.append('.Doc_Config button { color: rgb(91, 117, 254); text-decoration: underline; }');
		styleTag.append('.Doc_Config button:hover { color: inherit; }');
		return;
	}
	if (theme === 1) {
		styleTag.append('.Offer:nth-child(2n) { background: rgb(31, 31, 31); }');
		return;
	}
	styleTag.append('.Offer:nth-child(2n) { background: rgb(204, 205, 227); }');
	return;
}

/* Functions
-------------------------*/
function CreateElement(type, func) {
	const tag = document.createElement(type);
	func(tag);
	return tag;
}

function Sleep(ms) {
	return new Promise(a => setTimeout(() => a(true), ms));
}

function Capitalize(text) {
	const words = text.split(' ').filter(word => word.length);
	for (const i in words) {
		words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
	}
	return words.join(' ');
}

function MaxAmount(resource) {
	return parseFloat(localStorage.getItem(`Doc_MaxResource_${Capitalize(resource)}`)) || 0;
}

function MinAmount(resource) {
	return parseFloat(localStorage.getItem(`Doc_MinResource_${Capitalize(resource)}`)) || 0;
}

function ReplaceAll(text, search, replace) {
	if (search === replace || replace.search(search) != -1) {
		throw 'Infinite Loop!';
	}
	while (text.indexOf(search) != -1) {
		text = text.replaceAll(search, replace);
	}
	return text;
}

function CreateOfferLink(resource, price, sellersWanted, quantity = undefined) {
	if (quantity === undefined) {
		const max = parseInt(localStorage.getItem(`Doc_MaxResource_${resource}`)) || Infinity;
		if (localStorage.getItem('Doc_VT_ZeroAccountability')) {
			quantity = Math.max(Math.min(Math.floor(sellersWanted ? resourceBar.Money / price : resourceBar[resource]), max), 0);
		}
		else {
			quantity = Math.max(Math.min(Math.floor(sellersWanted ? (resourceBar.Money - MinAmount('Money') - myOffers.Money) / price : resourceBar[resource] - MinAmount(resource) - myOffers[resource]), max), 0);
		}
	}
	if (quantity) {
		return `https://politicsandwar.com/nation/trade/create/?resource=${resource.toLowerCase()}&p=${price}&q=${quantity}&t=${sellersWanted ? 'b' : 's'}`;
	}
}

function UpdateLinks() {
	for (const resource in myOffers) {
		if (resource === 'Money') {
			continue;
		}

		for (let i = 0; i < 2; ++i) {
			[...document.querySelectorAll(`.${i ? 's' : 'b'}Outbid_${resource}`)].forEach(aTag => UpdateLink(aTag, CreateOfferLink(resource, GetPrice(aTag.parentElement.parentElement) + (i ? 1 : -1), i ? true : false)));
			[...document.querySelectorAll(`.${i ? 's' : 'b'}Match_${resource}, .${i ? 's' : 'b'}TopUp_${resource}`)].forEach(aTag => UpdateLink(aTag, CreateOfferLink(resource, GetPrice(aTag.parentElement.parentElement), i ? true : false)));
		}
	}
}

function UpdateLink(aTag, link) {
	if (link) {
		aTag.setAttribute('href', link);
		aTag.style.removeProperty('text-decoration');
	}
	else {
		aTag.removeAttribute('href');
		aTag.style.setProperty('text-decoration', 'line-through');
	}
}

function UpdateQuantities() {
	if (currentResource === 'Money') {
		[...document.querySelectorAll('.Offer')].forEach(divTag => {
			const offerType = [...divTag.classList].filter(x => x.startsWith('Type-'))[0].slice(5);
			if (offerType !== 'Receive-Public') {
				return;
			}

			divTag.querySelector('.Amount').value = CalcUnits(offerType, divTag.querySelector('.Hide').textContent === 'SELLERS WANTED', Capitalize([...divTag.classList].filter(x => x.endsWith('Offer') && x.length > 6)[0].slice(0, -5)), GetQuantity(divTag), GetPrice(divTag));
		});
		return;
	}

	const data = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
	[...document.querySelectorAll('.Offer')].forEach(divTag => {
		const offerType = [...divTag.classList].filter(x => x.startsWith('Type-'))[0].slice(5);
		if (offerType !== 'Receive-Public') {
			return;
		}

		const price = GetPrice(divTag);
		const units = CalcUnits(offerType, divTag.querySelector('.Hide').textContent === 'SELLERS WANTED', Capitalize([...divTag.classList].filter(x => x.endsWith('Offer') && x.length > 6)[0].slice(0, -5)), GetQuantity(divTag), price);
		if (data && divTag.classList.contains('sOffer') === data.bought) {
			const quantity = data.bought ? data.levels.reduce((quantity, level) => quantity + (price > level.price ? level.quantity : 0), 0) : data.levels.reduce((quantity, level) => quantity + (price < level.price ? level.quantity : 0), 0);
			divTag.querySelector('.Amount').value = Math.min(units, quantity);
		}
		else {
			divTag.querySelector('.Amount').value = units;
		}
	});
}

function CreateRow(tdTags) {
	const sellerWanted = tdTags[1].textContent === 'SELLER WANTED';
	const buyerWanted = tdTags[2].textContent === 'BUYER WANTED';
	const offerType = (() => {
		const type = tdTags[6].children[0].tagName;
		if (type === 'FORM') {
			return sellerWanted || buyerWanted ? 'Receive-Public' : 'Receive-Personal';
		}
		if (type === 'A') {
			return sellerWanted || buyerWanted ? 'Send-Public' : 'Send-Personal';
		}
		return tdTags[6].textContent.includes('Accepted') ? 'Accepted' : 'Embargo';
	})();
	const sellUnits = offerType.endsWith('Public') || offerType === 'Embargo' ? sellerWanted : parseInt(tdTags[2].children[0].href.split('=')[1]) === nationID === (offerType !== 'Receive-Personal');
	const resource = Capitalize(tdTags[4].children[0].getAttribute('title'));
	if (myOffers[resource] === undefined) {
		myOffers[resource] = 0;
	}
	const price = parseInt(tdTags[5].textContent.split('/')[0].trim().replaceAll(',', ''));
	const quantity = parseInt(tdTags[4].textContent.trim().replaceAll(',', ''));
	const units = CalcUnits(offerType, sellUnits, resource, quantity, price);
	const date = new Date(`${tdTags[3].childNodes[0].textContent} ${tdTags[3].childNodes[2].textContent}`);

	document.querySelector('#Offers').append(CreateElement('div', divTag => {
		divTag.classList.add('Offer');
		divTag.classList.add(`${sellUnits ? 's' : 'b'}Offer`);
		divTag.classList.add(`${resource.toLowerCase()}Offer`);
		divTag.classList.add(`Type-${offerType}`);

		// Nations
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Nations');
			divTag.style.setProperty('grid-area', 'Nations');
			divTag.append(CreateElement('div', divTag => {
				divTag.style.setProperty('grid-area', 'Left');
				GenerateNationBio(divTag, tdTags[1], offerType.endsWith('Public') || offerType === 'Embargo', sellUnits, 'SELLERS WANTED');
			}));
			divTag.append(CreateElement('div', divTag => {
				divTag.style.setProperty('grid-area', 'Right');
				GenerateNationBio(divTag, tdTags[2], offerType.endsWith('Public') || offerType === 'Embargo', !sellUnits, 'BUYERS WANTED');
			}));
		}));

		// Date
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Date');
			divTag.style.setProperty('grid-area', 'Date');
			divTag.append(FormatDate(date));
		}));

		// Quantity
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Quantity');
			divTag.style.setProperty('grid-area', 'Quantity');
			divTag.append(CreateElement('img', imgTag => imgTag.setAttribute('src', tdTags[4].children[0].src)));
			divTag.append(' ');
			divTag.append(FormatNumber(quantity));
		}));

		// Price
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Price');
			divTag.style.setProperty('grid-area', 'Price');
			divTag.append(FormatMoney(price));
			divTag.append('/Ton');
			divTag.append(CreateElement('div', divTag => divTag.append(FormatMoney(price * (offerType.startsWith('Receive') ? units : quantity)))));
		}));

		// Outbid + Match || TopUp || Duplicate
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Create');
			divTag.style.setProperty('grid-area', 'Create');
			if (offerType.startsWith('Receive')) {
				// Outbid + Match
				divTag.append(CreateElement('a', aTag => {
					aTag.classList.add(`${sellUnits ? 's' : 'b'}Outbid_${resource}`);
					aTag.append('Outbid');
				}));
				divTag.append(document.createElement('br'));
				divTag.append(CreateElement('a', aTag => {
					aTag.classList.add(`${sellUnits ? 's' : 'b'}Match_${resource}`);
					aTag.append('Match');
				}));
				return;
			}
			if (offerType === 'Send-Public') {
				// TopUp
				divTag.append(CreateElement('a', aTag => {
					aTag.classList.add(`${sellUnits ? 's' : 'b'}TopUp_${resource}`);
					aTag.append('TopUp');
				}));
				if (sellUnits) {
					myOffers.Money += price * quantity;
				}
				else {
					myOffers[resource] += quantity;
				}
				return;
			}
			// Duplicate
			divTag.append(CreateElement('a', aTag => {
				aTag.setAttribute('href', CreateOfferLink(resource, price, offerType === 'Embargo' === sellUnits, quantity));
				aTag.append('Duplicate');
			}));
		}));

		// Form/Delete || Accepted || Embargo
		divTag.append(CreateElement('div', divTag => {
			divTag.style.setProperty('grid-area', 'Form');
			if (offerType === 'Accepted' || offerType === 'Embargo') {
				divTag.append(CreateElement('img', imgTag => imgTag.setAttribute('src', tdTags[6].children[0].src)));
				if (offerType === 'Accepted') {
					divTag.append(' ');
					divTag.append(CreateElement('b', bTag => bTag.append(sellUnits ? 'SOLD' : 'BOUGHT')));
					divTag.append(document.createElement('br'));
					const spanTag = tdTags[6].children[2];
					divTag.append(FormatDate(new Date(`${spanTag.childNodes[0].textContent} ${spanTag.childNodes[2].textContent}`)));
				}
				return;
			}
			if (offerType.startsWith('Receive')) {
				divTag.append(CreateElement('form', formTag => {
					formTag.setAttribute('action', location.href);
					formTag.setAttribute('method', 'POST');
					formTag.append(CreateElement('input', inputTag => {
						inputTag.setAttribute('type', 'hidden');
						inputTag.setAttribute('name', 'tradeaccid');
						inputTag.setAttribute('value', tdTags[6].querySelector('input[name="tradeaccid"]').value);
					}));
					formTag.append(CreateElement('input', inputTag => {
						inputTag.setAttribute('type', 'hidden');
						inputTag.setAttribute('name', 'ver');
						inputTag.setAttribute('value', tdTags[6].querySelector('input[name="ver"]').value);
					}));
					formTag.append(CreateElement('input', inputTag => {
						inputTag.setAttribute('type', 'hidden');
						inputTag.setAttribute('name', 'token');
						inputTag.setAttribute('value', token);
					}));
					formTag.append(CreateElement('input', inputTag => {
						inputTag.classList.add('Amount');
						inputTag.setAttribute('type', 'number');
						inputTag.setAttribute('name', 'rcustomamount');
						inputTag.setAttribute('value', units);
						// "this" doesn't work with an arrow function.
						inputTag.onchange = function () {
							const divTag = this.parentElement.parentElement.parentElement;
							divTag.querySelector('.Price div').textContent = FormatMoney(GetPrice(divTag) * this.value);
						};
					}));
					formTag.append(CreateElement('input', inputTag => {
						inputTag.classList.add('Accept');
						inputTag.classList.add(sellUnits ? 'Sell' : 'Buy');
						inputTag.setAttribute('type', 'submit');
						inputTag.setAttribute('name', 'acctrade');
						inputTag.setAttribute('value', sellUnits ? 'Sell' : 'Buy');
					}));
				}));
			}
			if (offerType.startsWith('Send') || offerType.endsWith('Personal')) {
				divTag.append(CreateElement('button', buttonTag => {
					buttonTag.setAttribute('href', `https://politicsandwar.com/index.php?id=26&${tdTags[6].querySelector('a').href.split('?')[1].split('&').filter(arg => arg.startsWith('tradedelid') || arg.startsWith('ver')).join('&')}`);
					buttonTag.setAttribute('checked', sellUnits);
					buttonTag.append(CreateElement('img', imgTag => imgTag.setAttribute('src', tdTags[6].querySelector('a img').src)));
					buttonTag.append(' Delete');
					// "this" doesn't work with an arrow function.
					buttonTag.onclick = async function () {
						this.disabled = true;
						await fetch(this.getAttribute('href'));
						const divTag = this.parentElement.parentElement;
						if (this.getAttribute('checked') === 'true') {
							myOffers.Money -= GetPrice(divTag) * GetQuantity(divTag);
						}
						else {
							myOffers[Capitalize([...divTag.classList].filter(x => x.length > 6)[0].slice(0, -5))] -= GetQuantity(divTag);
						}
						divTag.remove();
						if (!localStorage.getItem('Doc_VT_ZeroAccountability')) {
							UpdateLinks();
						}
					};
				}));
			}
		}));
	}));
}

function GenerateNationBio(divTag, tdTag, offerIsPublicOrEmbargo, offerWanted, wantedMessage) {
	if (offerIsPublicOrEmbargo) {
		if (offerWanted) {
			divTag.classList.add('Hide');
			divTag.append(CreateElement('b', bTag => bTag.append(wantedMessage)));
			return;
		}
	}
	else {
		if (!offerWanted) {
			divTag.classList.add('Hide');
		}
	}
	divTag.append(CreateElement('a', aTag => {
		aTag.setAttribute('href', tdTag.children[0].href);
		aTag.append(tdTag.children[0].textContent);
		aTag.append(CreateElement('img', imgTag => {
			imgTag.classList.add('tinyflag');
			imgTag.setAttribute('src', tdTag.children[0].children[0].src);
		}));
	}));
	divTag.append(document.createElement('br'));
	divTag.append(tdTag.children[1].nextSibling.textContent.trim());
	divTag.append(document.createElement('br'));
	if (tdTag.lastChild.href) {
		divTag.append(CreateElement('a', aTag => {
			aTag.setAttribute('href', tdTag.lastChild.href);
			aTag.append(tdTag.lastChild.textContent);
		}));
	}
	else {
		divTag.append(CreateElement('i', iTag => iTag.append('None')));
	}
}

function CalcUnits(offerType, sellerWanted, resource, quantity, price) {
	if (offerType.endsWith('Public') || offerType === 'Receive-Personal') {
		return Math.max(Math.min(Math.floor(sellerWanted ? resourceBar[resource] - MinAmount(resource) : (resourceBar.Money - MinAmount('Money')) / price), quantity), 0);
	}
	return quantity;
}

function GetQuantity(divTag) {
	return parseInt(divTag.querySelector('.Quantity').textContent.trim().replaceAll(',', ''));
}

// Won't be needed until Live Update is implemented
function SetQuantity(divTag, quantity) {
	divTag = divTag.querySelector('.Quantity');
	divTag.lastChild.remove();
	divTag.append(FormatNumber(quantity));
}

function GetPrice(divTag) {
	return parseInt(divTag.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', ''));
}

function FormatDate(date = new Date()) {
	let text = '';
	text += date.getHours().toString().padStart(2, 0);
	text += ':';
	text += date.getMinutes().toString().padStart(2, 0);
	text += ' ';
	text += date.getDate().toString().padStart(2, 0);
	text += '/';
	text += ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
	text += '/';
	text += date.getFullYear();
	return text;
}

function FormatNumber(number, digits = 0) {
	return number.toLocaleString('en-US', { maximumFractionDigits: digits });
}

function FormatMoney(money, digits = 0) {
	return money.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits })
}

async function InfiniteScroll() {
	if (marketType < 1 || !localStorage.getItem('Doc_VT_InfiniteScroll')) {
		return;
	}

	const { offset, pages } = (() => {
		const pTags = [...document.querySelectorAll('p.center')];
		const words = pTags[4].textContent.split(' ');
		const nums = words.splice(1, 2)[0].split('-').map(x => parseInt(x));
		if (nums[0]) {
			location.href = GetMinURL(0);
		}
		pTags[4].textContent = words.join(' ');

		pTags[2].append(pTags[3].children[4]);
		if (nums[1] < 50) {
			pTags[3].textContent = '';
			pTags[3].append(`Note: The game by default only loaded ${offset} trade offers.`);
			pTags[3].append(document.createElement('br'));
			pTags[3].append('We strongly recommend going to your ');
			pTags[3].append(CreateElement('a', aTag => {
				aTag.setAttribute('href', 'https://politicsandwar.com/account/#4');
				aTag.setAttribute('target', '_blank');
				aTag.append('Account');
			}));
			pTags[3].append(' settings and changing the default search results to 50,');
			pTags[3].append(document.createElement('br'));
			pTags[3].append('or if this was a link provided by some bot, that you ask the maximum query in the link to be set to at least 50, preferably 100.');
		}
		else {
			pTags[3].remove();
		}
		pTags[5].remove();

		return {
			offset: nums[1],
			pages: Math.ceil((parseInt(words[1]) - nums[1]) / 100)
		};
	})();
	if (!pages) {
		return;
	}

	for (let i = 0; i < pages; ++i) {
		console.time(`Load Page - ${i + 1}`);
		const doc = new DOMParser().parseFromString(await (await fetch(GetMinURL(100 * i + offset))).text(), 'text/html');
		console.timeEnd(`Load Page - ${i + 1}`);
		console.time('Convert Table');
		const trTags = [...doc.querySelectorAll('.nationtable tr')].slice(1);
		for (const trTag of trTags) {
			try {
				CreateRow([...trTag.children]);
			}
			catch (e) {
				console.error(e);
			}
		}
		console.timeEnd('Convert Table');
	}
}

function GetMinURL(min) {
	let minExists = false;
	let maxExists = false;
	const args = location.search.slice(1).split('&').map(arg => {
		if (arg.startsWith('minimum=')) {
			arg = `minimum=${min}`;
			minExists = true;
		}
		else if (arg.startsWith('maximum=')) {
			arg = 'maximum=100';
			maxExists = true;
		}
		return arg;
	});
	if (!minExists) {
		args.push(`minimum=${min}`);
	}
	if (!maxExists) {
		args.push('maximum=100');
	}
	return location.origin + location.pathname + '?' + args.join('&');
}

function AutoScroll() {
	if (marketType < 1 || currentResource === 'Money' || (location.search.slice(1).split('&').filter(arg => arg.startsWith('buysell='))[0] || '').length > 8) {
		document.querySelector('.Hide').scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
		return;
	}
	const divTag = document.querySelector('#Offers');
	(divTag.querySelector('p') || CreateElement('p', pTag => {
		divTag.insertBefore(pTag, CreateElement('hr', hrTag => divTag.insertBefore(hrTag, document.querySelector(`.${ascOrder ? 'b' : 's'}Offer`))));
		divTag.insertBefore(document.createElement('hr'), pTag);
		pTag.append(`Profit Gap: ${FormatMoney((GetPrice(pTag.nextElementSibling.nextElementSibling) - GetPrice(pTag.previousElementSibling.previousElementSibling)) * (ascOrder ? 1 : -1))}/Ton`);
	})).scrollIntoView({
		behavior: 'smooth',
		block: 'center'
	});
}

function Mistrade() {
	if (marketType < 2) {
		return false;
	}
	let checkOne = false;
	let checkTwo = false;
	location.search.slice(1).split('&').map(arg => arg.split('=')).forEach(arg => {
		if (arg[0] === 'buysell') {
			if (!arg[1].length) {
				checkOne = true;
			}
		}
		else if (arg[0] === 'resource1') {
			if (arg[1].length) {
				checkTwo = true;
			}
		}
	});
	if (checkOne && checkTwo) {
		const sellTag = ascOrder ? [...document.querySelectorAll('.sOffer')].pop() : document.querySelector('.sOffer');
		const buyTag = ascOrder ? document.querySelector('.bOffer') : [...document.querySelectorAll('.bOffer')].pop();
		if (!(sellTag && buyTag)) {
			return false;
		}
		if (GetPrice(sellTag) > GetPrice(buyTag)) {
			// Scroll To Mistrade!
			const misTag = (() => {
				const myTime = new Date().getTime() - 1000 * 60; // ms s
				const sellTime = new Date(sellTag.querySelector('.Date').textContent).getTime();
				const buyTime = new Date(buyTag.querySelector('.Date').textContent).getTime();
				if (sellTime > myTime || buyTag > myTime) {
					Sleep(0).then(() => {
						// Update Amounts
						const inputTag1 = sellTime > buyTime ? sellTag.querySelector('.Amount') : buyTag.querySelector('.Amount');
						const inputTag2 = sellTime > buyTime ? buyTag.querySelector('.Amount') : sellTag.querySelector('.Amount');
						if (inputTag1.value > inputTag2.value) {
							inputTag1.value = inputTag2.value;
						}
					});
					return sellTime > buyTime ? sellTag : buyTag;
				}
				return GetQuantity(sellTag) < GetQuantity(buyTag) ? sellTag : buyTag;
			})();
			misTag.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
			misTag.classList.add('Outline');


			// Switch Themes
			SetTheme(GetTheme() ? 0 : 2);

			// Announce that you detected a mistrade for Mistrade Detection Script.
			document.body.append(CreateElement('div', divTag => {
				divTag.setAttribute('id', 'Doc_Scrolled');
				divTag.style.setProperty('display', 'none');
			}));
			return true;
		}
	}
	return false;
}

function CreateMarketLinks() {
	const offerSide = parseInt(localStorage.getItem('Doc_MarketView'));
	[...document.querySelectorAll('#resource-column a')].forEach(aTag => {
		aTag.setAttribute('href', MarketLink(aTag.textContent.replaceAll('$', '').trim().slice(0, -1), offerSide));
	})
	return CreateElement('p', pTag => {
		pTag.setAttribute('id', 'MarketLinks');
		pTag.append(MarketTag('Oil', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Coal', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Iron', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Bauxite', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Lead', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Uranium', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Food', offerSide));
		pTag.append(document.createElement('br'));
		pTag.append(MarketTag('Gasoline', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Steel', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Aluminum', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Munitions', offerSide));
		pTag.append(' | ');
		pTag.append(MarketTag('Credits', offerSide));
		pTag.append(document.createElement('br'));
		pTag.append(CreateElement('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/index.php?id=26&display=nation&resource1=&buysell=&ob=date&od=DESC&maximum=100&minimum=0&search=Go');
			aTag.append('My Trades');
		}));
		pTag.append(' | ');
		pTag.append(CreateElement('a', aTag => {
			aTag.append('Activity');
			// "this" doesn't work with an arrow function.
			aTag.onclick = function () {
				this.parentElement.querySelector('input[type="submit"]').click();
			}
		}));
		pTag.append(CreateElement('form', formTag => {
			formTag.setAttribute('action', `https://politicsandwar.com/nation/id=${nationID}&display=trade`);
			formTag.setAttribute('method', 'POST');
			formTag.append(CreateElement('input', inputTag => {
				inputTag.setAttribute('type', 'number');
				inputTag.setAttribute('name', 'maximum');
				inputTag.setAttribute('value', 1000);
			}));
			formTag.append(CreateElement('input', inputTag => {
				inputTag.setAttribute('type', 'number');
				inputTag.setAttribute('name', 'minimum');
				inputTag.setAttribute('value', 0);
			}));
			formTag.append(CreateElement('input', inputTag => {
				inputTag.setAttribute('type', 'submit');
				inputTag.setAttribute('name', 'search');
				inputTag.setAttribute('value', 'Go');
			}));
		}));
	});
}

function UpdateMarketLinks() {
	const pTag = document.querySelector('#MarketLinks');
	const hrTag = pTag.nextElementSibling;
	pTag.remove();
	hrTag.parentElement.insertBefore(CreateMarketLinks(), hrTag)
}

function InjectMarketLinks() {
	const formTag = document.querySelector('#rightcolumn form[method="GET"]');
	formTag.parentElement.insertBefore(CreateMarketLinks(), formTag);
	formTag.parentElement.insertBefore(document.createElement('hr'), formTag);
}

function MarketTag(resource, offerSide) {
	return CreateElement('a', aTag => {
		aTag.setAttribute('href', MarketLink(resource, offerSide));
		aTag.append(CreateElement('img', imgTag => {
			if (resource === 'Food') {
				imgTag.setAttribute('src', 'https://politicsandwar.com/img/icons/16/steak_meat.png');
			}
			else if (resource === 'Credits') {
				imgTag.setAttribute('src', 'https://politicsandwar.com/img/icons/16/point_gold.png');
			}
			else {
				imgTag.setAttribute('src', `https://politicsandwar.com/img/resources/${resource.toLowerCase()}.png`);
			}
		}));
		aTag.append(` ${resource}`);
		if (localStorage.getItem(`Doc_VT_ReGain_${Capitalize(resource)}`)) {
			aTag.append('*');
		}
	});
}

function MarketLink(resource, offerSide) {
	if (resource === 'Money') {
		return 'https://politicsandwar.com/index.php?id=26&display=nation&resource1=&buysell=&ob=date&od=DESC&maximum=100&minimum=0&search=Go';
	}
	return `https://politicsandwar.com/index.php?id=26&display=world&resource1=${resource.toLowerCase()}&buysell=${offerSide ? 'sell' : (offerSide === 0 ? 'buy' : '')}&ob=price&od=DEF&maximum=100&minimum=0&search=Go`;
}

function ReGain() {
	const pTag = (document.querySelector('img[alt="Success"]') || { parentElement: null }).parentElement;
	if (!pTag) {
		return;
	}
	pTag.parentElement.parentElement.insertBefore(document.createElement('hr'), pTag.nextElementSibling);
	const words = ReplaceAll(pTag.textContent.trim(), '  ', ' ').split(' ');
	if (words[2] !== 'accepted') {
		return;
	}

	pTag.setAttribute('id', 'ReGain');
	let profit = 0;
	let quantity = parseInt(words[8].replaceAll(',', ''));
	const price = parseInt(words[14].slice(1, -1).replaceAll(',', '')) / quantity;
	const bought = words[7] === 'bought';
	const key = `Doc_VT_ReGain_${Capitalize(words[9].slice(0, -1))}`;
	const data = JSON.parse(localStorage.getItem(key));
	pTag.append(` ${FormatMoney(price)}/Ton.`);
	pTag.append(document.createElement('br'));

	if (data && data.bought !== bought) {
		for (const i in data.levels) {
			if ((!bought && price > data.levels[i].price) || (bought && price < data.levels[i].price)) {
				const amount = Math.min(data.levels[i].quantity, quantity);
				profit += amount * Math.abs(data.levels[i].price - price);
				data.levels[i].quantity -= amount;
				quantity -= amount;
			}
			if (!quantity) {
				break;
			}
		}
		data.levels = data.levels.filter(level => level.quantity);
	}

	/* One would think that based off the if statement above we'd only need to check if quantity was true-ish,
	   but in the one circumstance where the User sells a quantity at a price below the levels, either partly or fully below,
	   there would still be levels left to be regained and quantity left over. In this case we would not want to offer the button.
	   This circumstance also applies in the reverse. Where the User buys a quantity at a price above the levels.*/
	let buttonExists = false;
	if (quantity && (!data || data.bought === bought || !data.levels.length)) {
		buttonExists = true;
		pTag.append(CreateElement('a', aTag => {
			aTag.setAttribute('id', 'Doc_ReGain');
			aTag.append(`Re${bought ? 'sell' : 'buy'} for Profit?`);
			aTag.onclick = () => {
				const data = JSON.parse(localStorage.getItem(key));
				if (data) {
					const index = data.levels.findIndex(level => level.price === price);
					if (index > -1) {
						data.levels[index].quantity += quantity;
					}
					else {
						data.levels.push({
							quantity: quantity,
							price: price
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
						bought: bought,
						levels: [
							{
								quantity: quantity,
								price: price
							}
						]
					}));
				}
				aTag.remove();
				UpdateReGainStats();
			};
		}));
	}
	else if (data) {
		if (data.levels.length) {
			localStorage.setItem(key, JSON.stringify(data));
		}
		else {
			localStorage.removeItem(key);
		}
	}

	if (profit) {
		if (buttonExists) {
			pTag.append(' | ');
		}
		pTag.append(`Made ${FormatMoney(profit, 2)} Profit.`);
	}
}

function InjectReGainStats(divTag) {
	const formTag = document.querySelector('#rightcolumn form[method="GET"]');
	formTag.parentElement.insertBefore(divTag, formTag);
	formTag.parentElement.insertBefore(document.querySelector('hr'), formTag);
}

function UpdateReGainStats() {
	const hrTag = (document.querySelector('#RegainStats') || { nextElementSibling: null }).nextElementSibling;
	if (hrTag) {
		hrTag.previousElementSibling.remove();
	}
	const divTag = CreateReGainStats();
	if (divTag) {
		if (hrTag) {
			hrTag.parentElement.insertBefore(divTag, hrTag);
		}
		else {
			InjectReGainStats(divTag);
		}
	}
}

function CreateReGainStats() {
	if (currentResource === 'Money') {
		return;
	}
	const data = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
	if (!data) {
		return;
	}
	return CreateElement('div', divTag => {
		divTag.setAttribute('id', 'RegainStats');
		for (const level of data.levels) {
			divTag.append(CreateElement('p', pTag => {
				pTag.append(`${data.bought ? 'Bought' : 'Sold'} ${FormatNumber(level.quantity)} Ton${level.quantity > 1 ? 's' : ''} @ `);
				pTag.append(FormatMoney(level.price));
				pTag.append('/ton | ');
				pTag.append(CreateElement('a', aTag => {
					aTag.append('Forget');
					// "this" doesn't work with an arrow function.
					aTag.onclick = function () {
						const price = parseInt(this.parentElement.childNodes[1].textContent.slice(1).replaceAll(',', ''));
						const data = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
						data.levels = data.levels.filter(level => level.price !== price);
						if (data.levels.length) {
							localStorage.setItem(`Doc_VT_ReGain_${currentResource}`, JSON.stringify(data));
							this.parentElement.remove();
						}
						else {
							localStorage.removeItem(`Doc_VT_ReGain_${currentResource}`);
							const divTag = this.parentElement.parentElement;
							divTag.nextElementSibling.remove();
							divTag.remove();
							UpdateMarketLinks();
						}
					};
				}));
			}));
		}
		if (data.levels.length > 1) {
			divTag.append(CreateElement('a', aTag => {
				aTag.append('Forget All');
				// "this" doesn't work with an arrow function.
				aTag.onclick = function () {
					localStorage.removeItem(`Doc_VT_ReGain_${currentResource}`);
					const divTag = this.parentElement;
					divTag.nextElementSibling.remove();
					divTag.remove();
					UpdateMarketLinks();
				};
			}));
		}
	});
}

/* Start
-------------------------*/
async function Main() {
	console.time('Convert Table');
	CreateElement('div', divTag => {
		divTag.setAttribute('id', 'Offers');
		const tableTag = document.querySelector('.nationtable');
		tableTag.parentElement.insertBefore(divTag, tableTag);

		const trTags = [...tableTag.querySelectorAll('tr')].slice(1);
		for (const trTag of trTags) {
			try {
				CreateRow([...trTag.children]);
			}
			catch (e) {
				console.error(e);
			}
		}
		tableTag.remove();
	});
	console.timeEnd('Convert Table');
	const mistradeExists = Mistrade();
	ReGain();
	InjectMarketLinks();
	UpdateReGainStats();
	await InfiniteScroll();
	if (mistradeExists && document.querySelector('#ReGain')) {
		document.querySelector('#Doc_ReGain').click();
	}
	else if (!(mistradeExists || Mistrade())) {
		const pTag = document.querySelector('#ReGain');
		if (pTag) {
			pTag.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
			await Sleep(3000);
		}
		AutoScroll();
	}
	console.time('Updating');
	UpdateQuantities();
	UpdateLinks();
	console.timeEnd('Updating');
}

if (marketType > -1) {
	try {
		Main();
	}
	catch (e) {
		console.error(e);
	}
}