// ==UserScript==
// @name         Doc: Military
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
// @description  Making it easier to militarise and demilitarise your army.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/military/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import * as localStorage from './lib/localStorage.ts'
import * as sessionStorage from './lib/sessionStorage.ts'
import { createTag, divSpacer, lock, sleep, userConfig_APIKey, userConfig_Label } from './lib/utils.ts'

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
	spies: number,
	spies_today: number,
	missiles: number,
	missiles_today: number,
	nukes: number,
	nukes_today: number,
	cities: {
		barracks: number,
		factory: number,
		hangar: number,
		drydock: number
	}[],
	propaganda_bureau: boolean,
	central_intelligence_agency: boolean,
	spy_satellite: boolean,
	missile_launch_pad: boolean,
	space_program: boolean,
	nuclear_research_facility: boolean
}> = fetch(`https://api.politicsandwar.com/graphql?api_key=${localStorage.APIKey()}`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ query: '{me{nation{soldiers,soldiers_today,tanks,tanks_today,aircraft,aircraft_today,ships,ships_today,spies,spies_today,missiles,missiles_today,nukes,nukes_today,cities{barracks,factory,hangar,drydock},propaganda_bureau,central_intelligence_agency,spy_satellite,missile_launch_pad,space_program,nuclear_research_facility}}}' })
})
	.then(x => x.json())
	.then(x => x.data.me.nation)

/* User Configuration Settings
-------------------------*/
userConfig_Label('Military')
userConfig_APIKey()

/* Styling
-------------------------*/
document.head.append(createTag<HTMLStyleElement>('style', styleTag => {
	styleTag.textContent += '.doc_military { display: grid; grid-template-columns: repeat(2, calc(50% - 0.5rem)); gap: 1rem; }'
	styleTag.textContent += '.doc_military a { grid-column: 1 / 3; text-align: center; }'

	styleTag.textContent += '.spacer-row { display: flex; flex-direction: row; align-items: center; }'
	styleTag.textContent += '.spacer { flex-grow: 1; }'

	styleTag.append('#Doc_Config { text-align: center; padding: 0 1em; font-size: 0.8em; }')
	styleTag.append('#Doc_Config b { font-size: 1.25em; }')
	styleTag.append('#Doc_Config button { font-size: inherit; font-weight: normal; padding: 0; }')
	styleTag.append('#Doc_Config hr { margin: 0.5em 0; }')
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
						const maxUnits = nation.cities.reduce((sum, city) => sum + city.barracks, 0) * 3000
						inputTag.value = Math.min(Math.round(maxUnits / 3 * (nation.propaganda_bureau ? 1.1 : 1) - nation.soldiers_today), maxUnits - nation.soldiers).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buysoldiers')
			inputTag.setAttribute('value', 'Enlist/Discharge Soldiers')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/soldiers/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	Promise.all([ data, sessionStorage.Token(() => undefined) ])
		.then(_token => formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false)))
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
						const maxUnits = nation.cities.reduce((sum, city) => sum + city.factory, 0) * 250
						inputTag.value = Math.min(Math.round(maxUnits / 5 * (nation.propaganda_bureau ? 1.1 : 1) - nation.tanks_today), maxUnits - nation.tanks).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buytanks')
			inputTag.setAttribute('value', 'Manufacture/Decommission Tanks')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/tanks/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	Promise.all([ data, sessionStorage.Token(() => undefined) ])
		.then(_token => formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false)))
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
						const maxUnits = nation.cities.reduce((sum, city) => sum + city.hangar, 0) * 15
						inputTag.value = Math.min(Math.round(maxUnits / 5 * (nation.propaganda_bureau ? 1.1 : 1) - nation.aircraft_today), maxUnits - nation.aircraft).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buyaircraft')
			inputTag.setAttribute('value', 'Manufacture/Decommission Aircraft')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/aircraft/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	Promise.all([ data, sessionStorage.Token(() => undefined) ])
		.then(_token => formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false)))
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
						const maxUnits = nation.cities.reduce((sum, city) => sum + city.drydock, 0) * 5
						inputTag.value = Math.min(Math.round(maxUnits / 5 * (nation.propaganda_bureau ? 1.1 : 1) - nation.ships_today), maxUnits - nation.ships).toString()
					})
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buyships')
			inputTag.setAttribute('value', 'Manufacture/Decommission Ships')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/navy/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	Promise.all([ data, sessionStorage.Token(() => undefined) ])
		.then(() => formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false)))
})

