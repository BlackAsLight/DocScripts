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
		minify: true,
		jsxFactory: 'x',
		jsxFragment: 'y'
	})
	errors.forEach(error => console.error(error))
	warnings.forEach(warning => console.warn(warning))
}

/* Create ./docs/js/main.js
-------------------------*/
try {
	await Deno.remove('./docs/js/', { recursive: true })
}
// deno-lint-ignore no-empty
catch { }
finally {
	await Deno.mkdir('./docs/js/', { recursive: true })
}

const promises: Promise<void>[] = [ esbuild('./ts/main.tsx', './docs/js/main.js') ]

/* Compile ./src/ into ./docs/scripts/
-------------------------*/
// try {
// 	await Deno.remove('./docs/scripts/', { recursive: true })
// }
// // deno-lint-ignore no-empty
// catch { }
// finally {
// 	await Deno.mkdir('./docs/scripts/', { recursive: true })
// }

const dirEntries = Deno.readDir('./src/')
for await (const dirEntry of dirEntries) {
	if (!dirEntry.isFile || !(dirEntry.name.endsWith('.tsx') || dirEntry.name.endsWith('.ts')))
		continue

	promises.push((async () => {
		const lines: string[] = []
		{
			let copyLine = false
			const file = await Deno.open(`./src/${dirEntry.name}`)
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

		const name = dirEntry.name.slice(0, dirEntry.name.lastIndexOf('.')).replaceAll(' ', '')
		const fileWrite = await Deno.create(`./docs/scripts/${name}.user.js`)
		await fileWrite.write(Uint8Array.from(lines.join('\n').split('').map(char => char.charCodeAt(0))))

		await esbuild(`./src/${dirEntry.name}`, `./docs/scripts/${name}.min.js`)
		{
			console.log(`Converting: ./docs/scripts/${name}.min.js -> ./docs/scripts/${name}.user.js`)
			const fileRead = await Deno.open(`./docs/scripts/${name}.min.js`)
			for await (const line of readLines(fileRead))
				await fileWrite.write(Uint8Array.from((line + '\n').split('').map(char => char.charCodeAt(0))))
			fileRead.close()
		}
		fileWrite.close()

		console.log(`Deleting: ./docs/scripts/${name}.min.js`)
		await Deno.remove(`./docs/scripts/${name}.min.js`)
	})())
}
await Promise.allSettled(promises)
stop()

const endTime = performance.now()
console.log(`${(endTime - startTime).toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)
