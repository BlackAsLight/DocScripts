// ==UserScript==
// @name         Doc: Sync the aSyncly
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.9
// @description  Saves Settings to the Dossier Page
// @author       You
// @match        https://politicsandwar.com/*
// @exclude      https://politicsandwar.com/human/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_aSyncly')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', async divTag => {
	divTag.setAttribute('id', 'Doc_aSyncly');
	divTag.style.setProperty('display', 'none');
	await Sleep(10000);
	divTag.remove();
}));

/* Migration
-------------------------*/
if (localStorage.getItem('Doc_aSyncly_LastChecked')) {
	localStorage.removeItem('Doc_aSyncly_LastChecked');
}
if (localStorage.getItem('Doc_aSyncly_Hash')) {
	localStorage.removeItem('Doc_aSyncly_Hash');
}
if (localStorage.getItem('Doc_Commendations')) {
	localStorage.removeItem('Doc_Commendations');
}
if (localStorage.getItem('Doc_Commendations_Nations')) {
	localStorage.removeItem('Doc_Commendations_Nations');
}

/* Global Variables
-------------------------*/
const lastCheckedKey = '!Doc_aS1';
let updating = false;

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

function TryNumber(text) {
	const num = parseFloat(text);
	if (num.toString() === 'NaN') {
		return text;
	}
	return num;
}

async function Sync(lastChecked) {
	const { json, token } = await (async () => {
		const doc = new DOMParser().parseFromString(await (await fetch('https://politicsandwar.com/nation/dossier/')).text(), 'text/html');
		const token = doc.querySelector('input[name="token"]').value;
		const text = doc.querySelector('textarea[name="dossier"]').textContent;
		try {
			return {
				json: JSON.parse(text),
				token: token
			};
		}
		catch {
			console.error('Text in Dossier was invalid JSON.', text);
			return { token: token };
		}
	})();

	if (json && json[0] < lastChecked) {
		console.info('aSyncly: Updating localStorage');
		UpdateLocalStorage(json);
		return;
	}
	console.info('aSyncly: Updating Dossier');
	updating = true;
	try {
		await UpdateDossier(json ? json.h : null, token);
	}
	catch (e) {
		console.error(e);
	}
	updating = false;
}

function UpdateLocalStorage(json) {
	const lastChecked = json[0];
	json = JSON.parse(json[2].replaceAll('!?', '"'));
	const keys = Object.keys(localStorage).filter(key => key.startsWith('Doc_'));
	for (const [key, value] of json) {
		localStorage.setItem(key, TryNumber(value.replaceAll('!!', '"')));
		const i = keys.findIndex(k => k === key);
		if (i > -1) {
			keys.splice(i, 1);
		}
	}
	for (const key of keys) {
		localStorage.removeItem(key);
	}
	localStorage.setItem(lastCheckedKey, json[0]);
}

async function UpdateDossier(hash, token) {
	const lastChecked = new Date().getTime();
	const text = JSON.stringify(Object.entries(localStorage).filter(([key, _]) => key.startsWith('Doc_')).sort((x, y) => x[0] > y[0] ? 1 : y[0] < x[0] ? -1 : 0).map(([key, value]) => [key, value.replaceAll('"', '!!')]));
	const hashedText = await Hash(text);
	if (hashedText === hash) {
		localStorage.setItem(lastCheckedKey, lastChecked);
		return;
	}
	console.info('Saved Data', new DOMParser().parseFromString(await (await fetch('https://politicsandwar.com/nation/dossier/', {
		method: 'POST',
		body: (() => {
			const formData = new FormData();
			formData.append('dossier', JSON.stringify([lastChecked, hashedText, text.replaceAll('"', '!?')]));
			formData.append('update', 'Update');
			formData.append('token', token);
			return formData;
		})()
	})).text(), 'text/html').querySelector('textarea[name="dossier"]').textContent.length);
	localStorage.setItem(lastCheckedKey, lastChecked);
}

async function Hash(text) {
	return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(bytes => bytes.toString(16)).join('')
}

/* Start
-------------------------*/
window.addEventListener('beforeunload', () => updating || undefined);
window.addEventListener('unload', () => updating || undefined);
Main();
async function Main() {
	// Don't run between 23:55 and 00:05 | inclusive/exclusive.
	const date = new Date();
	if ((date.getUTCHours() === 23 && date.getUTCMinutes() >= 55) || (date.getUTCHours() === 0 && date.getUTCMinutes() < 5)) {
		return;
	}

	const players = parseInt(document.querySelector('#leftcolumn div.sidebar').textContent.split('\n').map(x => x.trim()).filter(x => x.length).pop());
	// Don't run if 800+ players are online.
	if (players >= 800) {
		return;
	}

	const lastChecked = parseInt(localStorage.getItem(lastCheckedKey)) || 0;
	// Don't run if there is 500+ players online and has been less than 30mins since last updated.
	if (players >= 500 && lastChecked > date.getTime() - 1000 * 60 * 30) { // ms * secs * mins
		return;
	}

	// Don't run if it's been less than 5mins since last updated.
	if (lastChecked > date.getTime() - 1000 * 60 * 5) {
		return;
	}

	console.info('aSyncly: Syncing...');
	Sync(lastChecked);
}
