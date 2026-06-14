import fs from "node:fs"
import path from "node:path"
import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils"

const defaultOptions = {
  title: "함께 보면 좋은 글",
  limit: 5,
  hideWhenEmpty: true,
  cachePath: "data/related-notes/related-notes.json",
  showReasons: true,
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

  for (const entry of fromCache) {
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

export const RelatedNotes = (opts = {}) => {
  const options = { ...defaultOptions, ...opts }

  const Component = ({ fileData, allFiles, displayClass }) => {
    const slug = String(fileData.slug ?? "")
    if (isSyntheticPage(slug) || fileData.unlisted === true) return null

    const entries = getRelatedEntries(fileData, allFiles ?? [], options)
    if (options.hideWhenEmpty && entries.length === 0) return null

    return h(
      "section",
      { class: ["related-notes", displayClass].filter(Boolean).join(" ") },
      h("div", { class: "related-notes__header" }, h("h2", null, options.title)),
      entries.length === 0
        ? h("p", { class: "related-notes__empty" }, "아직 연결할 만한 공개 글이 없습니다.")
        : h(
            "div",
            { class: "related-notes__list" },
            entries.map(({ page, reasons = [] }) =>
              h("article", { class: "related-notes__item" }, [
                h(
                  "a",
                  {
                    class: "internal related-notes__link",
                    href: resolveRelative(fileData.slug, page.slug),
                  },
                  titleOf(page),
                ),
                options.showReasons && reasons.length > 0
                  ? h(
                      "div",
                      { class: "related-notes__reasons" },
                      reasons.slice(0, 3).map((reason) =>
                        h("span", { class: "related-notes__reason" }, reasonLabel(reason)),
                      ),
                    )
                  : null,
              ]),
            ),
          ),
    )
  }

  Component.css = `
.related-notes {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.related-notes__header {
  margin-bottom: 1rem;
}

.related-notes__header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.related-notes__list {
  display: grid;
  gap: 0.75rem;
}

.related-notes__item {
  display: grid;
  gap: 0.4rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--lightgray);
}

.related-notes__item:last-child {
  border-bottom: 0;
}

.related-notes__link {
  width: fit-content;
  font-weight: 650;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.related-notes__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.related-notes__reason {
  padding: 0.1rem 0.45rem;
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  color: var(--gray);
  font-size: 0.78rem;
  line-height: 1.5;
}

.related-notes__empty {
  color: var(--gray);
}
`

  return Component
}

export default RelatedNotes
