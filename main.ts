import { readLines } from "https://deno.land/std@0.151.0/io/mod.ts"

function cmd(command: string) {
	console.log(`Command: ${command}`)
	return Deno.run({ cmd: command.split(' ') })
}

/* Create ./docs/js/main.js
-------------------------*/
try {
	await Deno.remove('./docs/js/', { recursive: true })
}
finally {
	await Deno.mkdir('./docs/js/', { recursive: true })
}

await cmd('deno bundle ./ts/main.tsx ./docs/js/main.js').status()

/* Compile ./src/ into ./docs/scripts/
-------------------------*/
try {
	await Deno.remove('./docs/scripts/', { recursive: true })
}
finally {
	await Deno.mkdir('./docs/scripts/', { recursive: true })
}

const dirEntries = Deno.readDir('./src/')
for await (const dirEntry of dirEntries) {
	if (!dirEntry.isFile || !(dirEntry.name.endsWith('.tsx') || dirEntry.name.endsWith('.ts')))
		continue

	const lines: string[] = []
	let copyLine = false
	for await (const line of readLines(await Deno.open(`./src/${dirEntry.name}`))) {
		if (!copyLine) {
			copyLine = line.trim() === '// ==UserScript=='
			if (!copyLine)
				continue
		}
		lines.push(line.trim())
		if (line.trim() === '// ==/UserScript==')
			break
	}
	if (!lines.length)
		continue
	lines.push('\'use strict\';\n')

	console.log('\n' + dirEntry.name + '\n')
	const name = dirEntry.name.slice(0, dirEntry.name.lastIndexOf('.')).replaceAll(' ', '')
	if (!(await cmd(`deno bundle ./src/${dirEntry.name} ./docs/scripts/${name}.js`).status()).success)
		continue
	if (!(await cmd(`esbuild ./docs/scripts/${name}.js --bundle --minify --outfile=./docs/scripts/${name}.min.js`).status()).success)
		continue

	const file = await Deno.create(`./docs/scripts/${name}.user.js`)
	await file.write(Uint8Array.from(lines.join('\n').split('').map(char => char.charCodeAt(0))))
	for await (const line of readLines(await Deno.open(`./docs/scripts/${name}.min.js`)))
		await file.write(Uint8Array.from((line + '\n').split('').map(char => char.charCodeAt(0))))

	await Deno.remove(`./docs/scripts/${name}.js`)
	await Deno.remove(`./docs/scripts/${name}.min.js`)
}
