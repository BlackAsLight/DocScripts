# DocScripts

This is a GitHub repository of a bunch of scripts made by Doctor for a game called Politics and War.

## DO NOT

...ask me how to do this or that unless you have read, followed, and *failed* the [installation](https://docscripts.stagintin.com/#installation) instructions found on the website.

## Installation && Updates

Head to the [Wiki](https://github.com/BlackAsLight/DocScripts/wiki) for instructions on how to install/update these scripts.

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
