import { promises as fs } from "node:fs"

const sourceFile = ".quartz/plugins/search/src/components/scripts/search.inline.ts"
const distFiles = [
  ".quartz/plugins/search/dist/index.js",
  ".quartz/plugins/search/dist/components/index.js",
]

async function patchFile(file, replacements) {
  let text = await fs.readFile(file, "utf8")
  const original = text

  for (const [from, to] of replacements) {
    text = text.replace(from, to)
  }

  if (text !== original) {
    await fs.writeFile(file, text, "utf8")
  }

  return text !== original
}

const sourceChanged = await patchFile(sourceFile, [
  [/^[ \t]*\(code >= 0xac00 && code <= 0xd7af\) \|\|\r?\n/m, ""],
])

let distChanged = 0
for (const file of distFiles) {
  const changed = await patchFile(file, [
    [/\|\|[A-Za-z_$][\w$]*>=44032&&[A-Za-z_$][\w$]*<=55215/g, ""],
  ])
  if (changed) {
    distChanged += 1
  }
}

console.log(`patched search plugin: source=${sourceChanged}, dist=${distChanged}`)

// 검색은 원래 contentIndex.json(1.3MB)을 받아 색인을 다 만든 뒤에야 버튼 클릭·Cmd+K 처리기를 붙인다.
// 그 사이 몇 초 동안 검색 버튼이 안 눌린다. 처리기를 먼저 붙이고 색인은 뒤에서 만들며,
// 색인이 아직이면 입력한 검색어는 색인이 끝날 때까지 기다렸다가 결과를 낸다.
// 여러 번 이동해도 색인은 한 번만 만들도록 진행 중인 Promise 를 같이 쓴다.
const readyMarker = "searchIndexReady"
const readySourceTargets = [
  [
    /async function initIndex\(\) \{\n  if \(indexInitialized\) return;\n  contentData = await fetchContentIndex\(\);\n  await fillDocument\(\);\n  indexInitialized = true;\n\}/,
    [
      "let searchIndexReady: Promise<void> | null = null;",
      "",
      "function initIndex(): Promise<void> {",
      "  searchIndexReady ??= (async () => {",
      "    contentData = await fetchContentIndex();",
      "    await fillDocument();",
      "    indexInitialized = true;",
      "  })().catch((err) => {",
      "    searchIndexReady = null;",
      "    throw err;",
      "  });",
      "  return searchIndexReady;",
      "}",
    ].join("\n"),
  ],
  [
    /  runCleanups\(\);\n  await initIndex\(\);\n  await setupSearch\(\);\n  scrollToSearchTerm\(\);/,
    "  runCleanups();\n  await setupSearch();\n  scrollToSearchTerm();\n  initIndex().catch(console.error);",
  ],
  [/(\n[ \t]*)let searchResults: any\[\];/, "$1await initIndex();$1let searchResults: any[];"],
]

const missingReady = []
let readyPatched = 0

async function patchReady(file, targets) {
  const text = await fs.readFile(file, "utf8")
  if (text.includes(readyMarker)) return
  let next = text
  for (const [from, to] of targets) {
    if (!from.test(next)) {
      missingReady.push(`${file}: ${from}`)
      return
    }
    next = next.replace(from, to)
  }
  await fs.writeFile(file, next, "utf8")
  readyPatched += 1
}

await patchReady(sourceFile, readySourceTargets)

const initDist =
  /async function ([A-Za-z_$][\w$]*)\(\)\{([A-Za-z_$][\w$]*)\|\|\(([A-Za-z_$][\w$]*)=await ([A-Za-z_$][\w$]*)\(\),await ([A-Za-z_$][\w$]*)\(\),\2=!0\)\}/
for (const file of distFiles) {
  const text = await fs.readFile(file, "utf8")
  const init = text.match(initDist)?.[1]
  // 압축된 이름에 $ 가 들어갈 수 있다(예: $t). 정규식과 치환 문자열에서 글자 그대로 쓰이게 한다.
  const initRe = init?.replace(/\$/g, "\\$")
  const initOut = init?.replace(/\$/g, "$$$$")
  if (!init && !text.includes(readyMarker)) {
    missingReady.push(`${file}: ${initDist}`)
    continue
  }
  await patchReady(file, [
    [
      initDist,
      "var searchIndexReady=null;function $1(){return searchIndexReady??=(async()=>{$3=await $4(),await $5(),$2=!0})().catch(e=>{throw searchIndexReady=null,e})}",
    ],
    [
      new RegExp(
        `async function ([A-Za-z_$][\\w$]*)\\(\\)\\{([A-Za-z_$][\\w$]*)\\(\\),await ${initRe}\\(\\),await ([A-Za-z_$][\\w$]*)\\(\\),([A-Za-z_$][\\w$]*)\\(\\)\\}`,
      ),
      `async function $1(){$2(),await $3(),$4(),${initOut}().catch(console.error)}`,
    ],
    [
      /(\.classList\.toggle\("display-results",[A-Za-z_$][\w$]*\),[^;]*;return\})let ([A-Za-z_$][\w$]*);/,
      `$1await ${initOut}();let $2;`,
    ],
  ])
}

// 플러그인이 갱신돼 패턴이 바뀌면 검색 버튼이 다시 몇 초씩 안 눌린다. 조용히 넘어가지 않고 빌드를 멈춘다.
if (missingReady.length > 0) {
  console.error(`search ready patch target not found:\n  ${missingReady.join("\n  ")}`)
  process.exit(1)
}

console.log(`patched search ready-before-index: ${readyPatched} file(s)`)
