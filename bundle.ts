import { encodeBase64 } from 'https://deno.land/std@0.204.0/encoding/base64.ts'
import { encodeHex } from 'https://deno.land/std@0.204.0/encoding/hex.ts'
import { parse, stringify } from 'https://deno.land/std@0.204.0/toml/mod.ts'
import { TextLineStream } from 'https://deno.land/std@0.204.0/streams/mod.ts'
// @deno-types="https://deno.land/x/esbuild@v0.17.19/mod.d.ts"
import { build, stop } from 'https://deno.land/x/esbuild@v0.17.19/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts'

type Package = {
	package: {
		name: string,
		version: string,
		edition: string
	}
}

const releaseMode = Deno.args.includes('--release')
const hashes = (
	releaseMode
		? JSON.parse(await Deno.readTextFile('./hashes.lock').catch(() => '{}'))
		: {}
) as Record<string, { hash: string, version: { major: number, minor: number, patch: number } } | undefined>

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

	/* Compile workspace projects
	-------------------------*/
	...members.map(async member => {
		console.log(member, releaseMode)
		const cargo = parse(await Deno.readTextFile(`./${member}/Cargo.toml`)) as Package
		if (releaseMode) {
			const [ major, minor, patch ] = cargo.package.version.split('.').map(x => parseInt(x))
			const hash = encodeHex(await crypto.subtle.digest('SHA-256', await Deno.readFile(`./static/wasm/${member}_bg.wasm`)))
			console.log(`${member}\n\
\t${hashes[ member ]!.hash}\n\
\t${hash}`)
			if (!hashes[ member ])
				hashes[ member ] = { hash, version: { major, minor, patch } }
			else if (hashes[ member ]!.version.major > major || hashes[ member! ]!.version.minor > minor)
				hashes[ member ]!.hash = hash
			else if (hashes[ member ]!.hash !== hash) {
				hashes[ member ]!.hash = hash
				hashes[ member ]!.version.patch += 1
				cargo.package.version = `${major}.${minor}.${patch + 1}`
				promises.push(Deno.writeTextFile(`./${member}/Cargo.toml`, stringify(cargo).trimStart()))
			}
		}

		await Deno.writeTextFile(
			`./static/wasm/${snakeToCamel(member)}.ts`,
			`${(await Deno.readTextFile(`./${member}/prefix.ts`)).replace('<VERSION />', cargo.package.version)}\n\
import x from './${member}.js'\n\
x(fetch('data:application/wasm;base64,${encodeBase64(await Deno.readFile(`./static/wasm/${member}_bg.wasm`))}'))`
		)
		await createScript(`./static/wasm/${snakeToCamel(member)}.ts`)
	})
]

/* Compile ./src/ into ./static/scripts/
-------------------------*/
for await (const dirEntry of Deno.readDir('./src/'))
	if (dirEntry.isFile && (dirEntry.name.endsWith('.ts') || dirEntry.name.endsWith('.tsx')))
		promises.push(createScript(`./src/${dirEntry.name}`))

await Promise.allSettled(promises)

if (releaseMode)
	await Deno.writeTextFile('./hashes.lock', JSON.stringify(hashes, undefined, '\t'))

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

async function createScript(path: string) {
	console.log(path)
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
}

function snakeToCamel(text: string) {
	return text.split('_').map(word => word[ 0 ].toUpperCase() + word.slice(1).toLowerCase())
}
