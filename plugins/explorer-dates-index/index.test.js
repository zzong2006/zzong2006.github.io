import assert from "node:assert/strict"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { ExplorerDatesIndex } from "./index.js"

test("explorer labels respect alias order without changing titles or exposing hidden notes", async () => {
  const output = await mkdtemp(path.join(tmpdir(), "explorer-labels-"))
  const note = (slug, frontmatter, extra = {}) => [
    null,
    { data: { slug, relativePath: `${slug}.md`, frontmatter, ...extra } },
  ]
  try {
    const content = [
      note("llm/GSPO", {
        title: "Group Sequence Policy Optimization",
        aliases: [null, "", "Group Sequence Policy Optimization", "GSPO", "G"],
      }),
      note("llm/GRPO", { title: "Group Relative Policy Optimization", alias: "GRPO" }),
      note("llm/DPO", { title: "DPO", aliases: ["Direct Preference Optimization"] }),
      note("llm/index", { title: "Language Models", aliases: ["LLM"] }),
      note("hidden", { title: "Hidden note", aliases: ["H"] }, { unlisted: true }),
    ]
    await ExplorerDatesIndex().emit({ argv: { output } }, content)
    const index = JSON.parse(await readFile(path.join(output, "static/explorerDates.json"), "utf8"))
    assert.deepEqual(index.labels, {
      "llm/GSPO": { label: "GSPO", title: "Group Sequence Policy Optimization" },
      "llm/GRPO": { label: "GRPO", title: "Group Relative Policy Optimization" },
    })
    assert.equal(content[0][1].data.frontmatter.title, "Group Sequence Policy Optimization")
    assert.deepEqual(index.files, {}) // Labels also work when dates are unavailable.
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})
