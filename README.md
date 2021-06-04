# DocScripts

Use with care. :)

Please create an issue here on GitHub if you find any bugs, have suggestions about improvements or other script ideas.

## Installation

### For Chrome, Microsoft Edge, Firefox, Opera Next, Dolphin Browser, and UC Browser users
Note: [TamperMonkey](https://www.tampermonkey.net/), or alike, needs to be installed on your modern browser of choice to install and run these scripts. If you do not know how to install an extension on your browser of choice then [YouTube](https://www.youtube.com/) it.
1. Click on the `.user.js` script above that you'd like to have installed on [TamperMonkey](https://www.tampermonkey.net/).
2. Click the Raw button located somewhere on your screen.
3. [TamperMonkey](https://www.tampermonkey.net/) should take over from there prompting you with an install button.
4. Click said install button.
5. You're done. Go to the pages the respective scripts run on and watch the magic.

### For Safari Users

Safari users can download [TamperMonkey](https://www.tampermonkey.net/) from the App Store, but it isn't free like it is for other browsers, so a free alternative for Safari users is [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12). Once [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) is installed and **activiated** on Safari:
1. Click on the `.user.js` script above that you'd like to have installed on [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12).
2. Right click the Raw button located somewhere on your screen and click Copy Link.
3. On the top of the browser to the left of the address bar, click on the [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) icon then click Manage Scripts.
4. Click on the Install From URL button at the top of the window and you'll be prompted with a textbox.
5. Paste the copied link into this provided textbox and then click Ok.
6. A new window will have opened. Click the green Confirm Installation button at the top right of your window.
7. You're done. You can close the tab/s and go to the pages the respective scripts run on and watch the magic.

### For Android Users

It has not been tested, but according to the Internet, there is an app called Kiwi Browser, downloadable off the Google Play Store, supports Chrome extentsions. Meaning you can install TamperMonkey, through the Chrome store, on said browser and theoretically use these scripts on your phone as well.

Again, this has not been tested, and that is only due to the fact that I do not own an Android.

### For iOS Users

iOS users are pretty much screwed. In my search for answers, I have only found one app that would allow my scripts to run on said iOS device. It's called [Gear Browser](https://apps.apple.com/au/app/gear-browser/id1458962238), and while the app is free for download the add-on feature that would run my scripts is sadly not. The app wants you to pay for a subscription to gain access, which is also the reason the app has such a low rating.

**BUT** things might not always look so doom and gloom for you iOS users. If all goes to plan, and if I'm smart enough to do it, I'll be releasing my own browser app, for free, that can run userscripts.

## Updates

### TamperMonkey
[TamperMonkey](https://www.tampermonkey.net/) can check and install updates published here automatically and is enabled by default. If you make any updates to the script in [TamperMonkey](https://www.tampermonkey.net/) yourself then it will stop checking for updates, until otherwised told to.

If you'd like to check if it's checking for updates or want to either enable/disable it from doing so then: 
1. Click on the TamperMonkey icon and go to it's dashboard. (Based off different browsers this could look slightly differently.)
2. Click on the script you wish to check. A tab should open listed with thata script name.
3. Click on the Settings button for said script. 
4. Look for the Check for Updates checkbox.
5. Either Enable or Disable it and Click that Save button.
6. Close the tab and you're done.

Again: Saving any changes to the script's code itself will untick that box.

### MeddleMonkey

[MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) can check and install updates published here automatically and in enabled by default.
Unlike [TamperMonkey](https://www.tampermonkey.net/), [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) only has the "Auto Update All or Nothing" Feature.

If you'd like to check if it's checking for updates or want to either enable/disable it from doing so then:
1. On the top of the browser to the left of the address bar, click on the [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) icon then click Manage Scripts.
2. Click on the Settings button located on the sidebar.
3. And make sure "Automatically check scripts for updates every day" checkbox is either ticked or unticked, based on your desire.

## Script Description

### View Trades

This script runs on the Trades Page.

- Changes colour of sell and buy buttons to match that of the create trade screen.
- Changes amount listed in the boxes to the actual amount you are able to buy or sell if the offerer is asking for more than you have.
- Provides the ability to load all trade offers (refined to your search) instead of your default amount listed.
  - A checkbox can be found on the left side of the screen to toggle on and off this feature.
  - This feature and the checkbox will not show up when viewing your own trade screen.
- Adds an Outbid button, which allows you to easily place a trade offer $1 less than said offer.
  - Requires the Create Trade Script to work properly.
- Adds a Match button, which allows you to easily place a trade offer at the same price as said offer.
  - Requires the Create Trade Script to work properly.
- Adds a TopUp button, which allows you to easily increase your current offers on the market.
  - Requires the Create Trade Script to work properly.
- Adds Links with Resource Icons to easily and quickly switch between different markets.

The Outbid, Match, and TopUp buttons only appear if the quantity is greater than zero. So if you have zero of said resource to sell, then no button will appear offering for you to sell it.

### Create Trade

This script runs on the Create Trade page.

- Reads quantity and price in URL, provided by the View Trades Script's buttons, and fills out the form for you.
- Hides the buy/sell button not specified in the URL, provided by the View Trades Script's buttons.
- Removes the Confirm Buy/Sell buttons **if** one of the Buy/Sell buttons disappear.
- Auto returns back to market page if trade created successfully.
- Changes colour of 'Top Offers' Tables to match that of the buy/sell buttons and fixes the bad formatting of the tables.

This script requires the View Trades Script for the first three features to be of any use.

### Find War

This script runs on the Nations page.

- Majorly changes the UI of the Nation's Page when viewing Nation's in war range. A more detailed discription will be provided when I can think of a way to describe it. Click the Find Nations in War Range button on this page to see the magic. https://politicsandwar.com/nation/war/

Note: You need to provide your API Key, found at the bottom of the Accounts page, to the script. You'll find an Insert API Key botton at the bottom of the sidebar for you to insert it.
You can easily remove it by making the prompt box blank and hitting the Okay or Submit button.
