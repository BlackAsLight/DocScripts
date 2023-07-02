// ==UserScript==
// @name         Doc: Military
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Making it easier to militarise and demilitarise your army.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/military/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import { createTag } from "./lib/utils.ts"

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_Military'))
	throw Error('This script was already injected...')
document.body.append(createTag<HTMLDivElement>('div', divTag => {
	divTag.setAttribute('id', 'Doc_Military')
	divTag.style.setProperty('display', 'none')
}))

/* Global Variables
-------------------------*/

/* User Configuration Settings
-------------------------*/

/* Styling
-------------------------*/

/* Main
-------------------------*/

/* Functions
-------------------------*/
