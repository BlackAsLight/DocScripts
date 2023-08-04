import { lock } from "./utils.ts"

export function Token(func: (token: string) => string | null | void | Promise<string | null | void>): Promise<void> {
	return lock('Doc_Token', async () => {
		let token = sessionStorage.getItem('Doc_Token') ?? document.querySelector<HTMLInputElement>('input[name="token"]')?.value
		if (token == undefined) {
			const response = await fetch('https://politicsandwar.com/city/')
			if (response.status === 200)
				token = new DOMParser().parseFromString(await response.text(), 'text/html').querySelector<HTMLInputElement>('input[name="token"]')?.value
			else
				throw `Failed to get Token | Status Code: ${response.status}`

			if (token == undefined)
				throw 'Token not Found'
		}

		const response = await func(token)
		if (response === undefined)
			return
		if (response === null)
			return sessionStorage.removeItem('Doc_Token')
		sessionStorage.setItem('Doc_Token', response)
	})
}
