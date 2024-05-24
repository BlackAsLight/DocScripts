// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      2.9
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @match        https://politicsandwar.com/index.php?id=27*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import { build, x } from 'https://deno.land/x/basic_jsx@v3.0.1/mod.tsx'
import { sleep } from '../utils.ts'

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_CreateTrade')) {
	throw Error('This script was already injected...')
}
document.body.append(
	build(<div id='Doc_CreateTrade' style='display: none;' />),
)

/* Global Variables
-------------------------*/
const enum LocalStorageKeys {
	Ticks = '!Doc_CT1',
	Recursive = '!Doc_CT2',
	Price = '!Doc_CT3',
	MarketView = 'Doc_MarketView',
}
const { resource, p, q, t } = Object.fromEntries(
	self.location.search.slice(1).split('&').map((args) => {
		const [key, value] = args.split('=')
		const number = parseFloat(value)
		if (`${number}` === 'NaN') {
			return [key, value]
		}
		return [key, number]
	}),
) as {
	resource: string | undefined
	p: number | undefined
	q: number | undefined
	t: string | undefined
}

/* Main
-------------------------*/
// If successfully made a trade offer.
if (document.querySelector('.alert-success')) {
	localStorage.setItem(
		LocalStorageKeys.Ticks,
		`${new Date().getTime() + 5000}`,
	)
	if (
		q && q > 10_000_000 && localStorage.getItem(LocalStorageKeys.Recursive)
	) {
		const args = self.location.search.slice(1).split('&')
		args[args.findIndex((arg) => arg.startsWith('q='))] = `q=${
			q - 10_000_000
		}`
		if (localStorage.getItem(LocalStorageKeys.Price)) {
			args[args.findIndex((arg) => arg.startsWith('p='))] = `p=${
				localStorage.getItem(LocalStorageKeys.Price)
			}`
			localStorage.removeItem(LocalStorageKeys.Price)
		}
		self.location.href = self.location.origin + self.location.pathname +
			'?' + args.join('&')
	} else {
		self.location.href =
			`https://politicsandwar.com/index.php?id=26&display=world&resource1=${
				resource ??
					document.querySelector<HTMLAnchorElement>(
						'.alert-success a[href^="https://politicsandwar.com/index.php"]',
					)!.href.split('?')[1].split('&').find((arg) =>
						arg.startsWith('resource1=')
					)?.split('=')[1]
			}&buysell=${
				[
					'buy',
					'sell',
				][parseInt(localStorage.getItem('Doc_MarketView')!)] ?? ''
			}&ob=price&od=DEF&maximum=100&minimum=0&search=Go`
	}
} else if (resource && document.querySelector('form#createTrade')) {
	localStorage.removeItem(LocalStorageKeys.Recursive)
	const formTag = document.querySelector('form#createTrade')!
	formTag.scrollIntoView({
		behavior: 'smooth',
		block: 'center',
	})
	formTag.addEventListener('submit', (_event) => {
		if (p) {
			const price =
				document.querySelector<HTMLInputElement>('input#priceper')!
					.valueAsNumber
			if (price !== p) {
				localStorage.setItem(LocalStorageKeys.Price, `${price}`)
			}
		}
		if (
			q && q >= 10_000_000 &&
			10_000_000 ===
				document.querySelector<HTMLInputElement>('input#amount')!
					.valueAsNumber
		) {
			localStorage.setItem(LocalStorageKeys.Recursive, '0')
		}
	})

	if (p) {
		document.querySelector<HTMLInputElement>('input#priceper')!
			.setAttribute('value', `${p}`)
	}
	if (q) {
		document.querySelector<HTMLInputElement>('input#amount')!.setAttribute(
			'value',
			`${Math.min(q, 10_000_000)}`,
		)
	}
	if (t) {
		document.querySelector<HTMLButtonElement>(
			`button[data-target="#${t === 's' ? 'buy' : 'sell'}Confirmation"]`,
		)!.remove()
		const buttonTag = document.querySelector<HTMLButtonElement>(
			`button[data-target="#${t === 's' ? 'sell' : 'buy'}Confirmation"]`,
		)!
		buttonTag.style.setProperty('border-radius', '6px')
		buttonTag.setAttribute('type', 'submit')
		buttonTag.setAttribute('name', 'submit')
		buttonTag.setAttribute('value', t === 's' ? 'Sell' : 'Buy')
		buttonTag.removeAttribute('data-target')
		const ticks =
			parseInt(localStorage.getItem(LocalStorageKeys.Ticks) ?? '0') -
			new Date().getTime()
		if (ticks > 0) {
			buttonTag.toggleAttribute('disabled', true)
			sleep(ticks)
				.then(() => buttonTag.toggleAttribute('disabled', false))
		}
	}
}
