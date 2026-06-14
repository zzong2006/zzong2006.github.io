import crypto from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import YAML from "yaml"
import { slugifyFilePath } from "@quartz-community/utils"

const rootDir = process.cwd()
const contentDir = path.join(rootDir, "content")
const cacheDir = path.join(rootDir, "data", "related-notes")
const embeddingCachePath = path.join(cacheDir, "embeddings.json")
const relatedOutputPath = path.join(cacheDir, "related-notes.json")

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? ""
const model = process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-2"
const outputDimensionality = Number(process.env.RELATED_NOTES_EMBEDDING_DIM ?? "768")
const maxChars = Number(process.env.RELATED_NOTES_MAX_CHARS ?? "3500")
const snippetLength = Number(process.env.RELATED_NOTES_SNIPPET_LENGTH ?? "180")
const topK = Number(process.env.RELATED_NOTES_LIMIT ?? "8")
const requestDelayMs = Number(process.env.RELATED_NOTES_REQUEST_DELAY_MS ?? "250")
const embedLimit = Number(process.env.RELATED_NOTES_EMBED_LIMIT ?? "900")

const ignoredSegments = new Set(["private", "templates", ".obsidian"])

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function pathExists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"))
  } catch {
    return fallback
  }
}

async function writeJson(file, value, options = {}) {
  await fs.writeFile(file, `${JSON.stringify(value, null, options.pretty ? 2 : 0)}\n`, "utf8")
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (ignoredSegments.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(fullPath)
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      yield fullPath
    }
  }
}

function splitFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { frontmatter: {}, body: markdown }

  try {
    return {
      frontmatter: YAML.parse(match[1]) ?? {},
      body: markdown.slice(match[0].length),
    }
  } catch {
    return { frontmatter: {}, body: markdown.slice(match[0].length) }
  }
}

