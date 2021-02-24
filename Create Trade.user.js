// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @grant        none
// ==/UserScript==

'use strict';

let args = window.location.search.slice(1).split('&');
for (let i = 0; i < args.length; i++) {
    args[i] = args[i].split('=');
    if (args[i][0] == 'p') {
        document.getElementById('priceper').value = parseInt(args[i][1]);
    }
    else if (args[i][0] == 'q') {
        document.getElementById('amount').value = parseInt(args[i][1]);
    }
    else if (args[i][0] == 't') {
        if (args[i][1] == 's') {
            document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[1].style.display = 'none';
            document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[0].style.borderRadius = '6px';
        }
        else {
            document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[0].style.display = 'none';
            document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[1].style.borderRadius = '6px';
        }
    }
}
