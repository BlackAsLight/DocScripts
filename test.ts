import { readLines } from 'https://deno.land/std@0.181.0/io/mod.ts'
import { build, stop } from 'https://deno.land/x/esbuild@v0.15.10/mod.js'
import { denoPlugin } from 'https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts'
const startTime = performance.now()

async function esbuild(inPath: string, outPath: string) {
	console.log(`Transpiling: ${inPath} -> ${outPath}`)
	const { errors, warnings } = await build({
		plugins: [ denoPlugin() ],
		entryPoints: [ inPath ],
		outfile: outPath,
		format: 'esm',
		bundle: true,
		keepNames: true,
		jsxFactory: 'x',
		jsxFragment: 'y',
	})
	errors.forEach(error => console.error(error))
	warnings.forEach(warning => console.warn(warning))
}

try {
	await Deno.remove('./tests/', { recursive: true })
}
// deno-lint-ignore no-empty
catch { }
finally {
	await Deno.mkdir('./tests/', { recursive: true })
}

await Promise.allSettled(Deno.args.map(async arg => {
	const lines: string[] = []
	{
		let copyLine = false
		const file = await Deno.open(arg)
		for await (const line of readLines(file)) {
			if (!copyLine)
				if (line.trim() === '// ==UserScript==')
					copyLine = true
				else
					continue
			lines.push(line.trim())
			if (line.trim() === '// ==/UserScript==')
				break
		}
		file.close()
	}
	if (!lines.length)
		return
	lines.push('\'use strict\';\n')

	const name = arg.slice(arg.lastIndexOf('/') + 1, arg.lastIndexOf('.')).replaceAll(' ', '')
	const fileWrite = await Deno.create(`./tests/${name}.js`)
	await fileWrite.write(Uint8Array.from(lines.join('\n').split('').map(char => char.charCodeAt(0))))

	await esbuild(arg, `./tests/${name}.bundle.js`)
	{
		console.log(`Converting: ./tests/${name}.bundle.js -> ./tests/${name}.js`)
		const fileRead = await Deno.open(`./tests/${name}.bundle.js`)
		for await (const line of readLines(fileRead))
			await fileWrite.write(Uint8Array.from((line + '\n').split('').map(char => char.charCodeAt(0))))
		fileRead.close()
	}
	fileWrite.close()
}))
stop()

const endTime = performance.now()
console.log(`${(endTime - startTime).toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)
