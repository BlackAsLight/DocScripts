# Find War

Consolidates information about potential raiding targets on the Nations page when searching by War Range. The best way to access this page is to your [War page](https://politicsandwar.com/nation/war/) and click on that big orange "Find Nations in War Range" button.

## Description

This Script changes the layout of the table massively splitting it up into three different sections:
1. General info, like:
   - Leader Name
     - If the Leader Name has a sword icon next to it, then it means the target has an available slot and that you're in war range. You can click it to open a new window that will take you directly to their War Declaration page.
   - Nation Name
   - Alliance Name
   - Continent
   - Last Active (Displayed in your local time)
   - No. of Cities
   - Nation's Color
   - Founded Date
   - Nation's Score
2. Military
   - Lists Soldiers, Tanks, Planes, Ships, Missiles, and Nuke count of said Nation.
   - Could contain ![Shield with Tick Icon](https://politicsandwar.com/img/icons/16/tick_shield.png) indicating you're within War Range.
   - Could contain ![Spy Emoji Icon](https://politicsandwar.com/img/icons/16/emotion_spy.png) indicating you're within Spy Range.
3. War History
   - Still under development in the department of displaying said War History, but...
   - Could display 0-3 of ![Shield with Plus Icon](https://politicsandwar.com/img/icons/16/plus_shield.png) indicating the number of available slots the nation has left.

The Script also adds two buttons at the bottom of the left sidebar.
 - An API Key button for you to provide the Script with your API Key. Your API Key can be found at the bottom of your [Account page](https://politicsandwar.com/account/#7)
   - You will need to provide your API Key for this script to work. Until it is provided it won't change the table at all.
   - If you'd like to remove your API Key from the script then just make the prompted box blank and hit the Ok button. The page will reload after removing your API Key from your browser's cookies.
 - An Auto Load button for you to provide the URL provided by the Server Part.
   - Again, the Server Part of this Script is completely optional. If you choose not to implement it then you'll just ignore this button and instead a Load Military button will appear in the Military section of each nation on the table.

## Installation

### Client

Simply install `Client.user.js`, found here above, like any of the other Scripts. Instructions on how to do this, if you're unsure, can be found on the [Main page](https://github.com/BlackAsLight/DocScripts#installation) of this GitHub repository.

You will need to provide this script with your API Key for this script to work. Look at the Description section of this page for information about how to do that.

### Server

Do Note: The setup of the `Server.js` file is completely optional. Choosing to set it up will allow the Script to load all the military data of the nations in the table automatically, and save it to a spreadsheet in your Google Drive so if you refresh the page within a half an hour it will call the data from the spreadsheet instead of using more API Calls. Choosing not to set it up will instead result in a Load Military button appearing in the Military section of each nation on the table. Not setting it up will result in an API Call every time you click the Load Military button.

Side Note: If you wanted to, you could share the URL, this section will provide, with a few people in a similar War Range to you, that you **Trust** not to log fake API Calls.

To setup `Server.js`, you first go to the [Server](https://github.com/BlackAsLight/DocScripts#server) section on the [Main page](https://github.com/BlackAsLight/DocScripts) of this GitHub repository. Follow those general setup instructions and when prompted to, come back here specific details regarding setup, before returning back there to finish the setup.

Specific Installation Details:
1. Open this Google Spreadsheet Template [Doc: Find War - Template](https://docs.google.com/spreadsheets/d/152OFvCwo6OdzDvL7aVN3Uiaj1uLMU-qfSwcde1RBAUw/edit?usp=sharing) and select Make a Copy found under the File dropdown button on the menu bar.
2. In the newly created copy of the spreadsheet you just made. Go to it's URL and copy the string of text between `/d/` and `/edit#gid=0`.
3. Once copied, you'll want to go back to the Google App Script tab, and paste it in between the `''` single quotation marks for the variable `spreadsheetID` found on line 9.
4. Return back to the Server section on the main page for the second half of the installation instructions.
