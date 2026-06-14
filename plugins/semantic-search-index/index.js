import fs from "node:fs/promises"
import path from "node:path"

export const manifest = {
  name: "semantic-search-index",
  displayName: "Semantic Search Index",
  description: "Emits a compact vector index for client-side semantic search.",
  version: "1.0.0",
  category: "emitter",
  defaultEnabled: true,
  defaultOptions: {
    cachePath: "data/related-notes/embeddings.json",
    outputPath: "static/semanticIndex.json",
    snippetLength: 180,
  },
}

const defaultOptions = {
  cachePath: "data/related-notes/embeddings.json",
  outputPath: "static/semanticIndex.json",
  snippetLength: 180,
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"))
  } catch {
    return fallback
  }
}

function isSyntheticPage(slug) {
  return slug === "" || slug === "index" || slug.endsWith("/index") || slug.startsWith("tags/")
}

function isDisplayableNote(data) {
  const slug = String(data?.slug ?? "")
  const relativePath = String(data?.relativePath ?? "")
  return (
    slug &&
    !isSyntheticPage(slug) &&
    data.unlisted !== true &&
    relativePath.toLowerCase().endsWith(".md")
  )
}

function titleOf(data) {
  const relativePath = String(data.relativePath ?? "")
  const fallback = relativePath.replace(/\.md$/i, "") || data.slug
  return String(data.frontmatter?.title ?? fallback)
}

function tagsOf(data) {
  const tags = data.frontmatter?.tags
  if (Array.isArray(tags)) return tags.map(String)
  if (typeof tags === "string") return tags.split(/[, ]+/).filter(Boolean)
  return []
}

function cleanSnippetText(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(
      /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g,
      (_, target, alias) => alias ?? target,
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~>#]+/g, " ")
    .replace(/-{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clipSnippet(value, limit) {
  const text = cleanSnippetText(value)
  if (!text || text.length <= limit) return text

  const head = text.slice(0, Math.max(0, limit - 3)).trim()
  const sentenceEnd = Math.max(
    head.lastIndexOf(". "),
    head.lastIndexOf("? "),
    head.lastIndexOf("! "),
  )
  const spaceEnd = head.lastIndexOf(" ")
  const boundary =
    sentenceEnd >= limit * 0.45 ? sentenceEnd + 1 : spaceEnd >= limit * 0.6 ? spaceEnd : -1
  const clipped = boundary > 0 ? head.slice(0, boundary).trim() : head
  return `${clipped}...`
}

function snippetOf(data, limit) {
  const snippet = clipSnippet(
    data.frontmatter?.description ??
      data.frontmatter?.summary ??
      data.description ??
      data.text ??
      "",
    limit,
  )
  return snippet === titleOf(data) ? "" : snippet
}

function normalizeVector(values) {
  if (!Array.isArray(values) || values.length === 0) return []

  let norm = 0
  for (const value of values) {
    norm += Number(value) * Number(value)
  }
  if (norm === 0) return []

  const scale = 1 / Math.sqrt(norm)
  return values.map((value) => Number(value) * scale)
}

function encodeInt8Vector(values) {
  const normalized = normalizeVector(values)
  if (normalized.length === 0) return ""

  const bytes = Int8Array.from(
    normalized.map((value) => Math.max(-127, Math.min(127, Math.round(value * 127)))),
  )
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64")
}

async function emitSemanticIndex(ctx, content, options) {
  const cachePath = path.isAbsolute(options.cachePath)
    ? options.cachePath
    : path.join(process.cwd(), options.cachePath)
  const cache = await readJson(cachePath, {
    version: 1,
    model: "gemini-embedding-2",
    outputDimensionality: 768,
    entries: {},
  })

  const entries = []
  let documents = 0
  for (const [, file] of content) {
    const data = file.data ?? {}
    if (!isDisplayableNote(data)) continue
    documents += 1

    const slug = String(data.slug ?? "")
    const cached = cache.entries?.[slug]
    const vector = encodeInt8Vector(cached?.embedding)
    if (!vector) continue

    entries.push({
      slug,
      title: titleOf(data),
      snippet: snippetOf(data, options.snippetLength),
      tags: tagsOf(data),
      vector,
    })
  }

  entries.sort((left, right) => left.slug.localeCompare(right.slug))

  const outputPath = path.isAbsolute(options.outputPath)
    ? options.outputPath
    : path.join(ctx.argv.output, options.outputPath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(
    outputPath,
    `${JSON.stringify({
      version: 1,
      generatedAt: new Date().toISOString(),
      model: cache.model ?? "gemini-embedding-2",
      outputDimensionality: cache.outputDimensionality ?? 768,
      encoding: "int8-base64-normalized",
      documents,
      embeddedDocuments: entries.length,
      entries,
    })}\n`,
    "utf8",
  )

  return [outputPath]
}

export const SemanticSearchIndex = (userOpts = {}) => {
  const options = { ...defaultOptions, ...userOpts }

  return {
    name: "SemanticSearchIndex",
    emit: (ctx, content) => emitSemanticIndex(ctx, content, options),
    partialEmit: (ctx, content) => emitSemanticIndex(ctx, content, options),
  }
}

export default SemanticSearchIndex
