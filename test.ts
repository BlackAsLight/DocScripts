import { readLines } from 'https://deno.land/std@0.151.0/io/mod.ts'

function cmd(command: string) {
	console.log(`Command: ${command}`)
	return Deno.run({ cmd: command.split(' ') })
}

try {
	await Deno.remove('./tests/', { recursive: true })
}
// deno-lint-ignore no-empty
catch {}
finally {
	await Deno.mkdir('./tests/', { recursive: true })
}

const args = Deno.args
for (let i = 0; i < args.length; ++i) {
	const lines: string[] = []
	let copyLine = false
	for await (const line of readLines(await Deno.open(args[ i ]))) {
		if (!copyLine) {
			copyLine = line.trim() === '// ==UserScript=='
			if (!copyLine)
				continue
		}
		lines.push(line.trim())
		if (line.trim() === '// ==/UserScript==')
			break
	}
	lines.push('\'use strict\';\n')

	console.log(`\n ${args[ i ]} \n`)
	const name = args[ i ].slice(args[ i ].lastIndexOf('/') + 1, args[ i ].lastIndexOf('.')).replaceAll(' ', '')
	if (!(await cmd(`deno bundle ${args[ i ]} ./tests/${name}.bundle.js`).status()).success)
		continue
	if (!(await cmd(`esbuild ./tests/${name}.bundle.js --bundle --minify --outfile=./tests/${name}.min.js`).status()).success)
		continue

	const file = await Deno.create(`./tests/${name}.js`)
	await file.write(Uint8Array.from(lines.join('\n').split('').map(char => char.charCodeAt(0))))
	for await (const line of readLines(await Deno.open(`./tests/${name}.min.js`)))
		await file.write(Uint8Array.from((line + '\n').split('').map(char => char.charCodeAt(0))))
}
