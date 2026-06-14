import YAML from "yaml"
import path from "node:path"

export const manifest = {
  name: "frontmatter",
  displayName: "Frontmatter",
  description: "Parse YAML frontmatter and remove it from rendered Markdown.",
  version: "1.0.0",
  category: "transformer",
  defaultOrder: 1,
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const TITLE_PREFIX_RE = /^(?:[A-Z](?:\.\d+)*|\d+(?:\.\d+)*)(?:[.)])\s+/i
const TRAILING_QUESTION_RE = /\s*[?？]\s*$/

function cleanDisplayTitle(value) {
  let title = String(value ?? "").trim()

  while (TITLE_PREFIX_RE.test(title)) {
    title = title.replace(TITLE_PREFIX_RE, "").trim()
  }

  return title.replace(TRAILING_QUESTION_RE, "").replace(/\s+/g, " ").trim()
}

function textFromNode(node) {
  if (!node) {
    return ""
  }

  if (typeof node.value === "string") {
    return node.value
  }

  if (Array.isArray(node.children)) {
    return node.children.map(textFromNode).join("")
  }

  return ""
}

function titleFromPath(file) {
  const filePath = String(file.data.relativePath ?? file.path ?? "")
  const extension = path.extname(filePath)
  return cleanDisplayTitle(path.basename(filePath, extension).replace(/[-_]+/g, " "))
}

function fallbackTitle(tree, file) {
  const heading =
    tree.children.find((node) => node.type === "heading" && node.depth === 1) ??
    tree.children.find((node) => node.type === "heading")
  const headingTitle = cleanDisplayTitle(textFromNode(heading))

  return headingTitle || titleFromPath(file)
}

function cleanPrimaryHeading(tree) {
  const heading = tree.children.find((node) => node.type === "heading" && node.depth === 1)

  if (!heading || !Array.isArray(heading.children)) {
    return
  }

  const originalTitle = textFromNode(heading).trim()
  const cleanedTitle = cleanDisplayTitle(originalTitle)

  if (cleanedTitle && cleanedTitle !== originalTitle) {
    heading.children = [{ type: "text", value: cleanedTitle }]
  }
}

function remarkFrontmatter() {
  return (tree, file) => {
    const source = String(file.value ?? "")
    const match = source.match(FRONTMATTER_RE)
    let frontmatter = {}

    if (match) {
      const raw = match[1].trim()
      const data = raw ? YAML.parse(raw) : {}
      frontmatter = data && typeof data === "object" ? data : {}

      const frontmatterEnd = match[0].length
      tree.children = tree.children.filter((node) => {
        const end = node.position?.end?.offset
        return typeof end !== "number" || end > frontmatterEnd
      })
    }

    cleanPrimaryHeading(tree)

    frontmatter.title = cleanDisplayTitle(frontmatter.title)

    if (!frontmatter.title) {
      frontmatter.title = fallbackTitle(tree, file)
    }

    file.data.frontmatter = frontmatter
    file.data.matter = frontmatter
  }
}

export const Frontmatter = () => ({
  name: "Frontmatter",
  markdownPlugins() {
    return [remarkFrontmatter]
  },
})

export default Frontmatter
