import fs from "node:fs"
import path from "node:path"
import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils"
import { clipParts, snippetParts, snippetPlainText } from "../../shared/snippet.js"
import { katexClientSource } from "../../shared/katex.js"

const defaultOptions = {
  title: "함께 보면 좋은 글",
  limit: 10,
  hideWhenEmpty: true,
  cachePath: "data/related-notes/related-notes.json",
  showReasons: true,
  showSnippets: true,
  snippetLength: 180,
}

let relatedCache

function readRelatedCache(cachePath) {
  if (relatedCache !== undefined) return relatedCache

  const resolvedPath = path.isAbsolute(cachePath) ? cachePath : path.join(process.cwd(), cachePath)
  try {
    relatedCache = JSON.parse(fs.readFileSync(resolvedPath, "utf8"))
  } catch {
    relatedCache = null
  }
  return relatedCache
}

function isSyntheticPage(slug) {
  return slug === "" || slug === "index" || slug.endsWith("/index") || slug.startsWith("tags/")
}

function isDisplayableNote(page) {
  const slug = String(page?.slug ?? "")
  const relativePath = String(page?.relativePath ?? "")
  return (
    slug &&
    !isSyntheticPage(slug) &&
    page.unlisted !== true &&
    relativePath.toLowerCase().endsWith(".md")
  )
}

function titleOf(page) {
  const relativePath = String(page.relativePath ?? "")
  const fallback = relativePath.replace(/\.md$/i, "") || page.slug
  return String(page.frontmatter?.title ?? fallback)
}

// Quartz 가 만든 설명(page.description)은 이미 HTML 이스케이프가 된 글이다. preact 가 한 번 더
// 이스케이프하므로 화면에 "&amp;" 가 그대로 보였다. 먼저 되돌린다.
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }

function decodeEntities(value) {
  return String(value ?? "").replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ENTITIES[name])
}

// 요약문은 조각 배열이다(짝수 칸 글, 홀수 칸 수식). 형식은 ../../shared/snippet.js 참고.
// 빌드 스크립트가 노트 원문으로 만든 캐시를 먼저 쓴다. Quartz 설명은 수식을 LaTeX 원문 글자로
// 풀어 두고 "_" 도 지워서(b_{ij} → b {ij}) 캐시가 없을 때만 쓴다.
function snippetOf(page, cache, options) {
  const cached = cache?.snippets?.[page.slug]
  const parts =
    Array.isArray(cached) && cached.length % 2 === 1
      ? cached.map(String)
      : clipParts(
          snippetParts(
            decodeEntities(
              page.frontmatter?.description ??
                page.frontmatter?.summary ??
                page.description ??
                page.text ??
                "",
            ),
          ),
          options.snippetLength,
        )
  return snippetPlainText(parts) === titleOf(page) ? [""] : parts
}

// 수식 칸은 TeX 원문을 글자로 넣어 두고, 브라우저에서 KaTeX 가 그 자리에 그린다(아래 script).
// KaTeX 를 못 불러와도 원문은 읽을 수 있게 남는다.
function renderSnippet(parts) {
  return parts
    .map((part, index) =>
      index % 2 ? h("span", { class: "related-notes__math", "data-tex": part }, part) : part,
    )
    .filter((part) => part !== "")
}

function folderOf(slug) {
  const parts = String(slug ?? "").split("/")
  parts.pop()
  return parts.join("/")
}

function tagsOf(page) {
  const tags = page.frontmatter?.tags
  if (Array.isArray(tags)) return tags.map(String)
  if (typeof tags === "string") return tags.split(/[, ]+/).filter(Boolean)
  return []
}

function tokenize(value) {
  return new Set(
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .match(/[a-z0-9\uAC00-\uD7A3]{2,}/g) ?? [],
  )
}

function overlapScore(left, right) {
  if (left.size === 0 || right.size === 0) return 0
  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }
  return intersection / Math.max(left.size, right.size)
}

function pageFeatures(page) {
  const title = titleOf(page)
  const slug = String(page.slug ?? "")
  return {
    slug,
    title,
    folder: folderOf(slug),
    tags: new Set(tagsOf(page)),
    links: new Set(Array.isArray(page.links) ? page.links.map(String) : []),
    titleTokens: tokenize(`${title} ${slug.replace(/[-_/]/g, " ")}`),
  }
}

