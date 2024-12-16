import { build, stop } from "esbuild";
import { denoPlugins } from "@luca/esbuild-deno-loader";
import { basename } from "@std/path";
import { extname } from "@std/path";
import { normalize } from "@std/path";

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

async function createScript(path: string, outDir: string): Promise<void> {
  const startTime = performance.now();
  if (extname(path) !== ".ts") {
    throw new TypeError(
      `Expected a ".ts" type extension. Got ${extname(path)} in ${path}`,
    );
  }

  const name = basename(path).slice(0, -3);
  const minPath = normalize(outDir + "/" + name + "min.js");
  const promise = esbuild(path, minPath);
  const file = await Deno.create(normalize(outDir + "/" + name + ".user.js"));
  await file.write(new TextEncoder().encode(
    await async function (): Promise<string> {
      const text = await Deno.readTextFile(path);
      const a = text.indexOf("// ==UserScript==");
      if (a === -1) {
        throw new SyntaxError(
          `Failed to locate "// ==UserScript==" in ${path}`,
        );
      }
      const b = text.indexOf("// ==/UserScript==", a) +
        "// ==/UserScript==".length;
      if (b === -1) {
        throw new SyntaxError(
          `Failed to locate "// ==/UserScript==" in ${path}`,
        );
      }
      return text.slice(a, b) + "\n'use strict';\n";
    }(),
  ));
  await promise;
  await (await Deno.open(minPath))
    .readable
    .pipeTo(file.writable);
  await Deno.remove(minPath);

  console.log(
    `(${
      (performance.now() - startTime).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    }ms)\t${path}`,
  );
}

await Promise.allSettled([
  Deno.mkdir("static/js/", { recursive: true })
    .then(() => esbuild("ts/main.ts", "static/js/main.js")),
  Deno.mkdir("static/scripts/", { recursive: true })
    .then(async () => {
      const promises: Promise<void>[] = [];
      for await (const dirEntry of Deno.readDir("src/")) {
        if (dirEntry.isFile && extname(dirEntry.name) === ".ts") {
          promises.push(
            createScript("src/" + dirEntry.name, "static/scripts/"),
          );
        }
      }
      await Promise.allSettled(promises);
    }),
]);
stop();

console.log(
  `${
    performance.now().toLocaleString("en-US", { maximumFractionDigits: 2 })
  }ms`,
);
