# DocScripts

Use with care. :)

Please create an issue here on GitHub if you find any bugs, have suggestions about improvements or other script ideas.

## Installation

Note: [TamperMonkey](https://www.tampermonkey.net/), or alike, needs to be installed on your modern browser of choice to install and run these scripts. If you do not known how to install an extension on your browser of choice then [YouTube](https://www.youtube.com/) it.
1. Click on the `.user.js` script above that you'd like to have installed on [TamperMonkey](https://www.tampermonkey.net/).
2. Click the Raw button located somewhere on your screen.
3. [TamperMonkey](https://www.tampermonkey.net/) should take over from there prompting you with an install button.
4. Click said install button.
5. You're done. Go to the pages the respective scripts run on and watch the magic.

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

- Adds a Load button, which displays:
  - When they were last active. (In your timezone not the games)
  - Their GDP.
  - Their current Soldiers, Tanks, Planes, Ships, Missiles, and Nukes.
  - and adds a Load More button which displays:
    - Their Avg Commerce.
    - Number of Cities Powered.
    - and their average Infrastructure.

Note: You need to provide your API Key, found at the bottom of the Accounts page, to the script. You'll find an Insert API Key botton at the bottom of the sidebar for you to insert it.
You can easily remove it by making the prompt box blank and hitting the Okay or Submit button.
