import { resolveRelative } from "@quartz-community/utils"
import {
  changeBadge,
  formatDate,
  noteDate,
  notePath,
  recentByFilter,
  recentFilterControls,
  recentNotesCss,
} from "../recent-updated-notes/components/index.js"

export const manifest = {
  name: "home-recent-notes",
  displayName: "Home Recent Notes",
  description: "Lists recently written and updated notes inside the home page body.",
  version: "2.0.0",
  category: "pageType",
  defaultOptions: {
    title: "Recent Posts",
    limit: 10,
    moreSlug: "recent",
    moreLabel: "더 보기",
  },
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

function filterControls(prefix) {
  return el(
    "div",
    { className: ["recent-filter"], role: "radiogroup", ariaLabel: "목록 필터" },
    recentFilterControls(prefix).flatMap(({ id, name, value, label, checked }) => [
      el("input", {
        className: ["recent-filter__input"],
        type: "radio",
        id,
        name,
        value,
        checked,
      }),
      el("label", { className: ["recent-filter__label"], htmlFor: id }, [text(label)]),
    ]),
  )
}

function item(page, { kindOf, filtersOf, locale }) {
  const date = noteDate(page, "modified")
  const badge = changeBadge(kindOf(page))
  return el(
    "li",
    { className: ["recent-updated-notes__item"], dataFilters: filtersOf(page).join(" ") },
    [
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
    ],
  )
}

// 새로 쓴 글과 고친 글을 수정일 순 한 목록에 두고, All · New · Edited 필터로 골라 본다.
// 필터마다 limit 편씩 꽉 차도록 recentByFilter 가 고른다.
function section(allFiles, opts, locale) {
  const { notes, kindOf, filtersOf } = recentByFilter(allFiles, opts.limit)
  if (notes.length === 0) return undefined
  // 머리글은 대문의 다른 h2('주제별로 둘러보기')와 같은 크기여야 해서 목록 컴포넌트의
  // 작은 h2 규칙(recent-updated-notes__header)을 쓰지 않는다. 모양은 custom.scss 에 있다.
  const header = el("div", { className: ["home-recent__header"] }, [
    el("h2", { id: "recent-posts" }, [text(opts.title)]),
    filterControls("home-recent-filter"),
    opts.moreSlug &&
      el(
        "a",
        {
          className: ["internal", "recent-updated-notes__more"],
          href: resolveRelative("index", opts.moreSlug),
        },
        [text(opts.moreLabel)],
      ),
  ])
  return el(
    "section",
    { className: ["recent-updated-notes", "home-recent", "recent-filter-scope"] },
    [
      header,
      el(
        "ol",
        { className: ["recent-updated-notes__list"] },
        notes.map((page) => item(page, { kindOf, filtersOf, locale })),
      ),
    ],
  )
}

// 대문(content/index.md)의 첫 h2 앞, 즉 소개 문단 바로 뒤에 목록을 끼운다.
// 목록은 모든 노트의 날짜가 있어야 만들 수 있어서 마크다운 변환 단계가 아니라
// 페이지를 그릴 때(treeTransforms) 넣는다. 대문을 그리는 쪽은 그대로 content-page 다.
export const HomeRecentNotes = (userOpts = {}) => {
  const opts = { ...manifest.defaultOptions, ...userOpts }

  const transform = (root, slug, { allFiles, cfg }) => {
    if (slug !== "index") return
    const recent = section(allFiles, opts, cfg.locale ?? "ko-KR")
    if (!recent) return
    const at = root.children.findIndex((node) => node.type === "element" && node.tagName === "h2")
    root.children.splice(at === -1 ? root.children.length : at, 0, recent)
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
