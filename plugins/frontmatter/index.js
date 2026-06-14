import YAML from "yaml"

export const manifest = {
  name: "frontmatter",
  displayName: "Frontmatter",
  description: "Parse YAML frontmatter and remove it from rendered Markdown.",
  version: "1.0.0",
  category: "transformer",
  defaultOrder: 1,
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

function remarkFrontmatter() {
  return (tree, file) => {
    const source = String(file.value ?? "")
    const match = source.match(FRONTMATTER_RE)

    if (!match) {
      return
    }

    const raw = match[1].trim()
    const data = raw ? YAML.parse(raw) : {}
    file.data.frontmatter = data && typeof data === "object" ? data : {}
    file.data.matter = file.data.frontmatter

    const frontmatterEnd = match[0].length
    tree.children = tree.children.filter((node) => {
      const end = node.position?.end?.offset
      return typeof end !== "number" || end > frontmatterEnd
    })
  }
}

export const Frontmatter = () => ({
  name: "Frontmatter",
  markdownPlugins() {
    return [remarkFrontmatter]
  },
})

export default Frontmatter
