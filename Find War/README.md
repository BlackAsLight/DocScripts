# Find War

Consolidates information about potential raiding targets on the Nations page when searching by War Range. The best way to access this page is to your [War page](https://politicsandwar.com/nation/war/) and click on that big orange "Find Nations in War Range" button.

## Version Compatibility

The Versions of Client that are compatible with Server.
 - Client | Server
 - v0.1-0.4 | Nil
 - v0.5-0.6 | v0.1
 - v0.7-0.8 | v0.2

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
   - Recently finished development, but I'm tired so will write something describing it later.
   - Could display 0-3 of ![Shield with Plus Icon](https://politicsandwar.com/img/icons/16/plus_shield.png) indicating the number of available slots the nation has left.

The Script also adds a button at the bottom of the left sidebar and you're required to provide it the URL it seeks created from the Server part under Installation.

## Installation

### Client

Simply install `Client.user.js`, found here above, like any of the other Scripts. Instructions on how to do this, if you're unsure, can be found on the [Main page](https://github.com/BlackAsLight/DocScripts#installation) of this GitHub repository.

You will need to complete the Server half for this script for it to work. Look at the Description section of this page for information about how to do that.

### Server

Setting up this Server section is required for the Client section to work. If you do not want to set this bit up then don't bother installing the Client section on your device.

Side Note: If you wanted to, you could share the URL, this section will provide, with a few people that you **Trust** to not abuse the system.

To setup `Server.js`, you first go to the [Server](https://github.com/BlackAsLight/DocScripts#server) section on the [Main page](https://github.com/BlackAsLight/DocScripts) of this GitHub repository. Follow those general setup instructions and when prompted to, come back here specific details regarding setup, before returning back there to finish the setup.

Specific Installation Details:
1. Paste your API Key in between the two single quotation marks `'` for the variable apiKeys located on line 9.
2. Return back to the Server section on the main page for the second half of the installation instructions.

If you'd like to share the URL with other people using the script then you can, and if you all trust each other enough you can put more than one API Key in the server side. If there are multiple keys then it will use them randomly.