// ==UserScript==
// @name         Doc: Find War
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.5
// @description  Consolidates information about potential raiding targets.
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=15*
// @match        https://politicsandwar.com/nations/
// @grant        GM_xmlhttpRequest
// ==/UserScript==

'use strict';
// Global Variables.
const char = [
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

let cache = [];
let log = [];

// Handle obtaining, changing and saving API Key provided by user.
(() => {
	let codeTag = document.createElement('code');
	codeTag.innerHTML = localStorage.Doc_APIKey == undefined || localStorage.Doc_APIKey == '' ? '<button>Insert API Key</button>' : '<button>Update API Key</button>';
	codeTag.onclick = () => {
		let response = prompt('API Key found at the bottom of Account Page:', localStorage.Doc_APIKey);
		if (response != undefined) {
			localStorage.Doc_APIKey = response;
			location.reload();
		}
	};
	document.getElementById('leftcolumn').appendChild(codeTag);
})();

(() => {
	let codeTag = document.createElement('code');
	codeTag.innerHTML = localStorage.Doc_FindWarURL == undefined || localStorage.Doc_FindWarURL == '' ? '<button>Insert Auto Load URL</button>' : '<button>Update Auto Load URL</button>';
	codeTag.onclick = () => {
		let response = prompt('URL received from Google Scripts:', localStorage.Doc_FindWarURL);
		if (response != undefined) {
			localStorage.Doc_FindWarURL = response;
			location.reload();
		}
	};
	document.getElementById('leftcolumn').appendChild(codeTag);
})();

// Creates CSS class.
{
	let styleTag = document.createElement('style');
	styleTag.textContent = '.grid-container-three {display:grid; grid-template-columns: calc(100%/3) calc(100%/3) calc(100%/3);} .grid-container-six {display:grid; grid-template-columns: calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6) calc(100%/6);} .grid-item {text-align: center;}';
	document.head.appendChild(styleTag);
}

// Creates a boolean value about whether it should alter the page.
const run = (() => {
	if (localStorage.Doc_APIKey != undefined && localStorage.Doc_APIKey != '') {
		let args = location.search.slice(1).split('&');
		while (args.length) {
			let arg = args.shift().split('=');
			if (arg[0] == 'cat') {
				if (arg[1] == 'war_range') {
					return true;
				}
			}
		}
	}
	return false;
})();

// Iterates through every row in the table.
if (run) {
	let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children);
	{
		let thTags = Array.from(trTags.shift().children);
		let thTag = thTags.shift();
		thTag.innerText = 'Targets?';
		while (thTags.length) {
			thTag = thTags.shift();
			thTag.parentElement.removeChild(thTag);
		}
	}
	while (trTags.length) {
		AffectRow(trTags.shift());
	}
	if (localStorage.Doc_FindWarURL != undefined && localStorage.Doc_FindWarURL != '') {
		let nationIDs = [];
		for (let i = 1; i < cache.length; i++) {
			nationIDs.push(cache[i].nationID);
		}
		SendPost({
			job: 'request',
			nationIDs: nationIDs
		}, true);
	}
}

// Alters a row to meet the new template.
function AffectRow(trTag) {
	let tdTags = Array.from(trTag.children);
	let tdTag = tdTags.shift();

	let buttonID = RandomID();
	let militaryID = RandomID();
	let continentID = RandomID();
	let lastActiveID = RandomID();
	tdTag.innerHTML = RowTemplate(tdTags, buttonID, militaryID, continentID, lastActiveID);
	// Load Military OnClick Event
	let nationID = tdTags[0].children[0].href.split('=')[1];
	if (localStorage.Doc_FindWarURL != undefined && localStorage.Doc_FindWarURL != '') {
		cache.push({
			buttonID: buttonID,
			militaryID: militaryID,
			continentID: continentID,
			lastActiveID: lastActiveID,
			nationID: nationID
		});
	}
	else {
		document.getElementById(buttonID).onclick = () => {
			let buttonTag = document.getElementById(buttonID);
			buttonTag.parentElement.removeChild(buttonTag);
			LoadMilitary(nationID, militaryID, continentID, lastActiveID);
		};
	}

	while (tdTags.length) {
		tdTag = tdTags.shift();
		tdTag.parentElement.removeChild(tdTag);
	}
}

