import { promises as fs } from "node:fs"

const searchScriptSource = ".quartz/plugins/search/src/components/scripts/search.inline.ts"
const searchScriptDistFiles = [
  ".quartz/plugins/search/dist/index.js",
  ".quartz/plugins/search/dist/components/index.js",
]
const searchComponentSource = ".quartz/plugins/search/src/components/Search.tsx"
const searchComponentDistFiles = [
  ".quartz/plugins/search/dist/index.js",
  ".quartz/plugins/search/dist/components/index.js",
]
const contentIndexSource = ".quartz/plugins/content-index/src/emitter.ts"
const contentIndexDistFile = ".quartz/plugins/content-index/dist/index.js"

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

const tokenizerSourceChanged = await patchFile(searchScriptSource, [
  [/^[ \t]*\(code >= 0xac00 && code <= 0xd7af\) \|\|\r?\n/m, ""],
])

let tokenizerDistChanged = 0
for (const file of searchScriptDistFiles) {
  const changed = await patchFile(file, [
    [/\|\|[A-Za-z_$][\w$]*>=44032&&[A-Za-z_$][\w$]*<=55215/g, ""],
  ])
  if (changed) {
    tokenizerDistChanged += 1
  }
}

const searchIndexSourceChanged = await patchFile(searchScriptSource, [
  [
    /    tag: "tags",\r?\n    index: \[\r?\n      \{ field: "title", tokenize: "forward" \},\r?\n      \{ field: "content", tokenize: "forward" \},\r?\n      \{ field: "tags", tokenize: "forward" \},\r?\n    \],/m,
    `    index: [
      { field: "title", tokenize: "forward" },
      { field: "content", tokenize: "forward" },
    ],`,
  ],
  [
    /    const fieldPriority: string\[\] = fieldPriorityAttr\r?\n      \? JSON\.parse\(fieldPriorityAttr\)\r?\n      : \["title", "content", "tags"\];/m,
    `    const fieldPriority: string[] = fieldPriorityAttr
      ? JSON.parse(fieldPriorityAttr)
      : ["title", "content"];`,
  ],
  [
    /      if \(!hasContent\) \{\r?\n        removeAllChildren\(results\);\r?\n        if \(preview\) removeAllChildren\(preview\);\r?\n        currentHover = null;\r?\n        return;\r?\n      \}\r?\n\r?\n      let searchResults: any\[\];/m,
    `      if (!hasContent) {
        removeAllChildren(results);
        if (preview) removeAllChildren(preview);
        currentHover = null;
        return;
      }

      await initIndex();

      let searchResults: any[];`,
  ],
  [
    /      \} else if \(parsed\.tags\.length > 0\) \{\r?\n        searchResults = await index\.searchAsync\(\{\r?\n          query: parsed\.tags\[0\],\r?\n          limit: 10000,\r?\n          index: \["tags"\],\r?\n        \}\);/m,
    `      } else if (parsed.tags.length > 0 && allTags.length > 0) {
        searchResults = await index.searchAsync({
          query: parsed.tags[0],
          limit: 10000,
          index: ["tags"],
        });`,
  ],
  [
    /async function fetchContentIndex\(\): Promise<Record<string, Item>> \{\r?\n  const data = await fetchData;\r?\n  return data as unknown as Record<string, Item>;\r?\n\}/m,
    `async function fetchContentIndex(): Promise<Record<string, Item>> {
  const data =
    typeof fetchSearchData === "function" ? await fetchSearchData() : await fetchData;
  return data as unknown as Record<string, Item>;
}`,
  ],
  [
    /let indexInitialized = false;\r?\n\r?\nasync function initIndex\(\) \{\r?\n  if \(indexInitialized\) return;\r?\n  contentData = await fetchContentIndex\(\);\r?\n  await fillDocument\(\);\r?\n  indexInitialized = true;\r?\n\}/m,
    `let indexInitialized = false;
let indexInitPromise: Promise<void> | null = null;

async function initIndex() {
  if (indexInitialized) return;
  if (indexInitPromise) return indexInitPromise;

  indexInitPromise = (async () => {
    contentData = await fetchContentIndex();
    await fillDocument();
    indexInitialized = true;
  })();

  try {
    await indexInitPromise;
  } finally {
    if (!indexInitialized) indexInitPromise = null;
  }
}`,
  ],
  [
    /      const base = \(await fetchData\) as unknown as Record<string, unknown>;/m,
    `      const base = (await (typeof fetchSearchData === "function"
        ? fetchSearchData()
        : fetchData)) as unknown as Record<string, unknown>;`,
  ],
  [
    /  await initIndex\(\);\r?\n  await setupSearch\(\);/m,
    `  await setupSearch();`,
  ],
])

