import { encodeBase64 } from '@std/encoding/base64.ts'
import { parse } from '@std/toml/mod.ts'
import { TextLineStream } from '@std/streams/mod.ts'
// @deno-types="@esbuild/mod.d.ts"
import { build, stop } from '@esbuild/mod.js'
import { denoPlugins } from '@esbuild_deno_loader/mod.ts'
import { Package } from './types.ts'

const members = (await Promise.all([
	/* Get Members
	-------------------------*/
	(async () => {
		const output = []
		for await (const dirEntry of Deno.readDir('./static/wasm/'))
			if (dirEntry.isFile && dirEntry.name.endsWith('_bg.wasm'))
				output.push(dirEntry.name.slice(0, dirEntry.name.lastIndexOf('_bg.wasm')))
		return output
	})(),

	/* Create ./static/js/
	-------------------------*/
	Deno.remove('./static/js/', { recursive: true })
		.catch(() => { })
		.finally(() => Deno.mkdir('./static/js/', { recursive: true })),

	/* Create ./static/scripts/
	-------------------------*/
	// Deno.remove('static/scripts/', { recursive: true })
	// 	.catch(() => { })
	// 	.finally(() => Deno.mkdir('./static/scripts/', { recursive: true })),
]))[ 0 ]

const promises: Promise<void>[] = [
	/* Create ./static/js/main.js
	-------------------------*/
	esbuild('./ts/main.ts', './static/js/main.js'),

	/* Bundle Wasm Scripts
	-------------------------*/
	...members.map(async member => {
		const startTime = performance.now()
		await Deno.writeTextFile(
			`./static/wasm/${snakeToCamel(member)}.ts`,
			`${(await Deno.readTextFile(`./${member}/prefix.ts`)).replace('<VERSION />', (parse(await Deno.readTextFile(`./${member}/Cargo.toml`)) as Package).package.version)}\n\
import x from './${member}.js'\n\
x(fetch('data:application/wasm;base64,${encodeBase64(await Deno.readFile(`./static/wasm/${member}_bg.wasm`))}'))`
		)
		await createScript(`./static/wasm/${snakeToCamel(member)}.ts`, startTime)
	})
]

/* Compile ./src/ into ./static/scripts/
-------------------------*/
for await (const dirEntry of Deno.readDir('./src/'))
	if (dirEntry.isFile && (dirEntry.name.endsWith('.ts') || dirEntry.name.endsWith('.tsx')))
		promises.push(createScript(`./src/${dirEntry.name}`))

await Promise.allSettled(promises)

stop()
console.log(`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)

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

async function createScript(path: string, startTime = performance.now()) {
	const lines: string[] = []
	{
		let copyLine = false
		for await (
			const line of (await Deno.open(path)).readable
				.pipeThrough(new TextDecoderStream())
				.pipeThrough(new TextLineStream())
		) {
			if (!copyLine)
				if (line.trim() === '// ==UserScript==')
					copyLine = true
				else
					continue
			lines.push(line.trim())
			if (line.trim() === '// ==/UserScript==')
				break
		}
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
	console.log(`(${(performance.now() - startTime).toLocaleString('en-US', { maximumFractionDigits: 2 })}ms):\t${path}`)
}

function snakeToCamel(text: string) {
	return text.split('_').map(word => word[ 0 ].toUpperCase() + word.slice(1).toLowerCase())
}
