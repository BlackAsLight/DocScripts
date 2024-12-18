import { build, stop } from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";
import { basename } from "@std/path";
import { extname } from "@std/path";

async function esbuild(inPath: string, outPath: string): Promise<void> {
  const { errors, warnings } = await build({
    plugins: denoPlugins(),
    entryPoints: [inPath],
    outfile: outPath,
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: "inline",
  });
  errors.forEach((error) => console.error(error));
  warnings.forEach((warning) => console.warn(warning));
}

async function createScript(path: string): Promise<void> {
  if (extname(path) !== ".ts") {
    throw new TypeError(
      `Expected a ".ts" type extension. Got ${extname(path)} in ${path}`,
    );
  }

  const name = basename(path).slice(0, -3);
  const promise = esbuild(path, `tests/${name}.min.js`);
  const file = await Deno.create(`tests/${name}.user.js`);
  await file.write(new TextEncoder().encode(
    await async function (): Promise<string> {
      const text = await Deno.readTextFile(path);
      const a = text.indexOf("// ==UserScript==");
      if (a == -1) {
        throw new SyntaxError(
          `Failed to locate "// ==UserScript==" in ${path}`,
        );
      }
      const b = text.indexOf("// ==/UserScript==", a) +
        "// ==/UserScript==".length;
      if (b == -1) {
        throw new SyntaxError(
          `Failed to locate "// ==/UserScript==" in ${path}`,
        );
      }
      return text.slice(a, b) + "\n'use strict';\n";
    }(),
  ));
  await promise;
  await (await Deno.open(`tests/${name}.min.js`))
    .readable
    .pipeTo(file.writable);
  await Deno.remove(`tests/${name}.min.js`);
}

await Deno.remove("tests/", { recursive: true }).catch(() => {});
await Deno.mkdir("./tests/", { recursive: true });

await Promise.allSettled(Deno.args.map((arg) => createScript(arg)));
stop();

console.log(
  `${
    performance.now().toLocaleString("en-US", { maximumFractionDigits: 2 })
  }ms`,
);
