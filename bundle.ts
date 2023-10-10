import { encodeBase64 } from "https://deno.land/std@0.203.0/encoding/base64.ts"
import { encodeHex } from 'https://deno.land/std@0.203.0/encoding/hex.ts'
import { parse } from 'https://deno.land/std@0.203.0/toml/mod.ts'
import { readLines } from "https://deno.land/std@0.201.0/io/mod.ts"

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

async function patchUpdate(path: string) {
	const readFile = await Deno.open(path)
	const writeFile = await Deno.create(`${path}.txt`)
	for await (let line of readLines(readFile)) {
		if (line.startsWith('// @version'))
			line = line.slice(0, line.lastIndexOf('.') + 1) + (parseInt(line.slice(line.lastIndexOf('.') + 1)) + 1 || 0)
		await writeFile.write(new TextEncoder().encode(line + '\n'))
	}
	readFile.close()
	writeFile.close()
	await Deno.rename(`${path}.txt`, path)
}

function snakeToCamel(text: string) {
	return text.split('_').map(word => word[ 0 ].toUpperCase() + word.slice(1).toLowerCase())
}

const updateLock = Deno.args.includes('--lock')
const hashes = (
	updateLock
		? JSON.parse(await Deno.readTextFile('./hashes.lock').catch(() => '{}'))
		: {}
) as Record<string, string | undefined>

await Promise.all([
	/* Create ./docs/js/
	-------------------------*/
	Deno.remove('static/js/', { recursive: true })
		.catch(() => { })
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

	/* Compile workspace projects
	-------------------------*/
	...(parse(await Deno.readTextFile('./Cargo.toml')) as { workspace: { resolver: string, members: string[] } })
		.workspace.members.map(async member => {
			if (await Deno.stat(`./static/wasm/${member}_bg.wasm`).then(() => false).catch(() => true))
				return

			if (updateLock) {
				const hash = encodeHex(await crypto.subtle.digest(
					'SHA-256',
					await Deno.readFile(`./static/wasm/${member}_bg.wasm`)
				))
				if (hashes[ member ] === hash)
					return
				hashes[ member ] = hash
				await patchUpdate(`./${member}/prefix.ts`)
			}

			await Deno.writeTextFile(
				`./static/wasm/${snakeToCamel(member)}.ts`,
				`${await Deno.readTextFile(`./${member}/prefix.ts`)}\n\
				import x from './${member}.js'\n\
				x(fetch('data:application/wasm;base64,${encodeBase64(await Deno.readFile(`./static/wasm/${member}_bg.wasm`))}'))`
			)
			await createScript(`./static/wasm/${snakeToCamel(member)}.ts`)
		})
]

/* Compile ./src/ into ./static/scripts/
-------------------------*/
const dirEntries = Deno.readDir('./src/')
for await (const dirEntry of dirEntries)
	if (dirEntry.isFile && (dirEntry.name.endsWith('.ts') || dirEntry.name.endsWith('.tsx')))
		promises.push(createScript(`./src/${dirEntry.name}`))

await Promise.allSettled(promises)
stop()
if (updateLock)
	await Deno.writeTextFile('./hashes.lock', JSON.stringify(hashes, undefined, '\t'))
console.log(`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)
