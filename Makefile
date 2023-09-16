release:
	cargo build --release --target=wasm32-unknown-unknown
	mkdir -p static/wasm/
	wasm-bindgen --out-dir static/wasm/ --out-name trade --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/release/trade.wasm
	deno run --allow-read --allow-write --allow-env --allow-run bundle.ts
	rm -rf static/wasm/

debug:
	cargo build --target=wasm32-unknown-unknown
	mkdir -p static/wasm/
	wasm-bindgen --out-dir static/wasm/ --out-name trade --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/debug/trade.wasm
	deno run --allow-read --allow-write --allow-env --allow-run bundle.ts
