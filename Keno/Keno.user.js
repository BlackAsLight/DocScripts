// ==UserScript==
// @name         Doc: Keno
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  try to take over the world!
// @author       BlackAsLight
// @match        https://politicsandwar.com/casino/keno/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_Keno')) {
	throw Error('This script was already injected...');
}
document.body.append(CreateElement('div', async divTag => {
	divTag.setAttribute('id', 'Doc_Keno');
	divTag.style.setProperty('display', 'none');
	await Sleep(10000);
	divTag.remove();
}));

/* Global Variables
-------------------------*/
const dataKey = 'Doc_K1';
const autoSelectKey = 'Doc_K2';
const selectionKey = 'Doc_K3';

/* User Configuration Settings
-------------------------*/
document.querySelector('#leftcolumn').append(CreateElement('div', divTag => {
	divTag.classList.add('Doc_Config');
	divTag.append(document.createElement('hr'));
	divTag.append(CreateElement('strong', strongTag => strongTag.append('Keno Config')));

	divTag.append(document.createElement('br'));
	divTag.append('Auto Select: ');
	divTag.append(CreateElement('input', inputTag => {
		inputTag.setAttribute('type', 'checkbox');
		inputTag.toggleAttribute('checked', localStorage.getItem(autoSelectKey));
		inputTag.addEventListener('change', function () {
			if (this.getAttribute('checked') === null) {
				localStorage.setItem(autoSelectKey, 0);
				UpdateSelection(GetData());
			}
			else {
				localStorage.removeItem(autoSelectKey);
			}
		});
	}));

	divTag.append(document.createElement('br'));
	divTag.append(CreateElement('div', divTag => {
		divTag.append(CreateElement('strong', strongTag => strongTag.append('Select')));

		divTag.append(CreateElement('label', labelTag => {
			labelTag.setAttribute('for', 'doc_strong');
			labelTag.append('Most Likely: ');
		}));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.setAttribute('id', 'doc_strong');
			inputTag.setAttribute('type', 'radio');
			inputTag.setAttribute('name', 'select');
			inputTag.toggleAttribute('checked', !localStorage.getItem(selectionKey));
			inputTag.addEventListener('change', () => {
				localStorage.removeItem(selectionKey);
				UpdateSelection(GetData());
			});
		}));

		divTag.append(document.createElement('br'));
		divTag.append(CreateElement('label', labelTag => {
			labelTag.setAttribute('for', 'doc_weak');
			labelTag.append('Least Likely: ');
		}));
		divTag.append(CreateElement('input', inputTag => {
			inputTag.setAttribute('id', 'doc_weak');
			inputTag.setAttribute('type', 'radio');
			inputTag.setAttribute('name', 'select');
			inputTag.toggleAttribute('checked', localStorage.getItem(selectionKey));
			inputTag.addEventListener('change', () => {
				localStorage.setItem(selectionKey, 0);
				UpdateSelection(GetData());
			});
		}));
	}));
}));

/* Styling
-------------------------*/
document.head.append(CreateElement('style', styleTag => {
	/* Config
	-------------------------*/
	styleTag.append(CreateCSS('.Doc_Config', [
		'text-align: center',
		'padding: 0 1em',
		'font-size: 0.8em'
	]));
	styleTag.append(CreateCSS('.Doc_Config hr', ['margin: 0.5em 0']));
	styleTag.append(CreateCSS('.Doc_Config strong', ['font-size: 1.25em']));
	styleTag.append(CreateCSS('.Doc_Config input', ['margin: 0']));
	styleTag.append(CreateCSS('.Doc_Config div strong', ['display: block;']));
	styleTag.append(CreateCSS('.Doc_Config div label', [
		'display: inline-block',
		'font-weight: normal',
		'margin: 0 0 0 25%',
		'text-align: left',
		'width: 25%'
	]));
	styleTag.append(CreateCSS('.Doc_Config div input', [
		'display: inline-block',
		'margin: 0 25% 0 0',
		'width: 25%'
	]));

	/* Tables
	-------------------------*/
	styleTag.append(CreateCSS('#kenoStats, #kenoSelection', [
		'display: flex',
		'width: 100%',
		'flex-wrap: wrap',
		'margin: 1em 0'
	]));
	styleTag.append(CreateCSS('#kenoStats div, #kenoSelection div', [
		'display: block',
		'flex-basis: 10%',
		'text-align: center',
		'border: 1px solid',
	]));
}));

/* Functions
-------------------------*/
function CreateElement(type, func) {
	const tag = document.createElement(type);
	func(tag);
	return tag;
}

function CreateCSS(selector, declarations) {
	return [selector, '{', ...declarations.map(declaration => declaration.endsWith(';') ? declaration : `${declaration};`), '}'].join(' ');
}

function Sleep(ms) {
	return new Promise(a => setTimeout(() => a(true), ms));
}

function GetData() {
	const data = JSON.parse(localStorage.getItem(dataKey));
	if (data) {
		return data;
	}
	let count = 80;
	const array = [];
	while (count--) {
		array.push(0);
	}
	return array;
}

function RecordData(data) {
	[...document.querySelectorAll('.miss, .hit')].forEach(tdTag => ++data[parseInt(tdTag.textContent) - 1]);
	localStorage.setItem(dataKey, JSON.stringify(data));
	return data;
}

function UpdateStats(data) {
	const divTags = (() => {
		const divTag = document.querySelector('#kenoStats') || CreateElement('div', divTag => {
			divTag.setAttribute('id', 'kenoStats');
			const scriptTag = document.querySelector('#kenoTable').parentElement.parentElement.nextElementSibling;
			scriptTag.parentElement.insertBefore(divTag, scriptTag);
		});
		const divTags = [...divTag.children];
		if (divTags.length) {
			return divTags;
		}
		for (const i in data) {
			divTag.append(CreateElement('div', divTag => divTag.setAttribute('data-i', i)));
		}
		return [...divTag.children];
	})();
	data.forEach((x, i) => {
		divTags.find(divTag => divTag.getAttribute('data-i') === i.toString()).textContent = `${i + 1}: ${x}`;
	});
}

function UpdateSelection(data) {
	const divTag = document.querySelector('#kenoSelection') || CreateElement('div', divTag => {
		divTag.setAttribute('id', 'kenoSelection');
		const scriptTag = document.querySelector('#kenoStats').nextElementSibling;
		scriptTag.parentElement.insertBefore(divTag, scriptTag);
	});

	[...divTag.children].forEach(divTag => divTag.remove());
	([...document.querySelectorAll('.selected')] || []).forEach(tdTag => tdTag.click());

	const tdTags = [...document.querySelectorAll('#kenoTable td')];
	data = data.map((x, i) => [i, x]).sort((x, y) => localStorage.getItem(selectionKey) ? x[1] - y[1] : y[1] - x[1]).slice(0, 10).map(([i, x]) => {
		divTag.append(CreateElement('div', divTag => divTag.append(`${i + 1}: ${x}`)));
		return i;
	});
	if (localStorage.getItem(autoSelectKey)) {
		data.forEach(i => tdTags[i].click());
	}
}

/* Start
-------------------------*/
Main();
async function Main() {
	await Sleep(1000);
	const data = RecordData(GetData());
	UpdateStats(data);
	UpdateSelection(data);
}