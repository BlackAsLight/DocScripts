# Baseball

## Description

### Away Games

This script runs on the [Baseball Away Game's Page](https://politicsandwar.com/obl/play/).
- It will remove the current Host or Cancel Game button and replace it with it's own which are both displayed at the same time constantly. Blue and Red respectively.
- Depending on your current status, one of the buttons will be disabled indicating which mode you are in.
- When you click the blue button to host a game, you will switch modes and the game will now start checking to see when the game if fulfilled to then switch you back, for you to click again.
- You can click the red button to cancel the game, if you wish to stop without fulfilling the game.
- The script will sleep between checks. This sleep time changes dynamically, starting at 1s and increases by 1s every 10 checks to a max of 10s sleep time.
  - This sleep time resets back to 1s if you cancel the game then start it again, or if the game is fulfilled.
- It is **not recommended** to view the market pages while this script is running, or you might find it a bit hard to accept or create trade offers.

### Home Games

This script runs on the [Baseball Home Game's Page](https://politicsandwar.com/obl/host/), and will refresh the page every 3s until you are no longer hosting a home game.
