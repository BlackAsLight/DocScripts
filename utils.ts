/* Types
-------------------------*/
export type None = undefined | null

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
		if (result !== undefined && result !== null)
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
export async function attemptPromise<T, U>(func: (() => Promise<T>), error: ((e: any) => Promise<U>) | undefined = undefined) {
	try {
		return await func()
	}
	catch (e) {
		if (error !== undefined)
			return await error(e)
		console.error(e)
	}
}

// deno-lint-ignore no-explicit-any
export function attempt<T, U>(func: (() => T), error: ((e: any) => U) | undefined = undefined) {
	try {
		return func()
	}
	catch (e) {
		if (error !== undefined)
			return error(e)
		console.error(e)
	}
}