// Creates the new Row HTML as a string.
function RowTemplate(tdTags, buttonID, militaryID, continentID, lastActiveID) {
	let html = '';
	// First Container
	html += '<div class="grid-container-three">';
	html += GridItem('<i>Continent</i>', continentID); // Continent
	html += GridItem(tdTags[0].innerText.split('\n')[1] + (tdTags[5].children[0] == undefined || tdTags[5].children[0].title.endsWith('Range') || tdTags[5].children[2] == undefined ? '' : ` <a target="_blank" href="https://politicsandwar.com/nation/war/declare/id=${tdTags[0].children[0].href.split('id=')[1]}"><img src="https://politicsandwar.com/img/icons/16/sword.png"></a>`)); // Leader Name
	html += GridItem(`<img src="${tdTags[3].children[0].src}">`); // Nation Colour
	html += GridItem('<i>Last Active</i>', lastActiveID); // Last Active
	html += GridItem(`<a target="_blank" href="${tdTags[0].children[0].href}">${tdTags[0].children[0].textContent.trim()}</a>`); // Nation Name
	html += GridItem(`Founded: ${FormatDate(new Date(tdTags[1].textContent.split(' ')[0]))}`); // Founded
	html += GridItem(`Cities: ${tdTags[4].textContent}`); // Cities
	html += GridItem(`${tdTags[2].children[0] == undefined ? 'No Alliance' : `<a target="_blank" href="${tdTags[2].children[0].href}">${tdTags[2].children[0].textContent}</a>`}`); // Alliance Name
	html += GridItem(`Score: ${tdTags[5].textContent.trim()}`); // Score
	html += '</div>';
	// Title
	html += `<hr><h4 style="text-align:center;">${tdTags[5].children[2] == undefined ? '' : `<img src="${tdTags[5].children[2].src}"> `}Military${tdTags[5].children[1] == undefined ? (tdTags[5].children[0] != undefined && tdTags[5].children[0].title.endsWith('Spy Range') ? ` <img src="${tdTags[5].children[0].src}">` : '') : ` <img src="${tdTags[5].children[1].src}">`}</h4>`;
	if (localStorage.Doc_FindWarURL == undefined || localStorage.Doc_FindWarURL == '') {
		html += `<h5 style="text-align:center;"><button id=${buttonID}>Load Military</button></h5>`; // Military Loan Button
	}
	// Second Container
	html += `<div id="${militaryID}" class="grid-container-six">`;
	html += GridItem('<i>Soldiers</i>');
	html += GridItem('<i>Tanks</i>');
	html += GridItem('<i>Planes</i>');
	html += GridItem('<i>Ships</i>');
	html += GridItem('<i>Missiles</i>');
	html += GridItem('<i>Nukes</i>');
	html += '</div>'
	// Title
	html += `<hr><h4 style="text-align:center;">War History${tdTags[5].children[0] == undefined ? '' : (() => { let src = tdTags[5].children[0].src; let repeat = parseInt(tdTags[5].children[0].title.split(' ')[0]); let imgTags = ''; for (let i = 0; i < repeat; i++) { imgTags += ` <img src="${src}">`; } return imgTags; })()}</h4>`;
	html += '<p><i>Coming Soon...</i></p>';
	return html;
}

function GridItem(text, id) {
	if (id == undefined) {
		return '<div class="grid-item">' + text + '</div>';
	}
	return '<div id="' + id + '" class="grid-item">' + text + '</div>';
}

