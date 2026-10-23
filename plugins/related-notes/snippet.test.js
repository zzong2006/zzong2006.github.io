import assert from "node:assert/strict"
import test from "node:test"
import { clipParts, snippetFromMarkdown, snippetParts, snippetPlainText } from "./snippet.js"

test("inline math is kept apart from the prose instead of being dropped", () => {
  const body = [
    "# Transpose ?",
    "",
    "For $\\boldsymbol{A} \\in \\mathbb{R}^{m \\times n}$ the matrix $\\boldsymbol{B} \\in \\mathbb{R}^{n \\times m}$ with $b_{i j}=a_{j i}$ is called the transpose of $\\boldsymbol{A}$. We write $\\boldsymbol{B}=\\boldsymbol{A}^{\\top}$.",
    "",
    "# Some Properties",
  ].join("\n")

  assert.deepEqual(snippetFromMarkdown(body, {}, 180), [
    "For ",
    "\\boldsymbol{A} \\in \\mathbb{R}^{m \\times n}",
    " the matrix ",
    "\\boldsymbol{B} \\in \\mathbb{R}^{n \\times m}",
    " with ",
    "b_{i j}=a_{j i}", // 수식 안의 "_" 는 지우지 않는다
    " is called the transpose of ",
    "\\boldsymbol{A}",
    ". We write ",
    "\\boldsymbol{B}=\\boldsymbol{A}^{\\top}",
    ".",
  ])
})

test("clipping never cuts inside math and always ends with prose", () => {
  const parts = ["aaaa bbbb ", "\\frac{1}{2}", " cccc dddd eeee"]
  // 글 10 + 수식 6(원문 11자의 절반) + 글 15 = 31
  assert.deepEqual(clipParts(parts, 40), parts)
  assert.deepEqual(clipParts(parts, 15), ["aaaa bbbb..."])
  assert.deepEqual(clipParts(parts, 20), ["aaaa bbbb ", "\\frac{1}{2}", "..."])
})

test("frontmatter description wins and prose markup is cleaned", () => {
  const parts = snippetFromMarkdown("ignored body text that is long enough", {
    description: "See [[Heap Sort|heap]] and `code` with $x_1$",
  }, 180)
  assert.deepEqual(parts, ["See heap and code with ", "x_1", ""])
  assert.equal(snippetPlainText(parts), "See heap and code with x_1")
})

test("headings, display math, tables and short blocks are skipped", () => {
  const body = "# A) Title ?\n\nshort\n\n$$\nx^2\n$$\n\n| a | b |\n\nThe real first paragraph is here."
  assert.deepEqual(snippetFromMarkdown(body, {}, 180), ["The real first paragraph is here."])
  assert.deepEqual(snippetParts("$$x$$ only display math"), ["only display math"])
})
