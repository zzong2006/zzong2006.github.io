import path from "node:path"
import { h } from "preact"
import { getDate, isFolderPath, resolveRelative } from "@quartz-community/utils"
import { htmlToJsx } from "@quartz-community/utils/jsx"
import { folderDisplayName } from "../shared/folder-names.js"

export const manifest = {
  name: "folder-page-clean",
  displayName: "Clean Folder Page",
  description: "Renders folder pages as quiet blog category indexes.",
  version: "1.0.0",
  category: "pageType",
  defaultOptions: {
    showFolderCount: true,
    showSubfolders: true,
  },
}

function joinSegments(...segments) {
  return segments.filter(Boolean).join("/")
}

function getFolders(slug) {
  let folderName = path.dirname(slug ?? "")
  const parentFolderNames = [folderName]
  while (folderName !== ".") {
    folderName = path.dirname(folderName ?? "")
    parentFolderNames.push(folderName)
  }
  return parentFolderNames
}

function mostRecentDatesFromEntries(entries) {
  let maybeDates
  for (const entry of entries) {
    if (!entry.dates) continue
    if (!maybeDates) {
      maybeDates = { ...entry.dates }
      continue
    }
    if (entry.dates.created > maybeDates.created) maybeDates.created = entry.dates.created
    if (entry.dates.modified > maybeDates.modified) maybeDates.modified = entry.dates.modified
    if (entry.dates.published > maybeDates.published) maybeDates.published = entry.dates.published
  }
  return maybeDates ?? { created: new Date(), modified: new Date(), published: new Date() }
}

function mostRecentDatesFromChildren(children) {
  return mostRecentDatesFromEntries(
    children.map((child) => child.data).filter((entry) => entry && entry.dates),
  )
}

// 하위 폴더 항목의 이름은 탐색기와 같은 규칙(shared/folder-names.js)으로 붙인다.
// node.displayName 은 폴더 페이지 제목이 있으면 그것, 없으면 원래 폴더 이름이다.
function pagesFromTrie(folder, showSubfolders) {
  return folder.children
    .map((node) => {
      const nodeData = node.data
      if (node.isFolder) {
        if (!showSubfolders || nodeData?.unlisted === true) return undefined
        const title = folderDisplayName(folderKeyOf(node.slug), node.displayName)
        if (nodeData) return { ...nodeData, frontmatter: { ...nodeData.frontmatter, title } }
        return {
          slug: node.slug,
          dates: mostRecentDatesFromChildren(node.children),
          frontmatter: { title, tags: [] },
        }
      }

      if (nodeData) {
        if (nodeData.unlisted === true) return undefined
        return nodeData
      }
      return undefined
    })
    .filter((page) => page !== undefined)
}

function folderKeyOf(slug) {
  return String(slug ?? "").replace(/\/index$/, "").replace(/\/$/, "")
}

// 폴더 안(하위 폴더 포함)의 노트 수. 탐색기가 폴더 옆에 보여 주는 수와 같은 기준이다.
// 폴더 페이지 자체(…/index)는 노트로 세지 않는다.
function countNotesUnder(allFiles, folderSlug) {
  const prefix = `${folderKeyOf(folderSlug)}/`
  let count = 0
  for (const file of allFiles ?? []) {
    if (file.unlisted === true) continue
    const slug = file.slug
    if (!slug || !slug.startsWith(prefix) || slug.endsWith("/index")) continue
    count += 1
  }
  return count
}

function pagesFromAllFiles(allFiles, folderSlug, showSubfolders) {
  const folderPrefix = folderSlug.endsWith("/index")
    ? folderSlug.slice(0, -"index".length)
    : folderSlug.endsWith("/")
      ? folderSlug
      : `${folderSlug}/`

  const directChildren = []
  const subfolderFiles = new Map()

  for (const file of allFiles ?? []) {
    if (file.unlisted === true) continue
    const fileSlug = file.slug
    if (!fileSlug || !fileSlug.startsWith(folderPrefix)) continue

    const relativePath = fileSlug.slice(folderPrefix.length)
    if (!relativePath || relativePath === "index") continue

    const segments = relativePath.split("/")

    if (segments.length === 1) {
      directChildren.push(file)
    } else if (showSubfolders) {
      const subfolderName = segments[0]
      if (!subfolderFiles.has(subfolderName)) subfolderFiles.set(subfolderName, [])
      subfolderFiles.get(subfolderName).push(file)
    }
  }

  for (const [subfolderName, files] of subfolderFiles) {
    const indexFile = files.find((f) => f.slug === `${folderPrefix}${subfolderName}/index`)
    if (indexFile) continue

    const subfolderSlug = `${folderPrefix}${subfolderName}`
    directChildren.push({
      slug: `${subfolderSlug}/index`,
      dates: mostRecentDatesFromEntries(files),
      frontmatter: { title: folderDisplayName(subfolderSlug, subfolderName), tags: [] },
    })
  }

  return directChildren
}

