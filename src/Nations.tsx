// ==UserScript==
// @name         Doc: Nations
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.1
// @description  Improves the Nations page UI
// @author       BlackAsLight
// @match        https://politicsandwar.com/nations/
// @include      https://politicsandwar.com/index.php?id=15*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import x from "../jsx.tsx"
import { pass } from "../utils.ts"

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_Nations'))
	throw Error('This script was already injected...')
document.body.append(<div id='Doc_Nations' style='display: none;' />)

/* Global Variables
-------------------------*/
const scoreKey = 'Doc_N1'
const ticksKey = 'Doc_N2'

/* User Configuration Settings
-------------------------*/
// document.querySelector('#leftcolumn')?.append(<div class='Doc_Config'>

// </div>)

/* Styling
-------------------------*/
// document.head.append(pass<HTMLStyleElement>(<style />, styleTag => {

// }));

/* Main
-------------------------*/
const formTag = document.querySelector('form[method="GET"]') as HTMLFormElement
formTag.parentElement?.insertBefore(<div>
	<label for='Doc_Score'>Nation Score: </label>
	{ pass<HTMLInputElement>(<input id='Doc_Score' type='number' value={ localStorage.getItem(scoreKey) ?? 0 } />, inputTag => inputTag.addEventListener('change', event => {
		const inputTag = event.target as HTMLInputElement
		const score = parseFloat(inputTag.value)
		if (`${score}` === 'NaN')
			return
		const date = new Date()
		if (inputTag.nextSibling)
			inputTag.nextSibling.textContent = date.toJSON()
		localStorage.setItem(ticksKey, `${date.getTime()}`)
		localStorage.setItem(scoreKey, `${score}`)
		updateIcons(score)
	})) }
	<br />
	{ new Date(parseInt(localStorage.getItem(ticksKey) ?? '0')).toJSON() }
	{ pass<HTMLButtonElement>(<button>Refresh</button>, buttonTag => buttonTag.addEventListener('click', async event => {
		const buttonTag = event.target as HTMLButtonElement
		// Scape to Update Ticks and Score
		buttonTag.toggleAttribute('disabled', true)
		const score = parseFloat((new DOMParser().parseFromString(await (await fetch('https://politicsandwar.com/nation/war/')).text(), 'text/html').querySelector('a.btn.btn-warning.btn-lg') as HTMLAnchorElement).href.split('?')[ 1 ].split('&').find(arg => arg.startsWith('keyword='))?.slice(8) ?? '0')
		console.log(`Score: ${score}`)
		const date = new Date()
		if (buttonTag.previousSibling)
			buttonTag.previousSibling.textContent = date.toJSON()
		localStorage.setItem(ticksKey, `${date.getTime()}`)
		localStorage.setItem(scoreKey, `${score}`)
		updateIcons(score);
		(buttonTag.previousElementSibling as HTMLInputElement).value = `${score}`
		buttonTag.toggleAttribute('disabled', false)
	})) }
</div>, formTag.nextElementSibling)
updateIcons(parseFloat(localStorage.getItem(scoreKey) ?? '0'))

/* Functions
-------------------------*/
function inSpyRange(score: number, rangeScore: number) {
	return rangeScore * 0.4 <= score && score <= rangeScore * 2.5
}

function inWarRange(score: number, rangeScore: number) {
	return rangeScore * 0.75 <= score && score <= rangeScore * 1.75
}

function updateIcons(myScore: number) {
	[ ...document.querySelectorAll('.nationtable tr') as unknown as HTMLTableRowElement[] ].slice(1).forEach(trTag => {
		const tdTag = trTag.lastElementChild as HTMLTableCellElement
		const theirScore = parseFloat(tdTag.lastChild?.textContent?.replaceAll(',', '') as string);
		[ ...tdTag.querySelectorAll('img') as unknown as HTMLImageElement[] ].forEach(imgTag => {
			if (imgTag.src === 'https://politicsandwar.com/img/icons/16/plus_shield.png')
				return
			imgTag.remove()
		})
		if (inSpyRange(theirScore, myScore))
			tdTag.insertBefore(<img src='https://politicsandwar.com/img/icons/16/emotion_spy.png' />, tdTag.lastChild)
		if (inWarRange(theirScore, myScore))
			if (inWarRange(myScore, theirScore))
				tdTag.insertBefore(<img src='https://docscripts.stagintin.com/icons/green_red.png' />, tdTag.lastChild)
			else
				tdTag.insertBefore(<img src='https://docscripts.stagintin.com/icons/green.png' />, tdTag.lastChild)
		else if (inWarRange(myScore, theirScore))
			tdTag.insertBefore(<img src='https://docscripts.stagintin.com/icons/red.png' />, tdTag.lastChild)
	})
}
