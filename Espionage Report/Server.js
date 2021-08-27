// ==GoogleScriptApp==
// @name         Doc: Espionage Report
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.4
// @description  Receives a Copy of Espionage Reports and saves to a Google Spreadsheet
// @author       BlackAsLight
// ==/GoogleScriptApp==

const spreadsheetID = '';
const report = 'Reports';
const identifier = 'Identifiers';
const folderPath = './Espionage/';

// Receives Espionage Report from Client Script
function doPost(e) {
	const data = JSON.parse(e.postData.contents);
	const folder = getFolderByPath(folderPath);

	// Get a filename that isn't in use.
	let fileName;
	while (true) {
		fileName = `ER-${randomText(15)}.json`;
		try {
			// Checks whether file name is already in use.
			// If it does then no error will be thrown and the while loop will run again.
			getFileByFolderFileName(folder, fileName);
		}
		catch {
			// If it doesn't then an error will be thrown, breaking out of the while loop.
			break;
		}
	}
	// Creates File in Google Drive for triggerUpdate()
	folder.createFile(fileName, JSON.stringify(data));
}

// Reads all reports saved in Google Drive and moves them to the Spreadsheet.
function triggerUpdate() {
	const spreadsheet = SpreadsheetApp.openById(spreadsheetID);
	const reportSheet = spreadsheet.getSheetByName(report);

	// Get list of approved identifiers.
	const identifiers = (() => {
		const sheet = spreadsheet.getSheetByName(identifier);
		return sheet.getRange(2, 1, sheet.getMaxRows() - 1, 2).getValues().filter(x => x[0].length && x[1].length);
	})();

	// Get folder and files in folder of all the reports.
	const folder = getFolderByPath(folderPath);
	let files = folder.getFiles();
	// Iterate through each file.
	while (files.hasNext()) {
		const file = files.next();
		// If file is a report then...
		if (file.getName().startsWith('ER-')) {
			// Parse it's data.
			const data = JSON.parse(file.getBlob().getDataAsString());
			// Check whether it has a valid identifierKey.
			const key = identifiers.filter(x => x[1] == data.identifierKey);
			if (key.length) {
				// If so it logged it into the Spreadsheet.
				const row = findRow(reportSheet, 3);
				reportSheet.getRange(row, 1, 1, 3).setValues([[data.timeStamp, data.report, key[0]]]);
			}
			// Move File from Drive to Trash.
			if (!file.isTrashed()) {
				file.setTrashed(true);
			}
		}
	}
}

/**
 * @param {Number} length
 */
function randomText(length) {
	const char = [
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
	];
	let text = '';
	for (let i = 0; i < length; ++i) {
		text += char[Math.floor(Math.random() * char.length)];
	}
	return text;
}

/* Google Spreadsheets Functions
-------------------------*/
/**
 * @param {SpreadsheetApp.Sheet} sheet
 */
function findRow(sheet, columns = undefined) {
	if (columns == undefined) {
		columns = sheet.getMaxColumns();
	}
	for (let i = 0; i < 2; ++i) {
		if (!sheet.getRange(sheet.getMaxRows() - 1, 1, 1, columns).isBlank()) {
			sheet.insertRowAfter(sheet.getMaxRows());
		}
	}
	let min = 2;
	let position = min;
	let max = sheet.getMaxRows();
	while (true) {
		if (sheet.getRange(position, 1, 1, columns).isBlank()) {
			if (sheet.getRange(position - 1, 1, 1, columns).isBlank()) {
				max = position;
				position = Math.floor((min + max) / 2);
			}
			else {
				return position;
			}
		}
		else {
			min = position;
			position = Math.floor((min + max) / 2);
		}
	}
}

/* Google Drive Functions
-------------------------*/
/**
 * @param {String} path
 */
function getFileByPath(path) {
	path = path.split('/');
	const fileName = path.pop();
	return getFileByFolderFileName(getFolderByPath(path.join('/')), fileName);
}

/**
 * @param {DriveApp.Folder} folder
 * @param {String} fileName
 */
function getFileByFolderFileName(folder, fileName) {
	let files = folder.getFiles();
	while (files.hasNext()) {
		let file = files.next();
		if (file.getName() == fileName) {
			return file;
		}
	}
	throw Error(`Cannot find file, ${fileName}, in folder, ${folder.getName()}.`);
}

/**
 * @param {String} path
 */
function getFolderByPath(path = './') {
	path = path.split('/');
	if (path[path.length - 1] == '') {
		path.pop();
	}
	if (path[0] == '.') {
		path.shift();
		if (!path.length) {
			return DriveApp.getRootFolder();
		}
	}
	let folder = DriveApp.getRootFolder();
	while (path.length) {
		folder = getFolderInFolder(folder, path.shift());
	}
	return folder;
}

/**
 * @param {DriveApp.Folder} currentFolder
 * @param {String} folderName
 */
function getFolderInFolder(currentFolder, folderName) {
	let folders = currentFolder.getFolders();
	while (folders.hasNext()) {
		let folder = folders.next();
		if (folder.getName() == folderName) {
			return folder;
		}
	}
	let folder = DriveApp.createFolder(randomText(15));
	folder.moveTo(currentFolder);
	folder.setName(folderName);
	return folder;
}