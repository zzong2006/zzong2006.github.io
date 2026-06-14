import { h } from "preact"
import { resolveRelative, simplifySlug } from "@quartz-community/utils"

const defaultOptions = {
  hideWhenEmpty: true,
  maxMentions: 8,
  snippetLength: 180,
}

const latexSymbols = new Map([
  ["alpha", "α"],
  ["beta", "β"],
  ["gamma", "γ"],
  ["lambda", "λ"],
  ["mu", "μ"],
  ["pi", "π"],
  ["theta", "θ"],
  ["sigma", "σ"],
  ["Sigma", "Σ"],
  ["mid", "|"],
  ["sum", "∑"],
  ["infty", "∞"],
  ["leq", "≤"],
  ["geq", "≥"],
  ["neq", "≠"],
  ["times", "×"],
  ["cdot", "·"],
])

function stripMath(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .split(/\r?\n/)
    .map((line) => (isMathHeavyLine(line) ? " " : line))
    .join("\n")
}

function simplifyLatex(value) {
  return String(value ?? "")
    .replace(/\\(?:operatorname|mathrm|mathbf|boldsymbol|mathbb|text)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/\\(?:left|right|displaystyle|limits|top)\b/g, " ")
    .replace(/\\([A-Za-z]+)(?=[^A-Za-z]|$)/g, (_, name) => latexSymbols.get(name) ?? " ")
    .replace(/\\\\/g, " ")
    .replace(/[{}]/g, "")
}

function mathNoise(value) {
  const text = String(value ?? "")
  const latexCommands = text.match(/\\[A-Za-z]+/g)?.length ?? 0
  const equationMarks = text.match(/[=^_{}]/g)?.length ?? 0
  return latexCommands * 4 + equationMarks
}

function isMathHeavyLine(value) {
  const text = String(value ?? "").trim()
  if (!text) {
    return false
  }

  const latexCommands = text.match(/\\[A-Za-z]+/g)?.length ?? 0
  const equationMarks = text.match(/[=^_{}]/g)?.length ?? 0
  const proseText = text.replace(/\\[A-Za-z]+/g, " ").replace(/[=^_{}()[\],|+\-*/]/g, " ")
  const proseWords = proseText.match(/[A-Za-z가-힣]{2,}/g)?.length ?? 0
  return (
    (latexCommands >= 4 && equationMarks >= 2) ||
    (latexCommands >= 2 && equationMarks >= 2 && proseWords <= 12) ||
    (latexCommands >= 1 && equationMarks >= 1 && proseWords <= 4)
  )
}

