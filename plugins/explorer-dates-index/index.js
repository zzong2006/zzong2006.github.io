import fs from "node:fs/promises"
import path from "node:path"

export const manifest = {
  name: "explorer-dates-index",
  displayName: "Explorer Dates Index",
  description: "Emits latest modified timestamps for explorer folder ordering.",
  version: "1.0.0",
  category: "emitter",
  defaultEnabled: true,
  defaultOptions: {
    outputPath: "static/explorerDates.json",
  },
}

const defaultOptions = {
  outputPath: "static/explorerDates.json",
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
  const parts = String(slug ?? "").split("/").filter(Boolean)
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

async function emitExplorerDates(ctx, content, options) {
  const files = {}
  const folders = {}

  for (const [, file] of content) {
    const data = file.data ?? {}
    if (!isDisplayableMarkdown(data)) continue

    const slug = String(data.slug ?? "")
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
