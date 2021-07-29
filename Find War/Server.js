// ==GoogleScriptApp==
// @name         Doc: Find War
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Middle Man Between UserScript and Politics & War API
// @author       BlackAsLight
// ==/GoogleScriptApp==

const apiKeys = ['']

function doPost(e) {
	return ContentService.createTextOutput(UrlFetchApp.fetch('https://api.politicsandwar.com/graphql?api_key=' + apiKeys[Math.floor(Math.random() * apiKeys.length)], {
		'method': 'POST',
		'payload': { query: `{ nations(first: 50, id: [${JSON.parse(e.postData.contents).join(', ')}]) { data { id leader_name continent last_active soldiers tanks aircraft ships missiles nukes treasures { name color continent bonus spawndate } offensive_wars { id date war_type winner attacker { id nation_name leader_name alliance { id name }} defender { id nation_name leader_name alliance { id name }} attacks { type loot_info }} defensive_wars { id date war_type winner attacker { id nation_name leader_name alliance { id name }} defender { id nation_name leader_name alliance { id name } } attacks { type loot_info }}}}}` }
	}).getContentText());
}