function cleanText(value) {
  return simplifyLatex(stripMath(value))
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias ?? target)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/gm, " ")
    .replace(/[`*_~>#]+/g, " ")
    .replace(/-{2,}/g, " ")
    .replace(/\s+([,.;:)])/g, "$1")
    .replace(/([(])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

function textBlocks(value) {
  const blocks = []
  let current = []

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current.join(" "))
      current = []
    }
  }

  for (const line of String(value ?? "").split(/\r?\n/)) {
    if (!line.trim() || isMathHeavyLine(line)) {
      flush()
      continue
    }
    current.push(line)
  }
  flush()
  return blocks
}

function bestSnippetText(sourceText, terms) {
  const candidates = textBlocks(sourceText)
    .map((block) => ({
      text: cleanText(block),
      score: mathNoise(block),
    }))
    .filter(({ text }) => text && findTerm(text, terms))
    .sort((a, b) => a.score - b.score || a.text.length - b.text.length)

  return candidates[0]?.text ?? cleanText(sourceText)
}

function titleTerms(fileData) {
  const frontmatter = fileData.frontmatter ?? {}
  const slug = String(simplifySlug(String(fileData.slug ?? "")))
  const slugLeaf = slug.split("/").filter(Boolean).at(-1) ?? ""
  const title = String(frontmatter.title ?? "")
  const aliases = Array.isArray(frontmatter.aliases) ? frontmatter.aliases : []

  return Array.from(
    new Set(
      [title, title.replace(/^[A-Z]\)\s*/, ""), title.replace(/^\d+\.\s*/, ""), slugLeaf, ...aliases]
        .flatMap((term) => [
          String(term),
          String(term).replace(/[?？]/g, ""),
          String(term).replace(/[-_]+/g, " "),
        ])
        .map((term) => term.trim())
        .filter((term) => term.length >= 2),
    ),
  ).sort((a, b) => b.length - a.length)
}

function findTerm(text, terms) {
  const lower = text.toLowerCase()
  for (const term of terms) {
    const index = lower.indexOf(term.toLowerCase())
    if (index !== -1) {
      return { term, index, length: term.length }
    }
  }
  return undefined
}

function excerpt(sourceText, terms, snippetLength) {
  const text = bestSnippetText(sourceText, terms)
  if (!text) {
    return { before: "", match: "", after: "" }
  }

  const hit = findTerm(text, terms)
  if (!hit) {
    const clipped = text.slice(0, snippetLength)
    return { before: clipped, match: "", after: text.length > clipped.length ? "..." : "" }
  }

  const half = Math.floor((snippetLength - hit.length) / 2)
  const start = Math.max(0, hit.index - half)
  const end = Math.min(text.length, hit.index + hit.length + half)
  return {
    before: `${start > 0 ? "..." : ""}${text.slice(start, hit.index)}`,
    match: text.slice(hit.index, hit.index + hit.length),
    after: `${text.slice(hit.index + hit.length, end)}${end < text.length ? "..." : ""}`,
  }
}

function compareMentions(a, b) {
  const aTitle = String(a.frontmatter?.title ?? "")
  const bTitle = String(b.frontmatter?.title ?? "")
  return aTitle.localeCompare(bTitle, undefined, { numeric: true, sensitivity: "base" })
}

function isSyntheticPage(slug) {
  return slug === "" || slug === "index" || slug.startsWith("tags/")
}

export const LinkedMentions = (opts) => {
  const options = { ...defaultOptions, ...opts }

  const Component = ({ fileData, allFiles, displayClass }) => {
    const rawSlug = String(fileData.slug ?? "")
    const slug = String(simplifySlug(rawSlug))

    if (isSyntheticPage(rawSlug) || isSyntheticPage(slug)) {
      return null
    }

    const backlinks = allFiles
      .filter((file) => file.unlisted !== true)
      .filter((file) => file.slug && file.slug !== fileData.slug)
      .filter((file) => Array.isArray(file.links) && file.links.includes(slug))
      .sort(compareMentions)
      .slice(0, options.maxMentions)

    if (options.hideWhenEmpty && backlinks.length === 0) {
      return null
    }

    const terms = titleTerms(fileData)
    return h(
      "section",
      { class: ["linked-mentions", displayClass].filter(Boolean).join(" ") },
      h("div", { class: "linked-mentions-header" }, [
        h("h2", null, "링크된 언급"),
        h("span", { class: "linked-mentions-count" }, String(backlinks.length)),
      ]),
      backlinks.length === 0
        ? h("p", { class: "linked-mentions-empty" }, "아직 이 노트를 링크한 공개 노트가 없습니다.")
        : h(
            "div",
            { class: "linked-mentions-list" },
            backlinks.map((file) => {
              const title = file.frontmatter?.title ?? file.slug
              const snippet = excerpt(file.text ?? file.description ?? "", terms, options.snippetLength)
              return h("article", { class: "linked-mention-card" }, [
                h(
                  "a",
                  {
                    class: "linked-mention-title internal",
                    href: resolveRelative(fileData.slug, file.slug),
                  },
                  title,
                ),
                h("p", { class: "linked-mention-snippet" }, [
                  snippet.before,
                  snippet.match ? h("mark", null, snippet.match) : null,
                  snippet.after,
                ]),
              ])
            }),
          ),
    )
  }

  Component.css = `
.linked-mentions {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.linked-mentions-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.linked-mentions-header h2 {
  font-size: 1.35rem;
  margin: 0;
}

.linked-mentions-count {
  color: var(--gray);
  font-weight: 700;
}

.linked-mentions-list {
  display: grid;
  gap: 0.85rem;
}

.linked-mention-card {
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  padding: 0.9rem 1rem;
  background: color-mix(in srgb, var(--light) 92%, var(--lightgray));
}

.linked-mention-title {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-weight: 700;
  background: transparent;
}

.linked-mention-snippet {
  margin: 0;
  color: var(--darkgray);
  line-height: 1.6;
}

.linked-mention-snippet mark {
  padding: 0 0.1rem;
  background: var(--textHighlight);
  color: inherit;
}

.linked-mentions-empty {
  color: var(--gray);
}
`

  return Component
}
