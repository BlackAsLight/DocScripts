// ==UserScript==
// @name         Doc: Reward-Ads
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
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
						// Click said button.
						mutation.target.click();
						console.log('Clicked!');
					}
				}
			}
		}
	}
});

// Starts observing attribute changes for the "btnAds" button.
observer.observe(document.getElementById('btnAds'), { attributes: true, childList: false, subtree: false });

// Click "btnAds button if needed when page loads.
setTimeout(() => {
	const adTag = document.getElementById('btnAds');
	if (adTag.style.display != 'none') {
		adTag.click();
		console.log('Clicked!');
	}
}, 3000);
