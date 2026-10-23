// 관련 노트 요약문. scripts/build-related-notes.mjs 가 노트 원문으로 만들어 캐시에 넣고,
// components/index.js 가 그린다.
//
// 요약문은 문자열이 아니라 조각 배열이다. 짝수 칸은 글, 홀수 칸은 인라인 수식의 TeX 원문이다.
// ["For ", "\\boldsymbol{A}", " the matrix ..."] 처럼 된다. 수식을 지우면 "For the matrix with
// is called the transpose of ." 처럼 문장이 깨지고, 글자로 풀면 LaTeX 원문이 그대로 보인다.
// 그래서 수식은 따로 들고 다니다가 화면에서 KaTeX 로 그린다. "$" 로 다시 감싸지 않는 것은
// 본문의 "$5" 같은 글자와 섞여 짝이 어긋나지 않게 하려는 것이다.

// $$...$$ 는 블록 수식이라 요약문에서 뺀다. 여기서는 한 줄 안의 $...$ 만 잡는다.
const INLINE_MATH = /(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g

// 수식이 아닌 부분만 다듬는다. 앞뒤 공백은 남겨서 수식과 단어가 붙지 않게 한다.
function cleanProse(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/!\[\[[^\]]*\]\]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias ?? target)
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~>#]+/g, " ")
    .replace(/-{2,}/g, " ")
    .replace(/\s+/g, " ")
}

export function snippetParts(text) {
  const parts = [""]
  let last = 0
  for (const match of String(text ?? "").matchAll(INLINE_MATH)) {
    const tex = match[1].trim()
    parts[parts.length - 1] += cleanProse(text.slice(last, match.index))
    if (tex) parts.push(tex, "")
    last = match.index + match[0].length
  }
  parts[parts.length - 1] += cleanProse(String(text ?? "").slice(last))

  parts[0] = parts[0].replace(/^\s+/, "")
  parts[parts.length - 1] = parts[parts.length - 1].replace(/\s+$/, "")
  return parts
}

// 수식은 TeX 원문이 그려진 모양보다 훨씬 길다(\boldsymbol{A} 는 화면에서 한 글자).
// 길이를 잴 때는 원문 길이의 절반으로 친다.
function mathWeight(tex) {
  return Math.max(1, Math.ceil(tex.length / 2))
}

export function snippetLength(parts) {
  return parts.reduce((sum, part, index) => sum + (index % 2 ? mathWeight(part) : part.length), 0)
}

export function snippetPlainText(parts) {
  return parts.join("")
}

// limit 안에 들어오도록 자른다. 수식 중간에서는 자르지 않는다. 글은 단어 경계에서 자른다.
export function clipParts(parts, limit) {
  if (snippetLength(parts) <= limit) return parts

  const budget = Math.max(0, limit - 3)
  const out = []
  let used = 0
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]
    const isMath = index % 2 === 1
    const weight = isMath ? mathWeight(part) : part.length

    if (used + weight <= budget) {
      out.push(part)
      used += weight
      continue
    }
    if (!isMath) {
      const room = part.slice(0, budget - used)
      const space = room.lastIndexOf(" ")
      out.push(space > 0 ? room.slice(0, space) : room)
    }
    break
  }

  // 수식에서 멈췄으면 마지막 칸이 수식이다. 배열은 항상 글로 끝나야 하므로 빈 글을 붙인다.
  if (out.length % 2 === 0) out.push("")
  out[out.length - 1] = out[out.length - 1].replace(/\s+$/, "") + "..."
  return out
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

export function snippetFromMarkdown(body, frontmatter, limit) {
  const summary = frontmatter?.description ?? frontmatter?.summary
  const summaryParts = snippetParts(summary)
  if (snippetPlainText(summaryParts)) return clipParts(summaryParts, limit)

  const parts =
    snippetBlocks(body)
      .map(snippetParts)
      .filter((block) => snippetLength(block) >= 16)
      .find((block) => !/^references?$/i.test(snippetPlainText(block))) ?? [""]

  return clipParts(parts, limit)
}
