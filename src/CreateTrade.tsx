// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      2.5
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @include      https://politicsandwar.com/index.php?id=27*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import x from "../jsx.tsx"

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_CreateTrade'))
	throw Error('This script was already injected...')
document.body.append(<div id='Doc_CreateTrade' style='display: none;' />)

/* Global Variables
-------------------------*/
const ticksKey = 'Doc_CT1'
const recursiveKey = 'Doc_CT2'
const priceKey = 'Doc_CT3'
const { p, q, t } = Object.fromEntries(location.search.slice(1).split('&').map(args => args.split('=')).map(([ key, value ]) => [ key, `${parseFloat(value)}` === 'NaN' ? value : parseFloat(value) ])) as Record<string, string | number | undefined>

/* Main
-------------------------*/
if (document.querySelector('.alert-success')) {
	if (q && q > 1_000_000 && localStorage.getItem(recursiveKey)) {
		const args = location.search.slice(1).split('&')
		const i = args.findIndex(arg => arg.startsWith('q='))
		args[ i ] = `q=${q as number - 1_000_000}`
		location.href = location.origin + location.pathname + '?' + args.join('&')
	}
	else {
		localStorage.removeItem(recursiveKey)
		const href = ((document.querySelector('a i.fa-backward') as HTMLElement).parentElement as HTMLAnchorElement).href.split('?')
		const args = href[ 1 ].split('&')
		const i = args.findIndex(arg => arg.startsWith('minimum='))
		if (i < 0)
			location.href = href.join('?')
		else {
			args[ i ] = 'minimum=0'
			location.href = href[ 0 ] + '?' + args.join('&')
		}
	}
}
else if (document.querySelector('#createTrade')) {
	localStorage.removeItem(recursiveKey)
	document.querySelector('#createTrade')?.scrollIntoView({
		behavior: 'smooth',
		block: 'center'
	})

	if (p) {
		const inputTag = document.querySelector('#priceper') as HTMLInputElement
		inputTag.setAttribute('value', p as string)
		inputTag.addEventListener('change', () => {
			const value = inputTag.value
			if (parseInt(value) === p)
				localStorage.removeItem(priceKey)
			else
				localStorage.setItem(priceKey, value)
		})
	}
	if (q)
		(document.querySelector('#amount') as HTMLInputElement).setAttribute('value', Math.min(q as number, 1_000_000).toString())
	if (t) {
		const tag = (() => {
			const sellTag = (document.querySelector('button i.fa-hands-usd') as HTMLElement).parentElement as HTMLButtonElement
			const buyTag = sellTag.nextElementSibling as HTMLButtonElement
			(t === 's' ? buyTag : sellTag).remove()
			return t === 's' ? sellTag : buyTag
		})()
		tag.style.setProperty('border-radius', '6px')
		tag.setAttribute('type', 'submit')
		tag.setAttribute('name', 'submit')
		tag.setAttribute('value', t === 's' ? 'Sell' : 'Buy')
		tag.removeAttribute('data-target')
		const ticks = parseInt(localStorage.getItem(ticksKey) ?? '')
		if (ticks) {
			const delay = 5000 + ticks - new Date().getTime()
			if (delay > 0) {
				sleep(delay)
					.then(() => tag.toggleAttribute('disabled', false))
				tag.toggleAttribute('disabled', true)
			}
			localStorage.removeItem(ticksKey)
		}
		if (q && (q as number) >= 1_000_000)
			tag.addEventListener('click', () => {
				if (Math.min(q as number, 1_000_000) === parseInt((document.querySelector('#amount') as HTMLInputElement).getAttribute('value') ?? '')) {
					localStorage.setItem(ticksKey, `${new Date().getTime()}`)
					localStorage.setItem(recursiveKey, '0')
				}
			})
	}

	// document.querySelector('#showTopOffersBtn')?.addEventListener('click', async () => {
	// 	await waitTilFalse(() => !(document.querySelector('#topOffersSection') as HTMLElement).childElementCount, 50)

	// })
}

/* Functions
-------------------------*/
function sleep(ms: number) {
	return new Promise<true>(a => setTimeout(() => a(true), ms))
}

// deno-lint-ignore no-explicit-any
async function waitTilFalse(func: (() => any), delay = 0) {
	while (func())
		await sleep(0)
}
