import path from "node:path"
import { h } from "preact"
import { getDate, isFolderPath, resolveRelative } from "@quartz-community/utils"

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

function pagesFromTrie(folder, showSubfolders) {
  return folder.children
    .map((node) => {
      const nodeData = node.data
      if (nodeData) {
        if (nodeData.unlisted === true) return undefined
        return nodeData
      }

      if (node.isFolder && showSubfolders) {
        return {
          slug: node.slug,
          dates: mostRecentDatesFromChildren(node.children),
          frontmatter: { title: node.displayName, tags: [] },
        }
      }
      return undefined
    })
    .filter((page) => page !== undefined)
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

    directChildren.push({
      slug: `${folderPrefix}${subfolderName}/index`,
      dates: mostRecentDatesFromEntries(files),
      frontmatter: { title: subfolderName, tags: [] },
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
    const { fileData, allFiles, cfg } = props
    const trie = props.ctx?.trie
    const slug = fileData?.slug

    if (!slug) return null

    let allPagesInFolder
    if (trie) {
      const folder = trie.findNode(slug.split("/"))
      if (!folder) return null
      allPagesInFolder = pagesFromTrie(folder, options.showSubfolders)
    } else {
      allPagesInFolder = pagesFromAllFiles(allFiles ?? [], slug, options.showSubfolders)
    }

    return h("div", { class: "popover-hint folder-index" }, [
      h("div", { class: "page-listing folder-page-listing" }, [
        options.showFolderCount
          ? h("p", { class: "folder-page-count" }, `${allPagesInFolder.length}개의 글`)
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

  Component.css = `
.folder-index article {
  display: none;
}
`

  return Component
}

const folderMatcher = ({ slug }) => slug.endsWith("/index")

export const FolderPage = (opts = {}) => {
  const body = () => FolderContent(opts)

  return {
    name: "FolderPage",
    priority: 10,
    match: folderMatcher,
    generate({ content, cfg }) {
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

        const relativePath = file?.relativePath
        if (relativePath) {
          const slugParts = path.dirname(slug).split("/").filter(Boolean)
          const pathParts = path.dirname(relativePath).split("/").filter(Boolean)
          for (let i = 0; i < slugParts.length && i < pathParts.length; i++) {
            const slugPart = slugParts[i]
            const pathPart = pathParts[i]
            if (slugPart && pathPart && !folderDisplayNames.has(slugPart)) {
              folderDisplayNames.set(slugPart, pathPart)
            }
          }
        }
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
        const folderName = folderDisplayNames.get(slugSegment) ?? slugSegment
        const pages = pagesFromAllFiles(allFiles, slug, opts?.showSubfolders ?? true)
        const description = folderDescription(folderName, pages.length)
        if (!frontmatter.title || frontmatter.title === "index") {
          frontmatter.title = opts?.prefixFolders ? `Folder: ${folderName}` : folderName
        }
        frontmatter.description = description
        file.data.description = description
      }

      const virtualPages = []
      for (const folder of folders) {
        if (foldersWithIndex.has(folder)) continue

        const slug = joinSegments(folder, "index")
        const slugSegment = folder.split("/").pop() ?? folder
        const folderName = folderDisplayNames.get(slugSegment) ?? slugSegment
        const title = opts?.prefixFolders ? `Folder: ${folderName}` : folderName
        const pages = pagesFromAllFiles(allFiles, slug, opts?.showSubfolders ?? true)
        const description = folderDescription(folderName, pages.length)

        virtualPages.push({
          slug,
          title,
          data: {
            description,
            frontmatter: { title, tags: [], description },
          },
        })
      }

      return virtualPages
    },
    layout: "folder",
    body,
  }
}
