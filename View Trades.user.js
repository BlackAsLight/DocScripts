// ==UserScript==
// @name         Doc: View Trades
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.9
// @description  Make Trading on the market Better!
// @author       BlackAsLight
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @grant        none
// ==/UserScript==

'use strict';

const sellColor = '#5cb85c';
const buyColor = '#337ab7';

// Get Resource Bar
const resources = (() => {
    const resources = document.getElementById('rssBar').children[0].children[0].children[0].innerText.trim().replaceAll('  ', ' ').replaceAll(',', '').split(' ');
    return {
        money: parseFloat(resources[13]),
        oil: parseFloat(resources[2]),
        coal: parseFloat(resources[1]),
        iron: parseFloat(resources[5]),
        bauxite: parseFloat(resources[6]),
        lead: parseFloat(resources[4]),
        uranium: parseFloat(resources[3]),
        food: parseFloat(resources[11]),
        gasoline: parseFloat(resources[7]),
        steel: parseFloat(resources[9]),
        aluminum: parseFloat(resources[10]),
        munitions: parseFloat(resources[8]),
        credits: parseFloat(resources[0])
    };
})();

(() => {
    let tableRows = document.getElementsByClassName('nationtable')[0].children[0].children;
    for (let i = 1; i < tableRows.length; i++) {
        let cells = tableRows[i].children;
        const resource = cells[4].children[0].getAttribute('title').toLowerCase();
        const quantity = parseInt(cells[4].innerText.trim().replaceAll(',', ''));
        const price = parseInt(cells[5].innerText.trim().split(' ')[0].replaceAll(',', ''));
        if (cells[6].children[0].tagName == 'FORM') {
            const isSelling = cells[6].children[0].children[5].value.toLowerCase() == 'sell';
            cells[5].appendChild(document.createElement('br'));
            let outbidQuantity = 0;
            let matchQuantity = 0;
            if (isSelling) {
                cells[6].children[0].children[5].style.backgroundColor = sellColor;
                if (quantity > resources[resource]) {
                    cells[6].children[0].children[3].value = Math.floor(resources[resource]);
                    cells[5].children[2].innerText = '$' + (parseInt(cells[6].children[0].children[3].value) * price).toLocaleString();
                }
                outbidQuantity = resources.money / (price + 1) > 1000000 ? 1000000 : Math.floor(resources.money / (price + 1));
                matchQuantity = resources.money / price > 1000000 ? 1000000 : Math.floor(resources.money / price);
            }
            else {
                cells[6].children[0].children[5].style.backgroundColor = buyColor;
                if (quantity * price > resources.money) {
                    cells[6].children[0].children[3].value = Math.floor(resources.money / price);
                    cells[5].children[2].innerText = '$' + (parseInt(cells[6].children[0].children[3].value) * price).toLocaleString();
                }
                outbidQuantity = resources[resource] > 1000000 ? 1000000 : Math.floor(resources[resource]);
                matchQuantity = resources[resource] > 1000000 ? 1000000 : Math.floor(resources[resource]);
            }
            if (outbidQuantity > 0) {
                let aTag = document.createElement('a');
                aTag.innerText = 'Outbid';
                aTag.href = `https://politicsandwar.com/nation/trade/create/resource=${resource}?p=${price + (isSelling ? 1 : -1)}&q=${outbidQuantity}&t=${isSelling ? 'b' : 's'}`;
                cells[5].appendChild(aTag);
            }
            if (outbidQuantity > 0 && matchQuantity > 0) {
                cells[5].append(' | ');
            }
            if (matchQuantity > 0) {
                let aTag = document.createElement('a');
                aTag.innerText = 'Match';
                aTag.href = `https://politicsandwar.com/nation/trade/create/resource=${resource}?p=${price}&q=${matchQuantity}&t=${isSelling ? 'b' : 's'}`;
                cells[5].appendChild(aTag);
            }
        }
        else if (cells[6].children[0].tagName == 'A') {
            cells[5].appendChild(document.createElement('br'));
            let topUpQuantity = 0;
            let type = '';
            if (cells[1].childElementCount == 1) {
                topUpQuantity = resources.money / price - quantity > 1000000 ? 1000000 : Math.floor(resources.money / price) - quantity;
                type = 'b';
            }
            else if (cells[2].childElementCount == 1) {
                topUpQuantity = resources[resource] - quantity > 1000000 ? 1000000 : Math.floor(resources[resource]) - quantity;
                type = 's';
            }
            if (topUpQuantity > 0) {
                let aTag = document.createElement('a');
                aTag.innerText = 'TopUp';
                aTag.href = `https://politicsandwar.com/nation/trade/create/resource=${resource}?p=${price}&q=${topUpQuantity}&t=${type}`;
                cells[5].appendChild(aTag);
            }
        }
    }
})();
