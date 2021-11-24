// ==UserScript==
// @name         Doc: Home Baseball
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Make Hosting Games Better
// @author       BlackAsLight
// @match        https://politicsandwar.com/obl/host/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
let token = Array.from(document.getElementsByTagName('input')).filter(x => x.name == 'token')[0].value;
let isHosting = Array.from(document.getElementsByTagName('input')).filter(x => x.name == 'cancelhomegame')[0] ? true : false;
let toggling = false;
let checking = false;

function SetUp() {
	const divTag = (() => {
		const divTag = document.createElement('div');
		const formTag = Array.from(document.getElementsByTagName('input')).filter(x => x.name == 'token')[0].parentElement;
		formTag.parentElement.insertBefore(divTag, formTag);
		formTag.remove();
		return divTag;
	})();
	divTag.style.textAlign = 'center';
	divTag.style.fontSize = '1.25em';
	divTag.appendChild((() => {
		const buttonTag = document.createElement('button');
		buttonTag.id = 'HOST';
		buttonTag.innerText = 'Host Game';
		buttonTag.className = 'btn';
		buttonTag.style.padding = '0.5em';
		buttonTag.style.backgroundColor = '#2648DA';
		buttonTag.style.color = '#FFFFFF';
		buttonTag.style.fontSize = 'inherit';
		buttonTag.style.borderRadius = '0.5em';
		buttonTag.disabled = isHosting;
		buttonTag.onclick = async () => {
			await ToggleGameStatus(buttonTag);
			isHosting = true;
			CheckGameStatus();
		};
		return buttonTag;
	})());
	divTag.append(' | ');
	divTag.appendChild((() => {
		const buttonTag = document.createElement('button');
		buttonTag.id = 'CANCEL';
		buttonTag.innerText = 'Cancel Game';
		buttonTag.className = 'btn';
		buttonTag.style.padding = '0.5em';
		buttonTag.style.backgroundColor = '#D9534F';
		buttonTag.style.color = '#FFFFFF';
		buttonTag.style.fontSize = 'inherit';
		buttonTag.style.borderRadius = '0.5em';
		buttonTag.disabled = !isHosting;
		buttonTag.onclick = () => {
			ToggleGameStatus(buttonTag);
		};
		return buttonTag;
	})());
}

async function ToggleGameStatus(buttonTag) {
	buttonTag.disabled = true;
	while (checking) {
		console.log('Checking...');
		buttonTag.disabled = true;
		await Sleep(1000);
	}
	toggling = true;
	await fetch(location.href, {
		method: 'POST',
		body: (() => {
			let formData = new FormData();
			formData.append('token', token);
			if (isHosting) {
				formData.append('cancelhomegame', 'Cancel Home Game');
			}
			else {
				formData.append('submithomegame', 'Host Home Game');
			}
			return formData;
		})()
	});
	toggling = false;
	console.log('Toggled');
}

async function CheckGameStatus() {
	try {
		let checks = 1;
		console.log(`Sleep Time: ${Math.floor(checks / 10) + 1}s`);
		while (isHosting) {
			checking = true;
			console.time('Ping');
			const doc = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
			console.timeEnd('Ping');
			token = Array.from(doc.getElementsByTagName('input')).filter(x => x.name == 'token')[0].value;
			isHosting = (() => {
				const inputTags = Array.from(doc.getElementsByTagName('input')).filter(x => x.name == 'cancelhomegame' || x.name == 'submithomegame');
				if (inputTags.length) {
					return inputTags[0].name == 'cancelhomegame';
				}
				throw Error();
			})();
			document.getElementById('HOST').disabled = isHosting;
			document.getElementById('CANCEL').disabled = !isHosting;
			checking = false;
			if (isHosting) {
				if (!(checks % 10) && checks <= 90) {
					console.log(`Sleep Time: ${Math.floor(checks / 10) + 1}s`);
				}
				await Sleep(Math.min(Math.floor(checks / 10) * 1000 + 1000, 10000));
				++checks;
			}
			while (toggling) {
				console.log('Toggling...');
				await Sleep(1000);
			}
		}
		console.log('No Longer Hosting.');
	}
	catch {
		location.href = 'https://politicsandwar.com/human/';
	}
}

async function Sleep(ms) {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, ms);
	});
}

SetUp();
CheckGameStatus();