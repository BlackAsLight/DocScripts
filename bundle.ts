import { readLines } from "https://deno.land/std@0.201.0/io/mod.ts"
import { encode } from "https://deno.land/std@0.201.0/encoding/base64.ts";
// @deno-types="https://deno.land/x/esbuild@v0.17.19/mod.d.ts"
import { build, stop } from 'https://deno.land/x/esbuild@v0.17.19/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts'

async function esbuild(inPath: string, outPath: string) {
	const { errors, warnings } = await build({
		plugins: denoPlugins(),
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

async function createScript(path: string) {
	console.log(path)
	const lines: string[] = []
	{
		let copyLine = false
		const file = await Deno.open(path)
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

	const name = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
	const file = await Deno.create(`./static/scripts/${name}.user.js`)
	await file.write(Uint8Array.from(lines.join('\n').split('').map(char => char.charCodeAt(0))))
	await esbuild(path, `./static/scripts/${name}.min.js`)
	await file.write(await Deno.readFile(`./static/scripts/${name}.min.js`))
	file.close()
	await Deno.remove(`./static/scripts/${name}.min.js`)
}

await Promise.all([
	/* Create ./docs/js/
	-------------------------*/
	Deno.remove('static/js/', { recursive: true }).catch(() => {})
		.finally(() => Deno.mkdir('./static/js/', { recursive: true })),

	/* Create ./static/scripts/
	-------------------------*/
	// Deno.remove('static/scripts/', { recursive: true })
	// 	.finally(() => Deno.mkdir('./static/scripts/', { recursive: true })),
])

const promises: Promise<void>[] = [
	/* Create ./static/js/main.js
	-------------------------*/
	esbuild('./ts/main.ts', './static/js/main.js'),

	/* Create ./static/wasm/Trade.ts
	-------------------------*/
	(async () => {
		if (await Deno.stat('./static/wasm/trade_bg.wasm').then(() => true).catch(() => false)) {
			await Deno.writeTextFile(
				'./static/wasm/Trade.ts',
				`${await Deno.readTextFile('./trade/prefix.ts')}\nimport x from './trade.js'\nx(fetch('data:application/wasm;base64,${encode(await Deno.readFile('./static/wasm/trade_bg.wasm'))}'))`
			)
			await createScript('./static/wasm/Trade.ts')
		}
	})()
]

/* Compile ./src/ into ./static/scripts/
-------------------------*/
const dirEntries = Deno.readDir('./src/')
for await (const dirEntry of dirEntries)
	if (dirEntry.isFile && (dirEntry.name.endsWith('.ts') || dirEntry.name.endsWith('.tsx')))
		promises.push(createScript(`./src/${dirEntry.name}`))

await Promise.allSettled(promises)
stop()
console.log(`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)
