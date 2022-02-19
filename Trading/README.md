# Trading

## Description

### Create Trade

This script runs on the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page, and the unique URLs mentioned in this script are provided by the View Trades Script.

- Auto scrolls the form to the centre of your page.
- Fill out the Quantity and Price of the form **if** it is provided in the URL.
- Hides the Sell/Buy button that is not specified in the URL **if** one is provided in the URL.
- When trades are successfully created, you get auto returned to the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page that you were last on...
- Unless the Quantity provided in the URL was greater than 1m tons. In which case it will return to the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page, with an adjusted quantity.
  - When you do get returned to the [Create Offer](https://politicsandwar.com/nation/trade/create/) Page, the Sell/Buy button that is still present will be disabled for 5s so you don't run into an error message.
- Format the 'Top Offers' Table to match that of the Sell/Buy buttons and fixes the bad formatting of the tables.

This script requires the View Trades Script for the majority of its functionality to be used.

### View Trade

This script runs on the [Trades](https://politicsandwar.com/index.php?id=90&display=world&resource1=food&buysell=&ob=price&od=ASC&maximum=100&minimum=0&search=Go) Page and is designed to work in tandem with the Create Trade Script.

- At the bottom of the sidebar, you'll be able to:
  - Toggle Infinite Scroll, which makes it so every offer that meets the Market's filters are displayed on the screen.
    - This feature doesn't when viewing your personal market, only global and alliance market.
  - Toggle Zero Accountability, which makes the Outbid, Match, and TopUp buttons not take into account your current offers on the page.
    - This feature can be toggled on and off without a page refresh. The links will update immediately upon toggling.
  - Set a Max Amount for a resource that you want to be set when creating an offer through the Outbid, Match, or TopUp buttons.
    - This will only affect the Outbid, Match, and TopUp button's links. It will not affect the total amount you can have when adding up all quantities of existing offers.
	- The amount can only be a positive number rounded down to a whole number. Setting it to zero or less will result in this feature being disabled for that resource, while inputting something invalid will result in nothing changing.
  - Set a Min Amount for a resource or money that you want to be excluded when creating or accepting offers.
    - This will only affect quantities the script calculates. You can easily override them by inputting a new amount in the boxes before accepting or creating an offer.
    - The amount can only be a positive number rounded to two digits. Setting a negative number will reset it to zero while inputting something invalid will result in nothing changing.
- Converts the entire table into a cleaner table that folds better on smaller screens.
  - The Sell button is green, and the Buy button is blue, so they match that of the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page.
  - The listed quantity in the boxes is either how much you can afford to buy/sell, taking into account any minimum you have set, or the amount the offer wants. Whichever is less, so you only have to accept the offer and don't need to do dumb *maths* to figure out how much you can buy/sell.
- Adds Outbid, and Match buttons to other people's offers, and a TopUp button to yours.
  - The Outbid button will be $1 better than the offer is it appearing on, while the Match and TopUp buttons will be the same price.
  - If the quantity calculated for these scripts is zero or less, then they'll appear crossed out and won't lead anywhere.
  - These buttons lead to the [Create Trade](https://politicsandwar.com/nation/trade/create/) Page with unique URLs that will fill out the resource, quantity, and price boxes, and hide the corresponding Sell/Buy button.
  - The Create Trade script is **required** for these links to be of any real use.
- Detects if mistrade is listed on the page when viewing both sides of the market. If one is detected it:
  - Auto scrolls down to the mistrade, making it the centre of your screen.
  - Adds a red outline to the offer, clearly displaying which one is the mistake.
  - Switch your theme from light to dark or dark to light.
  - And adds an invisible tag to the HTML document for another private script.
- Provides a Re-Sell/Buy button when you accept a trade. Clicking this button will cause the script to remember its existence and update all the relevant boxes on the screen to now display the quantity of this offer, or its previously calculated amount, whichever is less, or zero if the price of the offer would cause a negative or zero profit.
  - This button will be auto clicked if a mistrade is detected on the page.
  - This button won't display if the accepting offer is in response to another accepted offer that cancels out the quantities.
- Injects Market Links above the Market's filters. Links lead to every resource market plus your own offers, and your market activity.
  - An asterisk will appear on the resource Market Link if the script is remembering trades for that market.
- Injects horizontal list of all the trades the script is remembering, listing their quantity, price, and if it was bought or sold, as well as a Forget button, if you no longer want it to remember it.
- Auto Scrolls to the middle split of the market **if** both sides are displayed, no mistrade was detected, and the Re-Sell/Buy button doesn't exist. If you have an accepted offer on-page, but the Re-Sell/Buy didn't appear, then it will scroll after 3s, allowing you to view the listed Profit calculated.
- Makes it so Deleting your own offer doesn't refresh the page. Instead, the button will be disabled for a moment, and then when the offer disappears off the page, it has been deleted.