// Deal with the response of a Post Request.
function ReceivePost(jsonData) {
	while (cache.length) {
		const object = cache.shift();

		if (jsonData[object.nationID] == undefined) {
			LoadMilitary(object.nationID, object.militaryID, object.continentID, object.lastActiveID);
		}
		else {
			UpdateRow(JSON.parse(jsonData[object.nationID]), object.militaryID, object.continentID, object.lastActiveID);
		}
	}
	let pTag = document.createElement('p');
	pTag.innerHTML = '<b>10</b>';
	pTag.style.position = 'fixed';
	pTag.style.bottom = '1em';
	pTag.style.right = '1em';
	pTag.style.backgroundColor = '#282883';
	pTag.style.padding = '1em';
	pTag.style.borderRadius = '0.5em';
	pTag.style.color = '#ffffff'
	pTag.style.fontSize = '12px';
	document.body.appendChild(pTag);
	for (let i = 0; i < 10; i++) {
		setTimeout(() => {
			pTag.innerHTML = `<b>${i + 1}</b>`;
		}, (9 - i) * 1000);
	}
	setTimeout(() => {
		pTag.innerHTML = `<b>Sent!</b>`;
		pTag.style.opacity = 1;
		pTag.style.transition = 'opacity 1s ease-in-out';
		pTag.style.opacity = 0;
		setTimeout(() => {
			pTag.parentElement.removeChild(pTag);
		}, 1500);
	}, 10000);
	setTimeout(() => {
		if (log.length) {
			SendPost({
				job: 'log',
				nations: log
			}, false);
		}
		log = [];
	}, 10000);
}

// Calls Military info when User clicks Load Military button.
async function LoadMilitary(nationID, militaryID, continentID, lastActiveID) {
	const api = (await (await fetch(`https://politicsandwar.com/api/nation/id=${nationID}&key=${localStorage.Doc_APIKey}`)).json());
	UpdateRow(api, militaryID, continentID, lastActiveID);
	// Log Nation
	if (localStorage.Doc_FindWarURL != undefined && localStorage.Doc_FindWarURL != '') {
		log.push({
			timeStamp: new Date(),
			nationID: nationID,
			api: JSON.stringify(api)
		});
	}
}

// Fills in Military info.
function UpdateRow(api, militaryID, continentID, lastActiveID) {
	let gridItemTags = Array.from(document.getElementById(militaryID).children);
	gridItemTags[0].innerText = 'Solders: ' + parseInt(api.soldiers).toLocaleString();
	gridItemTags[1].innerText = 'Tanks: ' + parseInt(api.tanks).toLocaleString();
	gridItemTags[2].innerText = 'Planes: ' + parseInt(api.aircraft).toLocaleString();
	gridItemTags[3].innerText = 'Ships: ' + parseInt(api.ships).toLocaleString();
	gridItemTags[4].innerText = 'Missiles: ' + parseInt(api.missiles).toLocaleString();
	gridItemTags[5].innerText = 'Nukes: ' + parseInt(api.nukes).toLocaleString();
	document.getElementById(continentID).innerText = api.continent;
	document.getElementById(lastActiveID).innerText = 'Last Active: ' + FormatDateTime(new Date(new Date() - api.minutessinceactive * 1000 * 60));
}

// Send a POST request.
function SendPost(jsonData, processResponse) {
	GM_xmlhttpRequest({
		method: 'POST',
		data: JSON.stringify(jsonData),
		url: localStorage.Doc_FindWarURL,
		onload: (e) => {
			if (processResponse) {
				ReceivePost(JSON.parse(e.response));
			}
		}
	});
}

function RandomID() {
	let id = '';
	for (let i = 0; i < 50; i++) {
		id += char[Math.floor(Math.random() * char.length)];
	}
	return id;
}

function FormatDateTime(date) {
	let text = '';
	if (date.getHours() < 10) {
		text += '0';
	}
	text += date.getHours() + ':';
	if (date.getMinutes() < 10) {
		text += '0';
	}
	text += date.getMinutes() + ' ';
	text += FormatDate(date);
	return text;
}

function FormatDate(date) {
	let text = '';
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
}
