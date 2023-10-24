release:
	deno run -A compile.ts --release
	deno run -A bundle.ts --release
	make check
	rm -rf static/wasm/

debug:
	deno run -A compile.ts
	deno run -A bundle.ts

clean:
	cargo clean
	rm -rf static/wasm/

check:
	cargo check --target=wasm32-unknown-unknown
	deno cache --lock-write compile.ts bundle.ts test.ts
	deno check compile.ts bundle.ts test.ts

update:
	make clean
	rustup update
	git pull
	cargo update
	make check