let searchIndexDistChanged = 0
for (const file of searchScriptDistFiles) {
  const changed = await patchFile(file, [
    [
      /document:\{id:"id",tag:"tags",index:\[\{field:"title",tokenize:"forward"\},\{field:"content",tokenize:"forward"\},\{field:"tags",tokenize:"forward"\}\]\}/g,
      `document:{id:"id",index:[{field:"title",tokenize:"forward"},{field:"content",tokenize:"forward"}]}`,
    ],
    [
      /\?JSON\.parse\(([A-Za-z_$][\w$]*)\):\["title","content","tags"\]/g,
      `?JSON.parse($1):["title","content"]`,
    ],
    [
      /return\}let K;S\.query\?K=await le\.searchAsync/g,
      `return}await Ti();let K;S.query?K=await le.searchAsync`,
    ],
    [
      /:S\.tags\.length>0\?K=await le\.searchAsync\(\{query:S\.tags\[0\],limit:1e4,index:\["tags"\]\}\):K=\[\]/g,
      `:S.tags.length>0&&Pt.length>0?K=await le.searchAsync({query:S.tags[0],limit:1e4,index:["tags"]}):K=[]`,
    ],
    [
      /async function bi\(\)\{return await fetchData\}/g,
      `async function bi(){return typeof fetchSearchData=="function"?await fetchSearchData():await fetchData}`,
    ],
    [
      /var Rt=!1;async function Ti\(\)\{Rt\|\|\(Z=await bi\(\),await ki\(\),Rt=!0\)\}/g,
      `var Rt=!1,__searchInitPromise=null;async function Ti(){if(Rt)return;if(__searchInitPromise)return __searchInitPromise;__searchInitPromise=(async()=>{Z=await bi(),await ki(),Rt=!0})();try{await __searchInitPromise}finally{Rt||(__searchInitPromise=null)}}`,
    ],
    [
      /let r=await fetchData;if\(!r\|\|typeof r!="object"\)return;/g,
      `let r=typeof fetchSearchData=="function"?await fetchSearchData():await fetchData;if(!r||typeof r!="object")return;`,
    ],
    [
      /async function Mn\(\)\{Ai\(\),await Ti\(\),await wi\(\),Li\(\)\}/g,
      `async function Mn(){Ai(),await wi(),Li()}`,
    ],
  ])
  if (changed) {
    searchIndexDistChanged += 1
  }
}

const searchComponentSourceChanged = await patchFile(searchComponentSource, [
  [/export type SearchField = "title" \| "content" \| "tags";/, `export type SearchField = "title" | "content";`],
  [/fieldPriority: \["title", "content", "tags"\],/, `fieldPriority: ["title", "content"],`],
])

let searchComponentDistChanged = 0
for (const file of searchComponentDistFiles) {
  const changed = await patchFile(file, [
    [/fieldPriority:\s*\["title",\s*"content",\s*"tags"\]/g, `fieldPriority:["title","content"]`],
  ])
  if (changed) {
    searchComponentDistChanged += 1
  }
}

