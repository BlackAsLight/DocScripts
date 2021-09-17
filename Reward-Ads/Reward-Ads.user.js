// ==UserScript==
// @name         Doc: Reward-Ads
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.3
// @description  Autoplay Reward Ads
// @author       BlackAsLight
// @match        https://politicsandwar.com/rewarded-ads/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
// Creates an observer for mutations for elements.
const observer = new MutationObserver((list) => {
	for (const mutation of list) {
		if (mutation.target.id == 'btnAds') {
			if (mutation.type == 'attributes') {
				if (mutation.attributeName == 'style') {
					// If "btnAds" button shows up again...
					if (mutation.target.style.display != 'none') {
						// Then check if we've hit the max for today...
						if (document.getElementById('rewarded_ads_watched_today').textContent == '25') {
							// If so then go to our Nation page.
							window.location = document.getElementsByClassName('sidebar')[1].getElementsByTagName('a')[0].href;
						}
						else {
							// If not then click button.
							mutation.target.click();
							console.log('Clicked!');
						}
					}
				}
			}
		}
		// If "countdown" text shows up.
		else if (mutation.target.id == 'countdown') {
			console.log('Timer Set To Reload Page!');
			// Reload the page in 3 mins.
			setTimeout(() => {
				console.log('Reloading Page!');
				window.location.reload();
			}, 1000 * 60 * 3); // Milliseconds * Seconds * Minutes
		}
	}
});

{
	// Get User input on whether or not to set Aggressive Mode on.
	const codeTag = document.createElement('code');
	codeTag.innerHTML = `Aggressive Mode: <input id="aggressiveMode" type="checkbox" ${localStorage.Doc_RewardAds == 'true' ? 'checked' : ''}>`;
	document.getElementById('leftcolumn').appendChild(codeTag);
	document.getElementById('aggressiveMode').onchange = () => {
		const inputTag = document.getElementById('aggressiveMode');
		if (inputTag.checked) {
			localStorage.Doc_RewardAds = true;
			setTimeout(() => {
				console.log('Reloading Page!');
				window.location.reload();
			}, 1000 * parseInt(document.getElementById('countdown').textContent.split(' ')[5])); // Milliseconds * Seconds
		}
		else {
			localStorage.removeItem('Doc_RewardAds');
			console.log('Reloading Page!');
			window.location.reload();
		}
	};
}

setTimeout(() => {
	// Check if we've hit the max for today...
	if (document.getElementById('rewarded_ads_watched_today').textContent == '25') {
		// If so then go to our Nation page.
		window.location = document.getElementsByClassName('sidebar')[1].getElementsByTagName('a')[0].href;
	}
	else {
		// If not then if button is displayed...
		const adTag = document.getElementById('btnAds');
		if (adTag.style.display != 'none') {
			// Click button.
			adTag.click();
			console.log('Clicked!');
		}
		else {
			// If Aggressive Mode is on...
			if (localStorage.Doc_RewardAds == 'true') {
				// Start observing attribute changes for the countdown display.
				observer.observe(document.getElementById('countdown'), { attributes: true, childList: false, subtree: false });
			}
			else {
				// Else Start observing attribute changes for the "btnAds" button.
				observer.observe(document.getElementById('btnAds'), { attributes: true, childList: false, subtree: false });
			}
		}
	}
}, 3000);
