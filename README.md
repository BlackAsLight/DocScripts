# DocScripts

This is a GitHub respository of a bunch of scripts made by Doctor for a game called Politics and War.

**Please** scroll down and read how to [install](https://github.com/BlackAsLight/DocScripts#installation) these scripts and look in the individual folders for descriptions of said scripts.

**DO NOT** ask me how to do this or that unless you have read, followed, and _failed_ the [installation](https://github.com/BlackAsLight/DocScripts#installation) instructions.

## Installation

Please note that these scripts might have settings or require additional information from you the user upon setup. To provide the script with this info or configure it's available settings, go to the respective page the scripts run on and scroll down to the bottom of the left sidebar. That is where you'll find, if any, the scripts configurable settings or additional information needs. At no time will a script meant for the client side require you to edit the code.

### For Chrome, Microsoft Edge, Firefox, Opera Next, Dolphin Browser, and UC Browser users
Note: [TamperMonkey](https://www.tampermonkey.net/), or alike, needs to be installed on your modern browser of choice to install and run these scripts. If you do not know how to install an extension on your browser of choice then [YouTube](https://www.youtube.com/) it. Once [TamperMonkey](https://www.tampermonkey.net/), or alike, is installed on your browser of choice:
1. Click on the `.user.js` script above that you'd like to have installed on [TamperMonkey](https://www.tampermonkey.net/), or alike.
2. Click the Raw button located somewhere on your screen.
3. [TamperMonkey](https://www.tampermonkey.net/), or alike, should take over from there prompting you with an install button.
4. Click said install button.
5. Go to the page the script runs on and check at the bottom of the left sidebar if it has any settings that might need to be configured/ additional information need to be provided.

### For Safari Users

Safari users can download [TamperMonkey](https://www.tampermonkey.net/) from the App Store, but it isn't free like it is for other browsers, so a free alternative for Safari users is [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12). Once [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12) is installed and **activated** on Safari:
1. Click on the `.user.js` script above that you'd like to have installed on [MeddleMonkey](https://apps.apple.com/au/app/meddlemonkey/id1539631953?mt=12).
2. Click the Raw button located somewhere on your screen.
3. A new window will have opened. Click the green Confirm Installation button at the top right of your window.
4. Go to the page the script runs on and check at the bottom of the left sidebar if it has any settings that might need to be configured/ additional information need to be provided.

### For Android Users

It has not been tested, but according to the Internet, there is an app called Kiwi Browser, downloadable off the Google Play Store, which supports Chrome extensions. Meaning you can install [TamperMonkey](https://www.tampermonkey.net/), through the Chrome store, on said browser and theoretically use these scripts on your phone as well.

Again, this has not been tested, and that is only due to the fact that I do not own an Android. Since it has not been tested, I am unable to provide a step by step guide on how to install these scripts.

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
8. Click the Settings Button (Cog wheel icon) for Select Type and select Web App from the dropdown list.
9. Set the description to whatever you want. It would be best to include the version number in the description.
10. Set Who Can Access to Anyone.
11. Click Deploy.
14. After a few seconds of it processing, it will display an Authorization button. You will need to go ahead and click it. You'll need to give the script the access it needs to work properly.
15. After that, a URL will display on the screen. Click the Copy button and use it how the Script intended it to be used.

### Triggers

If the Server side script has triggers then follow these steps to set it up. Assuming you have the [Google App Script](https://script.google.com/home) Project open and looking at it's code:
1. Click the Triggers Button (Clock/Stopwatch Icon) located at the left of the window.
2. Click Add Trigger located at the bottom right of the window.
3. Select the appropriate function from the drop down list. Will most likely start with the word "trigger", but if unsure look at the Server section for the specific Script for answers.
4. set `time based trigger` and `interval` to what the Server section for the specific Script dictates or whatever you want.
   - Best not to set it to run every minute though as that might cause problems.
5. Click Save.

### Updating

Just like the User Scripts get updates, so do these Server side Scripts. The best way to update them would be to open the Project up and replace the old code with the new code. Make sure you follow the Server specific instructions for said Script so it works the first time around.

Once you've done that:
1. Hit the Save icon or do `Ctrl + S` (or `CMD + S` for Mac users), so the Save icon grays out.
2. Click the blue Deploy button, followed by Manage Deployments.
3. Click the Edit Button (Pencil Icon).
4. Then set the Version to New Version.
5. Set the description to whatever you want. It would be best to include the version number in the description.
6. Click Deploy.
7. If the update needs new authorization then an Authorization button will appear. You'll need to go ahead and click it. You'll need to give the script the access it needs to work properly.
8. The URL will appear for use. It is the exact same one as before so no need to update the Client side.
