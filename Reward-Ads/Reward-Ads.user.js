// ==UserScript==
// @name         Doc: Reward-Ads
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
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
	}
});

// Starts observing attribute changes for the "btnAds" button.
observer.observe(document.getElementById('btnAds'), { attributes: true, childList: false, subtree: false });

// Three second delay to give page time to decide if the button can be clicked or should be hidden.
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
	}
}, 3000);
