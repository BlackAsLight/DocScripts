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

- Sets Sell/Buy button colours to match that on the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page.
- If the amount you're able to Sell/Buy is less than the Offer, the amount listed in the box will be changed to what you're actually able to Sell/Buy.
- Can load all Offers that meet the specified filter results, instead of being limited to 100 offers.
  - To activate, tick the `Load All Offers` checkbox, located at the bottom of the left sidebar.
- Adds an Outbid button, to other people's offers, which allows you to easily create a trade offer at a better price of $1.
  - Requires the Create Trade Script to work properly.
  - If the `Load All Offers` checkbox is ticked then the quantities listed in the link will take into account exiting offers on the market.
- Adds a Match button, to other people's offers, which allows you to easily create a trade offer at the same price.
  - Requires the Create Trade Script to work properly.
  - If the `Load All Offers` checkbox is ticked then the quantities listed in the link will take into account exiting offers on the market.
- Adds a TopUp button, to your offers, which allows you to easily create a trade a trade offer at the same price. Due to how the game works, it will just end up increasing the quantity of the existing one and updating the created date
  - Requires the Create Trade Script to work properly.
  - If the `Load All Offers` checkbox is ticked then the quantities listed in the link will take into account exiting offers on the market.
- Adds Market Links, with Resource Icons, at the top of the page, to easily and quickly switch between different markets.

The Outbid, Match, and TopUp buttons only appear if the calculated quantity is greater than zero. So if you have zero of said resource to sell, then no button will appear offering for you to sell it.

### Quick Scroll

This script runs on the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page. It checks to see if the page has a mis-trade on it, and if so, scrolls down to it making it center-ish of your screen. Only checks on the global market, when looking at a specific resource (not all resources), and both buy/sell offers are displayed.