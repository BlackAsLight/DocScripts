// ==GoogleScriptApp==
// @name         Doc: Espionage Report
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Receives a Copy of Espionage Reports and saves to a Google Spreadsheet
// @author       BlackAsLight
// ==/GoogleScriptApp==

const spreadsheetID = '1JJPxw8O3mt_fEy5lqC6OIFdfB29EPzmW5rWBOFUWEcE';
const sheetName = 'Reports';
let sheet = SpreadsheetApp.openById(spreadsheetID).getSheetByName(sheetName);

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const rowNumber = findRow();
  sheet.getRange(rowNumber, 1).setValue(data.timeStamp);
  sheet.getRange(rowNumber, 2).setValue(data.report);
  sheet.getRange(rowNumber, 3).setValue(data.identifierKey);
}

function findRow() {
  for (let i = 0; i < 2; i++) {
    if (sheet.getRange(sheet.getMaxRows() - 1, 1).getValue() != '') {
      sheet.insertRows(sheet.getMaxRows());
    }
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
  return position;
}
