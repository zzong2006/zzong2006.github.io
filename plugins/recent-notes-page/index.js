import { h } from "preact"
import {
  RecentNotesList,
  recentNotes,
  recentNotesCss,
} from "../recent-updated-notes/components/index.js"

export const manifest = {
  name: "recent-notes-page",
  displayName: "Recent Notes Page",
  description: "Generates a page listing recently modified notes, linked from the home list.",
  version: "1.0.0",
  category: "pageType",
  defaultOptions: {
    slug: "recent",
    title: "최근 수정한 노트",
    limit: 200,
    showPaths: true,
  },
}

// 홈의 "최근 수정한 노트" 목록에서 "더 보기"로 오는 페이지다.
// content/ 는 vault 산출물이라 파일을 두지 않고 가상 페이지로 만든다.
// limit 이 0 이면 전체를 보여 준다.
function RecentNotesContent(opts) {
  const Component = ({ allFiles, fileData, cfg }) => {
    const all = recentNotes(allFiles)
    const notes = opts.limit > 0 ? all.slice(0, opts.limit) : all
    const countText =
      notes.length < all.length
        ? `전체 노트 ${all.length}개 중 최근 ${notes.length}개`
        : `노트 ${all.length}개`

    return h("div", { class: "popover-hint recent-updated-notes recent-notes-page" }, [
      h("p", { class: "recent-notes-page__count" }, countText),
      h(RecentNotesList, { notes, fileData, cfg, showPaths: opts.showPaths }),
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
  const description = "최근에 수정한 노트를 수정일 순서로 모아 둔 목록입니다."

  return {
    name: "RecentNotesPage",
    priority: 10,
    match: () => false,
    generate() {
      return [
        {
          slug: opts.slug,
          title: opts.title,
          // 탐색기·검색에 노트처럼 끼지 않게 숨긴다. 주소로는 그대로 열린다.
          data: {
            description,
            unlisted: true,
            frontmatter: { title: opts.title, tags: [], description },
          },
        },
      ]
    },
    layout: "recent",
    body: () => RecentNotesContent(opts),
  }
}

export default RecentNotesPage
