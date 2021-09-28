// ==UserScript==
// @name         Doc: Reward-Ads
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
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
					// If "btnAds" button disappeared, and AggressiveMode is on...
					else if (localStorage.Doc_RewardAds == 'true') {
						console.log('Aggressive Mode is Active!');
						// Check if time until next ad needs to be updated.
						if (new Date(parseInt(localStorage.Doc_RewardAdsTimer)) < new Date()) {
							console.log('Changing: ' + localStorage.Doc_RewardAdsTimer);
							localStorage.Doc_RewardAdsTimer = new Date().getTime() + 1000 * 60 * 3;
						}

						// Set interval to check every second if timer is up.
						setInterval(() => {
							const ticks = parseInt(localStorage.Doc_RewardAdsTimer) - new Date().getTime();
							console.log(ticks);
							// If timer is up reset the page to run another ad.
							if (ticks < 0) {
								console.log('Resetting!');

								// Hide Stuff.
								document.getElementById('ad-watched').style.display = 'none';
								document.getElementById('countdown').style.display = 'none';

								// Display the "btnAds" button.
								document.getElementById('btnAds').style.display = '';
								console.log('Reset!');

								// Clear all existing intervals.
								clearIntervals();
							}
						}, 1000);
					}
				}
			}
		}
	}
});

// Start observing attribute changes for the "btnAds" button.
observer.observe(document.getElementById('btnAds'), { attributes: true, childList: false, subtree: false });

setTimeout(() => {
	if (localStorage.Doc_RewardAdsTimer == undefined) {
		localStorage.Doc_RewardAdsTimer = new Date().getTime();
	}

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
}, 2000);

{
	// Get User input on whether or not to set Aggressive Mode on.
	const codeTag = document.createElement('code');
	codeTag.innerHTML = `Aggressive Mode: <input id="aggressiveMode" type="checkbox" ${localStorage.Doc_RewardAds == 'true' ? 'checked' : ''}>`;
	document.getElementById('leftcolumn').appendChild(codeTag);
	document.getElementById('aggressiveMode').onchange = () => {
		const inputTag = document.getElementById('aggressiveMode');
		if (inputTag.checked) {
			localStorage.Doc_RewardAds = true;
			window.location.reload();
		}
		else {
			localStorage.removeItem('Doc_RewardAds');
		}
	};
}

function clearIntervals() {
	const id = setTimeout(() => { console.log('Cleared Old Timers!') }, 1000);
	for (let i = 0; i < id; ++i) {
		clearInterval(i);
	}
}