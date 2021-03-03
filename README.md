# DocScripts

Use with care. :)

Please create an issue here on GitHub if you find any bugs or have suggestions about improvements.

## Installation

Click on the `.user.js` script above that you'd like to have installed on [TamperMonkey](https://www.tampermonkey.net/), then click the Raw button located somewhere on your screen. [TamperMonkey](https://www.tampermonkey.net/) should take over from there prompting you with an install button.

## Script Description

### View Trades

- Changes colour of sell and buy buttons to match that of the create trade screen.
- Changes amount listed in the boxes to the actual amount you are able to buy or sell if the offerer is asking for more than you have.
- Adds an Outbid button, which allows you to easily place a trade offer $1 less than said offer.
  - Requires the Create Trade Script to work properly.
- Adds a Match button, which allows you to easily place a trade offer at the same price as said offer.
  - Requires the Create Trade Script to work properly.
- Adds a TopUp button, which allows you to easily increase your current offers on the market.
  - Requires the Create Trade Script to work properly.

The Outbid, Match, and TopUp buttons only appear if the quantity is greater than zero. So if you have zero of said resource to sell, then no button will appear offering for you to sell it.

### Create Trade

- Reads quantity and price in URL, provided by the View Trades Script's buttons, and fills out the form for you.
- Hides the buy/sell button not specified in the URL, provided by the View Trades Script's buttons.
- Removes the Confirm Buy/Sell buttons **if** one of the Buy/Sell buttons disappear.
- Auto returns back to market page if trade created successfully.

This script requires the View Trades Script for the first three features to be of any use.
