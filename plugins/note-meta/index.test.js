import test from "node:test"
import assert from "node:assert/strict"
import { h } from "preact"
import render from "preact-render-to-string"
import { NoteMeta } from "./index.js"

test("both labeled dates render in Seoul time, including same-day notes", () => {
  const html = render(
    h(NoteMeta(), {
      fileData: {
        text: "hello world",
        dates: {
          created: "2026-10-01T16:00:00Z",
          modified: "2026-10-01T17:00:00Z",
        },
      },
    }),
  )
  assert.match(html, /최초 작성/)
  assert.match(html, /마지막 수정/)
  assert.equal((html.match(/2026-10-02<\/time>/g) ?? []).length, 2)
  assert.match(html, /읽는 데 1분/)
  assert.match(html, /최초 기록일/)
})

test("missing dates are omitted instead of fabricated", () => {
  const html = render(h(NoteMeta(), { fileData: { text: "hello", dates: {} } }))
  assert.doesNotMatch(html, /<time/)
})
