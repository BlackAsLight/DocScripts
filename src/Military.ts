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

import { createTag, LocalStorage } from "./lib/utils.ts"

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
const data: Promise<{
	soldiers: number,
	soldiers_today: number,
	tanks: number,
	tanks_today: number,
	cities: {
		barracks: number,
		factory: number
	}[]
}> = fetch(`https://api.politicsandwar.com/graphql?api_key=${LocalStorage.APIKey()}`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ query: '{me{nation{soldiers,soldiers_today,tanks,tanks_today,cities{barracks,factory}}}}' })
})
	.then(x => x.json())
	.then(x => x.data.me.nation)

/* User Configuration Settings
-------------------------*/

/* Styling
-------------------------*/

/* Main
-------------------------*/
// Soldiers
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Soldiers Enlisted: ', createTag<HTMLSpanElement>('span', spanTag => {
				spanTag.append('?')
				data.then(nation => spanTag.textContent = nation.soldiers.toString())
			})
		)),
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Soldiers Enlisted Today: ', createTag<HTMLSpanElement>('span', spanTag => {
				spanTag.append('?')
				data.then(nation => spanTag.textContent = nation.soldiers_today.toString())
			})
		)),
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Enlist/Discharge: ', createTag<HTMLInputElement>('input', inputTag => {
				inputTag.setAttribute('type', 'number')
				inputTag.setAttribute('name', 'soldiers')
				inputTag.setAttribute('value', '0')
				data.then(nation => inputTag.value = Math.round(nation.cities.reduce((sum, city) => sum + city.barracks, 0) * 1000 - nation.soldiers_today).toString())
			})
		)),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buysoldiers')
			inputTag.setAttribute('value', 'Enlist/Discharge Soldiers')
			inputTag.toggleAttribute('disabled', true)
			data.then(_nation => inputTag.toggleAttribute('disabled', false))
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			inputTag.setAttribute('value', '')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/soldiers/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', async function (event) {
		event.preventDefault()
		this.querySelectorAll('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
		await fetch(this.querySelector<HTMLAnchorElement>('a')!.href, {
			method: 'POST',
			body: new FormData(this)
		})
	}, { passive: false })
})

// Tanks
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Tanks Possessed: ', createTag<HTMLSpanElement>('span', spanTag => {
				spanTag.append('?')
				data.then(nation => spanTag.textContent = nation.tanks.toString())
			})
		)),
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Tanks Manufactured Today: ', createTag<HTMLSpanElement>('span', spanTag => {
				spanTag.append('?')
				data.then(nation => spanTag.textContent = nation.tanks_today.toString())
			})
		)),
		createTag<HTMLLabelElement>('label', labelTag => labelTag.append(
			'Enlist/Discharge: ', createTag<HTMLInputElement>('input', inputTag => {
				inputTag.setAttribute('type', 'number')
				inputTag.setAttribute('name', 'tanks')
				inputTag.setAttribute('value', '0')
				data.then(nation => inputTag.value = Math.round(nation.cities.reduce((sum, city) => sum + city.factory, 0) * 50 - nation.tanks_today).toString())
			})
		)),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buytanks')
			inputTag.setAttribute('value', 'Manufacture/Decommission Tanks')
			inputTag.toggleAttribute('disabled', true)
			data.then(_nation => inputTag.toggleAttribute('disabled', false))
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			inputTag.setAttribute('value', '')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/tanks/')
			aTag.textContent = 'Go to Page'
		})
	)
})

/* Functions
-------------------------*/
