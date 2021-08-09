// ==UserScript==
// @name         Doc: Hide Nation Descriptions
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Hides Nation's Descriptions set up by the user. Why? Because some people like to make them excessively long.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

'use strict';
document.getElementById('descCollapseDiv').remove();