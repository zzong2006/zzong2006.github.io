import { h } from "preact"
import {
  RECENT_FILTERS,
  RecentNotesList,
  formatDate,
  newNotes,
  noteDate,
  recentByFilter,
  recentFilterControls,
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

const countLine = (label, total, shown) =>
  shown < total ? `${label} ${total}개 중 최근 ${shown}개` : `${label} ${total}개`

const COUNT_LABELS = { all: "전체 노트", new: "새로 쓴 노트", updated: "고친 노트" }

// 수정일 순 전체 목록. 필터마다 limit 편씩 고른 것을 한 번에 그리고 CSS 로 골라 보인다.
// 날짜 묶음과 그 개수에도 data-filters 를 달아, 필터를 바꿨을 때 빈 날짜 머리글이 남지 않고
// 개수도 그 필터 기준으로 바뀐다.
function FilteredRecent({ allFiles, fileData, cfg, opts }) {
  const { notes, kindOf, filtersOf, totals, shown } = recentByFilter(allFiles, opts.limit)
  const groups = groupByDay(notes, cfg.locale ?? "ko-KR", "modified")
  const keys = RECENT_FILTERS.map(({ key }) => key)
  const countIn = (pages, key) => pages.filter((page) => filtersOf(page).includes(key)).length

  return h(
    "div",
    { class: "popover-hint recent-updated-notes recent-notes-page recent-filter-scope" },
    [
      h("div", { class: "recent-notes-page__toolbar" }, [
        h(
          "div",
          { class: "recent-filter", role: "radiogroup", "aria-label": "목록 필터" },
          recentFilterControls("recent-page-filter").flatMap(
            ({ id, name, value, label, checked }) => [
              h("input", {
                class: "recent-filter__input",
                type: "radio",
                id,
                name,
                value,
                checked,
              }),
              h("label", { class: "recent-filter__label", for: id }, label),
            ],
          ),
        ),
        h(
          "p",
          { class: "recent-notes-page__count" },
          keys.map((key) =>
            h(
              "span",
              { "data-filters": key },
              countLine(COUNT_LABELS[key], totals[key], shown[key]),
            ),
          ),
        ),
      ]),
      ...groups.map((group) => {
        const present = keys.filter((key) => countIn(group.notes, key) > 0)
        return h(
          "section",
          { class: "recent-notes-page__day", "data-filters": present.join(" ") },
          [
            h("h2", { class: "recent-notes-page__day-header" }, [
              h("time", { datetime: group.date.toISOString() }, group.label),
              // 스타일이 안 먹은 채로 떠도(배포 전에 연 탭에서 넘어올 때) 날짜와 개수가 붙지 않게 띄운다.
              " ",
              ...present.map((key) =>
                h(
                  "span",
                  { class: "recent-notes-page__day-count", "data-filters": key },
                  `${countIn(group.notes, key)}개`,
                ),
              ),
            ]),
            h(RecentNotesList, {
              notes: group.notes,
              fileData,
              cfg,
              showPaths: opts.showPaths,
              showDates: false,
              dateKey: "modified",
              kindOf,
              filtersOf,
            }),
          ],
        )
      }),
    ],
  )
}

// 작성일 순 새 글 목록(/new). 전부 새 글이라 필터와 New 표시가 없다.
function NewNotes({ allFiles, fileData, cfg, opts }) {
  const all = newNotes(allFiles)
  const notes = opts.limit > 0 ? all.slice(0, opts.limit) : all
  const groups = groupByDay(notes, cfg.locale ?? "ko-KR", "created")

  return h("div", { class: "popover-hint recent-updated-notes recent-notes-page" }, [
    h("p", { class: "recent-notes-page__count" }, countLine("노트", all.length, notes.length)),
    ...groups.map((group) =>
      h("section", { class: "recent-notes-page__day" }, [
        h("h2", { class: "recent-notes-page__day-header" }, [
          h("time", { datetime: group.date.toISOString() }, group.label),
          " ",
          h("span", { class: "recent-notes-page__day-count" }, `${group.notes.length}개`),
        ]),
        h(RecentNotesList, {
          notes: group.notes,
          fileData,
          cfg,
          showPaths: opts.showPaths,
          showDates: false,
          dateKey: "created",
        }),
      ]),
    ),
  ])
}

export const manifest = {
  name: "recent-notes-page",
  displayName: "Recent Notes Page",
  description:
    "Generates pages listing recently modified and newly written notes, linked from the home lists.",
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

// 대문 Recent Posts 의 "더 보기"로 오는 페이지다.
//   slug    : 모든 노트를 수정일 순으로. 대문과 같은 All · New · Edited 필터가 있다.
//   newSlug : 새로 쓴 노트를 작성일 순으로 (한꺼번에 옮겨 온 노트는 뺀다).
//             대문에서 더 링크하지 않지만 예전에 공유된 주소라 남겨 둔다.
// content/ 는 vault 산출물이라 파일을 두지 않고 가상 페이지로 만든다.
// limit 이 0 이면 전체를 보여 준다.
function RecentNotesContent(opts) {
  const Component = ({ allFiles, fileData, cfg }) =>
    fileData.slug === opts.newSlug
      ? NewNotes({ allFiles, fileData, cfg, opts })
      : FilteredRecent({ allFiles, fileData, cfg, opts })

  Component.css = `${recentNotesCss}
.recent-notes-page.recent-updated-notes {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}

.recent-notes-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin: 0 0 0.5rem;
}

.recent-notes-page__count {
  margin: 0 0 0.5rem;
  color: var(--gray);
  font-size: 0.9rem;
}

.recent-notes-page__toolbar .recent-notes-page__count {
  margin: 0;
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
