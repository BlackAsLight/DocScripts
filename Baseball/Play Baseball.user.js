// ==UserScript==
// @name         Doc: Play Baseball
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      2.3
// @description  Makes Playing Baseball Better
// @author       BlackAsLight
// @match        https://politicsandwar.com/obl/host/*
// @match        https://politicsandwar.com/obl/play/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_Baseball')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', divTag => {
	divTag.setAttribute('id', 'Doc_Baseball');
	divTag.style.setProperty('display', 'none');
}));

/* Migration
-------------------------*/
async function Migration() {
	const nationIDs = (JSON.parse(localStorage.getItem('Doc_SB_Books')) || []).filter(book => book.leaderName === undefined).map(book => book.nationID);
	while (nationIDs.length) {
		const subNationIDs = nationIDs.splice(0, 500);
		const nations = JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={nations(id:[${subNationIDs.join(',')}]){data{id leader_name}}}`)).text()).data.nations.data;
		const books = JSON.parse(localStorage.getItem('Doc_SB_Books'));
		for (const nation of nations) {
			(books.find(book => book.nationID === parseInt(nation.id)) || {}).leaderName = nation.leader_name;
		}
		localStorage.setItem('Doc_SB_Books', JSON.stringify(books.filter(book => book.leaderName)));
	}
}

/* Global Variables
-------------------------*/
const teamID = parseInt([...document.querySelectorAll('#leftcolumn a')].filter(aTag => aTag.href.includes('/obl/team/id'))[0].href.split('=')[1])
const isHost = location.href.startsWith('https://politicsandwar.com/obl/host/');
// The inputTag will always exist on Host Page, and might exist on Away Page.
let token = (() => {
	const inputTag = document.querySelector('input[name="token"]');
	return inputTag ? inputTag.value : null;
})();
// Might exist on Host Page dictating if already playing a game or not.
// Wouldn't Exist on Away Page, but Away Page would always be false.
let isPlaying = document.querySelector('input[name="cancelhomegame"]') ? true : false;
let checkingStatus = false;
let pauseCheckingStatus = false;
let userCancelled = false;
let checkingStats = false;
let played;
let profit = 0;
let profitAfterTips = 0;

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('b', bTag => bTag.append('Baseball Config')));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const apiKey = localStorage.getItem('Doc_APIKey');
		buttonTag.append(apiKey ? 'Update API Key' : 'Insert API Key');
		buttonTag.onclick = () => {
			const response = prompt('Insert API Key which can be found at the bottom of the Accounts Page:', apiKey || '');
			if (response === null) {
				return;
			}
			if (response.length) {
				localStorage.setItem('Doc_APIKey', response);
			}
			else {
				localStorage.removeItem('Doc_APIKey');
			}
			location.reload();
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Hide Notifications: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('Doc_Notify');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('Doc_Notify', true);
			}
			else {
				localStorage.removeItem('Doc_Notify');
			}
			document.querySelector('#notify').style.setProperty('display', inputTag.checked ? 'none' : 'block');
		};
		WaitForTag('#notify')
			.then(tag => tag.style.setProperty('display', localStorage.getItem('Doc_Notify') ? 'none' : 'block'));
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Disable Sound: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('!Doc_SB_Sound');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('!Doc_SB_Sound', true);
			}
			else {
				localStorage.removeItem('!Doc_SB_Sound');
			}
		};
	}));
	divTag.append(document.createElement('br'));
	divTag.append('Enable Built In Captcha: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.type = 'checkbox';
		inputTag.checked = localStorage.getItem('Doc_SB_Human');
		inputTag.onchange = () => {
			if (inputTag.checked) {
				localStorage.setItem('Doc_SB_Human', true);
			}
			else {
				localStorage.removeItem('Doc_SB_Human');
			}
		};
	}));
}));

/* Styling
-------------------------*/
document.head.append(CreateElement('style', styleTag => {
	// Game Buttons
	styleTag.append('#Game { font-size: 1.15em; text-align: center; width: 100%; }');
	styleTag.append('@media only screen and (max-width: 502px) { #Game { font-size: 1em; } }');
	styleTag.append('@media only screen and (max-width: 407px) { #Game { font-size: 12px; } } ');
	styleTag.append('#Game > p { border-color: black; border-style: solid; border-width: 0 2px; display: inline; margin: 0 0.25em; padding: 0; }');
	styleTag.append('#Play, #Cancel { border-radius: 0.5em; color: #FFFFFF; font-size: inherit; padding: 0.5em; width: 9em; }');
	styleTag.append('#Play { background-color: #2648DA; }');
	styleTag.append('#Cancel { background-color: #D9534F; }');
	styleTag.append('#Checks, #Played { border: inherit; display: inline; margin: 0; padding: 0 0.25em; }');
	styleTag.append('#Checks { border-width: 0 1px 0 0; }');
	styleTag.append('#Played { border-width: 0 0 0 1px; }');
	// Table Section
	styleTag.append('#Stats { display: flex; flex-direction: column; padding: 1em; width: 100%; }');
	styleTag.append('#Stats p { margin: 0; }');
	styleTag.append('#Stats > div { margin: 0.25em 0; }');
	styleTag.append('.Row, .Info { display: flex; grid-gap: 0 0.5em; }');
	styleTag.append('.Spacer { flex-grow: 1; }');
	styleTag.append('.Red { color: #D9534F; }');
	styleTag.append('.Green { color: #5CB85C; }');
	styleTag.append('.NoLink { text-decoration: line-through; }');
	styleTag.append('.Hide { display: none; }');
	styleTag.append('.Italic { font-style: italic; }');
	// Profit
	styleTag.append('#Profit { display: flex; flex-direction: column; text-align: center; padding: 1em; width: 100%; }');
	// Notification Section
	styleTag.append('#notify { bottom: 0.75em; font-size: 12px; left: 0; position: fixed; }');
	styleTag.append('.notify { background-color: #FF4D6A; border-radius: 0.5em; color: #F2F2F2; margin: 1em; padding: 0.75em; transition: 1s; }');
	// User Configuration Settings Section
	styleTag.append('.Doc_Config { text-align: center; padding: 0 1em; font-size: 0.8em; }');
	styleTag.append('.Doc_Config b { font-size: 1.25em; }');
	styleTag.append('.Doc_Config button { font-size: inherit; font-weight: normal; padding: 0; }');
	styleTag.append('.Doc_Config hr { margin: 0.5em 0; }');
	styleTag.append('.Doc_Config input { margin: 0; }');
}));

/* Functions
-------------------------*/
function CreateElement(type, func) {
	const tag = document.createElement(type);
	func(tag);
	return tag;
}

function Sleep(ms) {
	return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

async function WaitForTag(query) {
	let tag = document.querySelector(query);
	while (!tag) {
		await Sleep(50);
		tag = document.querySelector(query);
	}
	return tag;
}

async function CheckStats(delay = 0) {
	if (checkingStats) {
		return;
	}
	checkingStats = true;
	await Sleep(delay);

	const lastGameID = parseInt(localStorage.getItem('Doc_SB_GameID')) || 0;
	const pages = Math.ceil(JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={baseball_games(first:50,page:1,team_id:[${teamID}],min_id:${lastGameID + 1},orderBy:{column:DATE,order:ASC}){paginatorInfo{total}}}`)).text()).data.baseball_games.paginatorInfo.total / 50);
	console.info(`Game Pages: ${pages}`);

	for (let i = 1; i <= pages; i += 5) {
		const startTime = performance.now();

		try {
			// Get Games
			const games = [];
			Object.values(JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={${(() => {
				console.info(`Game Page: ${i}-${i + Math.min(pages - i, 4)}`);
				let query = '';
				const endpoints = Math.min(pages - i + 1, 5);
				for (let j = 0; j < endpoints; ++j) {
					query += `${'abcde'[(i % 5) + j - 1]}:baseball_games(first:50,page:${i + j},team_id:[${teamID}],min_id:${lastGameID + 1},orderBy:{column:DATE,order:ASC}){data{id home_revenue spoils open home_score away_score home_id home_nation_id away_id away_nation_id}}`;
				}
				return query;
			})()}}`)).text()).data).forEach(endpoint => endpoint.data.filter(game => game.open === 0).forEach(game => {
				const isHost = parseInt(game.home_id) === teamID;
				games.push({
					gameID: parseInt(game.id),
					revenue: game.home_revenue,
					winnings: game.spoils,
					isHost: isHost,
					otherTeamID: parseInt(game[`${isHost ? 'away' : 'home'}_id`]),
					otherNationID: parseInt(game[`${isHost ? 'away' : 'home'}_nation_id`]),
					otherTeamWon: (game.home_score < game.away_score) === isHost
				});
			}));

			// Update Books and Profit
			let books = JSON.parse(localStorage.getItem('Doc_SB_Books')) || [];
			const pending = JSON.parse(localStorage.getItem('Doc_SB_Pending')) || [];
			games.forEach(game => {
				const credit = Math.round((0.3 * (game.revenue + game.winnings) - (game.isHost === game.otherTeamWon ? game.winnings : 0)) * (game.isHost ? 100 : -100));
				const tips = Math.round((0.3 * (game.revenue + game.winnings) - (game.isHost === game.otherTeamWon ? game.winnings : 0)) * (game.isHost ? 1 : -1));
				let revenue = 0;
				if (game.isHost) {
					revenue += game.revenue;
				}
				if (!game.otherTeamWon) {
					revenue += game.winnings;
				}
				profit += revenue;
				profitAfterTips += (revenue - tips);
				updateProfit();

				if (credit.toString() === 'NaN') {
					console.debug(game);
					return;
				}
				console.debug(`Team: ${game.otherTeamID} | Tip: ${FormatMoney(0.3 * (game.revenue + game.winnings), 2)} | Credit: ${FormatMoney(credit / 100, 2)}`);

				const index = books.findIndex(book => book.teamID === game.otherTeamID);
				if (index > -1) {
					// Team Exists in Books.
					books[index].credit += credit;
					books[index].date = new Date().getTime();
				}
				else {
					// Team Doesn't Exist in Books.
					books.push({
						credit: credit,
						date: new Date().getTime(),
						leaderName: 'PENDING',
						nation: 'PENDING',
						nationID: game.otherNationID,
						team: 'PENDING',
						teamID: game.otherTeamID,
						rating: -1
					})
					pending.push({
						nationID: game.otherNationID,
						teamID: game.otherTeamID
					});
				}
				AddNotify({
					message: [
						`Total: ${FormatMoney(game.revenue + game.winnings, 2)}`,
						`Tip: ${FormatMoney(credit / -100, 2)}`
					],
					ms: 5000,
					title: index > -1 ? `${books[index].nation} | ${books[index].team}` : 'PENDING | PENDING'
				});
			});

			// Save Progress
			books = books.filter(book => book.credit).sort((x, y) => Math.abs(y.credit) - Math.abs(x.credit));
			if (books.length) {
				localStorage.setItem('Doc_SB_Books', JSON.stringify(books));
			}
			else {
				localStorage.removeItem('Doc_SB_Books');
			}
			if (pending.length) {
				localStorage.setItem('Doc_SB_Pending', JSON.stringify(pending));
			}
			else {
				localStorage.removeItem('Doc_SB_Pending');
			}
			localStorage.setItem('Doc_SB_GameID', games.map(game => game.gameID).reduce((x, y) => x > y ? x : y, lastGameID));
			UpdateTable();
		}
		catch {
			console.error('Failed to get Games. Trying again in 5s...');
			console.info('Retrying in 5s');
			i -= 5;
			await Sleep(5000);
			continue;
		}

		const endTime = performance.now();
		console.info(`Process Games ${i}-${i + Math.min(pages - i, 4)}: ${endTime - startTime}ms`);
		await Sleep(Math.max(1500 + endTime - startTime, 0));
	}

	// Fill Out Pending!
	const pending = JSON.parse(localStorage.getItem('Doc_SB_Pending')) || [];
	let books = JSON.parse(localStorage.getItem('Doc_SB_Books')) || [];
	while (pending.length) {
		const startTime = performance.now();
		const group = pending.splice(0, 500);

		// Fetch Data
		try {
			const data = JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={nations(id:[${group.map(x => x.nationID)}]){data{id leader_name nation_name}}baseball_teams(id:[${group.map(x => x.teamID)}]){data{id name rating}}}`)).text()).data;

			// Update Books
			data.nations.data.forEach(nation => {
				try {
					nation.id = parseInt(nation.id)
					const book = books.find(book => book.nationID === nation.id);
					book.nation = nation.nation_name;
					book.leaderName = nation.leader_name;
				}
				catch (e) {
					console.error(e);
					console.log(nation);
				}
			});
			data.baseball_teams.data.forEach(team => {
				try {
					team.id = parseInt(team.id);
					const book = books.find(book => book.teamID === team.id);
					book.team = team.name;
					book.rating = team.rating;
				}
				catch (e) {
					console.error(e);
					console.log(team);
				}
			});

			// Save Progress
			books = books.filter(book => book.credit).sort((x, y) => Math.abs(y.credit) - Math.abs(x.credit));
			if (books.length) {
				localStorage.setItem('Doc_SB_Books', JSON.stringify(books));
			}
			else {
				localStorage.removeItem('Doc_SB_Books');
			}
			if (pending.length) {
				localStorage.setItem('Doc_SB_Pending', JSON.stringify(pending));
			}
			else {
				localStorage.removeItem('Doc_SB_Pending');
			}
			[...document.querySelectorAll('#Stats > div')].forEach(divTag => divTag.remove());
			UpdateTable();
		}
		catch (e) {
			console.error(e)
			console.info('Retrying in 5s');
			pending.splice(0, 0, ...group);
			await Sleep(5000);
		}

		const endTime = performance.now();
		console.info(`Process Pending: ${endTime - startTime}ms`);
		await Sleep(Math.max(1500 + endTime - startTime, 0));
	}

	checkingStats = false;
}

