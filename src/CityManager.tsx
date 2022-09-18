// ==UserScript==
// @name         Doc: City Manager
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.2
// @description  Improving the experience of switching improvements.
// @author       BlackAsLight
// @match        https://politicsandwar.com/city/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==

import { x } from "../imports.ts"
import { pass, sleep, waitTilFalse, wrap } from "../utils.ts"

/* Double Injection Protection
-------------------------*/
if (document.querySelector('#Doc_CityManager'))
	throw Error('This script was already injected...')
document.body.append(<div id='Doc_CityManager' style='display: none;' />)

/* Global Variables
-------------------------*/
let token = (document.querySelector('input[name="token"]') as HTMLInputElement).value
let submitting = false
/* Main
-------------------------*/
document.querySelectorAll('form[action*="#improvements"]')
	.forEach(formTag => (formTag as HTMLFormElement)
		.addEventListener('click', async function (event) {
			if (!event.target || (event.target as HTMLElement).nodeName !== 'INPUT')
				return
			event.preventDefault()

			const inputTag = event.target as HTMLInputElement
			inputTag.toggleAttribute('disabled', true)
			await waitTilFalse(() => submitting)
			submitting = true

			const dom = new DOMParser().parseFromString(await (await fetch(this.action, {
				method: 'POST',
				body: (() => {
					const formData = new FormData()
					formData.append(inputTag.name, inputTag.value)
					formData.append('token', token)
					return formData
				})()
			})).text(), 'text/html')
			token = (dom.querySelector('input[name="token"]') as HTMLInputElement).value
			wrap(inputTag.parentElement as HTMLParagraphElement, pTag => (pTag.nextElementSibling ? pTag.nextElementSibling : pTag.previousElementSibling) as HTMLParagraphElement).textContent = wrap((dom.querySelector(`input[name="${inputTag.name}"]`) as HTMLInputElement).parentElement as HTMLParagraphElement, pTag => (pTag.nextElementSibling ? pTag.nextElementSibling : pTag.previousElementSibling) as HTMLParagraphElement).textContent
			const spanTags = [ ...document.querySelectorAll('.improvementQuantity') ]
			dom.querySelectorAll('.improvementQuantity').forEach((spanTag, i) => spanTags[ i ].textContent = spanTag.textContent);
			(document.querySelector('#improvements') as HTMLParagraphElement).insertBefore(dom.querySelector('#improvements>span') as HTMLSpanElement, pass(document.querySelector('#improvements>span') as HTMLSpanElement, async spanTag => {
				await sleep(0)
				spanTag.remove()
			}))

			submitting = false
			inputTag.toggleAttribute('disabled', false)
		}))