const contentIndexSourceChanged = await patchFile(contentIndexSource, [
  [
    /    const fp = joinSegments\("static", "contentIndex"\) as unknown as FullSlug;\r?\n    const simplifiedIndex = Object\.fromEntries\(\r?\n      Array\.from\(linkIndex\)\.map\(\(\[slug, content\]\) => \{\r?\n        delete content\.description;\r?\n        delete content\.date;\r?\n        return \[slug, content\];\r?\n      \}\),\r?\n    \);\r?\n\r?\n    outputs\.push\(\r?\n      await write\(\{\r?\n        ctx,\r?\n        content: JSON\.stringify\(simplifiedIndex\),\r?\n        slug: fp,\r?\n        ext: "\.json",\r?\n      \}\),\r?\n    \);/m,
    `    const fp = joinSegments("static", "contentIndex") as unknown as FullSlug;
    const searchFp = joinSegments("static", "searchIndex") as unknown as FullSlug;
    const navigationIndex = Object.fromEntries(
      Array.from(linkIndex).map(([slug, content]) => [
        slug,
        {
          slug: content.slug,
          title: content.title,
        },
      ]),
    );
    const searchIndex = Object.fromEntries(
      Array.from(linkIndex).map(([slug, content]) => [
        slug,
        {
          slug: content.slug,
          title: content.title,
          content: content.content,
        },
      ]),
    );

    outputs.push(
      await write({
        ctx,
        content: JSON.stringify(navigationIndex),
        slug: fp,
        ext: ".json",
      }),
    );
    outputs.push(
      await write({
        ctx,
        content: JSON.stringify(searchIndex),
        slug: searchFp,
        ext: ".json",
      }),
    );`,
  ],
])

const contentIndexDistChanged = await patchFile(contentIndexDistFile, [
  [
    /    const fp = joinSegments\("static", "contentIndex"\);\r?\n    const simplifiedIndex = Object\.fromEntries\(\r?\n      Array\.from\(linkIndex\)\.map\(\(\[slug2, content2\]\) => \{\r?\n        delete content2\.description;\r?\n        delete content2\.date;\r?\n        return \[slug2, content2\];\r?\n      \}\)\r?\n    \);\r?\n    outputs\.push\(\r?\n      await write\(\{\r?\n        ctx,\r?\n        content: JSON\.stringify\(simplifiedIndex\),\r?\n        slug: fp,\r?\n        ext: "\.json"\r?\n      \}\)\r?\n    \);/m,
    `    const fp = joinSegments("static", "contentIndex");
    const searchFp = joinSegments("static", "searchIndex");
    const navigationIndex = Object.fromEntries(
      Array.from(linkIndex).map(([slug2, content2]) => [
        slug2,
        {
          slug: content2.slug,
          title: content2.title
        }
      ])
    );
    const searchIndex = Object.fromEntries(
      Array.from(linkIndex).map(([slug2, content2]) => [
        slug2,
        {
          slug: content2.slug,
          title: content2.title,
          content: content2.content
        }
      ])
    );
    outputs.push(
      await write({
        ctx,
        content: JSON.stringify(navigationIndex),
        slug: fp,
        ext: ".json"
      })
    );
    outputs.push(
      await write({
        ctx,
        content: JSON.stringify(searchIndex),
        slug: searchFp,
        ext: ".json"
      })
    );`,
  ],
])

console.log(
  [
    `patched search tokenizer: source=${tokenizerSourceChanged}, dist=${tokenizerDistChanged}`,
    `patched search index lazy loading: source=${searchIndexSourceChanged}, dist=${searchIndexDistChanged}`,
    `patched search component defaults: source=${searchComponentSourceChanged}, dist=${searchComponentDistChanged}`,
    `patched split content/search index payloads: source=${contentIndexSourceChanged}, dist=${contentIndexDistChanged}`,
  ].join("\n"),
)
