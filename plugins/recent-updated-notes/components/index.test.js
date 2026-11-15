import { test } from "node:test"
import assert from "node:assert/strict"
import { changeKindOf, newNotes } from "./index.js"
import { homeLists } from "../../home-recent-notes/index.js"

const note = (slug, created, modified) => ({
  slug,
  relativePath: `${slug}.md`,
  dates: { created: new Date(created), modified: new Date(modified) },
})

const written = note("a/written", "2026-11-16T10:00:00+09:00", "2026-11-16T10:00:00+09:00")
const sameDayEdit = note("a/same-day", "2026-11-16T09:00:00+09:00", "2026-11-16T22:00:00+09:00")
const edited = note("a/edited", "2026-10-01T09:00:00+09:00", "2026-11-15T09:00:00+09:00")
// 한꺼번에 옮겨 온 날: BULK_DAY_THRESHOLD(20)편보다 많다.
const imported = Array.from({ length: 25 }, (_, i) =>
  note(`bulk/${i}`, "2026-06-14T09:00:00+09:00", "2026-06-14T09:00:00+09:00"),
)
const importedEdited = note("bulk/edited", "2026-06-14T09:00:00+09:00", "2026-11-14T09:00:00+09:00")
const files = [written, sameDayEdit, edited, ...imported, importedEdited]

test("notes written and edited on the same Seoul day are new", () => {
  /** 쓴 날 바로 고친 노트는 Edited 가 아니라 New 로 보인다. */
  const kindOf = changeKindOf(files)
  assert.equal(kindOf(written), "new")
  assert.equal(kindOf(sameDayEdit), "new")
})

test("notes edited after the day they were written are updated", () => {
  /** 한꺼번에 옮겨 온 노트도 나중에 고치면 수정으로 보인다. */
  const kindOf = changeKindOf(files)
  assert.equal(kindOf(edited), "updated")
  assert.equal(kindOf(importedEdited), "updated")
})

test("bulk-imported notes never edited get no badge", () => {
  /** 옮겨 오기만 한 노트는 쓴 것도 고친 것도 아니라 표시하지 않는다. */
  assert.equal(changeKindOf(files)(imported[0]), undefined)
})

test("home updated list includes new notes and skips untouched imports", () => {
  /** 대문 '최근 수정한 글' 은 새 글도 담고, 옮겨 오기만 한 노트는 뺀다. */
  const { updated } = homeLists(files, { newLimit: 5, updatedLimit: 10 })
  assert.deepEqual(
    updated.map((page) => page.slug),
    ["a/same-day", "a/written", "a/edited", "bulk/edited"],
  )
})

test("newNotes still drops bulk-imported days", () => {
  /** 신규 판정을 함수로 뺀 뒤에도 Recent Posts 고르는 기준은 그대로다. */
  assert.deepEqual(
    newNotes(files).map((page) => page.slug),
    ["a/written", "a/same-day", "a/edited"],
  )
})
