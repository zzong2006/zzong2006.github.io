import { h } from "preact"
import { resolveRelative } from "@quartz-community/utils"

export function getDate(page) {
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

export function notePath(page) {
  const relativePath = String(page.relativePath ?? "")
  return relativePath.replace(/\.md$/i, "")
}

export function isDisplayableNote(page) {
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

// 노트 상단 날짜(note-meta)와 같은 서울 시각으로 적는다. 빼면 빌드 머신(UTC) 기준이라
// 저녁에 고친 노트가 하루 앞 날짜로 나온다.
export function formatDate(date, locale) {
  return date.toLocaleDateString(locale ?? "ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

// 홈 목록과 "더 보기" 페이지가 같은 기준으로 고르고 정렬한다.
export function recentNotes(allFiles, limit) {
  const notes = [...allFiles]
    .filter(isDisplayableNote)
    .sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
  return limit > 0 ? notes.slice(0, limit) : notes
}

// 작성일·수정일 중 하나를 Date 로 꺼낸다. 없거나 잘못된 값이면 undefined.
export function noteDate(page, key) {
  const raw = page.dates?.[key]
  const date = raw instanceof Date ? raw : raw ? new Date(raw) : undefined
  return date && !Number.isNaN(date.getTime()) ? date : undefined
}

// 하루에 이보다 많이 생긴 노트는 새로 쓴 글이 아니라 한꺼번에 옮겨 온 것이다.
// (2026-06-14 첫 가져오기 1,232편, 2026-08-28 vault 동기화 56편. 직접 쓴 날은 많아야 5편)
export const BULK_DAY_THRESHOLD = 20

const hasBothDates = (page) =>
  isDisplayableNote(page) && noteDate(page, "created") && noteDate(page, "modified")
const createdDay = (page) => formatDate(noteDate(page, "created"))

// 노트가 BULK_DAY_THRESHOLD 편보다 많이 생긴 날(서울 날짜 문자열)의 모음.
export function bulkCreatedDays(allFiles) {
  const perDay = new Map()
  for (const page of allFiles.filter(hasBothDates))
    perDay.set(createdDay(page), (perDay.get(createdDay(page)) ?? 0) + 1)
  return new Set([...perDay].filter(([, count]) => count > BULK_DAY_THRESHOLD).map(([d]) => d))
}

// 새로 쓴 노트를 작성일 최신순으로 고른다. 한꺼번에 옮겨 온 날의 노트는 뺀다.
export function newNotes(allFiles) {
  const bulk = bulkCreatedDays(allFiles)
  return allFiles
    .filter((page) => hasBothDates(page) && !bulk.has(createdDay(page)))
    .sort((a, b) => noteDate(b, "created") - noteDate(a, "created"))
}

// 수정일 기준 목록에서 그 날짜에 무슨 일이 있었는지 고른다.
//   "new"     : 그날 새로 쓴 노트 (쓴 날 바로 고친 것도 새 글이다)
//   "updated" : 쓴 날 이후에 고친 노트
//   undefined : 한꺼번에 옮겨 온 뒤 고친 적 없는 노트. 쓴 것도 고친 것도 아니라 표시하지 않는다.
// 날짜는 화면에 보이는 서울 날짜로 비교한다. 같은 날 머리글 아래에서 표시가 어긋나지 않는다.
export function changeKindOf(allFiles) {
  const bulk = bulkCreatedDays(allFiles)
  return (page) => {
    if (!hasBothDates(page)) return undefined
    const modifiedDay = formatDate(noteDate(page, "modified"))
    if (modifiedDay !== createdDay(page)) return "updated"
    return bulk.has(createdDay(page)) ? undefined : "new"
  }
}

const CHANGE_LABELS = { new: "신규", updated: "수정" }

// 제목 오른쪽에 붙는 신규·수정 표시. preact 와 hast 양쪽에서 쓰도록 이름과 클래스만 준다.
export function changeBadge(kind) {
  return (
    kind && {
      label: CHANGE_LABELS[kind],
      className: `recent-updated-notes__badge recent-updated-notes__badge--${kind}`,
    }
  )
}

export function RecentNotesList({
  notes,
  fileData,
  cfg,
  showPaths,
  showDates = true,
  dateKey,
  kindOf,
}) {
  const locale = cfg.locale ?? "ko-KR"

  return h(
    "ol",
    { class: "recent-updated-notes__list" },
    notes.map((page) => {
      const date = dateKey ? noteDate(page, dateKey) : getDate(page)
      const title = page.frontmatter?.title ?? notePath(page)
      const pathLabel = notePath(page)
      const badge = kindOf && changeBadge(kindOf(page))

      return h(
        "li",
        { class: "recent-updated-notes__item" },
        h(
          "div",
          { class: "recent-updated-notes__title" },
          h(
            "a",
            {
              class: "internal recent-updated-notes__link",
              href: resolveRelative(fileData.slug, page.slug),
            },
            title,
          ),
          badge && h("span", { class: badge.className }, badge.label),
        ),
        h(
          "div",
          { class: "recent-updated-notes__meta" },
          showDates && h("time", { datetime: date.toISOString() }, formatDate(date, locale)),
          showPaths && h("span", { class: "recent-updated-notes__path" }, pathLabel),
        ),
      )
    }),
  )
}

export const recentNotesCss = `
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

.recent-updated-notes__title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.recent-updated-notes__link {
  font-weight: 600;
}

/* 제목 오른쪽의 신규·수정 표시. 긴 제목이 줄바꿈돼도 표시는 줄지 않는다. */
.recent-updated-notes__badge {
  flex-shrink: 0;
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.recent-updated-notes__badge--new {
  background-color: var(--highlight);
  color: var(--secondary);
}

.recent-updated-notes__badge--updated {
  background-color: var(--lightgray);
  color: var(--darkgray);
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

.recent-updated-notes__more {
  white-space: nowrap;
}
`

export const RecentUpdatedNotes = (userOpts = {}) => {
  const opts = {
    title: "최근 수정한 노트",
    limit: 8,
    showPaths: true,
    moreSlug: "recent",
    moreLabel: "더 보기",
    ...userOpts,
  }

  const Component = ({ allFiles, fileData, cfg, displayClass }) => {
    if (String(fileData.slug ?? "") !== "index") return null

    const notes = recentNotes(allFiles, opts.limit)
    if (notes.length === 0) return null

    return h(
      "section",
      { class: ["recent-updated-notes", displayClass].filter(Boolean).join(" ") },
      h(
        "div",
        { class: "recent-updated-notes__header" },
        h("h2", null, opts.title),
        opts.moreSlug &&
          h(
            "a",
            {
              class: "internal recent-updated-notes__more",
              href: resolveRelative(fileData.slug, opts.moreSlug),
            },
            opts.moreLabel,
          ),
      ),
      h(RecentNotesList, { notes, fileData, cfg, showPaths: opts.showPaths }),
    )
  }

  Component.css = recentNotesCss

  return Component
}

export default RecentUpdatedNotes
