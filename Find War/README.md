# Find War

Consolidates information about potential raiding targets on the Nations page when searching by War Range. The best way to access this page is to your [War page](https://politicsandwar.com/nation/war/) and click on that big orange "Find Nations in War Range" button.

## Version Compatibility

As of v1.3 for the Client Script, the server version is no longer required. Feel free to go to [Google App Script](https://script.google.com/home) and delete it.

The Versions of Client that are compatible with Server.
 - Client | Server
 - v0.1-0.4 | Nil
 - v0.5-0.6 | v0.1
 - v0.7-1.2 | v0.2
 - v1.3 | Nil

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
   - Could display 0-3 of ![Shield with Plus Icon](https://politicsandwar.com/img/icons/16/plus_shield.png) indicating the number of available slots the nation has left.
   - Will display info of recently completed wars. Max of 3.
     - Most recent will be highlighted in green.
	 - Displays info like:
	   - Loot
	   - Type of War
	   - Who won and against Who
	   - When the war was declared (Displayed in your local time)
	   - and A link to the timeline for further inspection

The Script also adds a button at the bottom of the left sidebar and you're required to provide it the URL it seeks created from the Server part under Installation.

## Installation

Simply install `Client.user.js`, found here above, like any of the other Scripts. Instructions on how to do this, if you're unsure, can be found on the [Main page](https://github.com/BlackAsLight/DocScripts#installation) of this GitHub repository.
Do note that this script does require you to provide your API Key which can be found on the bottom of the Accounts Page.
