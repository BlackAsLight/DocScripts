// ==UserScript==
// @name         Doc: Find War
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Assists in helping find a good nation to attack.
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=15*
// @match        https://politicsandwar.com/nations/
// @grant        none
// ==/UserScript==

'use strict';
const char = [
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

(() => {
	let codeTag = document.createElement('code');
	codeTag.innerHTML = localStorage.Doc_APIKey == undefined || localStorage.Doc_APIKey == '' ? '<button>Insert API Key</button>' : '<button>Update API Key</button>';
	codeTag.onclick = () => {
		let response = prompt('API Key provided by Doctor#4293', localStorage.Doc_APIKey);
		if (response != undefined) {
			localStorage.Doc_APIKey = response;
			location.reload();
		}
	};
	document.getElementById('leftcolumn').appendChild(codeTag);
})();

if (localStorage.Doc_APIKey != undefined && localStorage.Doc_APIKey != '') {
	(() => {
		let trTags = Array.from(document.getElementsByClassName('nationtable')[0].children[0].children);
		trTags.shift();

		for (let i = 0; i < trTags.length; i++) {
			let rowID = randomID();
			trTags[i].id = rowID;
			let button = document.createElement('button');
			let buttonID = randomID();
			button.id = buttonID;
			button.onclick = async () => {
				let buttonTag = document.getElementById(buttonID);
				button.parentElement.removeChild(button);
				let trTag = document.getElementById(rowID);
				let api = (await (await fetch(`https://politicsandwar.com/api/nation/id=${trTag.children[1].children[0].href.split('=')[1]}&key=${localStorage.Doc_APIKey}`)).json());
				let newTag = document.createElement('tr');
				newTag.innerHTML = `<td colspan="7"><p>Last Active: ${formatDate(new Date(new Date() - api.minutessinceactive * 1000 * 60))}<br>Soldiers: ${api.soldiers} | Tanks: ${api.tanks} | Planes: ${api.aircraft} | Ships: ${api.ships} | Missiles: ${api.missiles} | Nukes: ${api.nukes}</p></td>`;
				trTag.parentElement.insertBefore(newTag, trTag.nextSibling);
			};
			button.innerText = 'Load';
			trTags[i].children[6].appendChild(button);
		}
	})();
}

function randomID() {
	let id = '';
	for (let i = 0; i < 50; i++) {
		id += char[Math.floor(Math.random() * char.length)];
	}
	return id;
}

function formatDate(date) {
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
}