# Baseball

## Description

### Home Games

This script runs on the [Baseball Home Game's](https://politicsandwar.com/obl/host/) Page.
- It will remove the current Host or Cancel Game button and replace it with it's own which are both displayed at the same time constantly. Blue and Red respectively.
- Depending on your current status, one of the buttons will be disabled indicating which mode you are in.
- When you click the blue button to host a game, you will switch modes and the game will now start checking to see when the game is fulfilled to then switch you back, for you to click again.
  - A tone will play whenever the game is fulfilled.
- You can click the red button to cancel the game, if you wish to stop without fulfilling the game.
- The script will sleep between checks. This sleep time changes dynamically, starting at 1s and increases by 1s every 10 checks to a max of 10s sleep time.
  - This sleep time resets back to 1s if you cancel the game then start it again, or if the game is fulfilled.
- Every time the page loads or whenever a game is fulfilled, this script will check your game history and calculate any new tips you owe the away player.
- Tips are 30% of the ticket sales **and** winnings combined. Meaning it doesn't matter who wins the games, the pay is 70:30.
- This script will create a list under the Host and Cancel Game buttons, listing the nation's name, team name, and how much is owed, plus an info button will which display more.
  - If the amount is displayed in red, then you owe said much to that player.
  - If the amount is displayed in green, then that player owes you said much.
- Clicking the info button mentioned in the last dot point will display three new buttons. A Send Offer, Adjust, and Message button.
  - Clicking the Send Offer button will open the Create Offer screen. It is recommended to also have [Create Trade](https://github.com/BlackAsLight/DocScripts/blob/main/Trading/Create%20Trade.user.js) script installed so it auto fills the price, and quantity for you, and hides the sell/buy button that you don't want to click, otherwise only the resource, food, and nation part will be filled out.
  - The Adjust button creates a prompt allowing you to change the value of the amount owed. Setting it to zero will cause it to be removed from the books, while setting it blank or invalid number will cause nothing to happen.
  - The Message button at this time doesn't have any functionality.
- It is **not recommended** to view the market pages while this script is running, or you might find it a bit hard to accept or create trade offers.

### Away Games

This script runs on the [Baseball Away Game's](https://politicsandwar.com/obl/play/) Page, and will refresh the page every 3s until you are no longer hosting a home game.

### Team Building

This script runs on your Baseball page, where you can change player's names and up their stats. This script will replace the default Red and Blue buttons that allow you to up players stats, and instead provide a new blue button. Clicking this button will cause this button to turn red, and all the other buttons get disabled. It will then start to up the players stats until it reaches the max, 100, or you click the red button telling it to stop. If it reaches 100 then a sound will play letting you know.

### Human

This script runs on the [I'm Not A Robot](https://politicsandwar.com/human/) Page, and simply plays a tone whenever the page loads.