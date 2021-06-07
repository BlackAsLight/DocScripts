// ==GoogleScriptApp==
// @name         Doc: Find War
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Receives a Copy of API calls and saves to a Google Spreadsheet
// @author       BlackAsLight
// ==/GoogleScriptApp==

const spreadsheetID = '';
const sheetName = 'Logs';
let sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);

function doPost(e) {
	const data = JSON.parse(e.postData.contents);
	if (data.job == 'log') {
		while (data.nations.length) {
			const nation = data.nations.shift();
			const rowNumber = findRow();
			sheet.getRange(rowNumber, 1).setValue(nation.timeStamp);
			sheet.getRange(rowNumber, 2).setValue(nation.nationID);
			sheet.getRange(rowNumber, 3).setValue(nation.api);
		}
	}
	else if (data.job == 'request') {
		let response = {};
		for (let i = 2; i <= sheet.getMaxRows(); i++) {
			const timeStamp = new Date(sheet.getRange(i, 1).getValue());
			if (timeStamp > new Date() - 1800000) {
				for (let j = 0; j < data.nationIDs.length; j++) {
					const nationID = sheet.getRange(i, 2).getValue();
					if (nationID == data.nationIDs[j]) {
						response[nationID] = sheet.getRange(i, 3).getValue();
						data.nationIDs.splice(j, 1);
						break;
					}
				}
			}
		}
		return ContentService.createTextOutput(JSON.stringify(response));
	}
}

function findRow() {
	let addedRows = false;
	for (let i = 0; i < 2; i++) {
		if (sheet.getRange(sheet.getMaxRows() - 1, 1).getValue() != '') {
			sheet.insertRows(sheet.getMaxRows());
			addedRows = true;
		}
	}
	if (addedRows) {
		return sheet.getMaxRows() - 1;
	}
	const max = sheet.getMaxRows();
	let min = 2;
	let position = min;
	let find = true;
	let count = 0;
	while (find && count < max) {
		if (sheet.getRange(position, 1).getValue() == '') {
			if (sheet.getRange(position - 1, 1).getValue() != '') {
				find = false;
			}
			else {
				position = Math.floor((min + position) / 2);
			}
		}
		else {
			min = position;
			position = Math.floor((position + max) / 2);
		}
		count++;
	}
	if (count > max) {
		throw 'Infinite Loop Error';
	}
	return position;
}