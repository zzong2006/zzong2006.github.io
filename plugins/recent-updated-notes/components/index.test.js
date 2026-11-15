import { test } from "node:test"
import assert from "node:assert/strict"
import { changeKindOf, newNotes, recentByFilter } from "./index.js"

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

test("recent list mixes new and edited notes and skips untouched imports in filters", () => {
  /** All 은 수정일 순 전체, New·Edited 는 그 종류만 고른다. 옮겨 오기만 한 노트는 All 에만 든다. */
  const { notes, filtersOf } = recentByFilter(files, 0)
  const slugsIn = (key) => notes.filter((page) => filtersOf(page).includes(key)).map((p) => p.slug)
  assert.deepEqual(slugsIn("new"), ["a/same-day", "a/written"])
  assert.deepEqual(slugsIn("updated"), ["a/edited", "bulk/edited"])
  assert.equal(slugsIn("all").length, files.length)
  assert.deepEqual(filtersOf(imported[0]), ["all"])
})

test("each filter fills up to the limit on its own", () => {
  /** All 의 상위가 옮겨 온 노트로 차도 New 는 새 글을 limit 편까지 따로 채운다. */
  const recentImports = Array.from({ length: 3 }, (_, i) =>
    note(`late/${i}`, "2026-06-14T09:00:00+09:00", `2026-11-17T0${i}:00:00+09:00`),
  )
  const { notes, filtersOf, shown } = recentByFilter([...files, ...recentImports], 2)
  assert.deepEqual(shown, { all: 2, new: 2, updated: 2 })
  assert.deepEqual(
    notes.map((page) => [page.slug, filtersOf(page)]),
    [
      ["late/2", ["all", "updated"]],
      ["late/1", ["all", "updated"]],
      ["a/same-day", ["new"]],
      ["a/written", ["new"]],
    ],
  )
})

test("newNotes still drops bulk-imported days", () => {
  /** 신규 판정을 함수로 뺀 뒤에도 Recent Posts 고르는 기준은 그대로다. */
  assert.deepEqual(
    newNotes(files).map((page) => page.slug),
    ["a/written", "a/same-day", "a/edited"],
  )
})
