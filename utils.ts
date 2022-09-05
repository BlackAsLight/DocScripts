/* Types
-------------------------*/
export type None = undefined | null
// deno-lint-ignore no-explicit-any
export type Forced = any

/* Enums
-------------------------*/
export enum Resource {
	Money,
	Oil,
	Coal,
	Iron,
	Bauxite,
	Lead,
	Uranium,
	Food,
	Gasoline,
	Steel,
	Aluminum,
	Munitions,
	Credits
}

/* Functions
-------------------------*/
export function sleep(ms: number) {
	return new Promise<true>(a => setTimeout(() => a(true), ms))
}

export async function waitTilFalse(func: (() => boolean), delay = 0) {
	while (func())
		await sleep(delay)
}

export function filterMap<T, U>(array: T[], func: ((element: T, i: number) => U | None)) {
	const input = [ ...array ]
	const output: U[] = []
	let i = 0
	for (const element of input) {
		const result = func(element, i++)
		if (result != undefined)
			output.push(result)
	}
	return output
}

export function capitalise(text: string) {
	return filterMap(text.split(' '), word => word ? word[ 0 ].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase() : null).join(' ')
}

export function max(...integers: bigint[]) {
	let max = integers.shift() as bigint
	for (const integer of integers)
		if (max < integer)
			max = integer
	return max
}

export function min(...integers: bigint[]) {
	let min = integers.shift() as bigint
	for (const integer of integers)
		if (integer < min)
			min = integer
	return min
}

export function uniqueRandomID() {
	const char = 'abcdefghijklmnopqrstuvwxyz'
	let id: string
	do {
		id = ''
		for (let i = 0; i < 50; ++i)
			id += char[ Math.floor(Math.random() * 26) ]
	} while (document.querySelector(`#${id}`))
	return id
}

export function endTime(startTime: number) {
	const endTime = performance.now()
	return (endTime - startTime).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'ms'
}

// deno-lint-ignore no-explicit-any
export function pass<T>(x: T, func: ((x: T) => any)) {
	func(x)
	return x
}

export async function wrap<T, U>(x: T, func: ((x: T) => U | Promise<U>)) {
	return await func(x)
}

// deno-lint-ignore no-explicit-any
export async function attemptPromise<T, U>(func: (() => Promise<T>), error: ((e: any) => Promise<U>) | None = undefined) {
	try {
		return await func()
	}
	catch (e) {
		if (error != undefined)
			return await error(e)
		console.error(e)
	}
}

// deno-lint-ignore no-explicit-any
export function attempt<T, U>(func: (() => T), error: ((e: any) => U) | None = undefined) {
	try {
		return func()
	}
	catch (e) {
		if (error != undefined)
			return error(e)
		console.error(e)
	}
}

export function formatDate(date = new Date()) {
	let text = ''
	text += date.getHours().toString().padStart(2, '0')
	text += ':'
	text += date.getMinutes().toString().padStart(2, '0')
	text += ' '
	text += date.getDate().toString().padStart(2, '0')
	text += '/'
	text += [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][ date.getMonth() ]
	text += '/'
	text += date.getFullYear()
	return text
}

export function formatNumber(number: number, digits = 2) {
	return number.toLocaleString('en-US', {maximumFractionDigits: digits})
}

export function formatBigInt(x: bigint) {
	return `${(x / 100n).toLocaleString('en-US', { maximumFractionDigits: 0 })}.${(x % 100n).toString().padStart(2, '0')}`
}
