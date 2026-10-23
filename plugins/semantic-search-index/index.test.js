import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { SemanticSearchIndex } from "./index.js"

test("search snippets come from the note source and keep inline math apart", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "semantic-index-"))
  try {
    const contentDir = path.join(root, "content")
    const output = path.join(root, "public")
    await mkdir(path.join(contentDir, "la"), { recursive: true })
    await writeFile(
      path.join(contentDir, "la", "transpose.md"),
      '---\ntitle: "transpose"\n---\n\n# Transpose ?\n\nFor $b_{ij}=a_{ji}$ the matrix is called the transpose & more.\n',
    )
    const cachePath = path.join(root, "embeddings.json")
    await writeFile(
      cachePath,
      JSON.stringify({ entries: { "la/transpose": { embedding: [1, 0] }, "la/missing": { embedding: [0, 1] } } }),
    )

    const note = (slug, extra) => [
      null,
      { data: { slug, relativePath: `${slug}.md`, frontmatter: { title: slug.split("/")[1] }, ...extra } },
    ]
    const content = [
      note("la/transpose"),
      // 원문이 없으면 Quartz 설명으로 돌아가고, 이스케이프된 기호를 되돌린다.
      note("la/missing", { description: "A &amp; B" }),
    ]
    await SemanticSearchIndex({ cachePath }).emit({ argv: { output, directory: contentDir } }, content)

    const index = JSON.parse(await readFile(path.join(output, "static/semanticIndex.json"), "utf8"))
    const bySlug = Object.fromEntries(index.entries.map((entry) => [entry.slug, entry.snippet]))
    assert.deepEqual(bySlug["la/transpose"], [
      "For ",
      "b_{ij}=a_{ji}",
      " the matrix is called the transpose & more.",
    ])
    assert.deepEqual(bySlug["la/missing"], ["A & B"])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
