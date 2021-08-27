# Espionage Report
Automatically collect your, or your alliance members, reports of espionage operations neatly in a spreadsheet the moment they execute them.

If you want this script just for personal use then you need to do both parts. Client and Server. If you want this script for alliance use then the government, or someone with authority and trust needs to set up the Server Part, while everyone else installs the Client Script.

## Version Compatibility

The Versions of Client that are compatible with Server.
 - Client | Server
 - v0.1-0.2 | v0.1-0.3

## Description

### Client

 - Adds a Report URL button at the bottom of the left sidebar for inserting the URL provided by the Server Part.
 - Adds an Identifer Key button at the bottom of the left sidebar.
   - If your alliance controls the Server Part then you'll need to receive an Identifier Key from them.
   - If you control the Server Part then you can insert whatever you want in the prompted box, that appears when clicking on said button, but it cannot be left blank, otherwise the script will not send the reports to the Server Part.
 - If both parameters are provided, a Report URL and Identifier Key, then whenever you do an espionage operation, a copy of the report will be automatically sent to the Server Part.

This Script requires the setup of the Server Part to be of any use. There is no point in installing this Script if the Server Part isn't setup.

### Server

 - Receives reports from the Client Script and saves it in your Google Drive,
 - To then later be moved into a Spreadsheet.

This Part requires the Client Script to be installed on at least one browser to be of any use. There is no point in setting this Part up if the Client Script isn't installed.

## Installation

### Client
Simply install the `Client.user.js` Script, found here above, like any of the other Scripts. Instructions on installation can be found on the [main page](https://github.com/BlackAsLight/DocScripts#installation).

1. Once installed you'll need a URL provided by the Server Part, and an Identifier Key.
2. Simply go to any [Espionage](https://politicsandwar.com/nation/espionage/eid=6) page in game. Your own will even work.
3. On the left sidebar at the bottom you'll find two buttons. Insert Report URL and Insert Identifier Key.
   - These buttons will change to Update Report URL and Update Identifier Key when they have been provided with something and upon refresh.
4. Click on each button and provide the desired info into the prompted box that appears on screen.

Once a URL **and** Identifer Key has been provided to the Script, whenever you do an espionage operation, a copy of the report will be automatically sent to the Server Part.

### Server

To setup `Server.js`, you first go to the [Server](https://github.com/BlackAsLight/DocScripts#server) section on the [Main page](https://github.com/BlackAsLight/DocScripts) of this GitHub repository. Follow those general setup instructions and when prompted to, come back here for specific details regarding setup, before returning back there to finish the setup.

Specific Setup Details:
1. Open this Google Spreadsheet Template [Doc: Espionage Report - Template](https://docs.google.com/spreadsheets/d/1JJPxw8O3mt_fEy5lqC6OIFdfB29EPzmW5rWBOFUWEcE/edit?usp=sharing) and select Make a Copy found under the File dropdown button on the menu bar.
2. Once a copy has been made, in the copied spreadsheet URL you'll want to copy the string of text between `/d/` and `/edit#gid=0`.
3. You'll then want to go back to the Google App Script tab and paste in between the `''` single quotation marks for the variable `spreadsheetID` found on line 9.
4. Return back to the [Server](https://github.com/BlackAsLight/DocScripts#server) section on the [Main page](https://github.com/BlackAsLight/DocScripts) for the second half of the setup instructions.

#### Triggers

As of v0.2 for `Server.js`, this Script does have one Trigger that needs to be set up. It's function is called **triggerUpdate** and it would probably be best to run this trigger every hour to every 15 mins based on how many reports you expect to get per day.

Go to the [main page](https://github.com/BlackAsLight/DocScripts#server) and scroll down to the Triggers heading under the Server section for instructions on how to add a trigger.

That's everything you need to do to set up the Server Part. Granted that you've done it all correct it will work. You can share the spreadsheet you made a copy of with anyone you want to view the reports and also customise the other bits around it to suit your business more.