function byFolderThenTitle(f1, f2) {
  const f1IsFolder = isFolderPath(f1.slug ?? "")
  const f2IsFolder = isFolderPath(f2.slug ?? "")
  if (f1IsFolder && !f2IsFolder) return -1
  if (!f1IsFolder && f2IsFolder) return 1

  const f1Title = String(f1.frontmatter?.title ?? f1.slug ?? "")
  const f2Title = String(f2.frontmatter?.title ?? f2.slug ?? "")
  const titleCompare = f1Title.localeCompare(f2Title, undefined, {
    numeric: true,
    sensitivity: "base",
  })
  if (titleCompare !== 0) return titleCompare

  if (f1.dates && f2.dates) {
    return (getDate(f2)?.getTime() ?? 0) - (getDate(f1)?.getTime() ?? 0)
  }
  return 0
}

function folderDescription(folderName, count) {
  return `${folderName} 카테고리의 글 ${count}개를 모아둔 목록입니다.`
}

function hasRenderedContent(tree) {
  return Array.isArray(tree?.children) && tree.children.length > 0
}

function ContentBody({ fileData, tree }) {
  const content = htmlToJsx(tree)
  const classes = fileData?.frontmatter?.cssclasses ?? []
  return h("article", { class: ["popover-hint", ...classes].join(" ") }, [
    h("div", { class: "markdown-preview-view markdown-rendered" }, content),
  ])
}

function PageList({ cfg, fileData, allFiles, limit, sort }) {
  const sorter = sort ?? byFolderThenTitle
  let list = [...allFiles].sort(sorter)
  if (limit) list = list.slice(0, limit)

  const fileSlug = fileData?.slug
  const locale = cfg?.locale ?? "en-US"

  return h(
    "ul",
    { class: "section-ul" },
    list.map((page) => {
      const title = page.frontmatter?.title ?? page.slug
      const tags = page.frontmatter?.tags ?? []

      return h("li", { class: "section-li" }, [
        h("div", { class: "section" }, [
          h("div", { class: "desc" }, [
            h("h3", null, [
              h(
                "a",
                {
                  href: resolveRelative(fileSlug ?? "", page.slug),
                  class: "internal",
                  lang: locale,
                },
                title,
              ),
            ]),
          ]),
          h(
            "ul",
            { class: "tags" },
            tags.map((tag) =>
              h("li", null, [
                h(
                  "a",
                  {
                    class: "internal tag-link",
                    href: resolveRelative(fileSlug ?? "", `tags/${tag}`),
                  },
                  tag,
                ),
              ]),
            ),
          ),
        ]),
      ])
    }),
  )
}

function FolderContent(opts = {}) {
  const options = {
    showFolderCount: true,
    showSubfolders: true,
    ...opts,
  }

  const Component = (props) => {
    const { fileData, allFiles, cfg, tree } = props
    const trie = props.ctx?.trie
    const slug = fileData?.slug

    if (!slug) return null
    const isGeneratedFolderPage = fileData?.frontmatter?.folderPage === true
    if (!isGeneratedFolderPage && hasRenderedContent(tree)) return h(ContentBody, props)

    let allPagesInFolder
    if (trie) {
      const folder = trie.findNode(slug.split("/"))
      if (!folder) return null
      allPagesInFolder = pagesFromTrie(folder, options.showSubfolders)
    } else {
      allPagesInFolder = pagesFromAllFiles(allFiles ?? [], slug, options.showSubfolders)
    }

    // 예전에는 바로 아래 항목 수(폴더 포함)를 "12개의 글"로 보여 줘서, 같은 폴더를 탐색기는
    // 168 로 셌다. 탐색기와 같은 기준의 노트 수와, 하위 폴더 수를 나눠 적는다.
    const subfolderCount = allPagesInFolder.filter((page) => isFolderPath(page.slug ?? "")).length
    const noteCount = countNotesUnder(allFiles, slug)
    const countText = subfolderCount > 0
      ? `폴더 ${subfolderCount}개 · 노트 ${noteCount}개`
      : `노트 ${noteCount}개`

    return h("div", { class: "popover-hint folder-index" }, [
      h("div", { class: "page-listing folder-page-listing" }, [
        options.showFolderCount
          ? h("p", { class: "folder-page-count" }, countText)
          : null,
        h("div", null, [
          h(PageList, {
            ...props,
            sort: options.sort,
            allFiles: allPagesInFolder,
          }),
        ]),
      ]),
    ])
  }

  return Component
}

