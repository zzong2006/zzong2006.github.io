import fs from "node:fs/promises"
import path from "node:path"
import { clipParts, snippetFromMarkdown, snippetParts, snippetPlainText } from "../shared/snippet.js"

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

// Quartz 가 만든 설명(data.description)은 이미 HTML 이스케이프가 된 글이다. 카드가 한 번 더
// 이스케이프하므로 "&amp;" 가 그대로 보였다. 먼저 되돌린다.
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }

function decodeEntities(value) {
  return String(value ?? "").replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ENTITIES[name])
}

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/

// 노트 원문 위치. Quartz 버전에 따라 filePath 가 절대 경로이거나 작업 폴더 기준 경로다.
function sourceCandidates(ctx, data) {
  const candidates = []
  if (data.filePath) candidates.push(path.resolve(String(data.filePath)))
  if (data.relativePath) {
    candidates.push(path.resolve(String(ctx.argv?.directory ?? "content"), String(data.relativePath)))
  }
  return candidates
}

async function readBody(ctx, data) {
  for (const file of sourceCandidates(ctx, data)) {
    try {
      return (await fs.readFile(file, "utf8")).replace(FRONTMATTER, "")
    } catch {}
  }
  return null
}

// 요약문은 조각 배열이다(짝수 칸 글, 홀수 칸 인라인 수식). 형식은 ../shared/snippet.js 참고.
// Quartz 설명은 수식을 LaTeX 원문 글자로 풀고 "_" 도 지워서, 원문을 못 읽을 때만 쓴다.
async function snippetOf(ctx, data, limit) {
  const body = await readBody(ctx, data)
  const parts =
    body !== null
      ? snippetFromMarkdown(body, data.frontmatter ?? {}, limit)
      : clipParts(
          snippetParts(
            decodeEntities(
              data.frontmatter?.description ??
                data.frontmatter?.summary ??
                data.description ??
                data.text ??
                "",
            ),
          ),
          limit,
        )
  return snippetPlainText(parts) === titleOf(data) ? [""] : parts
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
      snippet: await snippetOf(ctx, data, options.snippetLength),
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
