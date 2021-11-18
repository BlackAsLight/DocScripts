// ==UserScript==
// @name         Doc: Commendation 3000
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Script that locates nations to commend.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/dossier/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        GM_xmlhttpRequest
// ==/UserScript==

'use strict';
let latestDate = (() => {
	let num = localStorage.getItem('Doc_Commendations');
	return num ? num : 0;
})();

document.getElementById('leftcolumn').appendChild((() => {
	const codeTag = document.createElement('code');
	codeTag.appendChild((() => {
		const buttonTag = document.createElement('button');
		const apiKey = localStorage.getItem('Doc_APIKey');
		buttonTag.innerText = apiKey ? 'Update API Key' : 'Insert API Key';
		buttonTag.onclick = () => {
			const response = prompt('Insert API Key which can be found at the bottom of Accounts Page:', apiKey);
			if (response != null) {
				if (response.length) {
					localStorage.setItem('Doc_APIKey', response);
				}
				else {
					localStorage.removeItem('Doc_APIKey');
				}
				location.reload();
			}
		};
		return buttonTag;
	})());
	return codeTag;
})());

document.getElementById('rightcolumn').appendChild((() => {
	const pTag = document.createElement('p');
	pTag.style.textAlign = 'center';
	pTag.appendChild((() => {
		const buttonTag = document.createElement('button');
		buttonTag.style.backgroundColor = '#2648da';
		buttonTag.style.padding = '10px';
		buttonTag.style.color = '#ffffff';
		buttonTag.style.fontSize = '16px';
		buttonTag.innerText = 'Run Commendation 3000';
		buttonTag.onclick = () => {
			buttonTag.disabled = true;
			pTag.innerHTML = pTag.innerHTML;
			Main();
		};
		return buttonTag;
	})());
	return pTag;
})());

async function Main() {
	let nations = await (async () => {
		let data = JSON.parse(localStorage.getItem('Doc_Commendations_Nations'));
		if (!data) {
			data = (await GetNations()).filter(x => x.date > latestDate).filter(x => x.id != parseInt(document.getElementsByClassName('sidebar')[1].getElementsByTagName('a')[0].href.split('=')[1]));
			localStorage.setItem('Doc_Commendations_Nations', JSON.stringify(data));
		}
		return data;
	})();
	const total = nations.length;
	let count = 0;
	while (nations.length) {
		++count;
		const nation = nations.shift();
		try {
			await Tab(nation, Math.floor(count / total * 1000000) / 10000);
			localStorage.setItem('Doc_Commendations_Nations', JSON.stringify(nations));
		}
		catch (e) {
			console.log(e);
		}
	}
	if (!nations.length) {
		localStorage.removeItem('Doc_Commendations_Nations');
	}
}

async function Tab(nation, percentage) {
	await new Promise((resolve) => {
		const tab = window.open(`https://politicsandwar.com/nation/id=${nation.id}`);
		tab.onload = () => {
			if (latestDate < nation.date) {
				localStorage.setItem('Doc_Commendations', nation.date);
			}
			const spanTag = tab.document.getElementById('commendment_count');
			if (spanTag) {
				const aTag = spanTag.parentElement.children[1];
				if (aTag.children[0].className == 'fa fa-thumbs-up') {
					aTag.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
					aTag.style.fontSize = '2em';
					aTag.onclick = () => {
						console.log(`Commended: ${nation.id} | ${percentage}%`);
						setTimeout(() => {
							tab.close();
						}, 1000);
						resolve(true);
					};
				}
				else {
					tab.close();
					resolve(true);
				}
			}
			else {
				tab.close();
				resolve(true);
			}
		};
	});
}

async function GetNations() {
	const date = (() => {
		const num = localStorage.getItem('Doc_Commendations');
		return num ? StringDate(parseInt(num)) : StringDate(0);
	})();
	let page = 0;
	let nations = [];
	let run;
	do {
		run = await new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'POST',
				url: `https://api.politicsandwar.com/graphql?api_key=${localStorage.getItem('Doc_APIKey')}&query={
  nations(first: 500 page: ${++page}, created_after:"${date}") { data { id date } paginatorInfo { hasMorePages }}}`,
				onload: (event) => {
					try {
						let json = JSON.parse(event.response).data.nations;
						while (json.data.length) {
							const nation = json.data.shift();
							nations.push({
								id: parseInt(nation.id),
								date: new Date(nation.date.replace(' ', 'T') + 'Z').getTime()
							});
						}
						resolve(json.paginatorInfo.hasMorePages);
					}
					catch (error) {
						console.log(error);
						reject(false);
					}
				}
			});
		});
		console.log(`Nations Found Created After ${date}: ${run ? page * 500 : nations.length}`);
	} while (run);
	nations.sort((x, y) => x.date - y.date);
	return nations;
}

function StringDate(num) {
	const date = new Date(num - 1000 * 60 * 60 * 24);
	return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1 < 10 ? '0' : ''}${date.getUTCMonth() + 1}-${date.getUTCDate() < 10 ? '0' : ''}${date.getUTCDate()}`;
}