function heuristicRelated(current, allFiles, limit) {
  const currentFeatures = pageFeatures(current)
  return allFiles
    .filter(isDisplayableNote)
    .filter((page) => page.slug !== current.slug)
    .map((page) => {
      const candidate = pageFeatures(page)
      let sharedTags = 0
      for (const tag of currentFeatures.tags) {
        if (candidate.tags.has(tag)) sharedTags += 1
      }

      const tagScore = Math.min(1, sharedTags / 2)
      const directLink = currentFeatures.links.has(candidate.slug)
      const backlink = candidate.links.has(currentFeatures.slug)
      const linkScore = directLink || backlink ? 1 : 0
      const folderScore =
        currentFeatures.folder && currentFeatures.folder === candidate.folder ? 1 : 0
      const titleScore = overlapScore(currentFeatures.titleTokens, candidate.titleTokens)
      const score = 0.35 * tagScore + 0.3 * linkScore + 0.15 * folderScore + 0.2 * titleScore

      const reasons = []
      if (sharedTags > 0) reasons.push("tag")
      if (directLink || backlink) reasons.push("link")
      if (folderScore > 0) reasons.push("folder")
      if (titleScore > 0) reasons.push("title")

      return { slug: candidate.slug, score, reasons }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function getRelatedEntries(fileData, allFiles, options) {
  const cache = readRelatedCache(options.cachePath)
  const bySlug = new Map(allFiles.filter(isDisplayableNote).map((page) => [page.slug, page]))
  const fromCache = cache?.relatedBySlug?.[fileData.slug] ?? []
  const seen = new Set()
  const entries = []

  for (const cachedEntry of fromCache) {
    const entry =
      typeof cachedEntry === "string"
        ? { slug: cachedEntry }
        : cachedEntry && typeof cachedEntry === "object"
          ? cachedEntry
          : null
    if (!entry) continue

    const page = bySlug.get(entry.slug)
    if (!page || seen.has(entry.slug)) continue
    seen.add(entry.slug)
    entries.push({ ...entry, page })
    if (entries.length >= options.limit) return entries
  }

  for (const entry of heuristicRelated(fileData, allFiles, options.limit)) {
    const page = bySlug.get(entry.slug)
    if (!page || seen.has(entry.slug)) continue
    seen.add(entry.slug)
    entries.push({ ...entry, page })
    if (entries.length >= options.limit) break
  }

  return entries
}

function reasonLabel(reason) {
  switch (reason) {
    case "semantic":
      return "내용 유사"
    case "tag":
      return "태그"
    case "link":
      return "링크"
    case "folder":
      return "같은 폴더"
    case "title":
      return "제목"
    default:
      return reason
  }
}

// 요약문 수식 칸(.related-notes__math)을 브라우저에서 KaTeX 로 그린다. 불러오는 방식은 ../../shared/katex.js.
const katexScript = `
(() => {
  ${katexClientSource}
  function renderSnippetMath() {
    renderTexNodes(document, ".related-notes__math");
  }
  document.addEventListener("nav", renderSnippetMath);
  renderSnippetMath();
})();
`

export const RelatedNotes = (opts = {}) => {
  const options = { ...defaultOptions, ...opts }

  const Component = ({ fileData, allFiles, displayClass }) => {
    const slug = String(fileData.slug ?? "")
    if (isSyntheticPage(slug) || fileData.unlisted === true) return null

    const entries = getRelatedEntries(fileData, allFiles ?? [], options)
    if (options.hideWhenEmpty && entries.length === 0) return null
    const cache = readRelatedCache(options.cachePath)

    return h(
      "section",
      { class: ["related-notes", displayClass].filter(Boolean).join(" ") },
      h("div", { class: "related-notes__header" }, h("h2", null, options.title)),
      entries.length === 0
        ? h("p", { class: "related-notes__empty" }, "아직 연결할 만한 공개 글이 없습니다.")
        : h(
            "div",
            { class: "related-notes__list" },
            entries.map((entry) => {
              const { page, reasons = [] } = entry
              const snippet = options.showSnippets ? snippetOf(page, cache, options) : [""]

              return h("article", { class: "related-notes__item" }, [
                h(
                  "h3",
                  { class: "related-notes__title" },
                  h(
                    "a",
                    {
                      class: "internal related-notes__link",
                      href: resolveRelative(fileData.slug, page.slug),
                    },
                    titleOf(page),
                  ),
                ),
                snippetPlainText(snippet)
                  ? h("p", { class: "related-notes__snippet" }, renderSnippet(snippet))
                  : null,
                options.showReasons && reasons.length > 0
                  ? h(
                      "div",
                      { class: "related-notes__meta" },
                      reasons
                        .slice(0, 3)
                        .flatMap((reason, index) => [
                          index > 0
                            ? h("span", { class: "related-notes__separator", "aria-hidden": "true" }, "·")
                            : null,
                          h("span", { class: "related-notes__reason" }, reasonLabel(reason)),
                        ])
                        .filter(Boolean),
                    )
                  : null,
              ])
            }),
          ),
    )
  }

  Component.css = `
.related-notes {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--lightgray);
}

.related-notes__header {
  margin-bottom: 0.7rem;
}

.related-notes__header h2 {
  margin: 0;
  color: var(--darkgray);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0;
}

.related-notes__list {
  display: grid;
  gap: 0.75rem;
}

.related-notes__item {
  display: grid;
  gap: 0.22rem;
  padding: 0;
}

.related-notes__title {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.4;
}

.related-notes__link.internal {
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: var(--secondary);
  width: fit-content;
  font-weight: 650;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.related-notes__link.internal:hover {
  background: transparent;
  color: var(--tertiary);
}

.related-notes__snippet {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--darkgray);
  font-size: 0.86rem;
  line-height: 1.45;
  opacity: 0.82;
}

.related-notes__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.15rem 0.38rem;
  color: var(--gray);
  font-size: 0.78rem;
  line-height: 1.35;
}

.related-notes__separator {
  color: var(--lightgray);
}

.related-notes__reason {
  white-space: nowrap;
}

.related-notes__empty {
  color: var(--gray);
}
`

  Component.afterDOMLoaded = katexScript

  return Component
}

export default RelatedNotes