function FormatMoney(money, digits = 0) {
	return money.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits })
}

async function ToggleHostGame() {
	try {
		const buttonTag = document.querySelector(isPlaying ? '#Cancel' : '#Play');
		buttonTag.disabled = true;
		while (checkingStatus) {
			buttonTag.disabled = true;
			await Sleep(100);
		}
		pauseCheckingStatus = true;
		const doc = await GetDoc({
			method: 'POST',
			body: (() => {
				const formData = new FormData();
				formData.append('token', token);
				if (isPlaying) {
					formData.append('cancelhomegame', 'Cancel Home Game');
					userCancelled = true;
				}
				else {
					formData.append('submithomegame', 'Host Home Game');
				}
				return formData;
			})()
		});
		if (doc.querySelector('.alert-danger')) {
			throw Error(`Error: ${doc.querySelector('.alert-danger').textContent.slice(5)}`);
		}
		token = doc.querySelector('input[name="token"]').value;
		isPlaying = doc.querySelector('input[name="cancelhomegame"]') ? true : false;
		pauseCheckingStatus = false;
		if (isPlaying) {
			CheckHostStatus();
		}
	}
	catch {
		location.reload();
	}
}

async function CheckHostStatus() {
	let checks = 0;
	while (isPlaying) {
		checkingStatus = true;
		const doc = await GetDoc();
		token = doc.querySelector('input[name="token"]').value;
		isPlaying = doc.querySelector('input[name="cancelhomegame"]') ? true : false;
		document.querySelector('#Play').disabled = isPlaying;
		document.querySelector('#Cancel').disabled = !isPlaying;
		checkingStatus = false;
		if (isPlaying) {
			document.querySelector('#Checks').textContent = ++checks;
			await Sleep(Math.min(Math.floor(checks / 10) * 1000 + 1000, 10000));
		}
		while (pauseCheckingStatus) {
			await Sleep(100);
		}
	}
	document.querySelector('#Checks').textContent = 0;
	document.querySelector('#Play').disabled = false;
	document.querySelector('#Cancel').disabled = true;
	if (userCancelled) {
		userCancelled = false;
	}
	else {
		document.querySelector('#Played').textContent = `${++played}/250`;
		Sound();
		CheckStats(2500);
	}
}

