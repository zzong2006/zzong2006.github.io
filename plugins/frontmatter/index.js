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

// vault 는 "# A) 개요", "## B.1) 일반 공식" 처럼 섹션 번호를 붙여 작성한다(AGENTS.md).
// 저자에게는 구조 표시지만 독자에게는 의미가 없으므로 발행 시 모든 헤딩에서 떼어낸다.
function cleanHeadings(tree) {
  for (const node of tree.children) {
    if (node.type !== "heading" || !Array.isArray(node.children)) {
      continue
    }

    const originalTitle = textFromNode(node).trim()
    const cleanedTitle = cleanDisplayTitle(originalTitle)

    if (cleanedTitle && cleanedTitle !== originalTitle) {
      node.children = [{ type: "text", value: cleanedTitle }]
    }
  }
}

// 첫 헤딩이 제목과 같으면 Quartz 가 제목을 이미 크게 보여주므로 중복이다.
function dropHeadingDuplicatingTitle(tree, title) {
  if (!title) {
    return
  }

  const index = tree.children.findIndex((node) => node.type === "heading")
  if (index === -1) {
    return
  }

  const heading = tree.children[index]
  if (heading.depth > 2) {
    return
  }

  if (cleanDisplayTitle(textFromNode(heading)).toLowerCase() === cleanDisplayTitle(title).toLowerCase()) {
    tree.children.splice(index, 1)
  }
}

// "# References" 처럼 자리표시자만 남아 내용이 없는 섹션은 발행하지 않는다.
// 하위 헤딩이 내용을 가진 부모 헤딩은 남긴다. 안쪽부터 비워지므로 안정될 때까지 반복한다.
function dropEmptySections(tree) {
  let changed = true

  while (changed) {
    changed = false

    for (let index = tree.children.length - 1; index >= 0; index -= 1) {
      const node = tree.children[index]
      if (node.type !== "heading") {
        continue
      }

      const next = tree.children[index + 1]
      const isEmpty = !next || (next.type === "heading" && next.depth <= node.depth)

      if (isEmpty) {
        tree.children.splice(index, 1)
        changed = true
      }
    }
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

    cleanHeadings(tree)

    frontmatter.title = cleanDisplayTitle(frontmatter.title)

    if (!frontmatter.title) {
      frontmatter.title = fallbackTitle(tree, file)
    }

    // 제목이 확정된 뒤에 정리해야 fallbackTitle 이 첫 헤딩을 쓸 수 있다.
    dropHeadingDuplicatingTitle(tree, frontmatter.title)
    dropEmptySections(tree)

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
