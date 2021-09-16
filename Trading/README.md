# Trading

## Description

### Create Trades

This script runs on the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page.

- Reads quantity and price in URL, provided by the View Trades Script's buttons, and fills out the form for you.
- Hides the buy/sell button not specified in the URL, provided by the View Trades Script's buttons.
- Removes the Confirm Buy/Sell buttons **if** one of the Buy/Sell buttons disappear.
- If the trade was successfully created then it will auto return back to the market page,
- unless the quantity in the URL was greater than 1,000,000.00 and in that case it will return to the create create offer page.
  - If this does happen then the sell/buy button will also be disabled for 5 seconds so you don't get the error message.
  - this recessiveness allows for easily creating large trades well over 1,000,000.00 tons.
- Changes colour of 'Top Offers' Tables to match that of the buy/sell buttons and fixes the bad formatting of the tables.

This script requires the View Trades Script for the first three features to be of any use.

### View Trade

This script runs on the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page.

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
  - If the Load All Trade Offers Checkbox is ticked then the quantities for TopUp will take all your offers into account instead of just that offer preventing trade offers getting cancelled.
  - Requires the Create Trade Script to work properly.
- Adds a Push button. Like the TopUp button, but lets you choose a different price to create the trade at.
  - This button won't appear unless the Load All Trade Offers Checkbox is ticked.
  - Requires the Create Trade Script to work properly.
- When you click the Push button, all TopUp buttons are replaced with Outbid buttons, and all Outbid buttons, including the new ones, have their quantities adjusted so the offer being created takes into account what's already on the market.
- When you click the Push button, all the Match and Push buttons turn into Cancel buttons, which in turn can be clicked to undo the effects of the Push Button.
- Adds Links with Resource Icons to easily and quickly switch between different markets.

The Outbid, Match, and TopUp buttons only appear if the quantity is greater than zero. So if you have zero of said resource to sell, then no button will appear offering for you to sell it.