async function AwayGame() {
	isPlaying = true;
	document.querySelector('#Play').disabled = true;
	document.querySelector('#Cancel').disabled = false;
	let checks = 0;
	while (isPlaying) {
		if (!token) {
			const doc = await GetDoc();
			const inputTag = doc.querySelector('input[name="token"]');
			if (inputTag) {
				token = inputTag.value;
			}
		}
		if (token) {
			const doc = await GetDoc({
				method: 'POST',
				body: (() => {
					const formData = new FormData();
					formData.append('token', token);
					formData.append('submitawaygame', 'Play Away Game');
					return formData;
				})()
			});
			// If true then game was played. If false then game was attempted, but failed to play.
			if (doc.querySelectorAll('.nationtable').length > 1) {
				isPlaying = false;
			}
			const inputTag = doc.querySelector('input[name="token"]');
			token = inputTag ? inputTag.value : null;
		}
		else {
			document.querySelector('#Checks').textContent = ++checks;
			await Sleep(1000);
		}
	}
	if (userCancelled) {
		userCancelled = false;
	}
	else {
		document.querySelector('#Played').textContent = `${++played}/250`;
		Sound();
		CheckStats(2500);
	}
	document.querySelector('#Checks').textContent = 0;
	document.querySelector('#Play').disabled = false;
	document.querySelector('#Cancel').disabled = true;
}

