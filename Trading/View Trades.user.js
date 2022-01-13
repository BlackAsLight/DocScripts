// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      4.4
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @match        https://politicsandwar.com/nation/trade/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Global Variables
-------------------------*/
const sellColor = '#5cb85c';
const buyColor = '#337ab7';
const nationLink = Array.from(document.getElementsByTagName('a')).filter(x => x.textContent == 'View')[0].href;

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

// NegOne = None
// Zero = Personal
// One = Alliance
// Two = World
const marketType = (() => {
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
})();

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

	// Toggle Zero Accountability
	leftColumn.appendChild((() => {
		const codeTag = document.createElement('code');
		codeTag.innerText = 'Zero Accountability: ';
		codeTag.appendChild((() => {
			const inputTag = document.createElement('input');
			inputTag.type = 'checkbox';
			if (localStorage.getItem('Doc_VT_ZeroAccountability')) {
				inputTag.checked = true;
			}
			inputTag.onchange = () => {
				if (inputTag.checked) {
					localStorage.setItem('Doc_VT_ZeroAccountability', true);
				}
				else {
					localStorage.removeItem('Doc_VT_ZeroAccountability');
				}
				UpdateLinks();
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

function ConvertRow(tdTags) {
	const resource = tdTags[4].children[0].getAttribute('title');
	if (myOffers[resource] === undefined) {
		myOffers[resource] = 0;
	}
	const quantity = parseInt(tdTags[4].textContent.trim().replaceAll(',', ''));
	const price = parseInt(tdTags[5].textContent.trim().split(' ')[0].replaceAll(',', ''));
	const isSellOffer = tdTags[1].childElementCount === 1;
	const isBuyOffer = tdTags[2].childElementCount === 1;
	const amount = isSellOffer ? Math.max(Math.min(Math.floor(resources[resource]), quantity), 0) : Math.max(Math.floor(Math.min(resources.Money, quantity * price) / price), 0);
	document.querySelector('#Offers').append((() => {
		const divTag = document.createElement('div');
		divTag.className = `Offer ${isSellOffer ? 'sOffer' : 'bOffer'}`;
		divTag.append((() => {
			const divTag = document.createElement('div');
			divTag.className = 'Nations';
			divTag.style.gridArea = 'Nations';
			// Is this an open offer?
			if (isSellOffer || isBuyOffer) {
				divTag.append((() => {
					const divTag = document.createElement('div');
					divTag.className = 'Hide';
					divTag.style.gridArea = isSellOffer ? 'Left' : 'Right';
					divTag.append((() => {
						const bTag = document.createElement('b');
						bTag.append(`${isSellOffer ? 'SELL' : 'BUY'}ERS WANTED`);
						return bTag;
					})());
					return divTag;
				})());
				divTag.append((() => {
					const divTag = document.createElement('div');
					divTag.style.gridArea = isSellOffer ? 'Right' : 'Left';
					GenerateNationInfo(divTag, tdTags[isSellOffer + 1]);
					return divTag;
				})());
			}
			else {
				const sellerIsYou = tdTags[1].children[0].href == nationLink;
				divTag.append((() => {
					const divTag = document.createElement('div');
					if (sellerIsYou) {
						divTag.className = 'Hide';
					}
					divTag.style.gridArea = 'Left';
					GenerateNationInfo(divTag, tdTags[1]);
					return divTag;
				})());
				divTag.append((() => {
					const divTag = document.createElement('div');
					if (!sellerIsYou) {
						divTag.className = 'Hide';
					}
					divTag.style.gridArea = 'Right';
					GenerateNationInfo(divTag, tdTags[2]);
					return divTag;
				})());
			}
			return divTag;
		})());
		divTag.append((() => {
			const divTag = document.createElement('div');
			divTag.className = 'Quantity';
			divTag.style.gridArea = 'Quantity';
			divTag.append((() => {
				const imgTag = document.createElement('img');
				imgTag.src = tdTags[4].children[0].src;
				return imgTag;
			})());
			divTag.append(` ${quantity.toLocaleString()}`);
			return divTag;
		})());
		divTag.append((() => {
			const divTag = document.createElement('div');
			divTag.className = 'Price';
			divTag.style.gridArea = 'Price';
			divTag.append(`$${price.toLocaleString()}/Ton`);
			divTag.append((() => {
				const divTag = document.createElement('div');
				divTag.append(`$${(price * amount).toLocaleString()}`);
				return divTag;
			})());
			return divTag;
		})());
		divTag.append((() => {
			const divTag = document.createElement('div');
			divTag.style.gridArea = 'Create';
			if (tdTags[6].children[0].tagName == 'A') {
				divTag.append((() => {
					const aTag = document.createElement('a');
					aTag.className = `${isSellOffer ? 's' : 'b'}TopUp_${resource}`;
					aTag.append('TopUp');
					return aTag;
				})());
				if (isSellOffer) {
					myOffers.Money += price * quantity;
				}
				else {
					myOffers[resource] += quantity;
				}
			}
			else {
				divTag.append((() => {
					const aTag = document.createElement('a');
					aTag.className = `${isSellOffer ? 's' : 'b'}Outbid_${resource}`;
					aTag.append('Outbid');
					return aTag;
				})());
				divTag.append(document.createElement('br'));
				divTag.append((() => {
					const aTag = document.createElement('a');
					aTag.className = `${isSellOffer ? 's' : 'b'}Match_${resource}`;
					aTag.append('Match');
					return aTag;
				})());
			}
			return divTag;
		})());
		// Is this somebody else's offer that you can accept?
		if (tdTags[6].children[0].tagName == 'FORM') {
			divTag.append((() => {
				const divTag = document.createElement('div');
				divTag.style.gridArea = 'Form';
				divTag.append((() => {
					const formTag = document.createElement('form');
					formTag.method = 'POST';
					formTag.append((() => {
						const inputTag = document.createElement('input');
						inputTag.type = 'hidden';
						inputTag.name = 'tradeaccid';
						inputTag.value = tdTags[6].children[0].children[0].value;
						return inputTag;
					})());
					formTag.append((() => {
						const inputTag = document.createElement('input');
						inputTag.type = 'hidden';
						inputTag.name = 'ver';
						inputTag.value = tdTags[6].children[0].children[1].value;
						return inputTag;
					})());
					formTag.append((() => {
						const inputTag = document.createElement('input');
						inputTag.type = 'hidden';
						inputTag.name = 'token';
						inputTag.value = tdTags[6].children[0].children[2].value;
						return inputTag;
					})());
					formTag.append((() => {
						const inputTag = document.createElement('input');
						inputTag.className = 'tradeForm';
						inputTag.type = 'number';
						inputTag.name = 'rcustomamount';
						inputTag.value = amount;
						inputTag.onchange = UpdateTotal;
						return inputTag;
					})());
					formTag.append((() => {
						const inputTag = document.createElement('input');
						inputTag.className = `tradeForm ${isSellOffer ? 's' : 'b'}Submit`;
						inputTag.type = 'submit';
						inputTag.name = 'acctrade';
						inputTag.value = isSellOffer ? 'Sell' : 'Buy';
						return inputTag;
					})());
					return formTag;
				})());
				return divTag;
			})());
		}
		// Is this your offer?
		else if (tdTags[6].children[0].tagName == 'A') {
			divTag.append((() => {
				const divTag = document.createElement('div');
				divTag.style.gridArea = 'Form';
				divTag.append((() => {
					const bTag = document.createElement('b');
					bTag.className = 'Show';
					bTag.append(isSellOffer ? 'BUYING' : 'SELLING');
					return bTag;
				})());
				divTag.append((() => {
					const buttonTag = document.createElement('button');
					buttonTag.className = 'btn btn-danger';
					buttonTag.append((() => {
						const divTag = document.createElement('div');
						divTag.style.display = 'none';
						divTag.append(`${tdTags[6].children[0].href} ${isSellOffer} ${resource}`);
						return divTag;
					})());
					buttonTag.append(tdTags[6].children[0].children[0].children[0]);
					buttonTag.append(' Delete');
					buttonTag.onclick = DeleteOffer;
					return buttonTag;
				})());
				return divTag;
			})());
		}
		// This is a an offer that you cannot accept due to an embargo or is one of your accepted offers.
		else {
			divTag.append((() => {
				const divTag = document.createElement('div');
				divTag.style.gridArea = 'Form';
				divTag.append(tdTags[6].children[0]);
				if (tdTags[6].childElementCount > 1) {
					divTag.append(document.createElement('br'));
					divTag.append((() => {
						const bTag = document.createElement('b');
						bTag.append(tdTags[1].children[0].href == nationLink ? ' SOLD' : ' BOUGHT');
						return bTag;
					})());
					divTag.append(document.createElement('br'));
					divTag.append(`${tdTags[6].children[1].childNodes[0].textContent} ${tdTags[6].children[1].childNodes[2].textContent}`);
				}
				return divTag;
			})());
		}
		divTag.append((() => {
			const divTag = document.createElement('div');
			divTag.className = 'Date';
			divTag.style.gridArea = 'Date';
			divTag.append(`${tdTags[3].childNodes[0].textContent} ${tdTags[3].childNodes[2].textContent}`);
			return divTag;
		})());
		return divTag;
	})());
}

function GenerateNationInfo(divTag, tdTag) {
	divTag.append((() => {
		const aTag = document.createElement('a');
		aTag.href = tdTag.children[0].href
		aTag.append(tdTag.children[0].textContent)
		aTag.append((() => {
			const imgTag = document.createElement('img');
			imgTag.className = 'tinyflag';
			imgTag.src = tdTag.children[0].children[0].src;
			return imgTag;
		})())
		return aTag;
	})());
	divTag.append(document.createElement('br'));
	divTag.append(tdTag.children[1].nextSibling.textContent.trim());
	divTag.append(document.createElement('br'));
	divTag.append((() => {
		const aTag = document.createElement('a');
		aTag.href = tdTag.lastChild.href;
		aTag.append(tdTag.lastChild.textContent);
		return aTag;
	})());
}

function UpdateTotal(inputTag) {
	if (inputTag.target) {
		inputTag = this;
	}
	if (inputTag.value.toString().indexOf('.') >= 0) {
		inputTag.value = Math.floor(inputTag.value);
	}
	const divTag = inputTag.parentElement.parentElement.parentElement.children[2];
	const price = parseInt(divTag.textContent.slice(1).split('/')[0].replaceAll(',', ''));
	divTag.children[0].textContent = `$${(price * inputTag.value).toLocaleString()}`;
}

async function DeleteOffer() {
	this.disabled = true;
	const data = this.children[0].textContent.split(' ');
	await fetch(data.shift());
	const divTag = this.parentElement.parentElement;
	console.log(myOffers[data[1]]);
	myOffers[data[1]] -= (data[0] == 'true' ? parseInt(divTag.textContent.slice(1).split('/')[0].replaceAll(',', '')) : 1) * parseInt(divTag.children[1].textContent.trim().replaceAll(',', ''));
	console.log(myOffers[data[1]]);
	divTag.remove();
	if (!localStorage.getItem('Doc_VT_ZeroAccountability')) {
		UpdateLinks();
	}
}

function Mistrade() {
	if (marketType === 2 && (() => {
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
		return checkOne && checkTwo;
	})()) {
		const favouringSelling = document.querySelector('.Hide').textContent === 'SELLERS WANTED';
		const sellTag = favouringSelling ? Array.from(document.querySelectorAll('.sOffer')).pop() : document.querySelector('.sOffer');
		const buyTag = favouringSelling ? document.querySelector('.bOffer') : Array.from(document.querySelectorAll('.bOffer')).pop();
		if (!(sellTag && buyTag)) {
			return false;
		}
		if (parseInt(sellTag.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', '')) > parseInt(buyTag.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', ''))) {
			(new Date(sellTag.querySelector('.Date').textContent).getTime() > new Date(buyTag.querySelector('.Date').textContent).getTime() ? sellTag : buyTag).scrollIntoView({
				behavour: 'smooth',
				block: 'center'
			});
			// TODO: Add CSS for outline to highlight the mistrade.
			const linkTag = Array.from(document.querySelectorAll('link')).filter(x => x.href === 'https://politicsandwar.com/css/dark-theme.css')[0];
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
			const aTag = document.querySelector('#Doc_ReGain');
			if (aTag) {
				aTag.click();
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
	return false;
}

function MarketLinks() {
	const formTag = Array.from(document.getElementById('rightcolumn').children).filter(tag => tag.tagName == 'FORM')[0];
	formTag.parentElement.insertBefore((() => {
		const pTag = document.createElement('P');
		pTag.style.textAlign = 'center';
		pTag.append(MarketLink('Oil'));
		pTag.append(' | ');
		pTag.append(MarketLink('Coal'));
		pTag.append(' | ');
		pTag.append(MarketLink('Iron'));
		pTag.append(' | ');
		pTag.append(MarketLink('Bauxite'));
		pTag.append(' | ');
		pTag.append(MarketLink('Lead'));
		pTag.append(' | ');
		pTag.append(MarketLink('Uranium'));
		pTag.append(' | ');
		pTag.append(MarketLink('Food'));
		pTag.append(document.createElement('br'));
		pTag.append(MarketLink('Gasoline'));
		pTag.append(' | ');
		pTag.append(MarketLink('Steel'));
		pTag.append(' | ');
		pTag.append(MarketLink('Aluminum'));
		pTag.append(' | ');
		pTag.append(MarketLink('Munitions'));
		pTag.append(' | ');
		pTag.append(MarketLink('Credits'));
		pTag.append(document.createElement('br'));
		pTag.append((() => {
			const aTag = document.createElement('a');
			aTag.href = 'https://politicsandwar.com/index.php?id=26&display=nation&resource1=&buysell=&ob=date&od=DESC&maximum=100&minimum=0&search=Go';
			aTag.append('Personal Trades');
			return aTag;
		})());
		return pTag;
	})(), formTag);
	formTag.parentElement.insertBefore(document.createElement('hr'), formTag);
}

function MarketLink(resource) {
	const aTag = document.createElement('a');
	aTag.id = `ML_${resource}`;
	aTag.href = `https://politicsandwar.com/index.php?id=90&display=world&resource1=${resource.toLowerCase()}&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go`;
	aTag.append((() => {
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

function ReGain() {
	const pTag = (() => {
		const imgTag = document.querySelector('img[alt="Success"]');
		if (imgTag) {
			return imgTag.parentElement;
		}
	})();
	if (!pTag) {
		return;
	}
	pTag.className = 'ReGain';
	const text = ReplaceAll(pTag.textContent.trim(), '  ', ' ').split(' ');
	if (text[2] !== 'accepted') {
		return;
	}
	let quantity = parseInt(text[8].replaceAll(',', ''));
	const price = parseInt(text[14].slice(1, -1).replaceAll(',', '')) / quantity;
	const bought = text[7] === 'bought';
	const key = `Doc_VT_ReGain_${text[9][0].toUpperCase() + text[9].slice(1, -1).toLowerCase()}`;
	let data = JSON.parse(localStorage.getItem(key));
	let profit = 0;

	// Update Info if transaction was made in profit.
	if (data && data.bought != bought) {
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

	pTag.append(` $${price.toLocaleString()}/ton.`);
	// Add Re-Sell/Buy for Profit Button.
	pTag.append(document.createElement('br'));
	data = JSON.parse(localStorage.getItem(key));
	let buttonExists = false;
	if ((!data || data.bought == bought) && quantity) {
		pTag.append((() => {
			buttonExists = true;
			const aTag = document.createElement('a');
			aTag.id = 'Doc_ReGain';
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
				MiddleScroll();
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
	return buttonExists;
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
		document.querySelector('#RegainLevelDiv').remove();
		document.querySelector('#RegainLevelHr').remove();
	}
	else {
		let data = JSON.parse(localStorage.getItem(key));
		data.levels = data.levels.filter(x => x.price != price);
		if (data.levels.length) {
			localStorage.setItem(key, JSON.stringify(data));
			document.querySelector(`#RegainLevel${i}`).remove();
		}
		else {
			localStorage.removeItem(key);
			document.querySelector('#RegainLevelDiv').remove();
			document.querySelector('#RegainLevelHr').remove();
		}
	}
	UpdateQuantities();
}

async function InfiniteScroll() {
	if (marketType > 0 && localStorage.getItem('Doc_VT_InfiniteScroll')) {
		const pTags = Array.from(document.querySelectorAll('p.center'))
		const alreadyLoaded = (() => {
			const nums = pTags[4].textContent.split(' ')[1].split('-');
			if (nums[0] !== '0') {
				location.href = GetURL(0);
			}
			return parseInt(nums[1]);
		})();
		const pagesToLoad = (() => {
			const text = pTags[4].textContent.split(' ');
			text.splice(1, 2);
			pTags[4].innerText = text.join(' ');
			return Math.ceil((parseInt(text[1]) - alreadyLoaded) / 100);
		})();
		pTags[2].append(pTags[3].children[4]);
		pTags[5].parentElement.removeChild(pTags[5]);
		if (alreadyLoaded < 50) {
			pTags[3].innerText = `Note: The game by default only loaded ${alreadyLoaded} trade offers.`;
			pTags[3].append(document.createElement('br'));
			pTags[3].append('We strongly recommend going to your ');
			pTags[3].append((() => {
				const aTag = document.createElement('a');
				aTag.target = '_blank';
				aTag.href = 'https://politicsandwar.com/account/#4';
				aTag.innerText = 'Account';
				return aTag;
			})());
			pTags[3].append(' settings and changing the default search results to 50,');
			pTags[3].append(document.createElement('br'));
			pTags[3].append('or if this was a link provided by some bot, that you ask the maximum query in the link to be set to at least 50, preferably 100.');
		}
		else {
			pTags[3].parentElement.removeChild(pTags[3]);
		}

		if (pagesToLoad) {
			for (let i = 0; i < pagesToLoad; ++i) {
				const url = GetURL(100 * i + alreadyLoaded);
				console.time(`Load Page - ${i + 1}`);
				const doc = new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
				console.timeEnd(`Load Page - ${i + 1}`);
				console.time('Convert Table');
				let trTags = Array.from(doc.querySelector('.nationtable').children[0].children).slice(1);
				while (trTags.length) {
					const trTag = trTags.shift();
					try {
						ConvertRow(Array.from(trTag.children));
					}
					catch (e) {
						console.error(trTag, e);
					}
				}
				console.timeEnd('Convert Table');
			}
		}
	}
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

function MiddleScroll() {
	if (marketType > 0 && (() => {
		let args = location.search.slice(1).split('&');
		let checkOne = false;
		let checkTwo = false;
		while (args.length) {
			const arg = args.shift().split('=');
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
		}
		return checkOne && checkTwo;
	})()) {
		Array.from(document.querySelectorAll(`.${document.querySelector('.Hide').textContent === 'SELLERS WANTED' ? 's' : 'b'}Offer`)).pop().scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
	}
}

async function Sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true);
		}, ms);
	});
}

function UpdateQuantities() {
	if (currentResource !== 'Money') {
		const json = JSON.parse(localStorage.getItem(`Doc_VT_ReGain_${currentResource}`));
		if (json) {
			let divTags = Array.from(document.querySelectorAll('.Offer'));
			while (divTags.length) {
				const divTag = divTags.shift();
				const inputTag = divTag.querySelector('input[name="rcustomamount"]');
				if (inputTag && divTag.querySelector('.Hide').textContent === 'SELLERS WANTED' === json.bought) {
					const offerPrice = parseInt(divTag.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', ''));
					let quantity = 0;
					for (let i = 0; i < json.levels.length; ++i) {
						if ((json.bought && offerPrice > json.levels[i].price) || (!json.bought && offerPrice < json.levels[i].price)) {
							quantity += json.levels[i].quantity;
						}
					}
					inputTag.value = Math.min(parseInt(inputTag.value), quantity);
				}
			}
		}
	}
}

function UpdateLinks() {
	for (let resource in myOffers) {
		if (resource === 'Money') {
			continue;
		}
		for (let i = 0; i < 2; ++i) {
			let aTags = Array.from(document.querySelectorAll(`.${i % 2 ? 's' : 'b'}Outbid_${resource}`));
			while (aTags.length) {
				const aTag = aTags.shift();
				const price = parseInt(aTag.parentElement.parentElement.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', ''));
				const link = CreateOfferLink(resource, price + (i % 2 ? 1 : -1), i % 2);
				if (link) {
					aTag.href = link;
					aTag.style.display = 'inline';
				}
				else {
					aTag.style.display = 'none';
				}
			}
			aTags = Array.from(document.querySelectorAll(`.${i % 2 ? 's' : 'b'}Match_${resource}`)).concat(Array.from(document.querySelectorAll(`.${i % 2 ? 's' : 'b'}TopUp_${resource}`)));
			while (aTags.length) {
				const aTag = aTags.shift();
				const price = parseInt(aTag.parentElement.parentElement.querySelector('.Price').textContent.slice(1).split('/')[0].replaceAll(',', ''));
				const link = CreateOfferLink(resource, price, i % 2);
				if (link) {
					aTag.href = link;
					aTag.style.display = 'inline';
				}
				else {
					aTag.style.display = 'none';
				}
			}
		}
	}
}

function CreateOfferLink(resource, price, isSellOffer) {
	const quantity = (() => {
		if (localStorage.getItem('Doc_VT_ZeroAccountability')) {
			return Math.max(Math.floor(isSellOffer ? (resources.Money + MinAmount('Money')) / price : resources[resource] + MinAmount(resource)), 0);
		}
		return Math.max(Math.floor(isSellOffer ? (resources.Money - myOffers.Money) / price : resources[resource] - myOffers[resource]), 0);
	})();
	if (quantity > 0) {
		return `https://politicsandwar.com/nation/trade/create/?resource=${resource.toLowerCase()}&p=${price}&q=${quantity}&t=${isSellOffer ? 'b' : 's'}`;
	}
}

/* Start
-------------------------*/
(() => {
	const styleTag = document.createElement('style');
	styleTag.append('#Offers { text-align: center;; }');
	styleTag.append('.Offer:nth-child(2n) { background: #d2d3e8; }');
	styleTag.append('.Offer { display: grid; grid-template-columns: repeat(8, 1fr); align-items: center; grid-gap: 1em; padding: 1em}');
	styleTag.append('.Nations { display: grid; grid-template-columns: repeat(2, 1fr); grid-template-areas: "Left Right"; align-items: center; grid-gap: 1em; }')
	styleTag.append('.sOffer { grid-template-areas: "Nations Nations Nations Nations Date Quantity Price Form" "Nations Nations Nations Nations Date Quantity Create Form"; }');
	styleTag.append('.bOffer { grid-template-areas: "Nations Nations Nations Nations Date Quantity Price Form" "Nations Nations Nations Nations Date Quantity Create Form"; }');
	styleTag.append('.Show { display: none; }');
	styleTag.append('@media only screen and (max-width: 991px) { .Show { display: block; } .Hide { display: none; } .Nations { grid-template-columns: 1fr; grid-template-areas: "Left" "Right"; } .Offer { grid-template-columns: repeat(6, 1fr); grid-template-areas: "Nations Nations Date Quantity Price Form" "Nations Nations Date Quantity Create Form"; } }');
	styleTag.append('@media only screen and (max-width: 600px) { .Offer { grid-template-columns: repeat(4, 1fr); grid-template-areas: "Nations Quantity Price Form" "Nations Date Create Form"; } }');
	styleTag.append('@media only screen and (max-width: 440px) { .Offer { grid-template-columns: repeat(3, 1fr); grid-template-areas: "Nations Quantity Form" "Nations Price Form" "Nations Create Form" "Date Date Date"; } }');
	styleTag.append('.Offer input { transition: 300ms; }');
	styleTag.append('.Offer input:hover, .Offer input:focus { border-radius: 10px; }');
	styleTag.append('.Offer input.sSubmit { background-color: #5cb85c; }');
	styleTag.append('.Offer input.bSubmit { background-color: #337ab7; }');
	styleTag.append('.ReGain { text-align: center; }');
	document.head.append(styleTag);
})();

async function Main() {
	console.time('Convert Table');
	const divTag = (() => {
		const divTag = document.createElement('div');
		divTag.id = 'Offers';
		const tableTag = document.querySelector('.nationtable');
		tableTag.parentElement.insertBefore(divTag, tableTag);

		let trTags = Array.from(tableTag.children[0].children).slice(1);
		while (trTags.length) {
			const trTag = trTags.shift();
			try {
				ConvertRow(Array.from(trTag.children));
				trTag.remove();
			}
			catch (e) {
				console.error(trTag, e);
			}
		}
		tableTag.remove();
		return divTag;
	})();
	console.timeEnd('Convert Table');
	const mistradeExists = Mistrade();
	MarketLinks();
	const buttonExists = ReGain();
	ReGainCurrentLevels();
	await InfiniteScroll();
	if (!(mistradeExists || Mistrade() || buttonExists)) {
		if (buttonExists === false) {
			await Sleep(1500);
		}
		MiddleScroll();
	}
	console.time('Updating');
	UpdateQuantities();
	UpdateLinks();
	console.timeEnd('Updating');
}

if (marketType > -1) {
	Main();
}