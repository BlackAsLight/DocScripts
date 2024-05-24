import * as localStorage from './localStorage.ts'

export type None = undefined | null
// deno-lint-ignore no-explicit-any
export type Irrelevant = any

const locks: Record<string, boolean> = {}
export async function lock<T>(key: string, func: () => Promise<T>): Promise<T> {
	while (locks[key]) {
		await sleep(50)
	}
	locks[key] = true
	try {
		return await func()
	} catch (error) {
		throw error
	} finally {
		delete locks[key]
	}
}

export function createTag<T extends HTMLElement>(
	type: string,
	func?: (tag: T) => void,
): T {
	const tag = document.createElement(type) as T
	if (func) {
		func(tag)
	}
	return tag
}

export enum GetLocalStorageKey {
	Doc_APIKey = 'APIKey',
}

export const enum Ticks {
	Day1 = 86_400_000,
	Minute15 = 900_000,
	Minute5 = 300_000,
}

export function sleep(ms: number): Promise<true> {
	return new Promise<true>((a) => setTimeout(() => a(true), ms))
}

export function divSpacer(): HTMLDivElement {
	return createTag<HTMLDivElement>(
		'div',
		(divTag) => divTag.classList.add('spacer'),
	)
}

function userConfig() {
	return document.querySelector<HTMLDivElement>('#Doc_Config') ??
		createTag<HTMLDivElement>('div', (divTag) => {
			document.querySelector('#leftcolumn')!.append(divTag)
			divTag.setAttribute('id', 'Doc_Config')
		})
}

export function userConfig_Label(label: string) {
	const divTag = userConfig()
	divTag.append(document.createElement('hr'))
	divTag.append(createTag<HTMLElement>('b', (bTag) => bTag.append(label)))
}

export function userConfig_APIKey() {
	const divTag = userConfig()
	divTag.append(document.createElement('br'))
	divTag.append(createTag<HTMLButtonElement>('button', (buttonTag) => {
		const apiKey = localStorage.APIKey()
		buttonTag.append(apiKey ? 'Update API Key' : 'Insert API Key')
		buttonTag.addEventListener('click', (_event) => {
			const response = prompt(
				'Insert API Key | It can be found at the bottom of the Accounts Page:',
				apiKey ?? '',
			)
			if (response === null) {
				return
			}
			localStorage.APIKey(response || null)
			location.reload()
		})
	}))
}