async function GetDoc(options) {
	let doc = new DOMParser().parseFromString(await (await fetch(location.href, options)).text(), 'text/html');
	while (!doc.querySelector('input')) {
		console.info(doc);
		if (!localStorage.getItem('Doc_SB_Human')) {
			location.reload();
			throw Error('Refreshing Page.');
		}
		await new Promise(resolve => {
			const divTag = document.querySelector('#Game');
			divTag.parentElement.insertBefore(CreateElement('iframe', iframeTag => {
				iframeTag.src = 'https://politicsandwar.com/human/';
				iframeTag.style.setProperty('display', 'none');
				iframeTag.style.setProperty('height', `${window.innerHeight}px`);
				iframeTag.style.setProperty('width', '100%');
				iframeTag.onunload = () => {
					iframeTag.style.setProperty('display', 'none');
				};
				iframeTag.onload = async () => {
					iframeTag.style.setProperty('display', 'inline');
					if (iframeTag.contentWindow.location.href !== 'https://politicsandwar.com/human/' || iframeTag.contentDocument.querySelector('.alert-success')) {
						iframeTag.remove();
						resolve(true);
					}
				};
			}), divTag.nextElementSibling);
		});
		doc = new DOMParser().parseFromString(await (await fetch(location.href, options)).text(), 'text/html');
	}
	return doc;
}

