import { build } from "esbuild"
import { mkdir, copyFile, cp } from "node:fs/promises"
await mkdir("dist", { recursive: true })
await build({
  entryPoints: ["src/app.mjs"],
  outfile: "dist/app.js",
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
})
await build({
  entryPoints: ["src/style.css"],
  outfile: "dist/style.css",
  bundle: true,
  minify: true,
  loader: { ".woff": "file", ".woff2": "file", ".ttf": "file" },
  assetNames: "fonts/[name]-[hash]",
})
await copyFile("src/index.html", "dist/index.html")
