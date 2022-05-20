// ==UserScript==
// @name         Doc: Send Message
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.3
// @description  Easily Mass Message Players By Nation ID or Leader Name
// @author       BlackAsLight
// @match        https://politicsandwar.com/inbox/message/
// @match        https://politicsandwar.com/inbox/message/receiver=*
// @match        https://politicsandwar.com/inbox/message/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_SendMessage')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', divTag => {
	divTag.id = 'Doc_SendMessage';
	divTag.style.display = 'none';
}));

/* Global Variables
-------------------------*/
let total = 0;
let magic;

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('b', bTag => bTag.append('Send Message Config')));
	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('button', buttonTag => {
		const apiKey = localStorage.getItem('Doc_APIKey');
		buttonTag.append(apiKey ? 'Update API Key' : 'Insert API Key');
		buttonTag.onclick = () => {
			const response = prompt('Insert API Key which can be found at the bottom of the Accounts Page:', apiKey || '');
			if (response !== null) {
				if (response.length) {
					localStorage.setItem('Doc_APIKey', response);
				}
				else {
					localStorage.removeItem('Doc_APIKey');
				}
				location.reload();
			}
		};
	}));
}));

/* Styling
-------------------------*/
document.head.append(CreateElement('style', styleTag => {
	styleTag.append('#Message label { display: block; margin: 0.75em 0 0.25em 0; padding: 0 0 0 0.5em; }');
	styleTag.append('#Message input { display: block; width: 100%; margin: 0; padding: 0.5em; }');
	styleTag.append('#Message > button { display: block; margin: 0.5em auto; padding: 1em; font-weight: normal; font-size: inherit; color: #337ab7; border: 1px solid #337ab7; border-radius: 5px; }');
	styleTag.append('#Message > button:hover { color: #fff; background-color: #337ab7; }');
	styleTag.append('#Message > button:disabled { color: #fff; background-color: #70a1cc; text-decoration: none; }');
	styleTag.append('#Message > .Failed:disabled { background-color: #ff8080; }');
	styleTag.append('.Doc_Config { text-align: center; padding: 0 1em; font-size: 0.8em; }');
	styleTag.append('.Doc_Config b { font-size: 1.25em; }');
	styleTag.append('.Doc_Config button { font-size: inherit; font-weight: normal; padding: 0; }');
	styleTag.append('.Doc_Config hr { margin: 0.5em 0; }');
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

async function SendMessage() {
	const body = document.querySelector('#Message .ck-content').innerHTML;
	if (!body) {
		return false;
	}

	const leaderNames = await (async () => {
		const text = document.querySelector('#to').value;
		if (!text.length) {
			return [];
		}

		const leaderNames = [];
		const nationIDs = [];
		text.split(',').map(x => x.trim()).forEach(x => {
			if (parseInt(x)) {
				nationIDs.push(x);
			}
			else {
				leaderNames.push(x);
			}
		});

		const promises = [];
		while (nationIDs.length) {
			promises.push(new Promise(resolve => {
				fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={nations(first:500,id:[${nationIDs.splice(0, 500).join(',')}]){data{leader_name}}}`)
					.then(x => x.text())
					.then(x => {
						JSON.parse(x).data.nations.data.forEach(y => leaderNames.push(y.leader_name));
						resolve(true);
					});
			}));
		}
		await Promise.all(promises);

		return [...new Set(leaderNames)].sort();
	})();
	if (!leaderNames.length) {
		return false;
	}
	const pTag = CreateElement('p', pTag => {
		pTag.classList.add('List');
	});
	document.querySelector('#Message').append(CreateElement('div', divTag => {
		divTag.append(CreateElement('h2', h2Tag => h2Tag.append('Sent To:')));
		divTag.append(pTag);
	}));
	while (leaderNames.length) {
		const receivers = leaderNames.splice(0, 21);
		await fetch('https://politicsandwar.com/inbox/message/', {
			method: 'POST',
			body: (() => {
				const formData = new FormData();
				formData.append('receiver', receivers[0]);
				formData.append('carboncopy', receivers.slice(1).join(','));
				formData.append('subject', document.querySelector('#subject').value);
				formData.append('body', body);
				formData.append('sndmsg', true);
				formData.append('newconversation', true);
				return formData;
			})()
		});
		pTag.textContent += `${receivers.join(', ')}, `;
	}
	pTag.textContent = pTag.textContent.slice(0, -2);
	return true;
}

async function GetPlaceHolder() {
	total = total || await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={nations(first:1,page:1,vmode:false){paginatorInfo{total}}}`)
		.then(x => x.text())
		.then(x => JSON.parse(x).data.nations.paginatorInfo.total)
	const count = Math.ceil(Math.random() * 10);
	const placeholders = await fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={nations(first: ${count},page:${Math.ceil(Math.random() * Math.ceil(total / count))},vmode:false){data{id leader_name}}}`)
		.then(x => x.text())
		.then(x => JSON.parse(x).data.nations.data);
	return placeholders.map(x => x[Math.floor(Math.random() * 2) ? 'id' : 'leader_name']).join(', ');
}

async function DeletePlaceHolder(inputTag) {
	let text = inputTag.placeholder.split('');
	while (text.length) {
		text.pop();
		inputTag.placeholder = text.join('');
		await Sleep(50);
	}
}

async function WritePlaceHolder(text, inputTag) {
	inputTag.placeholder = '';
	text = text.split('');
	while (text.length) {
		inputTag.placeholder += text.shift();
		await Sleep(50 + Math.floor(Math.random() * 150));
	}
}

async function WriteValue(text, inputTag) {
	inputTag.value = '';
	text = text.split('');
	while (text.length) {
		inputTag.value += text.shift();
		await Sleep(50 + Math.floor(Math.random() * 150));
	}
}

async function WaitForTag(doc, query) {
	let tag = doc.querySelector(query);
	while (!tag) {
		await Sleep(100);
		tag = doc.querySelector(query);
	}
	return tag;
}

async function NewMessage() {
	CreateElement('div', async divTag => {
		divTag.id = 'Message';

		divTag.append(CreateElement('p', pTag => {
			pTag.append('To compose a new message enter the ');
			pTag.append(CreateElement('b', bTag => bTag.append('Nation ID')));
			pTag.append(CreateElement('i', iTag => iTag.append(' or ')));
			pTag.append(CreateElement('b', bTag => bTag.append('Leader Name')));
			pTag.append(' into the "To" field. ');
			pTag.append('To send duplicate messages, enter their Nation ID or Leader Name separated by commas into the "To" field. ');
			pTag.append('You\'re able to do a mixture of Nation IDs and Leader Names.');
		}));

		divTag.append(CreateElement('label', labelTag => labelTag.append('To')));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.id = 'to';
			inputTag.type = 'text';
		}));

		divTag.append(CreateElement('label', labelTag => labelTag.append('Subject')));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.id = 'subject';
			inputTag.type = 'text';
		}));

		divTag.append(CreateElement('label', labelTag => labelTag.append('Body')));
		const formTag = document.querySelector('input[name="newconversation"]').parentElement;
		formTag.previousElementSibling.remove();
		formTag.parentElement.insertBefore(divTag, formTag);
		formTag.style.display = 'none';

		divTag.append(await (async () => {
			const divTag = await WaitForTag(formTag, 'div');
			divTag.querySelector('label').remove();
			return divTag;
		})());

		divTag.append(CreateElement('button', buttonTag => {
			buttonTag.disabled = localStorage.getItem('Doc_APIKey') === null;
			buttonTag.append('Send Message');
			buttonTag.onclick = async () => {
				buttonTag.disabled = true;
				magic = false;
				buttonTag.textContent = 'Sending...';
				if (await SendMessage()) {
					buttonTag.textContent = 'Sent!';
				}
				else {
					buttonTag.textContent = 'Failed to Send Message';
					buttonTag.classList.add('Failed');
					setTimeout(() => {
						buttonTag.classList.remove('Failed');
						buttonTag.textContent = 'Send Message';
						buttonTag.disabled = false;
					}, 1500);
				}
			};
		}));

		formTag.remove();
	});

	await WaitForTag(document, '#to');
	if (location.href.includes('receiver=')) {
		Sleep(1500).then(() => WriteValue(location.href.slice(location.href.indexOf('/message/') + 9).split('&').filter(x => x.startsWith('receiver='))[0].split('=')[1].replaceAll('+', ' '), document.querySelector('#to')));
		magic = false;
	}
	else {
		magic = localStorage.getItem('Doc_APIKey') !== null
	}
	while (magic) {
		const inputTag = document.querySelector('#to');
		const text = await GetPlaceHolder();
		await DeletePlaceHolder(inputTag);
		await Sleep(50 + Math.floor(Math.random() * 150));
		await WritePlaceHolder(text, inputTag);
		await Sleep(5000);
	}
}

/* Start
-------------------------*/
function Main() {
	if (location.href.includes('id=')) {
		const divTag = (document.querySelector('.blue-msg') || document.querySelector('.red-msg')).parentElement;
		divTag.style.removeProperty('height');
		divTag.style.setProperty('max-height', '50vh');
		return;
	}
	NewMessage();
}

Main();