function UpdateTable() {
	const divTags = [...document.querySelectorAll('#Stats > div')];
	const books = JSON.parse(localStorage.getItem('Doc_SB_Books')) || [];
	books.forEach(book => {
		const divTag = (() => {
			const i = divTags.findIndex(divTag => divTag.id === `Stats_${book.teamID}`);
			return i > -1 ? divTags.splice(i, 1)[0] : null;
		})();
		if (!divTag) {
			document.querySelector('#Stats').append(CreateRow(book));
			return;
		}
		divTag.style.setProperty('order', book.credit * (isHost ? -1 : 1));
		const pTag = divTag.querySelector('.Money');
		pTag.textContent = FormatMoney(Math.abs(book.credit) / 100, 2);
		if (book.credit > 0 !== pTag.classList.contains('Red')) {
			pTag.classList.add(book.credit > 0 ? 'Red' : 'Green');
			pTag.classList.remove(book.credit < 0 ? 'Red' : 'Green');
		}
		const link = CreateOfferLink(book.leaderName, book.credit / 100);
		const aTag = divTag.querySelector('.Link');
		if (link) {
			if (!aTag.getAttribute('href')) {
				aTag.classList.remove('NoLink');
			}
			aTag.setAttribute('href', link);
		}
		else if (!aTag.getAttribute('href')) {
			aTag.classList.add('NoLink');
			aTag.removeAttribute('href');
		}
	});
	divTags.forEach(divTag => divTag.remove());
}

