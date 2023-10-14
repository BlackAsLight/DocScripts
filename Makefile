release:
	deno run -A compile.ts --release
	deno run -A bundle.ts --release
	cargo check
	rm -rf static/wasm/

debug:
	deno run -A compile.ts
	deno run -A bundle.ts

check:
	cargo check --target=wasm32-unknown-unknown
	deno check bundle.ts test.ts

update:
	cargo update
	deno cache --lock-write compile.ts bundle.ts test.ts
	make check

clean:
	cargo clean
	rm -rf static/wasm/
