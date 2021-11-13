# Trading

## Description

### Create Trade

This script runs on the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page, and the unique URLs mentioned in this script are provided by the View Trades Script.

- Auto scrolls the form to the centre of your page.
- Fills out the Quantity and Price of the form **if** it is provided in the URL.
- Hides the Sell/Buy button that is not specified in the URL **if** one is provided in the URL.
- When trades are successfully created, you get auto returned to the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page that you were last on.
- Unless the Quantity provided in the URL was greater than 1m tons. In that case it will return to the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page.
  - When you do get return to the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page, the Sell/Buy button that is still present will be disabled for 5s so you don't run into an error message.
- Formats the 'Top Offers' Table to match tht of the Sell/Buy buttons and fixes the bad formatting of the tables.

This script requires the View Trades Script for the majority of it's functionality to be used.

### View Trade

This script runs on the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page, and is designed to work in tandem with the Create Trade Script.

- Sets the Sell/Buy Button's colour to match that of the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page.
- Injects a bunch of Market Links, above the Market's filters, to each market with pre-defined filters to view both sides of the market at once. *Why? Because looking at both sides of the market at once is the superior choice.*
- When the quantity you're able to Sell/Buy is less than the Trade Offer, it's quantity listed in the box will be auto changed to what you're actually able to Sell/Buy.
- Provides the ability to set your own minimums, with the default being zero, of amount of resources or money you'd like to have on your nation. The above functionality will take into account this minimum when updating the boxes.
  - Setting can be found at the bottom of the left sidebar.
  - Amount can be any number greater than or equal to zero, rounded to two decimal points. Putting in an invalid number or a negative number will cause it to be reset to zero.
- When you successfully accept a trade offer, a Re-Sell/Buy button appears by it. Clicking it will cause the script to remember this trade and update all the corresponding boxes so you can easily Re-Sell/Buy this resource for a Profit. This will persist throughout refreshes of the page until you make a profit off the trade or click the Forget button.
  - This Re-Sell/Buy button won't appear, when a trade is accepted, you already have a trade for the opposite side of the market remembered.
  - This feature can remember multiple trades for the same resource, but only one side of the market at a time.
- A list of the currently remembered trades will appear between the Market Links and the Market's filters. Each one will list the quantity, price and if you bought or sold said resource. Along with a Forget button that will make the script forget about it. There is also a Forget All button at the end of the list which will delete all trades of that resource from memory.
  - The list is filtered for whichever resource is currently loaded in, so if the Market's filter is set to 'Any Resource', this list will not appear.
- An asterisk `*` will appear at the end of any Market Link that has trades remembered to be Re-Sold/Bought.
- Provides the ability for all offers according to that Market's filters to be loaded in meaning there is no longer a default max. This feature is called 'Infinite Scroll' and can be toggled off and on from the bottom of the left sidebar.
  - Some other features change in their calculations based on if this feature is activated or not.
- An Outbid and Match button will appear on other people's offers. These buttons will lead to the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page with a unique URL defining the resource, quantity, price, and whether you're buying or selling.
  - The Outbid button's price will be $1 better than that current offer's price, while the Match button's price will be the same as their offer's price.
  - The Quantity selected for these buttons will be calculated based off how much you're actually able to Sell/Buy. Taking into account any minimums you have set.
  - **If** 'Infinite Scroll' is toggled on, then the Quantity will also take into account all your other offers on the page, so none on the page will be canceled due to insufficient funds.
  - If the Quantity for these buttons is zero or less then these button's will not appear for that offer.
- A TopUp button will appear on your own offers. This button is just like the Match button, but it's Quantity will subtract the offer's current Quantity.
  - Like the Match button, this button will not appear if it's calculated Quantity is zero or less.
- When a mistrade is spotted upon loading a page, the script will auto scroll you down to it, making it the centre of your page for you to easily click on to accept. It will also toggle you from Light to Dark mode or Dark to Light mode whenever it detects a mistrade.
- When no mistrade is detected and you haven't accepted an offer, you will get scrolled down to the change between the two markets **if** you're viewing both sides of the market at once. 

The Outbid, Match, and TopUp buttons only appear if the calculated quantity is greater than zero. So if you have zero of said resource to sell, then no button will appear offering for you to sell it.

### Quick Scroll

**Depreciated**