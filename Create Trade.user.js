// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.4
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @grant        none
// ==/UserScript==

'use strict';

if (document.getElementsByClassName('alert-success').length) {
    window.location = document.getElementsByClassName('alert-success')[0].children[1].children[0].href;
}
else {
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
            let sellButton = document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[0];
            let buyButton = document.getElementsByClassName('nationtable')[0].children[0].children[9].children[0].children[0].children[1];
            if (args[i][1] == 's') {
                buyButton.style.display = 'none';
                sellButton.style.borderRadius = '6px';
                sellButton.type = 'submit';
                sellButton.name = 'submit';
                sellButton.value = 'Sell';
                sellButton.dataset.target = '';
            }
            else {
                sellButton.style.display = 'none';
                buyButton.style.borderRadius = '6px';
                buyButton.type = 'submit';
                buyButton.name = 'submit';
                buyButton.value = 'Buy';
                buyButton.dataset.target = '';
            }
        }
    }
}
