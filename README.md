# DocScripts

Use with care. :)

Please create an issue here on GitHub if you find any bugs, have suggestions about improvements or other script ideas.

For those of you who find yourselves here and don't know GitHub. All the code above is open source. Meaning you can check it all out for malicious code, or if you can't read JavaScript, someone you trust can check it out for malicious code. Answers to some commonly asked questions:
1. No, none of these scripts breaks the game rules.
2. I can't tell if you do or don't choose to install these scripts. I don't get a notification of any sorts if you decide to install or run any of it.
3. Likewise, I cannot see any information it provides or collects for you. All I can do is provide you with simple step by step guides for set up and hope you did it right.

## Installation

### For Chrome, Microsoft Edge, Firefox, Opera Next, Dolphin Browser, and UC Browser users
Note: [TamperMonkey](https://www.tampermonkey.net/), or alike, needs to be installed on your modern browser of choice to install and run these scripts. If you do not know how to install an extension on your browser of choice then [YouTube](https://www.youtube.com/) it.
1. Click on the `.user.js` script above that you'd like to have installed on [TamperMonkey](https://www.tampermonkey.net/).
2. Click the Raw button located somewhere on your screen.
3. [TamperMonkey](https://www.tampermonkey.net/) should take over from there prompting you with an install button.
4. Click said install button.
5. You're done. Go to the pages the respective scripts run on and watch the magic.

### For Safari Users

Safari users can download [TamperMonkey](https://www.tampermonkey.net/) from the App Store, but it isn't free like it is for other browsers, so a free alternative for Safari users is [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12). Once [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) is installed and **activated** on Safari:
1. Click on the `.user.js` script above that you'd like to have installed on [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12).
2. Click the Raw button located somewhere on your screen.
3. A new window will have opened. Click the green Confirm Installation button at the top right of your window.
4. You're done. You can close the tab/s and go to the pages the respective scripts run on and watch the magic.

### For Android Users

It has not been tested, but according to the Internet, there is an app called Kiwi Browser, downloadable off the Google Play Store, which supports Chrome extensions. Meaning you can install TamperMonkey, through the Chrome store, on said browser and theoretically use these scripts on your phone as well.

Again, this has not been tested, and that is only due to the fact that I do not own an Android.

### For iOS Users

iOS users are pretty much screwed. In my search for answers, I have only found one app that would allow my scripts to run on said iOS device. It's called [Gear Browser](https://apps.apple.com/au/app/gear-browser/id1458962238), and while the app is free for download the add-on feature that would run my scripts is sadly not. The app wants you to pay for a subscription to gain access, which is also the reason the app has such a low rating.

**BUT** things might not always look so doom and gloom for you iOS users. If all goes to plan, and if I'm smart enough to do it, I'll be releasing my own browser app, for free, that can run UserScripts.

## Updates

### TamperMonkey
[TamperMonkey](https://www.tampermonkey.net/) can check and install updates published here automatically and is enabled by default. If you make any updates to the script in [TamperMonkey](https://www.tampermonkey.net/) yourself then it will stop checking for updates, until otherwise told to.

If you'd like to check if it's checking for updates or want to either enable/disable it from doing so then: 
1. Click on the TamperMonkey icon and go to it's dashboard. (Based off different browsers this could look slightly differently.)
2. Click on the script you wish to check. A tab should open listed with that script name.
3. Click on the Settings button for said script. 
4. Look for the Check for Updates checkbox.
5. Either Enable or Disable it and Click that Save button.
6. Close the tab and you're done.

Again: Saving any changes to the script's code itself will un-tick that box.

### MeddleMonkey

[MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) can check and install updates published here automatically and in enabled by default.
Unlike [TamperMonkey](https://www.tampermonkey.net/), [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) only has the "Auto Update All or Nothing" Feature.

If you'd like to check if it's checking for updates or want to either enable/disable it from doing so then:
1. On the top of the browser to the left of the address bar, click on the [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) icon then click Manage Scripts.
2. Click on the Settings button located on the sidebar.
3. And make sure "Automatically check scripts for updates every day" checkbox is either ticked or un-ticked, based on your desire.

## Server

As you might have noticed some of these Scripts have a `Server.js` file associated with them. Setup for these are not done the same way as the `.user.js` Scripts, but instead require you to have a Google account so you can install them on [Google's App Script](https://script.google.com/home) and have it run on Google's cloud.

Below is general instructions on how to setup a `Server.js` file. You will be instructed part way through to return back to that Script's Server section to make any changes specific to that Script's needs, before returning here to finish the setup.

1. To go [Google App Script](https://script.google.com/home).
2. Click on New Project.
3. Give the project a name. It can be whatever you want, but it's probably best to give it the same name as the Script.
4. Delete the code already in there and copy-paste the contents of the `Server.js` file associated with the Script you want.
5. Return back to the Server section of the Script that instructed you to come here, and follow those instructions to make the specific changes necessary for said `Server.js`.
6. Now that you've done the specifics for that `Server.js`, either hit the Save icon or do `Ctrl + S` (or `CMD + S` for Mac users), so the Save icon grays out.
   - It is very important that you click Save before proceeding onto the next bit.
7. Click the blue Deploy button, followed by New Deployment.
8. Click the Cog wheel icon for Select Type and select Web App from the dropdown list.
9. Set the description to whatever you want. It would be best to include the version number in the description.
10. Set Who Can Access to Anyone.
11. Click Deploy.
14. After a few seconds of it processing, it will display an Authorization button. You will need to go ahead and click it. You'll need to give the script the access it needs to work properly.
15. After that, a URL will display on the screen. Click the Copy button and use it how the Script intended it to be used.

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
