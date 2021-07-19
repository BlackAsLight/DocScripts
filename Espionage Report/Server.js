// ==GoogleScriptApp==
// @name         Doc: Espionage Report
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Receives a Copy of Espionage Reports and saves to a Google Spreadsheet
// @author       BlackAsLight
// ==/GoogleScriptApp==

const spreadsheetID = '';
const sheetName = 'Reports';
const sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);
const folderPath = './Espionage/';

function doPost(e) {
	const data = JSON.parse(e.postData.contents);
	const folder = getFolderByPath(folderPath);
	let fileName = `ER-${randomText(15)}.json`;
	let check = true;
	while (check) {
		try {
			// Checks whether file name exists or not.
			getFileByFolderFileName(folder, fileName);
			// If it does exist then no error will be thrown and file name will be changed to try again.
			fileName = `ER-${randomText(15)}.json`;
		}
		catch {
			// If an error is thrown then the file doesn't exist.
			check = false;
		}
	}
	folder.createFile(fileName, JSON.stringify(data));
}

function triggerUpdate() {
	const folder = getFolderByPath(folderPath);
	let files = folder.getFiles();
	while (files.hasNext()) {
		const file = files.next();
		if (file.getName().startsWith('ER-')) {
			const data = JSON.parse(file.getBlob().getDataAsString());
			const row = findRow(sheet);
			sheet.getRange(row, 1, 1, 3).setValues([[data.timeStamp, data.report, data.identifierKey]]);
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
function findRow(sheet) {
	for (let i = 0; i < 2; ++i) {
		if (!sheet.getRange(sheet.getMaxRows() - 1, 1, 1, sheet.getMaxColumns()).isBlank()) {
			sheet.insertRowAfter(sheet.getMaxRows());
		}
	}
	let min = 2;
	let position = min;
	let max = sheet.getMaxRows();
	while (true) {
		if (sheet.getRange(position, 1, 1, sheet.getMaxColumns()).isBlank()) {
			if (sheet.getRange(position - 1, 1, 1, sheet.getMaxColumns()).isBlank()) {
				max = position;
				position = Math.floor((min + position) / 2);
			}
			else {
				return position;
			}
		}
		else {
			min = position;
			position = Math.floor((position + max) / 2);
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