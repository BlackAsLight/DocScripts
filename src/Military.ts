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

import { createTag, divSpacer, LocalStorage, sleep } from "./lib/utils.ts"

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
	aircraft: number,
	aircraft_today: number,
	ships: number,
	ships_today: number,
	cities: {
		barracks: number,
		factory: number,
		hangar: number,
		drydock: number
	}[]
}> = fetch(`https://api.politicsandwar.com/graphql?api_key=${LocalStorage.APIKey()}`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ query: '{me{nation{soldiers,soldiers_today,tanks,tanks_today,aircraft,aircraft_today,ships,ships_today,cities{barracks,factory,hangar,drydock}}}}' })
})
	.then(x => x.json())
	.then(x => x.data.me.nation)

const initToken = fetch('https://politicsandwar.com/nation/military/soldiers/').then(x => x.text()).then(x => new DOMParser().parseFromString(x, 'text/html').querySelector<HTMLInputElement>('input[name="token"]')!.value)
let wait = false

/* User Configuration Settings
-------------------------*/

/* Styling
-------------------------*/
document.head.append(createTag<HTMLStyleElement>('style', styleTag => {
	styleTag.textContent += '.doc_military { display: grid; grid-template-columns: repeat(2, calc(50% - 0.5rem)); gap: 1rem; }'
	styleTag.textContent += '.doc_military a { grid-column: 1 / 3; text-align: center; }'

	styleTag.textContent += '.spacer-row { display: flex; flex-direction: row; align-items: center; }'
	styleTag.textContent += '.spacer { flex-grow: 1; }'
}))

/* Main
-------------------------*/
// Soldiers
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Soldiers Enlisted:', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.soldiers.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Soldiers Enlisted Today:', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.soldiers_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Enlist/Discharge:', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'soldiers')
					inputTag.setAttribute('value', '0')
					data.then(nation => {
						const max = nation.cities.reduce((sum, city) => sum + city.barracks, 0) * 3000
						inputTag.value = Math.min(Math.round(max / 3 - nation.soldiers_today), max - nation.soldiers).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buysoldiers')
			inputTag.setAttribute('value', 'Enlist/Discharge Soldiers')
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			initToken.then(token => inputTag.setAttribute('value', token))
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/soldiers/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

		;[ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(_nation => initToken.then(_token => [ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', false))))
})

// Tanks
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Tanks Possessed: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.tanks.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Tanks Manufactured Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.tanks_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Manufacture/Decommission: ', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'tanks')
					inputTag.setAttribute('value', '0')
					data.then(nation => {
						const max = nation.cities.reduce((sum, city) => sum + city.factory, 0) * 250
						inputTag.value = Math.min(Math.round(max / 5 - nation.tanks_today), max - nation.tanks).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buytanks')
			inputTag.setAttribute('value', 'Manufacture/Decommission Tanks')
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			initToken.then(token => inputTag.setAttribute('value', token))
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/tanks/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

		;[ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(_nation => initToken.then(_token => [ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', false))))
})

// Aircraft
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Aircraft Possessed: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.aircraft.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Aircraft Manufactured Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.aircraft_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Manufacture/Decommission: ', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'aircraft')
					inputTag.setAttribute('value', '0')
					data.then(nation => {
						const max = nation.cities.reduce((sum, city) => sum + city.hangar, 0) * 15
						inputTag.value = Math.min(Math.round(max / 5 - nation.aircraft_today), max - nation.aircraft).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buyaircraft')
			inputTag.setAttribute('value', 'Manufacture/Decommission Aircraft')
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			initToken.then(token => inputTag.setAttribute('value', token))
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/aircraft/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

		;[ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(_nation => initToken.then(_token => [ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', false))))
})

// Navel Ships
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Ships Possessed: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.ships.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Ships Manufactured Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.ships_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Manufacture/Decommission: ', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'ships')
					inputTag.setAttribute('value', '0')
					data.then(nation => {
						const max = nation.cities.reduce((sum, city) => sum + city.drydock, 0)
						inputTag.value = Math.min(Math.round(max / 5 - nation.ships_today), max - nation.ships).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buyships')
			inputTag.setAttribute('value', 'Manufacture/Decommission Ships')
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'hidden')
			inputTag.setAttribute('name', 'token')
			initToken.then(token => inputTag.setAttribute('value', token))
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/navy/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

		;[ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(_nation => initToken.then(_token => [ ...formTag.querySelectorAll<HTMLInputElement>('input') ].forEach(inputTag => inputTag.toggleAttribute('disabled', false))))
})

/* Functions
-------------------------*/
async function formSubmitEvent(this: HTMLFormElement, event: SubmitEvent): Promise<void> {
	event.preventDefault()
	this.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	while (wait)
		await sleep(50)
	wait = true
	const token = new DOMParser().parseFromString(await (await fetch(this.querySelector<HTMLAnchorElement>('a')!.href, {
		method: 'POST',
		body: new FormData(this)
	})).text(), 'text/html').querySelector<HTMLInputElement>('input[name="token"]')!.value
	document.querySelectorAll('input[name="token"]').forEach(inputTag => inputTag.setAttribute('value', token))
	wait = false
}
