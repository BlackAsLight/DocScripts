import { TextLineStream } from '@std/streams'
import { build, stop } from 'esbuild'
import { denoPlugins } from '@luca/esbuild-deno-loader'

await Promise.all([
	/* Create ./static/js/
	-------------------------*/
	Deno.remove('./static/js/', { recursive: true })
		.catch(() => {})
		.finally(() => Deno.mkdir('./static/js/', { recursive: true })),
	/* Create ./static/scripts/
	-------------------------*/
	// Deno.remove('static/scripts/', { recursive: true })
	// 	.catch(() => { })
	// 	.finally(() => Deno.mkdir('./static/scripts/', { recursive: true })),
])

const promises: Promise<void>[] = [
	/* Create ./static/js/main.js
	-------------------------*/
	esbuild('./ts/main.ts', './static/js/main.js'),
]

/* Compile ./src/ into ./static/scripts/
-------------------------*/
for await (const dirEntry of Deno.readDir('./src/')) {
	if (
		dirEntry.isFile &&
		(dirEntry.name.endsWith('.ts') || dirEntry.name.endsWith('.tsx'))
	) {
		promises.push(createScript(`./src/${dirEntry.name}`))
	}
}

await Promise.allSettled(promises)

stop()
console.log(
	`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`,
)

async function esbuild(inPath: string, outPath: string) {
	const { errors, warnings } = await build({
		plugins: denoPlugins({
			configPath: await Deno.realPath('./deno.json'),
		}),
		entryPoints: [inPath],
		outfile: outPath,
		format: 'esm',
		bundle: true,
		minify: true,
		jsxFactory: 'x',
		jsxFragment: 'y',
	})
	errors.forEach((error) => console.error(error))
	warnings.forEach((warning) => console.warn(warning))
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
			if (!copyLine) {
				if (line.trim() === '// ==UserScript==') {
					copyLine = true
				} else {
					continue
				}
			}
			lines.push(line.trim())
			if (line.trim() === '// ==/UserScript==') {
				break
			}
		}
	}
	if (!lines.length) {
		return
	}
	lines.push("'use strict';\n")

	const name = path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
	const file = await Deno.create(`./static/scripts/${name}.user.js`)
	await file.write(
		Uint8Array.from(
			lines.join('\n').split('').map((char) => char.charCodeAt(0)),
		),
	)
	await esbuild(path, `./static/scripts/${name}.min.js`)
	await file.write(await Deno.readFile(`./static/scripts/${name}.min.js`))
	file.close()
	await Deno.remove(`./static/scripts/${name}.min.js`)
	console.log(
		`(${
			(performance.now() - startTime).toLocaleString('en-US', {
				maximumFractionDigits: 2,
			})
		}ms):\t${path}`,
	)
}
