import { encodeHex } from 'https://deno.land/std@0.204.0/encoding/hex.ts'
import { parse } from 'https://deno.land/std@0.204.0/toml/mod.ts'

type WorkSpace = {
	workspace: {
		resolver: string,
		members: string[]
	}
}

const releaseMode = Deno.args.includes('--release')
const members = await Promise.all(
	(parse(await Deno.readTextFile('./Cargo.toml')) as WorkSpace)
		.workspace
		.members
)

await Deno.mkdir('./static/wasm/', { recursive: true })
for (const member of members) {
	if (await Deno.stat(`./${member}/src/main.rs`).then(() => true).catch(() => false))
		if (
			await command(`cargo --locked build --bin ${member} ${releaseMode ? '--release' : ''} --target wasm32-unknown-unknown`, releaseMode ? { 'SERVER_FN_OVERRIDE_KEY': member } : undefined)
			&& await command(`wasm-bindgen --out-dir static/wasm/ --out-name ${member} --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/${releaseMode ? 'release' : 'debug'}/${member}.wasm`)
		) {
			console.log(`${member}: true\n\
\t${encodeHex(await crypto.subtle.digest('SHA-256', await Deno.readFile(`./target/wasm32-unknown-unknown/${releaseMode ? 'release' : 'debug'}/${member}.wasm`)))}\n\
\t${encodeHex(await crypto.subtle.digest('SHA-256', await Deno.readFile(`./static/wasm/${member}_bg.wasm`)))}`)
		}
		else
			console.log(`${member}: false`)
}

console.log(`${performance.now().toLocaleString('en-US', { maximumFractionDigits: 2 })}ms`)

async function command(command: string, env?: Record<string, string>): Promise<boolean> {
	const args = command.split(' ').filter(x => x)
	return (await new Deno.Command(args.shift()!, { env, args }).spawn().status).success
}
