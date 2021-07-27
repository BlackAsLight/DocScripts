// ==UserScript==
// @name         Doc: Espionage Report
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Send a Copy of the Espionage Report to a Google Spreadsheet
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/espionage/*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        GM_xmlhttpRequest
// ==/UserScript==

'use strict';

// Adds button to insert or update the URL to report espionage operations to.
(() => {
	let codeTag = document.createElement('code');
	codeTag.innerHTML = localStorage.Doc_EspionageReportURL == undefined || localStorage.Doc_EspionageReportURL == '' ? '<button>Insert Report URL</button>' : '<button>Update Report URL</button>';
	codeTag.onclick = () => {
		let response = prompt('Espionage Report URL:', localStorage.Doc_EspionageReportURL);
		if (response != undefined) {
			localStorage.Doc_EspionageReportURL = response;
		}
	};
	document.getElementById('leftcolumn').appendChild(codeTag);
})();

// Adds button to insert or update your Identifier Key to report espionage operations.
(() => {
	let codeTag = document.createElement('code');
	codeTag.innerHTML = localStorage.Doc_EspionageIdentifierKey == undefined || localStorage.Doc_EspionageIdentifierKey == '' ? '<button>Insert Identifier Key</button>' : '<button>Update Identifier Key</button>';
	codeTag.onclick = () => {
		let response = prompt('Espionage Identifier Key:', localStorage.Doc_EspionageIdentifierKey);
		if (response != undefined) {
			localStorage.Doc_EspionageIdentifierKey = response;
		}
	};
	document.getElementById('leftcolumn').appendChild(codeTag);
})();

// Gets Report and sends it to spreadsheet if all arguments are met.
let pTag = document.getElementById('result_copy');
if (pTag != undefined) {
	if (localStorage.Doc_EspionageReportURL != undefined && localStorage.Doc_EspionageReportURL != '') {
		if (localStorage.Doc_EspionageIdentifierKey != undefined && localStorage.Doc_EspionageIdentifierKey != '') {
			sendPost(localStorage.Doc_EspionageReportURL, {
				timeStamp: new Date(),
				report: pTag.textContent,
				identifierKey: localStorage.Doc_EspionageIdentifierKey
			});
		}
	}
}

// Send a POST request.
function sendPost(url, jsonData) {
	GM_xmlhttpRequest({
		method: 'POST',
		data: JSON.stringify(jsonData),
		url: url
	});
}