import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils"

function getDate(page) {
  const dateType = page.defaultDateType ?? "modified"
  const dates = page.dates ?? {}
  const rawDate = dates[dateType] ?? dates.modified ?? dates.created ?? dates.published
  if (!rawDate) return undefined

  const date = rawDate instanceof Date ? rawDate : new Date(rawDate)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function isTagPage(slug) {
  return slug === "tags" || slug === "tags/index" || slug.startsWith("tags/")
}

function isFolderIndex(slug) {
  return slug === "index" || slug.endsWith("/index")
}

function notePath(page) {
  const relativePath = String(page.relativePath ?? "")
  return relativePath.replace(/\.md$/i, "")
}

function isDisplayableNote(page) {
  const slug = String(page.slug ?? "")
  const relativePath = String(page.relativePath ?? "")

  return (
    slug !== "" &&
    page.unlisted !== true &&
    relativePath.toLowerCase().endsWith(".md") &&
    !isTagPage(slug) &&
    !isFolderIndex(slug) &&
    Boolean(getDate(page))
  )
}

function formatDate(date, locale) {
  return date.toLocaleDateString(locale ?? "ko-KR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

export const RecentUpdatedNotes = (userOpts = {}) => {
  const opts = {
    title: "최근 수정한 노트",
    limit: 8,
    showPaths: true,
    ...userOpts,
  }

  const Component = ({ allFiles, fileData, cfg, displayClass }) => {
    if (String(fileData.slug ?? "") !== "index") return null

    const locale = cfg.locale ?? "ko-KR"
    const notes = [...allFiles]
      .filter(isDisplayableNote)
      .sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
      .slice(0, opts.limit)

    if (notes.length === 0) return null

    return h(
      "section",
      { class: ["recent-updated-notes", displayClass].filter(Boolean).join(" ") },
      h("div", { class: "recent-updated-notes__header" }, h("h2", null, opts.title)),
      h(
        "ol",
        { class: "recent-updated-notes__list" },
        notes.map((page) => {
          const date = getDate(page)
          const title = page.frontmatter?.title ?? notePath(page)
          const pathLabel = notePath(page)

          return h(
            "li",
            { class: "recent-updated-notes__item" },
            h(
              "a",
              {
                class: "internal recent-updated-notes__link",
                href: resolveRelative(fileData.slug, page.slug),
              },
              title,
            ),
            h(
              "div",
              { class: "recent-updated-notes__meta" },
              h("time", { datetime: date.toISOString() }, formatDate(date, locale)),
              opts.showPaths && h("span", { class: "recent-updated-notes__path" }, pathLabel),
            ),
          )
        }),
      ),
    )
  }

  Component.css = `
.recent-updated-notes {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
}

.recent-updated-notes__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.recent-updated-notes__header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.recent-updated-notes__list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.recent-updated-notes__item {
  display: grid;
  gap: 0.25rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--lightgray);
}

.recent-updated-notes__item:last-child {
  border-bottom: 0;
}

.recent-updated-notes__link {
  font-weight: 600;
}

.recent-updated-notes__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  color: var(--gray);
  font-size: 0.875rem;
}

.recent-updated-notes__path {
  overflow-wrap: anywhere;
}
`

  return Component
}

export default RecentUpdatedNotes
