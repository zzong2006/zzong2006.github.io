import fs from "node:fs"
import path from "node:path"
import { h } from "preact"
import { exercisesForNote } from "../matching.js"

export const PracticeLinks = () => {
  // Read the same canonical data as the runner; missing data must fail the build.
  const problems = JSON.parse(fs.readFileSync(path.join(process.cwd(), "apps/practice/problems.json"), "utf8"))
  const Component = ({ fileData, displayClass }) => {
    const matches = exercisesForNote(problems, fileData.slug)
    if (matches.length === 0 || fileData.unlisted || fileData.frontmatter?.private || fileData.frontmatter?.draft) return null
    return h("aside", {class: ["ml-practice-links", displayClass].filter(Boolean).join(" "), "aria-label": "이 노트의 Python 실습"},
      h("div", {class: "ml-practice-links__heading"},
        h("strong", null, "읽은 내용을 코드로 확인해 보세요"),
        h("a", {href: "/practice/", "data-router-ignore": true}, `전체 ${problems.length}문제 ↗`)),
      h("p", null, `이 노트와 연결된 ${matches.length}개 실습 · 브라우저에서 Python으로 풀고 바로 채점받을 수 있어요.`),
      h("div", {class:"ml-practice-links__buttons"}, matches.map(p=>h("a", {
        href: `/practice/#${p.id}`, "data-router-ignore": true, title: p.title,
      }, `${p.short} 풀기 →`))))
  }
  Component.css = `
  .ml-practice-links{border:1px solid var(--lightgray);border-left:3px solid var(--secondary);border-radius:8px;padding:1rem 1.1rem;margin:1.2rem 0;background:var(--highlight)}
  .ml-practice-links__heading{display:flex;justify-content:space-between;align-items:baseline;gap:.75rem;flex-wrap:wrap}
  .ml-practice-links__heading strong{color:var(--dark);font-size:1rem}
  .ml-practice-links__heading a{font-size:.85rem;white-space:nowrap}
  .ml-practice-links p{font-size:.9rem;color:var(--darkgray);line-height:1.6;margin:.5rem 0 .8rem}
  .ml-practice-links__buttons{display:flex;flex-wrap:wrap;gap:.5rem}
  .ml-practice-links__buttons a{display:inline-block;border:1px solid var(--secondary);border-radius:6px;padding:.4rem .7rem;color:var(--secondary);font-size:.9rem;font-weight:600;text-decoration:none}
  .ml-practice-links__buttons a:hover{background:var(--lightgray)}
  .ml-practice-links a:focus-visible{outline:2px solid var(--secondary);outline-offset:3px}
  `
  return Component
}
export default PracticeLinks