function CreateRow(book) {
	return CreateElement('div', divTag => {
		divTag.id = `Stats_${book.teamID}`;
		divTag.style.setProperty('order', book.credit * (isHost ? -1 : 1));
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Row');
			divTag.append(CreateElement('div', divTag => divTag.classList.add('Spacer')));
			divTag.append(CreateElement('p', pTag => {
				pTag.append(CreateElement('a', aTag => {
					aTag.href = `https://politicsandwar.com/nation/id=${book.nationID}`;
					aTag.target = '_blank';
					aTag.append(book.nation);
				}));
				pTag.append(` ${book.team} `);
				pTag.append(CreateElement('i', iTag => iTag.append(`${book.rating}%`)));
			}));
			divTag.append(CreateElement('p', pTag => {
				pTag.classList.add(book.credit > 0 ? 'Red' : 'Green');
				pTag.classList.add('Money');
				pTag.append(FormatMoney(Math.abs(book.credit) / 100, 2));
			}));
			divTag.append(CreateElement('a', aTag => {
				aTag.classList.add('InfoBtn');
				aTag.append('Info');
				aTag.onclick = () => {
					ToggleInfo(book.teamID);
				};
			}));
			divTag.append(CreateElement('div', divTag => divTag.classList.add('Spacer')));
		}));
		divTag.append(CreateElement('div', divTag => {
			divTag.classList.add('Info');
			divTag.classList.add('Hide');
			divTag.append(CreateElement('div', divTag => divTag.classList.add('Spacer')));
			divTag.append(CreateElement('a', aTag => {
				aTag.classList.add('Link');
				aTag.append('Send Offer');
				const link = CreateOfferLink(book.leaderName, book.credit / 100);
				if (link) {
					aTag.href = link;
				}
				else {
					aTag.classList.add('NoLink');
				}
				aTag.target = '_blank';
			}));
			divTag.append(' | ');
			divTag.append(CreateElement('a', aTag => {
				aTag.append('Adjust');
				aTag.onclick = () => {
					const credit = JSON.parse(localStorage.getItem('Doc_SB_Books')).find(x => x.teamID === book.teamID).credit;
					const response = Math.round(parseFloat(prompt(`Adjust Book Value:\nYou're Owed Money < 0 | You Owe Money > 0 | Zero will Remove. Blank or Invalid will Cancel`, credit / 100)) * 100);
					if (`${response}` === 'NaN' || credit === response) {
						return;
					}
					const books = JSON.parse(localStorage.getItem('Doc_SB_Books'));
					const i = books.findIndex(x => x.teamID === book.teamID);
					if (response) {
						books[i].credit = response;
					}
					else {
						books.splice(i, 1);
					}
					if (books.length) {
						localStorage.setItem('Doc_SB_Books', JSON.stringify(books));
					}
					else {
						localStorage.removeItem('Doc_SB_Books');
					}
					UpdateTable();
				};
			}));
			divTag.append(' | ');
			divTag.append(CreateElement('a', aTag => {
				aTag.append('Delete');
				aTag.onclick = () => {
					const books = JSON.parse(localStorage.getItem('Doc_SB_Books'));
					books.splice(books.findIndex(x => x.teamID === book.teamID), 1);
					if (books.length) {
						localStorage.setItem('Doc_SB_Books', JSON.stringify(books));
					}
					else {
						localStorage.removeItem('Doc_SB_Books');
					}
					UpdateTable();
				};
			}));
			divTag.append(CreateElement('div', divTag => divTag.classList.add('Spacer')));
		}));
	});
}

function ToggleInfo(teamID) {
	const divTag = document.querySelector(`#Stats_${teamID} .Info`);
	if (divTag.classList.contains('Hide')) {
		divTag.classList.remove('Hide');
		document.querySelector(`#Stats_${teamID} .InfoBtn`).classList.add('Italic');
	}
	else {
		divTag.classList.add('Hide');
		document.querySelector(`#Stats_${teamID} .InfoBtn`).classList.remove('Italic');
	}
}

function CreateOfferLink(leaderName, money) {
	return Math.floor(Math.abs(money)) ? `https://politicsandwar.com/nation/trade/create/?leadername=${leaderName.replaceAll(' ', '+')}&resource=food&p=${Math.min(Math.floor(Math.abs(money)), 50000000)}&q=1&t=${money > 0 ? 'b' : 's'}` : null;
}

