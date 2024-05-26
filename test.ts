import { TextLineStream } from '@std/streams'
import { build, stop } from 'esbuild'
import { denoPlugins } from '@luca/esbuild-deno-loader'

async function esbuild(inPath: string, outPath: string) {
	const { errors, warnings } = await build({
		plugins: denoPlugins({
			configPath: await Deno.realPath('./deno.json'),
		}),
		entryPoints: [inPath],
		outfile: outPath,
		format: 'esm',
		bundle: true,
		keepNames: true,
		jsxFactory: 'x',
		jsxFragment: 'y',
	})
	errors.forEach((error) => console.error(error))
	warnings.forEach((warning) => console.warn(warning))
}

async function createScript(path: string) {
	const lines: string[] = []
	{
		let copyLine = false
		for await (
			const line of (await Deno.open(path)).readable.pipeThrough(
				new TextDecoderStream(),
			).pipeThrough(
				new TextLineStream(),
			)
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
	const file = await Deno.create(`./tests/${name}.user.js`)
	await file.write(
		Uint8Array.from(
			lines.join('\n').split('').map((char) => char.charCodeAt(0)),
		),
	)
	await esbuild(path, `./tests/${name}.min.js`)
	await file.write(await Deno.readFile(`./tests/${name}.min.js`))
	file.close()
	await Deno.remove(`./tests/${name}.min.js`)
}

/* Create ./tests/
-------------------------*/
try {
	await Deno.remove('./tests/', { recursive: true })
} // deno-lint-ignore no-empty
catch {
} finally {
	await Deno.mkdir('./tests/', { recursive: true })
}

await Promise.allSettled(Deno.args.map((arg) => createScript(arg)))
stop()

console.log(
	`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`,
)
