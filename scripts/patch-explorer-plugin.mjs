import { promises as fs } from "node:fs"

// 탐색기는 slug·title·filePath 만 쓰는데, 원래는 검색용 본문까지 든 contentIndex.json(4MB)을
// 다 받아야 그려진다. explorer-dates-index 가 내보내는 가벼운 explorerIndex.json 을 먼저 읽고,
// 그 파일을 못 받으면 원래대로 contentIndex.json(fetchData)으로 돌아간다.
// 한 페이지 안의 SPA 이동은 window.__explorerIndex 에 담아 둔 같은 요청을 다시 쓴다.
const marker = "explorerIndex.json"
const lightIndex =
  '(window.__explorerIndex??=fetch((document.body?.dataset?.basepath??"")+"/static/explorerIndex.json")' +
  ".then(r=>r.ok?r.json():fetchData).catch(()=>fetchData))"

const targets = [
  {
    file: ".quartz/plugins/explorer/src/components/scripts/explorer.inline.ts",
    from: /const data = await fetchData;/,
    to: `const data = await ${lightIndex};`,
  },
  {
    file: ".quartz/plugins/explorer/dist/index.js",
    from: /let ([A-Za-z_$][\w$]*)=await fetchData;/,
    to: `let $1=await${lightIndex};`,
  },
  {
    file: ".quartz/plugins/explorer/dist/components/index.js",
    from: /let ([A-Za-z_$][\w$]*)=await fetchData;/,
    to: `let $1=await${lightIndex};`,
  },
]

let patched = 0
const missing = []
for (const { file, from, to } of targets) {
  const text = await fs.readFile(file, "utf8")
  if (text.includes(marker)) continue
  if (!from.test(text)) {
    missing.push(file)
    continue
  }
  await fs.writeFile(file, text.replace(from, to), "utf8")
  patched += 1
}

// 플러그인이 갱신돼 패턴이 바뀌면 탐색기가 다시 4MB 를 기다리게 된다. 조용히 넘어가지 않고 빌드를 멈춘다.
if (missing.length > 0) {
  console.error(`explorer plugin patch target not found in:\n  ${missing.join("\n  ")}`)
  process.exit(1)
}

console.log(
  `patched explorer plugin: ${patched} file(s), ${targets.length - patched} already patched`,
)
