import { promises as fs } from "node:fs"

const sourceFile = ".quartz/plugins/search/src/components/scripts/search.inline.ts"
const distFiles = [
  ".quartz/plugins/search/dist/index.js",
  ".quartz/plugins/search/dist/components/index.js",
]

async function patchFile(file, replacements) {
  let text = await fs.readFile(file, "utf8")
  const original = text

  for (const [from, to] of replacements) {
    text = text.replace(from, to)
  }

  if (text !== original) {
    await fs.writeFile(file, text, "utf8")
  }

  return text !== original
}

const sourceChanged = await patchFile(sourceFile, [
  [/^[ \t]*\(code >= 0xac00 && code <= 0xd7af\) \|\|\r?\n/m, ""],
])

let distChanged = 0
for (const file of distFiles) {
  const changed = await patchFile(file, [[/\|\|[A-Za-z_$][\w$]*>=44032&&[A-Za-z_$][\w$]*<=55215/g, ""]])
  if (changed) {
    distChanged += 1
  }
}

console.log(`patched search plugin: source=${sourceChanged}, dist=${distChanged}`)
