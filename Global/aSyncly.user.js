// ==UserScript==
// @name         Doc: Sync the aSyncly
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
// @description  Saves Settings to the Dossier Page
// @author       You
// @match        https://politicsandwar.com/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
let updating = false
const bannedKeys = ['Doc_aSyncly', 'Doc_Commendations', 'Doc_MarketWatcher'];

window.onbeforeunload = () => {
	return updating || undefined
}

async function Sync(lastChecked) {
	const { data, token } = await (async () => {
		const doc = new DOMParser().parseFromString(await (await fetch('https://politicsandwar.com/nation/dossier/')).text(), 'text/html');
		const token = doc.querySelector('input[name="token"]').value;
		try {
			return {
				data: JSON.parse(doc.querySelector('textarea[name="dossier"]').textContent.replaceAll('!!', '\\')),
				token: token
			};
		}
		catch {
			console.error('Text in Dossier was invalid JSON.', doc.querySelector('textarea[name="dossier"]').textContent);
		}
		return {
			token: token
		};
	})();

	if (data && data.lastChecked > lastChecked) {
		console.info('Updating Local Settings.');
		UpdateLocal(data);
	}
	else {
		updating = true
		console.info('Updating Foreign Settings.');
		try {
			await UpdateForeign(data ? data.hash : null, token);
		} catch (e) {
			console.error(e);
		}
		updating = false
	}
}

function UpdateLocal(data) {
	const keys = [];
	for (const key in data.localStorage) {
		localStorage.setItem(key, data.localStorage[key]);
		keys.push(key);
	}
	for (let i = 0; i < localStorage.length; ++i) {
		const key = localStorage.key(i);
		if (!key.startsWith('Doc') || keys.includes(key) || bannedKeys.map(x => key.startsWith(x)).filter(x => x).length) {
			continue;
		}
		localStorage.removeItem(key);
	}
	localStorage.setItem('Doc_aSyncly_LastChecked', data.lastChecked);
}

async function UpdateForeign(hash, token) {
	const data = {
		lastChecked: new Date().getTime(),
		localStorage: {}
	};
	for (let i = 0; i < localStorage.length; ++i) {
		const key = localStorage.key(i);
		if (!key.startsWith('Doc') || bannedKeys.map(x => key.startsWith(x)).filter(x => x).length) {
			continue;
		}
		data.localStorage[key] = localStorage.getItem(key);
	}
	data.hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(data.localStorage))).then(buffer => [...new Uint8Array(buffer)].map(bytes => bytes.toString(16)).join(''));

	if (data.hash === hash) {
		return;
	}

	console.info('Saved Data', new DOMParser().parseFromString(await (await fetch('https://politicsandwar.com/nation/dossier/', {
		method: 'POST',
		body: (() => {
			const formData = new FormData();
			formData.append('dossier', JSON.stringify(data).replaceAll('\\', '!!'));
			formData.append('update', 'Update');
			formData.append('token', token);
			return formData;
		})()
	})).text(), 'text/html').querySelector('textarea[name="dossier"]').textContent);
	localStorage.setItem('Doc_aSyncly_LastChecked', data.lastChecked);
}

function Main() {
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

	const lastChecked = parseInt(localStorage.getItem('Doc_aSyncly_LastChecked')) || 0;
	// Don't run if there is 500+ players online and has been less than 30mins since last updated.
	if (players >= 500 && lastChecked > date.getTime() - 1000 * 60 * 30) { // ms * secs * mins
		return;
	}

	// Don't run if it's been less than 5mins since last updated.
	if (lastChecked > date.getTime() - 1000 * 60 * 5) {
		return;
	}

	console.info('Syncing Settings.');
	Sync(lastChecked);
}

Main();
