import { resolveRelative } from "@quartz-community/utils"
import {
  changeBadge,
  changeKindOf,
  formatDate,
  isDisplayableNote,
  newNotes,
  notePath,
  noteDate,
  recentNotesCss,
} from "../recent-updated-notes/components/index.js"

export const manifest = {
  name: "home-recent-notes",
  displayName: "Home Recent Notes",
  description: "Lists newly written and recently updated notes inside the home page body.",
  version: "1.0.0",
  category: "pageType",
  defaultOptions: {
    newTitle: "Recent Posts",
    newLimit: 5,
    newMoreSlug: "new",
    updatedTitle: "최근 수정한 글",
    updatedLimit: 5,
    moreSlug: "recent",
    moreLabel: "더 보기",
  },
}

// 새 글은 작성일 순으로, 수정한 글은 수정일 순으로 고른다.
// 새로 쓰는 것도 노트를 고친 일이라 수정한 글 목록에 새 글도 넣고, 제목 옆에 신규·수정을 단다.
// 한꺼번에 옮겨 온 뒤 고친 적 없는 노트는 쓴 것도 고친 것도 아니라 뺀다(kindOf 가 undefined).
export function homeLists(allFiles, { newLimit, updatedLimit }) {
  const newest = newNotes(allFiles).slice(0, newLimit)
  const kindOf = changeKindOf(allFiles)
  const updated = allFiles
    .filter((page) => isDisplayableNote(page) && kindOf(page))
    .sort((a, b) => noteDate(b, "modified") - noteDate(a, "modified"))
    .slice(0, updatedLimit)
  return { newest, updated, kindOf }
}

const folderOf = (page) => notePath(page).split("/").slice(0, -1).join("/")

// 본문 트리(hast)에 바로 끼우므로 preact 가 아니라 hast 노드로 만든다.
const el = (tagName, properties, children = []) => ({
  type: "element",
  tagName,
  properties,
  children: children.filter(Boolean),
})
const text = (value) => ({ type: "text", value })

function section({ id, title, notes, dateKey, more, locale, kindOf }) {
  // 머리글은 대문의 다른 h2('주제별로 둘러보기')와 같은 크기여야 해서 목록 컴포넌트의
  // 작은 h2 규칙(recent-updated-notes__header)을 쓰지 않는다. 모양은 custom.scss 에 있다.
  const header = el("div", { className: ["home-recent__header"] }, [
    el("h2", { id }, [text(title)]),
    more &&
      el("a", { className: ["internal", "recent-updated-notes__more"], href: more.href }, [
        text(more.label),
      ]),
  ])
  const items = notes.map((page) => {
    const date = noteDate(page, dateKey)
    const badge = kindOf && changeBadge(kindOf(page))
    return el("li", { className: ["recent-updated-notes__item"] }, [
      el("div", { className: ["recent-updated-notes__title"] }, [
        el(
          "a",
          {
            className: ["internal", "recent-updated-notes__link"],
            href: resolveRelative("index", page.slug),
          },
          [text(page.frontmatter?.title ?? notePath(page))],
        ),
        badge && el("span", { className: badge.className.split(" ") }, [text(badge.label)]),
      ]),
      el("div", { className: ["recent-updated-notes__meta"] }, [
        el("time", { dateTime: date.toISOString() }, [text(formatDate(date, locale))]),
        // 대문에서는 제목이 바로 위에 있으므로 폴더만 적는다. 긴 논문 제목이 두 번 나오지 않는다.
        el("span", { className: ["recent-updated-notes__path"] }, [text(folderOf(page))]),
      ]),
    ])
  })
  return el(
    "section",
    { className: ["recent-updated-notes", "home-recent", `home-recent--${id}`] },
    [header, el("ol", { className: ["recent-updated-notes__list"] }, items)],
  )
}

// 대문(content/index.md)의 첫 h2 앞, 즉 소개 문단 바로 뒤에 두 목록을 끼운다.
// 목록은 모든 노트의 날짜가 있어야 만들 수 있어서 마크다운 변환 단계가 아니라
// 페이지를 그릴 때(treeTransforms) 넣는다. 대문을 그리는 쪽은 그대로 content-page 다.
export const HomeRecentNotes = (userOpts = {}) => {
  const opts = { ...manifest.defaultOptions, ...userOpts }

  const transform = (root, slug, { allFiles, cfg }) => {
    if (slug !== "index") return
    const { newest, updated, kindOf } = homeLists(allFiles, opts)
    const locale = cfg.locale ?? "ko-KR"
    const sections = [
      newest.length > 0 &&
        section({
          id: "recent-posts",
          title: opts.newTitle,
          notes: newest,
          dateKey: "created",
          locale,
          more: opts.newMoreSlug && {
            href: resolveRelative("index", opts.newMoreSlug),
            label: opts.moreLabel,
          },
        }),
      updated.length > 0 &&
        section({
          id: "recently-updated",
          title: opts.updatedTitle,
          notes: updated,
          dateKey: "modified",
          locale,
          kindOf,
          more: opts.moreSlug && {
            href: resolveRelative("index", opts.moreSlug),
            label: opts.moreLabel,
          },
        }),
    ].filter(Boolean)
    const at = root.children.findIndex((node) => node.type === "element" && node.tagName === "h2")
    root.children.splice(at === -1 ? root.children.length : at, 0, ...sections)
  }

  // 이 플러그인은 자기 페이지가 없다. body 는 목록 CSS 를 싣는 용도로만 둔다.
  const Body = () => null
  Body.css = recentNotesCss

  return {
    name: "HomeRecentNotes",
    priority: -10,
    match: () => false,
    layout: "content",
    body: () => Body,
    treeTransforms: () => [transform],
  }
}

export default HomeRecentNotes
