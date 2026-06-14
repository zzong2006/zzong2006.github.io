import { promises as fs } from "node:fs"
import path from "node:path"

const root = path.resolve("content")
const frontmatterFence = "---"

function cleanValue(value) {
  return value
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^\[|\]$/g, "")
    .trim()
}

function keepValue(value) {
  return value && value !== "-" && value !== "---"
}

function unique(values) {
  return [...new Set(values.map(cleanValue).filter(keepValue))]
}

function parseInlineList(raw) {
  const value = raw.trim()

  if (!value) {
    return []
  }

  if (value.startsWith("[") && value.includes("]")) {
    const inner = value.slice(1, value.indexOf("]"))
    return inner.split(",").map(cleanValue).filter(keepValue)
  }

  if (value.startsWith("[")) {
    return []
  }

  return [cleanValue(value)].filter(keepValue)
}

function yamlString(value) {
  return JSON.stringify(value)
}

function normalizeFrontmatter(text) {
  const newline = text.includes("\r\n") ? "\r\n" : "\n"
  const lines = text.split(/\r?\n/)

  if (lines[0] !== frontmatterFence) {
    return text
  }

  const end = lines.findIndex((line, index) => index > 0 && line === frontmatterFence)
  if (end === -1) {
    return text
  }

  const fm = lines.slice(1, end)
  const body = lines.slice(end + 1)
  const tags = []
  const aliases = []
  let title = null

  for (let index = 0; index < fm.length; index += 1) {
    const line = fm[index]
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)

    if (!match) {
      continue
    }

    const [, key, raw] = match
    const normalizedKey = key === "alias" ? "aliases" : key
    const values = normalizedKey === "tags" ? tags : normalizedKey === "aliases" ? aliases : null

    if (values) {
      values.push(...parseInlineList(raw))

      while (index + 1 < fm.length) {
        const item = fm[index + 1].match(/^\s+-\s*(.+)$/)
        if (!item) {
          break
        }

        values.push(cleanValue(item[1]))
        index += 1
      }

      continue
    }

    if (normalizedKey === "title" && raw.trim() && !raw.includes("[") && !raw.includes("{")) {
      title = cleanValue(raw)
    }
  }

  const next = []
  if (title) {
    next.push(`title: ${yamlString(title)}`)
  }

  const nextTags = unique(tags)
  if (nextTags.length > 0) {
    next.push(`tags: [${nextTags.map(yamlString).join(", ")}]`)
  }

  const nextAliases = unique(aliases)
  if (nextAliases.length > 0) {
    next.push(`aliases: [${nextAliases.map(yamlString).join(", ")}]`)
  }

  if (next.length === 0) {
    return body.join(newline)
  }

  return [frontmatterFence, ...next, frontmatterFence, ...body].join(newline)
}

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath)
    }
  }

  return files
}

const files = await listMarkdownFiles(root)
let changed = 0

for (const file of files) {
  const text = await fs.readFile(file, "utf8")
  const next = normalizeFrontmatter(text)

  if (next !== text) {
    await fs.writeFile(file, next, "utf8")
    changed += 1
  }
}

console.log(`normalized frontmatter in ${changed} markdown files`)
