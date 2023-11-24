release:
	deno run -A compile.ts --release
	deno run -A bundle.ts

debug:
	deno run -A compile.ts
	deno run -A bundle.ts

clean:
	cargo clean
	rm -rf static/wasm/

check:
	cargo +nightly check --target wasm32-unknown-unknown
	deno cache --lock-write compile.ts bundle.ts test.ts
	deno check compile.ts bundle.ts test.ts

update:
	make clean
	rustup update
	git pull
	cargo update
	make check
