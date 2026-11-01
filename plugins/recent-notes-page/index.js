import { h } from "preact"
import {
  RecentNotesList,
  formatDate,
  newNotes,
  noteDate,
  recentNotes,
  recentNotesCss,
} from "../recent-updated-notes/components/index.js"

// 같은 날 쓴(고친) 노트를 한 묶음으로 모은다. 목록이 이미 최신순이라 이어지는 것끼리 묶으면 된다.
// 묶는 기준은 화면에 보이는 날짜 문자열이라 머리글과 묶음이 어긋나지 않는다.
function groupByDay(notes, locale, dateKey) {
  const groups = []
  for (const page of notes) {
    const date = noteDate(page, dateKey)
    const label = formatDate(date, locale)
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.notes.push(page)
    else groups.push({ label, date, notes: [page] })
  }
  return groups
}

export const manifest = {
  name: "recent-notes-page",
  displayName: "Recent Notes Page",
  description: "Generates pages listing recently modified and newly written notes, linked from the home lists.",
  version: "1.0.0",
  category: "pageType",
  defaultOptions: {
    slug: "recent",
    title: "최근 수정한 노트",
    newSlug: "new",
    newTitle: "최근 작성한 노트",
    limit: 200,
    showPaths: true,
  },
}

// 대문의 두 목록에서 "더 보기"로 오는 페이지다.
//   slug    : "최근 수정한 글" → 모든 노트를 수정일 순으로
//   newSlug : "Recent Posts"  → 새로 쓴 노트를 작성일 순으로 (한꺼번에 옮겨 온 노트는 뺀다)
// content/ 는 vault 산출물이라 파일을 두지 않고 가상 페이지로 만든다.
// limit 이 0 이면 전체를 보여 준다.
function RecentNotesContent(opts) {
  const Component = ({ allFiles, fileData, cfg }) => {
    const isNew = fileData.slug === opts.newSlug
    const dateKey = isNew ? "created" : "modified"
    const all = isNew ? newNotes(allFiles) : recentNotes(allFiles)
    const notes = opts.limit > 0 ? all.slice(0, opts.limit) : all
    const countText =
      notes.length < all.length
        ? `전체 노트 ${all.length}개 중 최근 ${notes.length}개`
        : `노트 ${all.length}개`

    const groups = groupByDay(notes, cfg.locale ?? "ko-KR", dateKey)

    return h("div", { class: "popover-hint recent-updated-notes recent-notes-page" }, [
      h("p", { class: "recent-notes-page__count" }, countText),
      ...groups.map((group) =>
        h("section", { class: "recent-notes-page__day" }, [
          h("h2", { class: "recent-notes-page__day-header" }, [
            h("time", { datetime: group.date.toISOString() }, group.label),
            // 스타일이 안 먹은 채로 떠도(배포 전에 연 탭에서 넘어올 때) 날짜와 개수가 붙지 않게 띄운다.
            " ",
            h("span", { class: "recent-notes-page__day-count" }, `${group.notes.length}개`),
          ]),
          h(RecentNotesList, {
            notes: group.notes,
            fileData,
            cfg,
            showPaths: opts.showPaths,
            showDates: false,
            dateKey,
          }),
        ]),
      ),
    ])
  }

  Component.css = `${recentNotesCss}
.recent-notes-page.recent-updated-notes {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.recent-notes-page__count {
  margin: 0 0 0.5rem;
  color: var(--gray);
  font-size: 0.9rem;
}
`

  return Component
}

export const RecentNotesPage = (userOpts = {}) => {
  const opts = { ...manifest.defaultOptions, ...userOpts }
  const page = (slug, title, description) => ({
    slug,
    title,
    // 탐색기·검색에 노트처럼 끼지 않게 숨긴다. 주소로는 그대로 열린다.
    data: {
      description,
      unlisted: true,
      frontmatter: { title, tags: [], description },
    },
  })

  return {
    name: "RecentNotesPage",
    priority: 10,
    match: () => false,
    generate() {
      return [
        page(opts.slug, opts.title, "최근에 수정한 노트를 수정일 순서로 모아 둔 목록입니다."),
        opts.newSlug &&
          page(opts.newSlug, opts.newTitle, "새로 쓴 노트를 작성일 순서로 모아 둔 목록입니다."),
      ].filter(Boolean)
    },
    layout: "recent",
    body: () => RecentNotesContent(opts),
  }
}

export default RecentNotesPage
