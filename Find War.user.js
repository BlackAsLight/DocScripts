// ==UserScript==
// @name         Doc: Find War
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
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
			const rowID = randomID();
			trTags[i].id = rowID;
			let loadButton = document.createElement('button');
			const loadButtonID = randomID();
			loadButton.id = loadButtonID;
			loadButton.onclick = async () => {
				let loadButtonTag = document.getElementById(loadButtonID);
				loadButton.parentElement.removeChild(loadButton);
				let trTag = document.getElementById(rowID);
				let api = (await (await fetch(`https://politicsandwar.com/api/nation/id=${trTag.children[1].children[0].href.split('=')[1]}&key=${localStorage.Doc_APIKey}`)).json());
				let newTag = document.createElement('tr');
				const loadMoreButtonID = randomID();
				newTag.innerHTML = `<td colspan="7"><p>Last Active: ${formatDate(new Date(new Date() - api.minutessinceactive * 1000 * 60))} | GDP: $${parseInt(api.gdp).toLocaleString()}`
					+ '<br><b>Military</b>'
					+ `<br>Soldiers: ${parseInt(api.soldiers).toLocaleString()} | Tanks: ${parseInt(api.tanks).toLocaleString()} | Planes: ${parseInt(api.aircraft).toLocaleString()} | Ships: ${parseInt(api.ships).toLocaleString()} | Missiles: ${parseInt(api.missiles).toLocaleString()} | Nukes: ${parseInt(api.nukes).toLocaleString()}`
					+ `<br><button id="${loadMoreButtonID}">Load More</button></p></td>`;
				trTag.parentElement.insertBefore(newTag, trTag.nextSibling);
				document.getElementById(loadMoreButtonID).onclick = async () => {
					let loadMoreButtonTag = document.getElementById(loadMoreButtonID);
					let pTag = loadMoreButtonTag.parentElement;
					pTag.removeChild(loadMoreButtonTag);
					let doc = new DOMParser().parseFromString(await (await fetch(`https://politicsandwar.com/index.php?id=62&n=${encodeURI(api.name)}`)).text(), 'text/html');
					let rows = doc.getElementsByClassName('nationtable')[1].children[0];
					pTag.innerHTML += '<b>Nation</b>'
						+ `<br>Commerce: ${parseInt(rows.children[8].children[1].innerText) + '%'} | Cities Powered: ${(() => {
							let cities = Array.from(rows.children[9].children);
							cities.shift();
							cities.shift();
							let count = 0;
							for (let j = 0; j < cities.length; j++) {
								count += cities[j].innerText == 'Yes';
							}
							return count.toLocaleString();
						})()} | Avg Infra: ${(() => {
							let infra = Array.from(rows.children[2].children);
							infra.shift();
							infra.shift();
							let total = 0;
							for (let j = 0; j < infra.length; j++) {
								total += parseFloat(infra[j].innerText.replaceAll(',', ''));
							}
							return Math.round(total / infra.length, 2).toLocaleString();
						})()}`;
				};
			};
			loadButton.innerText = 'Load';
			trTags[i].children[6].appendChild(loadButton);
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