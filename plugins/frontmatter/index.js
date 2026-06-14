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
  return path.basename(filePath, extension).replace(/[-_]+/g, " ").trim()
}

function fallbackTitle(tree, file) {
  const heading =
    tree.children.find((node) => node.type === "heading" && node.depth === 1) ??
    tree.children.find((node) => node.type === "heading")
  const headingTitle = textFromNode(heading).trim()

  return headingTitle || titleFromPath(file)
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

    if (!frontmatter.title || String(frontmatter.title).trim() === "") {
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
