import fs from "node:fs/promises"
import path from "node:path"

export const manifest = {
  name: "explorer-dates-index",
  displayName: "Explorer Dates Index",
  description: "Emits latest modified timestamps, explorer labels and pinned notes.",
  version: "1.0.0",
  category: "emitter",
  defaultEnabled: true,
  defaultOptions: {
    outputPath: "static/explorerDates.json",
    pinsPerFolder: 5,
    pinMinBacklinks: 3,
  },
}

const defaultOptions = {
  outputPath: "static/explorerDates.json",
  pinsPerFolder: 5,
  pinMinBacklinks: 3,
}

function dateValue(data) {
  const dates = data?.dates ?? {}
  const rawDate = dates.modified ?? dates.created ?? dates.published
  if (!rawDate) return undefined

  const date = rawDate instanceof Date ? rawDate : new Date(rawDate)
  const timestamp = date.getTime()
  return Number.isNaN(timestamp) ? undefined : timestamp
}

function isIndexSlug(slug) {
  return slug === "index" || slug.endsWith("/index")
}

function isDisplayableMarkdown(data) {
  const slug = String(data?.slug ?? "")
  const relativePath = String(data?.relativePath ?? "")
  return (
    slug &&
    data?.unlisted !== true &&
    relativePath.toLowerCase().endsWith(".md") &&
    !slug.startsWith("tags/")
  )
}

function parentFolderSlugs(slug) {
  const parts = String(slug ?? "")
    .split("/")
    .filter(Boolean)
  if (parts.length === 0) return []

  const folderParts = isIndexSlug(slug) ? parts.slice(0, -1) : parts.slice(0, -1)
  const folders = []
  for (let index = 1; index <= folderParts.length; index += 1) {
    folders.push(`${folderParts.slice(0, index).join("/")}/index`)
  }

  if (isIndexSlug(slug) && slug !== "index" && !folders.includes(slug)) {
    folders.push(slug)
  }

  return folders
}

// 링크 대상은 "a/b#절" 이나 "a/b/index" 로도 온다. 대소문자도 노트 slug 와 다를 수 있다.
function linkKey(value) {
  return String(value ?? "")
    .replace(/#.*$/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/(^|\/)index$/, "")
    .toLowerCase()
}

// 폴더마다 다른 노트가 많이 링크하는 노트를 고른다. 탐색기가 그 폴더 목록 맨 위에 고정한다.
// 한 노트에서 같은 대상으로 건 링크는 한 번으로 센다. 자기 자신으로 가는 링크는 세지 않는다.
// 폴더 페이지(index)는 그 안의 노트를 전부 나열하므로, 세면 모든 노트에 1씩 더해질 뿐이라 뺀다.
// 루트 직속 노트는 탐색기에서 폴더 묶음이 순서를 정하므로 고르지 않는다.
export function pickPins(notes, { pinsPerFolder, pinMinBacklinks }) {
  const slugOf = new Map()
  for (const note of notes) {
    if (!isIndexSlug(note.slug)) slugOf.set(linkKey(note.slug), note.slug)
  }

  const sources = new Map()
  for (const note of notes) {
    if (isIndexSlug(note.slug)) continue
    const self = linkKey(note.slug)
    for (const link of new Set((note.links ?? []).map(linkKey))) {
      if (link === self || !slugOf.has(link)) continue
      if (!sources.has(link)) sources.set(link, new Set())
      sources.get(link).add(self)
    }
  }

  const byFolder = new Map()
  for (const [key, from] of sources) {
    if (from.size < pinMinBacklinks) continue
    const slug = slugOf.get(key)
    const folder = slug.split("/").slice(0, -1).join("/")
    if (!folder) continue
    if (!byFolder.has(folder)) byFolder.set(folder, [])
    byFolder.get(folder).push({ slug, backlinks: from.size })
  }

  const pins = {}
  for (const candidates of byFolder.values()) {
    candidates.sort(
      (left, right) =>
        right.backlinks - left.backlinks ||
        left.slug.localeCompare(right.slug, undefined, { numeric: true, sensitivity: "base" }),
    )
    candidates.slice(0, pinsPerFolder).forEach(({ slug, backlinks }, index) => {
      pins[slug] = { rank: index + 1, backlinks }
    })
  }
  return pins
}

async function emitExplorerDates(ctx, content, options) {
  const files = {}
  const folders = {}
  const labels = {}
  const notes = []

  for (const [, file] of content) {
    const data = file.data ?? {}
    if (!isDisplayableMarkdown(data)) continue

    const slug = String(data.slug ?? "")
    notes.push({ slug, links: Array.isArray(data.links) ? data.links : [] })
    const frontmatter = data.frontmatter ?? {}
    const title = String(frontmatter.title ?? "").trim()
    const rawAliases = frontmatter.aliases ?? frontmatter.alias
    const aliases = Array.isArray(rawAliases) ? rawAliases : [rawAliases]
    // Alias order is author-controlled. Use the first shorter name, not an
    // arbitrary shortest synonym. Keep the full title for hover/accessibility.
    const alias = aliases.find(
      (value) => typeof value === "string" && value.trim() && value.trim().length < title.length,
    )
    if (alias && !isIndexSlug(slug)) labels[slug] = { label: alias.trim(), title }

    const modified = dateValue(data)
    if (!modified) continue

    files[slug] = modified
    for (const folderSlug of parentFolderSlugs(slug)) {
      folders[folderSlug] = Math.max(folders[folderSlug] ?? 0, modified)
    }
  }

  const outputPath = path.isAbsolute(options.outputPath)
    ? options.outputPath
    : path.join(ctx.argv.output, options.outputPath)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(
    outputPath,
    `${JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      files,
      folders,
      labels,
      pins: pickPins(notes, options),
    })}\n`,
    "utf8",
  )

  return [outputPath]
}

export const ExplorerDatesIndex = (userOpts = {}) => {
  const options = { ...defaultOptions, ...userOpts }

  return {
    name: "ExplorerDatesIndex",
    emit: (ctx, content) => emitExplorerDates(ctx, content, options),
    partialEmit: (ctx, content) => emitExplorerDates(ctx, content, options),
  }
}

export default ExplorerDatesIndex