function arrayFromValue(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === "string") return value.split(/[, ]+/).map((v) => v.trim()).filter(Boolean)
  return []
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias ?? target)
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~>#]+/g, " ")
    .replace(/-{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clipText(value, limit) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim()
  if (!text || text.length <= limit) return text

  const head = text.slice(0, Math.max(0, limit - 3)).trim()
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "))
  const spaceEnd = head.lastIndexOf(" ")
  const boundary = sentenceEnd >= limit * 0.45 ? sentenceEnd + 1 : spaceEnd >= limit * 0.6 ? spaceEnd : -1
  const clipped = boundary > 0 ? head.slice(0, boundary).trim() : head
  return `${clipped}...`
}

function snippetBlocks(markdown) {
  const blocks = []
  let current = []
  let inCode = false
  let inMath = false

  const flush = () => {
    if (current.length > 0) {
      blocks.push(current.join(" "))
      current = []
    }
  }

  for (const line of String(markdown ?? "").split(/\r?\n/)) {
    const trimmed = line.trim()

    if (trimmed.startsWith("```")) {
      inCode = !inCode
      flush()
      continue
    }
    if (trimmed === "$$") {
      inMath = !inMath
      flush()
      continue
    }
    if (inCode || inMath) continue

    if (
      !trimmed ||
      /^#{1,6}\s/.test(trimmed) ||
      /^-{3,}$/.test(trimmed) ||
      /^\|/.test(trimmed) ||
      /^!\[/.test(trimmed)
    ) {
      flush()
      continue
    }

    current.push(trimmed)
  }
  flush()

  return blocks
}

function snippetFromBody(body, frontmatter) {
  const summary = frontmatter.description ?? frontmatter.summary
  const summaryText = cleanText(summary)
  if (summaryText) return clipText(summaryText, snippetLength)

  const snippet =
    snippetBlocks(body)
      .map(cleanText)
      .filter((block) => block.length >= 16)
      .find((block) => !/^references?$/i.test(block)) ?? ""

  return clipText(snippet, snippetLength)
}

function slugFromRelativePath(relativePath) {
  return String(slugifyFilePath(relativePath.replaceAll(path.sep, "/")))
}

function titleFromPath(relativePath) {
  return path.basename(relativePath, path.extname(relativePath))
}

function isPublished(frontmatter) {
  if (frontmatter.draft === true || frontmatter.unlisted === true) return false
  if (frontmatter.publish === false || frontmatter.published === false) return false
  return true
}

function extractWikiLinks(markdown) {
  const links = []
  const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g
  for (const match of markdown.matchAll(pattern)) {
    const rawTarget = String(match[1] ?? "").trim()
    if (rawTarget) links.push(rawTarget)
  }
  return links
}

function normalizeLookupKey(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "")
    .toLowerCase()
}

function tokenize(value) {
  return new Set(
    String(value ?? "")
      .normalize("NFKC")
      .toLowerCase()
      .match(/[a-z0-9\uAC00-\uD7A3]{2,}/g) ?? [],
  )
}

function overlapScore(left, right) {
  if (left.size === 0 || right.size === 0) return 0
  let intersection = 0
  for (const token of left) {
    if (right.has(token)) intersection += 1
  }
  return intersection / Math.max(left.size, right.size)
}

function folderOf(slug) {
  const parts = slug.split("/")
  parts.pop()
  return parts.join("/")
}

function cosineSimilarity(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return 0
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0
  for (let i = 0; i < left.length; i++) {
    dot += left[i] * right[i]
    leftNorm += left[i] * left[i]
    rightNorm += right[i] * right[i]
  }
  if (leftNorm === 0 || rightNorm === 0) return 0
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
}

async function loadDocuments() {
  const docs = []
  for await (const filePath of walk(contentDir)) {
    const relativePath = path.relative(contentDir, filePath)
    const markdown = await fs.readFile(filePath, "utf8")
    const { frontmatter, body } = splitFrontmatter(markdown)
    if (!isPublished(frontmatter)) continue

    const slug = slugFromRelativePath(relativePath)
    if (slug === "index" || slug.endsWith("/index")) continue

    const title = String(frontmatter.title ?? titleFromPath(relativePath))
    const tags = arrayFromValue(frontmatter.tags)
    const aliases = arrayFromValue(frontmatter.aliases)
    const cleaned = cleanText(body)
    const snippet = snippetFromBody(body, frontmatter)
    const embeddingInput = `title: ${title} | text: ${[...aliases, ...tags, cleaned]
      .filter(Boolean)
      .join("\n")
      .slice(0, maxChars)}`

    docs.push({
      slug,
      title,
      relativePath: relativePath.replaceAll(path.sep, "/"),
      tags,
      aliases,
      snippet,
      rawLinks: extractWikiLinks(body),
      folder: folderOf(slug),
      titleTokens: tokenize(`${title} ${slug.replace(/[-_/]/g, " ")} ${aliases.join(" ")}`),
      embeddingInput,
      hash: sha256(`${model}:${outputDimensionality}:${embeddingInput}`),
    })
  }
  return docs
}

function resolveLinks(docs) {
  const byKey = new Map()
  for (const doc of docs) {
    const relativeNoExt = doc.relativePath.replace(/\.md$/i, "")
    const basenameNoExt = path.basename(relativeNoExt)
    byKey.set(normalizeLookupKey(relativeNoExt), doc.slug)
    byKey.set(normalizeLookupKey(basenameNoExt), doc.slug)
    byKey.set(normalizeLookupKey(doc.title), doc.slug)
    byKey.set(normalizeLookupKey(doc.slug), doc.slug)
    for (const alias of doc.aliases) {
      byKey.set(normalizeLookupKey(alias), doc.slug)
    }
  }

  for (const doc of docs) {
    doc.links = Array.from(
      new Set(
        doc.rawLinks
          .map((target) => byKey.get(normalizeLookupKey(target)))
          .filter((slug) => slug && slug !== doc.slug),
      ),
    )
    delete doc.rawLinks
  }
}

async function embedWithGemini(text) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      output_dimensionality: outputDimensionality,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini embedding request failed: ${response.status} ${errorText}`)
  }

  const json = await response.json()
  const values = json.embedding?.values ?? json.embeddings?.[0]?.values
  if (!Array.isArray(values)) {
    throw new Error("Gemini embedding response did not include embedding values")
  }
  return values
}

async function ensureEmbeddings(docs) {
  await fs.mkdir(cacheDir, { recursive: true })
  const cache = await readJson(embeddingCachePath, {
    version: 1,
    model,
    outputDimensionality,
    entries: {},
  })
  cache.version = 1
  cache.model = model
  cache.outputDimensionality = outputDimensionality
  cache.entries ??= {}

  let reused = 0
  let created = 0
  let failed = 0
  let skippedByLimit = 0

  for (const doc of docs) {
    const cached = cache.entries?.[doc.slug]
    if (cached?.hash === doc.hash && Array.isArray(cached.embedding)) {
      reused += 1
      continue
    }

    if (!apiKey) continue
    if (created >= embedLimit) {
      skippedByLimit += 1
      continue
    }

    try {
      const embedding = await embedWithGemini(doc.embeddingInput)
      cache.entries[doc.slug] = {
        hash: doc.hash,
        embedding,
        title: doc.title,
        updatedAt: new Date().toISOString(),
      }
      created += 1
      await writeJson(embeddingCachePath, cache)
      await sleep(requestDelayMs)
    } catch (error) {
      failed += 1
      console.warn(`[related-notes] ${doc.slug}: ${error.message}`)
      await sleep(Math.max(requestDelayMs, 1000))
    }
  }

  await writeJson(embeddingCachePath, cache)
  return { cache, stats: { reused, created, failed, skippedByLimit } }
}

function scorePair(current, candidate, embeddings) {
  const currentTags = new Set(current.tags)
  const candidateTags = new Set(candidate.tags)
  let sharedTags = 0
  for (const tag of currentTags) {
    if (candidateTags.has(tag)) sharedTags += 1
  }

  const currentEntry = embeddings.entries?.[current.slug]
  const candidateEntry = embeddings.entries?.[candidate.slug]
  const currentEmbedding = currentEntry?.hash === current.hash ? currentEntry.embedding : undefined
  const candidateEmbedding =
    candidateEntry?.hash === candidate.hash ? candidateEntry.embedding : undefined
  const hasEmbeddings = Array.isArray(currentEmbedding) && Array.isArray(candidateEmbedding)
  const semanticScore = hasEmbeddings ? Math.max(0, cosineSimilarity(currentEmbedding, candidateEmbedding)) : 0
  const tagScore = Math.min(1, sharedTags / 2)
  const directLink = current.links.includes(candidate.slug)
  const backlink = candidate.links.includes(current.slug)
  const linkScore = directLink || backlink ? 1 : 0
  const folderScore = current.folder && current.folder === candidate.folder ? 1 : 0
  const titleScore = overlapScore(current.titleTokens, candidate.titleTokens)
  const score = hasEmbeddings
    ? 0.65 * semanticScore + 0.15 * tagScore + 0.1 * linkScore + 0.05 * folderScore + 0.05 * titleScore
    : 0.35 * tagScore + 0.3 * linkScore + 0.15 * folderScore + 0.2 * titleScore

  const reasons = []
  if (semanticScore >= 0.65) reasons.push("semantic")
  if (sharedTags > 0) reasons.push("tag")
  if (directLink || backlink) reasons.push("link")
  if (folderScore > 0) reasons.push("folder")
  if (titleScore > 0) reasons.push("title")

  return { score, reasons }
}

function buildRelatedMap(docs, embeddings) {
  const relatedBySlug = {}
  for (const current of docs) {
    relatedBySlug[current.slug] = docs
      .filter((candidate) => candidate.slug !== current.slug)
      .map((candidate) => {
        const { score, reasons } = scorePair(current, candidate, embeddings)
        return {
          slug: candidate.slug,
          title: candidate.title,
          snippet: candidate.snippet,
          score: Number(score.toFixed(6)),
          reasons,
        }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
  return relatedBySlug
}

await fs.mkdir(cacheDir, { recursive: true })

if (!(await pathExists(contentDir))) {
  console.warn("[related-notes] content directory was not found; writing empty related-note map")
  await writeJson(
    relatedOutputPath,
    { version: 1, generatedAt: new Date().toISOString(), relatedBySlug: {} },
    { pretty: true },
  )
  process.exit(0)
}

const docs = await loadDocuments()
resolveLinks(docs)
const { cache: embeddings, stats } = await ensureEmbeddings(docs)
const relatedBySlug = buildRelatedMap(docs, embeddings)
const embeddedCount = docs.filter((doc) => {
  const entry = embeddings.entries?.[doc.slug]
  return entry?.hash === doc.hash && Array.isArray(entry.embedding)
}).length

await writeJson(
  relatedOutputPath,
  {
    version: 1,
    generatedAt: new Date().toISOString(),
    strategy: embeddedCount > 0 ? "gemini-embedding-plus-heuristic" : "heuristic",
    model,
    outputDimensionality,
    snippetLength,
    topK,
    documents: docs.length,
    embeddedDocuments: embeddedCount,
    relatedBySlug,
  },
  { pretty: true },
)

console.log(
  `[related-notes] docs=${docs.length}, embedded=${embeddedCount}, reused=${stats.reused}, created=${stats.created}, failed=${stats.failed}, skippedByLimit=${stats.skippedByLimit}`,
)
if (!apiKey) {
  console.log("[related-notes] GEMINI_API_KEY is not set; used heuristic scoring only")
}
