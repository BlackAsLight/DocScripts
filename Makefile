release:
	SERVER_FN_OVERRIDE_KEY="trade" cargo --locked build --bin trade --release --target=wasm32-unknown-unknown
	mkdir -p static/wasm/
	wasm-bindgen --out-dir static/wasm/ --out-name trade --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/release/trade.wasm
	deno run -A bundle.ts --lock
	rm -rf static/wasm/

debug:
	cargo build --bin trade --target=wasm32-unknown-unknown
	mkdir -p static/wasm/
	wasm-bindgen --out-dir static/wasm/ --out-name trade --target web --omit-default-module-path --no-typescript target/wasm32-unknown-unknown/debug/trade.wasm
	deno run --allow-read --allow-write --allow-env --allow-run bundle.ts

check:
	cargo check --target=wasm32-unknown-unknown
	deno check bundle.ts test.ts

update:
	cargo update
	make check

clean:
	cargo clean
	rm -rf static/wasm/