// Spies
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Spies Enlisted: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.spies.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Spies Enlisted Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.spies_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Enlist/Discharge: ', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'spies')
					inputTag.setAttribute('value', '0')
					data.then(nation => inputTag.value = Math.min(
						(nation.central_intelligence_agency ? 3 : 2) + (nation.spy_satellite ? 1 : 0) - nation.spies_today,
						(nation.central_intelligence_agency ? 60 : 50) - nation.spies
					).toString())
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'train_spies')
			inputTag.setAttribute('value', 'Enlist/Discharge Spies')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/spies/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	Promise.all([ data, sessionStorage.Token(() => undefined) ])
		.then(() => formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false)))
})

// Missiles
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Missiles Stockpiled: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.missiles.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Missiles Manufactured Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.missiles_today.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Manufacture/Decommission: ', divSpacer(), createTag<HTMLInputElement>('input', inputTag => {
					inputTag.setAttribute('type', 'number')
					inputTag.setAttribute('name', 'missile_purchase_input_amount')
					inputTag.setAttribute('value', '0')
					data.then(nation => inputTag.value = ((nation.space_program ? 3 : 2) - nation.missiles_today).toString())
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'missile_purchase_form_submit')
			inputTag.setAttribute('value', 'Manufacture/Decommission Missiles')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/missiles/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(async nation => {
		if (!nation.missile_launch_pad)
			return
		await sessionStorage.Token(() => undefined)
		formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false))
	})
})

// Nukes
createTag<HTMLFormElement>('form', formTag => {
	const divTag = document.querySelector<HTMLDivElement>('#rightcolumn>.row')!
	divTag.parentElement!.insertBefore(formTag, divTag)
	divTag.remove()

	formTag.classList.add('doc_military')
	formTag.append(
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Nuclear Weapons Possessed: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.nukes.toString())
				})
			)
		}),
		createTag<HTMLLabelElement>('label', labelTag => {
			labelTag.classList.add('spacer-row')
			labelTag.append(
				'Nuclear Weapons Manufactured Today: ', divSpacer(), createTag<HTMLSpanElement>('span', spanTag => {
					spanTag.append('?')
					data.then(nation => spanTag.textContent = nation.nukes_today.toString())
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
					data.then(nation => inputTag.value = (1 - nation.nukes_today).toString())
				})
			)
		}),
		createTag<HTMLInputElement>('input', inputTag => {
			inputTag.setAttribute('type', 'submit')
			inputTag.setAttribute('name', 'buyships')
			inputTag.setAttribute('value', 'Manufacture/Decommission Nuclear Weapons')
		}),
		createTag<HTMLAnchorElement>('a', aTag => {
			aTag.setAttribute('href', 'https://politicsandwar.com/nation/military/nukes/')
			aTag.textContent = 'Go to Page'
		})
	)

	formTag.addEventListener('submit', formSubmitEvent, { passive: false })

	formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	data.then(async nation => {
		if (!nation.nuclear_research_facility)
			return
		await sessionStorage.Token(() => undefined)
		formTag.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', false))
	})
})

/* Functions
-------------------------*/
async function formSubmitEvent(this: HTMLFormElement, event: SubmitEvent): Promise<void> {
	event.preventDefault()
	this.querySelectorAll<HTMLInputElement>('input').forEach(inputTag => inputTag.toggleAttribute('disabled', true))
	await sessionStorage.Token(async token => new DOMParser().parseFromString(await (await fetch(this.querySelector<HTMLAnchorElement>('a')!.href, {
		method: 'POST',
		body: [ ...this.querySelectorAll<HTMLInputElement>('input[name][value]'), { name: 'token', value: token } ]
			.reduce((formData, inputTag) => (formData.append(inputTag.name, inputTag.value), formData), new FormData())
	})).text(), 'text/html').querySelector<HTMLInputElement>('input[name="token"]')?.value ?? null)
}
