# Espionage Report
Automatically collect your, or your alliance members, espionage reports neatly in a spreadsheet the moment they execute them.

## Categories
There are two types of categories that you might fall into.

### Individuals
If you are an individual wanting to record your own reports automatically for whatever reason then you must do the Server and Client part listed below.

### Alliances
If you are an alliance wanting to record your members reports automatically for whatever reason then you must do the Server part and have all the members do the Client part listed below.

## Server
To set up the Server side you'll need a Google Account.

1. To go [Google App Script](https://script.google.com/home).
2. Click on New Project.
3. Give the project a name. I suggest 'Espionage Report' or 'Doc: Espionage Report'.
4. Delete the code already in their and copy-paste the contents of the Server.js file found here above.
5. Open this Google Spreadsheet Template [Doc: Espionage Report - Template](https://docs.google.com/spreadsheets/d/1JJPxw8O3mt_fEy5lqC6OIFdfB29EPzmW5rWBOFUWEcE/edit?usp=sharing) and select Make a Copy found under the File dropdown button on the menu bar.
6. In the spreadsheet URL you'll want to copy the string of text between `/d/` and `/edit#gid=0`.
7. Once Copyed you'll want to go back to the Google App Script tab and paste in between the `''` single quotation marks for the variable `spreadsheetID` found on line 9.
8. Click Save. Very important that you click Save before proceeding onto the next bit.
9. Click the blue Deploy button, followed by New Deployment.
10. Click the Cog wheel for Select Type and select Web App from the dropdown list.
11. Set the description to whatever you want. Listing the version of the file, Server.js, here though is suggested.
12. Set Who Can Access to Anyone.
13. Click Deploy.
14. It might take a few seconds and if this is your first time it should ask you for Authorisation next. If it does then give it Authorisation.
15. After that, a URL should display on the screen. Copy it and provide it to anyone who will be sending reports. That URL will be needed on the Client side.

That's everything you need to do to set up the Server side. Granted that you've done it all correct it will work. You can share the spreadsheet you made a copy of with anyone you want to view the reports and also customise the other bits around it to suit your business more.

## Client
Simply install the Client.user.js file, found here above, like any of the other scripts. Instructions on installation can be found on the [main page](https://github.com/BlackAsLight/DocScripts#installation).

1. Once installed you'll need a URL provided by the Server part, and an Identifier Key.
2. Simply go to any [Espionage](https://politicsandwar.com/nation/espionage/eid=6) page in game. Your own will even work.
3. On the left sidebar at the bottom you'll find two buttons. `Insert Report URL` and `Insert Identifier Key`. 
4. Click on each button and provide the desired info into the prompted box that appears on screen.

Once that is all complete and the provided URL is correct, whenever you do an espionage report, on that computer, a copy of the report will automatically be sent.

### Identifier Key
An Identifier Key is simply meant to be a way to check who is sending in these reports. It can be any number or string and meant to help with filtering out any bad reports from malicious users.

If you're in the **Alliance** category then you're government will provide you with a unique Indentification Key. While the Identification Key can just be the member's nation ID or name, it is recommended that you, the government, create a random number or string up and save it in a table next to the members name. As using a member's nation ID or name, or any other publicly available information would allow for anyone to easily send in reports as somebody else. Granted that they have the URL.

If you're an **Individual** then you can create up any number or string to place into it, but it cannot be left empty otherwise no report will be sent.
