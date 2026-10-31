import assert from "node:assert/strict"
import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { ExplorerDatesIndex, pickPins } from "./index.js"

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

test("pins count distinct linking notes per folder, skipping folder pages and self links", () => {
  const notes = [
    { slug: "algo/index", links: ["algo/dfs", "algo/bfs", "algo/heap", "algo/stack"] },
    { slug: "algo/dfs", links: ["algo/dfs", "algo/stack#push", "algo/stack"] },
    { slug: "algo/bfs", links: ["algo/DFS", "algo/stack", "algo/heap"] },
    { slug: "algo/heap", links: ["algo/dfs", "algo/stack", "algo/bfs"] },
    { slug: "algo/stack", links: ["algo/dfs", "algo/heap"] },
    { slug: "ml/sgd", links: ["algo/heap", "algo/dfs", "missing/note", "ml"] },
    { slug: "root-note", links: [] },
    { slug: "hub", links: ["root-note", "algo/bfs"] },
    { slug: "x", links: ["root-note"] },
    { slug: "y", links: ["root-note"] },
  ]

  assert.deepEqual(pickPins(notes, { pinsPerFolder: 2, pinMinBacklinks: 3 }), {
    "algo/dfs": { rank: 1, backlinks: 4 },
    "algo/heap": { rank: 2, backlinks: 3 },
  })
  // dfs 는 bfs·heap·stack·sgd 4개. heap 과 stack 은 3개로 같아서 이름순으로 heap 이 앞선다.
  // index·자기 자신·없는 노트·폴더 링크("ml")는 세지 않는다. bfs 는 2개라 기준 미달,
  // root-note 는 3개지만 루트 직속이라 고르지 않는다.
  assert.deepEqual(Object.keys(pickPins(notes, { pinsPerFolder: 5, pinMinBacklinks: 3 })), [
    "algo/dfs",
    "algo/heap",
    "algo/stack",
  ])
})

test("pins are emitted next to labels", async () => {
  const output = await mkdtemp(path.join(tmpdir(), "explorer-pins-"))
  const note = (slug, links) => [null, { data: { slug, relativePath: `${slug}.md`, links } }]
  try {
    const content = [
      note("a/target", []),
      note("a/one", ["a/target"]),
      note("b/two", ["a/target"]),
      note("b/three", ["a/target"]),
    ]
    await ExplorerDatesIndex().emit({ argv: { output } }, content)
    const index = JSON.parse(await readFile(path.join(output, "static/explorerDates.json"), "utf8"))
    assert.deepEqual(index.pins, { "a/target": { rank: 1, backlinks: 3 } })
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})

test("explorer index keeps only slug, title and filePath, and skips unlisted notes", async () => {
  // 탐색기가 검색용 본문(contentIndex.json)을 기다리지 않도록 가벼운 인덱스를 따로 낸다.
  // 항목은 content-index 와 같게 unlisted 만 뺀다. 폴더 페이지와 제목 없는 노트도 들어가야 트리가 같다.
  const output = await mkdtemp(path.join(tmpdir(), "explorer-index-"))
  const note = (slug, frontmatter, extra = {}) => [
    null,
    {
      data: { slug, relativePath: `${slug}.md`, frontmatter, text: "body", links: ["x"], ...extra },
    },
  ]
  try {
    const content = [
      note("papers/bandit/linucb", { title: "LinUCB", tags: ["bandit"] }),
      note("papers/index", { title: "Papers" }),
      note("untitled", {}),
      note("hidden", { title: "Hidden" }, { unlisted: true }),
    ]
    const emitted = await ExplorerDatesIndex().emit({ argv: { output } }, content)
    const indexPath = path.join(output, "static/explorerIndex.json")
    assert.ok(emitted.includes(indexPath))
    const index = JSON.parse(await readFile(indexPath, "utf8"))
    assert.deepEqual(index, {
      "papers/bandit/linucb": {
        slug: "papers/bandit/linucb",
        filePath: "papers/bandit/linucb.md",
        title: "LinUCB",
      },
      "papers/index": { slug: "papers/index", filePath: "papers/index.md", title: "Papers" },
      untitled: { slug: "untitled", filePath: "untitled.md", title: "" },
    })
  } finally {
    await rm(output, { recursive: true, force: true })
  }
})