const folderMatcher = ({ slug }) => slug.endsWith("/index")

export const FolderPage = (opts = {}) => {
  const body = () => FolderContent(opts)

  return {
    name: "FolderPage",
    priority: 10,
    match: folderMatcher,
    generate({ content, cfg, ctx }) {
      const allFiles = content
        .map((c) => c[1].data)
        .filter((d) => d?.unlisted !== true)
      const locale = cfg?.locale ?? "en-US"

      const folders = new Set()
      const folderDisplayNames = new Map()
      for (const file of allFiles) {
        const slug = file?.slug
        if (!slug) continue
        const fileFolders = getFolders(slug).filter((f) => f !== "." && f !== "tags")
        for (const f of fileFolders) folders.add(f)

        // 주소는 소문자라 LLM 이 llm 이 된다. 원래 폴더 이름을 폴더 경로별로 기억해 둔다.
        // (예전에는 마지막 조각만 키로 써서 RL 과 papers/rl 처럼 이름이 같은 폴더가 섞였다.)
        const relativePath = file?.relativePath
        if (relativePath) {
          const slugParts = path.dirname(slug).split("/").filter(Boolean)
          const pathParts = path.dirname(relativePath).split("/").filter(Boolean)
          for (let i = 0; i < slugParts.length && i < pathParts.length; i++) {
            const folderKey = slugParts.slice(0, i + 1).join("/")
            const pathPart = pathParts[i]
            if (pathPart && !folderDisplayNames.has(folderKey)) {
              folderDisplayNames.set(folderKey, pathPart)
            }
          }
        }
      }

      // breadcrumb 은 ctx.trie 의 폴더 이름을 쓴다. 이 trie 는 generate 보다 먼저 만들어져서
      // 아래에서 바꾸는 제목이 반영되지 않는다(경로 줄만 "papers" 로 남았다). 노드 이름을 직접 바꾼다.
      const renameInTrie = (folder, name) => {
        const node = ctx?.trie?.findNode(folder.split("/"))
        if (node) node.displayName = name
      }

      const foldersWithIndex = new Set()
      for (const [, file] of content) {
        const data = file.data
        if (data?.unlisted === true) continue
        const slug = data?.slug
        if (slug && slug.endsWith("/index")) {
          const folder = slug.slice(0, -"/index".length)
          foldersWithIndex.add(folder)
        }
      }

      for (const [, file] of content) {
        const slug = file.data?.slug
        if (!slug || !slug.endsWith("/index")) continue

        const frontmatter = file.data.frontmatter ?? (file.data.frontmatter = {})

        const folder = slug.slice(0, -"/index".length)
        const slugSegment = folder.split("/").pop() ?? folder
        const folderName = folderDisplayName(folder, folderDisplayNames.get(folder) ?? slugSegment)
        const description = folderDescription(folderName, countNotesUnder(allFiles, slug))
        // 폴더 노트(retrieval/Retrieval.md 처럼 폴더와 이름이 같은 노트)도 제목을 폴더 이름으로
        // 맞춘다. 이 제목이 breadcrumb 에 쓰이므로, 여기서 "Retrieval" 로 두면 탐색기의
        // "검색"과 경로 줄의 "Retrieval" 이 갈라진다.
        frontmatter.title = opts?.prefixFolders ? `Folder: ${folderName}` : folderName
        renameInTrie(folder, folderName)
        frontmatter.description = description
        file.data.description = description
      }

      const virtualPages = []
      for (const folder of folders) {
        if (foldersWithIndex.has(folder)) continue

        const slug = joinSegments(folder, "index")
        const slugSegment = folder.split("/").pop() ?? folder
        const folderName = folderDisplayName(folder, folderDisplayNames.get(folder) ?? slugSegment)
        const title = opts?.prefixFolders ? `Folder: ${folderName}` : folderName
        const description = folderDescription(folderName, countNotesUnder(allFiles, slug))
        renameInTrie(folder, folderName)

        virtualPages.push({
          slug,
          title,
          data: {
            description,
            frontmatter: { title, tags: [], description, folderPage: true },
          },
        })
      }

      return virtualPages
    },
    layout: "folder",
    body,
  }
}