function updateProfit() {
	document.getElementById('ProfitValueAfterTips').textContent = `${FormatMoney(profitAfterTips)}`;
	document.getElementById('ProfitValueBeforeTips').textContent = `${FormatMoney(profit)}`;
}

/* Notifications
-------------------------*/
function NotifySection() {
	if (document.querySelector('#notify')) {
		return;
	}
	document.body.append(CreateElement('div', divTag => {
		divTag.id = 'notify';
	}));
}

function AddNotify(obj) {
	if (!obj.message) {
		return;
	}
	document.querySelector('#notify').append(CreateElement('p', pTag => {
		pTag.classList.add('notify');
		if (obj.title) {
			pTag.append(CreateElement('b', bTag => bTag.append(obj.title)));
			pTag.append(document.createElement('br'));
		}
		if (typeof obj.message === 'string') {
			pTag.append(obj.message);
		}
		else {
			pTag.append(obj.message.shift());
			while (obj.message.length) {
				pTag.append(document.createElement('br'));
				pTag.append(obj.message.shift());
			}
		}
		if (obj.ms) {
			RemoveNotify(pTag, obj.ms);
		}
	}));
}

async function RemoveNotify(pTag, ms) {
	await Sleep(ms);
	pTag.style.setProperty('opacity', 0);
	await Sleep(1000);
	pTag.style.setProperty('fontSize', 0);
	pTag.style.setProperty('padding', 0);
	pTag.style.setProperty('margin', 0);
	await Sleep(1000);
	pTag.remove();
}

