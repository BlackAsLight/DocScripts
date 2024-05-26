import { Irrelevant } from './utils.ts'

export const APIKey: {
	(): string | null
	(set: string | null): void
} = function (set?: string | null): Irrelevant {
	return localStorage[set === undefined ? 'getItem' : set !== null ? 'setItem' : 'removeItem']('Doc_APIKey', set!)
}
