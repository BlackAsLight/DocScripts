import { Forced } from '../utils.ts'

document.addEventListener('click', (event) => {
	if ((event.target as Forced).matches('a[href^="#"]')) {
		event.preventDefault()
		document.querySelector((event.target as Forced).hash).scrollIntoView()
	}
})
