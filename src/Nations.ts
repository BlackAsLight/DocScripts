// ==UserScript==
// @name         Doc: Nations
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      10.0.0
// @description  Improves the Nations page UI
// @author       BlackAsLight
// @match        https://politicsandwar.com/nations/
// @include      https://politicsandwar.com/index.php?id=15*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import { createTag } from '@doctor/create-tag'

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_Nations')) {
	throw Error('This script was already injected...')
}
document.body.append(createTag('div', { id: 'Doc_Nations' }, (divTag) => divTag.style.setProperty('display', 'none')))

/* Global Variables
-------------------------*/
const scoreKey = 'Doc_N1'
const ticksKey = 'Doc_N2'

/* Main
-------------------------*/
const formTag = document.querySelector('form[method="GET"]') as HTMLFormElement
formTag.parentElement?.insertBefore(
	createTag('div', (divTag) =>
		divTag.append(
			createTag('label', { htmlFor: 'Doc_Score', textContent: 'Nation Score:' }),
			createTag('input', { id: 'Doc_Score', type: 'number', value: localStorage.getItem(scoreKey) ?? '0' }, (inputTag) =>
				inputTag.addEventListener('change', function (_event) {
					if (this.valueAsNumber.toString() === 'NaN') {
						return
					}
					const date = new Date()
					if (this.nextSibling) {
						this.nextSibling.textContent = date.toJSON()
					}
					localStorage.setItem(ticksKey, date.getTime().toString())
					localStorage.setItem(scoreKey, this.valueAsNumber.toString())
					updateIcons(this.valueAsNumber)
				})),
			createTag('br'),
			new Date(parseInt(localStorage.getItem(ticksKey) ?? '0')).toJSON(),
			createTag('button', { className: 'btn btn-primary', textContent: 'Refresh' }, (buttonTag) => {
				buttonTag.addEventListener('click', async function (_event) {
					this.disabled = true
					const score = parseFloat(
						new DOMParser()
							.parseFromString(await (await fetch('https://politicsandwar.com/nation/war/')).text(), 'text/html')
							.querySelector<HTMLAnchorElement>('a[href^="/index.php?id=15"]')!
							.href
							.split('?')[1]
							.split('&')
							.find((arg) =>
								arg.startsWith('keyword=')
							)
							?.slice(8) ??
							'0',
					)
					console.log(`Score: ${score}`)
					const date = new Date()
					if (this.previousSibling) {
						this.previousSibling.textContent = date.toJSON()
					}
					localStorage.setItem(ticksKey, `${date.getTime()}`)
					localStorage.setItem(scoreKey, `${score}`)
					updateIcons(score)
					;(this.previousElementSibling!.previousElementSibling as HTMLInputElement).valueAsNumber = score
					this.disabled = false
				})
				buttonTag.style.setProperty('margin-inline', '0.5em')
			}),
		)),
	formTag.nextElementSibling,
)
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
	;[...document.querySelectorAll<HTMLTableRowElement>(
		'.nationtable tr',
	)].slice(1).forEach((trTag) => {
		const tdTag = trTag.lastElementChild as HTMLTableCellElement
		const theirScore = parseFloat(tdTag.lastChild!.textContent!.replaceAll(',', ''))
		;[...tdTag.querySelectorAll<HTMLImageElement>('img')].forEach((imgTag) => {
			if (imgTag.src === 'https://politicsandwar.com/img/icons/16/plus_shield.png') {
				return
			}
			imgTag.remove()
		})
		if (inSpyRange(theirScore, myScore)) {
			tdTag.insertBefore(
				createTag('img', { src: 'https://politicsandwar.com/img/icons/16/emotion_spy.png' }),
				tdTag.lastChild,
			)
		}
		if (inWarRange(theirScore, myScore)) {
			if (inWarRange(myScore, theirScore)) {
				tdTag.insertBefore(
					createTag('img', { src: 'https://docscripts.stagintin.com/icons/green_red.png' }),
					tdTag.lastChild,
				)
			} else {
				tdTag.insertBefore(
					createTag('img', { src: 'https://docscripts.stagintin.com/icons/green.png' }),
					tdTag.lastChild,
				)
			}
		} else if (inWarRange(myScore, theirScore)) {
			tdTag.insertBefore(createTag('img', { src: 'https://docscripts.stagintin.com/icons/red.png' }), tdTag.lastChild)
		}
	})
}
