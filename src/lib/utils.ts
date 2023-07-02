export type None = undefined | null
// deno-lint-ignore no-explicit-any
export type Irrelevant = any

export function createTag<T extends HTMLElement>(type: string, func?: ((tag: T) => void)): T {
	const tag = document.createElement(type) as T
	if (func)
		func(tag)
	return tag
}

interface LocalStorage {
	APIKey(): string | null
	APIKey(set: string | null): void
}
export const LocalStorage: LocalStorage = {
	APIKey(set?: string | null): Irrelevant {
		return localStorage[ set === undefined ? 'getItem' : set !== null ? 'setItem' : 'removeItem' ]('Doc_APIKey', set!)
	},
}
export enum GetLocalStorageKey {
	Doc_APIKey = 'APIKey'
}

export function sleep(ms: number): Promise<true> {
	return new Promise<true>(a => setTimeout(() => a(true), ms))
}

export function divSpacer(): HTMLDivElement {
	return createTag<HTMLDivElement>('div', divTag => divTag.classList.add('spacer'))
}
