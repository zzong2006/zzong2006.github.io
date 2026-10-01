import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseHistory, resolveDates } from "./index.js"

test("Git creation survives edits and renames, deletion and recreation reset it", () => {
  const log = [
    "DATE:2020-01-01T00:00:00Z",
    "\nA",
    "content/한 글.md",
    "DATE:2021-01-01T00:00:00Z",
    "\nM",
    "content/한 글.md",
    "DATE:2022-01-01T00:00:00Z",
    "\nR100",
    "content/한 글.md",
    "content/new.md",
  ].join("\0")
  assert.deepEqual(parseHistory(log).get("content/new.md"), {
    created: "2020-01-01T00:00:00Z",
    modified: "2022-01-01T00:00:00Z",
  })
  assert.equal(parseHistory(log).has("content/한 글.md"), false)
  const recreated = parseHistory(
    log + "\0DATE:2023-01-01T00:00:00Z\0D\0content/new.md\0A\0content/new.md",
  )
  assert.equal(recreated.get("content/new.md").created, "2023-01-01T00:00:00Z")
})

test("explicit dates win; invalid and missing dates never become build time", () => {
  const history = { created: "2020-01-01T00:00:00Z", modified: "2026-10-01T16:00:00Z" }
  const resolved = resolveDates({ created: "2019-03-04", modified: "invalid" }, history)
  assert.equal(resolved.dates.created.toISOString(), "2019-03-03T15:00:00.000Z")
  assert.equal(resolved.dates.modified.toISOString(), history.modified.replace("Z", ".000Z"))
  assert.equal(resolved.dateSources.created, "frontmatter")
  assert.equal(resolveDates({}, undefined).dates.created, undefined)
})

test("frontmatter normalization preserves author dates across repeated publishing", () => {
  const base = path.resolve(tmpdir())
  const dir = mkdtempSync(path.join(base, "note-dates-"))
  try {
    mkdirSync(path.join(dir, "content"))
    const note = path.join(dir, "content/test.md")
    writeFileSync(
      note,
      '---\ncreated: 2019-03-04\nmodified: "2026-10-02T00:00:00+09:00"\npublished: 2020-01-01\n---\nBody\n',
    )
    const script = fileURLToPath(
      new URL("../../scripts/normalize-frontmatter.mjs", import.meta.url),
    )
    execFileSync(process.execPath, [script], { cwd: dir })
    const first = readFileSync(note, "utf8")
    assert.match(first, /created: "2019-03-04"/)
    assert.match(first, /modified: "2026-10-02T00:00:00\+09:00"/)
    execFileSync(process.execPath, [script], { cwd: dir })
    assert.equal(readFileSync(note, "utf8"), first)
  } finally {
    assert.ok(dir.startsWith(base + path.sep))
    rmSync(dir, { recursive: true, force: true })
  }
})
