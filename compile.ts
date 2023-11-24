import { encodeHex } from "@std/encoding/hex.ts"
import { parse } from "@std/toml/mod.ts"
import { WorkSpace, Package, Scripts } from './types.ts'

const releaseMode = Deno.args.includes('--release')
const scripts = (releaseMode ? JSON.parse(await Deno.readTextFile('./scripts.lock').catch(() => '{}')) : {}) as Scripts
const members = await Promise.all(
	(parse(await Deno.readTextFile('./Cargo.toml')) as WorkSpace)
		.workspace
		.members
)
const cleanUp: Promise<void>[] = []

await Deno.mkdir('./static/wasm/', { recursive: true })
/* Compile workspace projects
-------------------------*/
for (const member of members)
	if (
		await Deno.stat(`./${member}/src/main.rs`)
			.then(() => true)
			.catch(() => false)
	)
		if (
			await command(`cargo +nightly --frozen build --bin ${member}${releaseMode ? ' --release ' : ' '}--target wasm32-unknown-unknown`)
			&& await command(`wasm-bindgen --out-dir static/wasm/ --out-name ${member} --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/${releaseMode ? 'release' : 'debug'}/${member}.wasm`)
		)
			(console.log(`Success: ${member}`), cleanUp.push(updateScript(member)))
		else
			console.log(`Fail: ${member}`)

await Promise.allSettled(cleanUp)
await Deno.writeTextFile('./scripts.lock', JSON.stringify(scripts))
console.log(`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)

async function command(command: string, env?: Record<string, string>): Promise<boolean> {
	console.log(`Command: ${command}`)
	const args = command.split(' ').filter(x => x)
	return (await new Deno.Command(args.shift()!, { env, args }).spawn().status).success
}

async function updateScript(member: string): Promise<void> {
	if (!releaseMode)
		return

	const version = (parse(await Deno.readTextFile(`./${member}/Cargo.toml`)) as Package).package.version
	if (!scripts[ member ] || scripts[ member ].version !== version)
		scripts[ member ] = { hash: encodeHex(await crypto.subtle.digest('SHA-256', await Deno.readFile(`./target/wasm32-unknown-unknown/release/${member}.wasm`))), version }
	else
		await Promise.allSettled([ Deno.remove(`./static/wasm/${member}.js`), Deno.remove(`./static/wasm/${member}_bg.wasm`) ])
}
