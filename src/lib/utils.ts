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
	Hash(): string | null
	Hash(set: string | null): void
	Token(func: ((token: string | null) => string | null | Promise<string | null>)): Promise<void>
	aSynclyLastChecked(): number
	aSynclyLastChecked(set: number | null): void
}
export const LocalStorage: LocalStorage = {
	APIKey(set?: string | null): Irrelevant {
		return localStorage[ set === undefined ? 'getItem' : set !== null ? 'setItem' : 'removeItem' ]('Doc_APIKey', set!)
	},
	Hash(set?: string | null): Irrelevant {
		return localStorage[ set === undefined ? 'getItem' : set !== null ? 'setItem' : 'removeItem' ]('!Doc_Hash', set!)
	},
	async Token(func: (token: string | null) => string | null | Promise<string | null>): Promise<Irrelevant> {
		const set = await func(localStorage.getItem('!Doc_Token'))
		localStorage[ set !== null ? 'setItem' : 'removeItem' ]('!Doc_Token', set!)
	},
	aSynclyLastChecked(set?: number | null): Irrelevant {
		if (set === undefined)
			return parseInt(localStorage.getItem('!Doc_aS1') ?? '0') || 0
		if (set !== null)
			return localStorage.setItem('!Doc_aS1', set.toString())
		localStorage.removeItem('!Doc_aS1')
	}
}
export enum GetLocalStorageKey {
	Doc_APIKey = 'APIKey'
}

export const enum Ticks {
	Day1 = 86_400_000,
	Minute15 = 900_000,
	Minute5 = 300_000
}

export function sleep(ms: number): Promise<true> {
	return new Promise<true>(a => setTimeout(() => a(true), ms))
}

export function divSpacer(): HTMLDivElement {
	return createTag<HTMLDivElement>('div', divTag => divTag.classList.add('spacer'))
}