/* Start
-------------------------*/
Migration().then(() => Main());
function Main() {
	NotifySection();
	const divTag = CreateElement('div', divTag => {
		divTag.id = 'Game';
		divTag.append(CreateElement('button', buttonTag => {
			buttonTag.id = 'Play';
			buttonTag.classList.add('btn');
			buttonTag.append(isHost ? 'Host Game' : 'Away Game');
			buttonTag.disabled = isPlaying;
			buttonTag.onclick = isHost ? ToggleHostGame : AwayGame;
			Sleep(0).then(() => buttonTag.focus());
		}));
		divTag.append(CreateElement('p', pTag => {
			pTag.append(CreateElement('p', pTag => {
				pTag.id = 'Checks';
				pTag.append('0');
			}));
			pTag.append(CreateElement('p', async pTag => {
				pTag.id = 'Played';
				const apiKey = localStorage.getItem('Doc_APIKey');
				pTag.append(`${apiKey ? '?' : '!'}/250`);
				if (!apiKey) {
					return;
				}
				checkingStats = true;
				let plays = 0;
				while (true) {
					try {
						const pages = JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${apiKey}&query={baseball_games(first:50,team_id:[${teamID}]){paginatorInfo{lastPage}}}`)).text()).data.baseball_games.paginatorInfo.lastPage;
						const ticks = (() => {
							const date = new Date();
							return date.getTime() - (((date.getUTCHours() * 60 + date.getUTCMinutes()) * 60 + date.getUTCSeconds()) * 1000 + date.getUTCMilliseconds());
						})();
						console.info(`Pages: ${pages}`);
						for (let i = 1; i <= pages; i += 5) {
							const startTime = performance.now();
							const result = Object.values(JSON.parse(await (await fetch(`https://api.politicsandwar.com/graphql?api_key=${apiKey}&query={${(() => {
								console.info(`Page: ${i}-${i + Math.min(pages - i, 4)}`);
								let query = '';
								for (let j = 0; j < Math.min(pages - i + 1, 5); ++j) {
									query += `${'abcde'[(i % 5) + j - 1]}:baseball_games(first:50,page:${i + j},team_id:[${teamID}],orderBy:{column:DATE,order:DESC}){data{date home_revenue spoils home_score away_score home_id open}}`;
								}
								return query;
							})()}}`)).text()).data)
							result.map(endpoint => endpoint.data.map(game => {
								if (new Date(game.date).getTime() < ticks || game.open !== 0) {
									return;
								}
								const isHost = parseInt(game.home_id) === teamID;
								const otherTeamWon = (game.home_score < game.away_score) === isHost;
								let revenue = 0;
								let tips = Math.round((0.3 * (game.home_revenue + game.spoils) - (isHost === otherTeamWon ? game.spoils : 0)) * (isHost ? 1 : -1));
								if (isHost) {
									revenue += game.home_revenue;
								}
								if (!otherTeamWon) {
									revenue += game.spoils;
								}

								profit += revenue;
								profitAfterTips += (revenue - tips);
							}))
							const resultEnd = result.map(endpoint => endpoint.data.map(game => new Date(game.date).getTime()).reduce((arr, time) => [arr[0] + (time > ticks ? 1 : 0), arr[1] + 1], [0, 0])).reduce((x, y) => [x[0] + y[0], x[1] + y[1]], [0, 0]);
							plays += resultEnd[0];
							if (resultEnd[0] < resultEnd[1]) {
								break;
							}
							const endTime = performance.now();
							console.info(`Sleep: ${endTime - startTime}ms`);
							await Sleep(Math.max(1500 + endTime - startTime, 0));
						}
						break;
					}
					catch {
						console.error('Failed to calculate games. Trying again in 5s...');
						await Sleep(5000);
					}
				}
				updateProfit();
				checkingStats = false;
				played = plays;
				pTag.textContent = `${played}/250`;
				CheckStats(0);
			}));
		}));
		divTag.append(CreateElement('button', buttonTag => {
			buttonTag.id = 'Cancel';
			buttonTag.classList.add('btn');
			buttonTag.append('Cancel Game');
			buttonTag.disabled = !isPlaying;
			buttonTag.onclick = isHost ? ToggleHostGame : () => {
				buttonTag.disabled = true;
				isPlaying = false;
				userCancelled = true;
			};
		}));
	});
	const profitTag = CreateElement('div', divTag => {
		divTag.id = 'Profit';
		divTag.classList.add('col-sm-6');
		divTag.append(CreateElement('h4', h3Tag => {
			h3Tag.append('Income today after tips');
		}));
		divTag.append(CreateElement('p', pTag => {
			pTag.id = 'ProfitValueAfterTips';
			pTag.append("?");
		}));
		divTag.append(CreateElement('h4', h3Tag => {
			h3Tag.append('Income today before tips');
		}));
		divTag.append(CreateElement('p', pTag => {
			pTag.id = 'ProfitValueBeforeTips';
			pTag.append("?");
		}));
	});

	// Would only throw error on away page when there are no games currently available.
	try {
		const formTag = document.querySelector('input[name="token"]').parentElement;
		if (!isHost) {
			formTag.previousElementSibling.remove();
		}
		formTag.parentElement.insertBefore(divTag, formTag);
		formTag.parentElement.insertBefore(profitTag, divTag.nextSibling);
		formTag.remove();
	}
	catch {
		const divTags = document.querySelectorAll('.alert-danger');
		divTags[0].previousElementSibling.remove();
		divTags[0].previousElementSibling.remove();
		divTags[0].parentElement.insertBefore(divTag, divTags[0]);
		if ([...divTags].find(x => x.textContent.startsWith('You Are Hosting A Game'))) {
			document.querySelector('#Play').disabled = true;
		}
		divTags.forEach(x => x.remove());
	}
	divTag.parentElement.insertBefore(CreateElement('div', divTag => {
		divTag.id = 'Stats';
		const date = new Date().getTime() - 1000 * 60 * 60 * 24 * 7;
		const books = (JSON.parse(localStorage.getItem('Doc_SB_Books')) || []).filter(book => book.date > date);
		if (books.length) {
			localStorage.setItem('Doc_SB_Books', JSON.stringify(books));
		}
		else {
			localStorage.removeItem('Doc_SB_Books');
		}
		books.forEach(book => divTag.append(CreateRow(book)));
	}), divTag.nextElementSibling);

	if (isHost && isPlaying) {
		CheckHostStatus();
	}
}

function Sound() {
	if (localStorage.getItem('!Doc_SB_Sound')) {
		return;
	}
	new Audio('data:audio/mpeg;base64,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Kaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+pIARINcD/AAAGkHAAAAAAANIOAAAAAAAaQAAAAAAAA0gAAAAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq').play();
}
