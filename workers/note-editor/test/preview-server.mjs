// Local UI fixture only. Never imported by the Worker and never deployed.
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { resolve, extname } from "node:path"
const root = resolve("dist")
let note =
  '---\ntitle: "분류 모델의 학습과 평가"\ntags: [metrics]\n---\n\n# A) 확률에서 판정으로\n\n[[cross-entropy|Cross-entropy]]는 정답에 부여한 확률을 평가한다.\n\n$$\nL = -\\log p(y\\mid x)\n$$\n\n| 지표 | 질문 |\n| --- | --- |\n| Precision | 양성 판정 중 정답은? |\n| Recall | 실제 양성을 얼마나 찾았나? |\n\n<img src="x" onerror="window.__xss=1"><script>window.__xss=1</script>\n'
let sha = "initial",
  siteSha = "site",
  checks = 0
createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8790")
  if (url.pathname.startsWith("/api/")) {
    let body = ""
    for await (const chunk of req) body += chunk
    const data = body ? JSON.parse(body) : {}
    let result = {}
    if (url.pathname === "/api/session") result = { csrf: "fixture" }
    if (url.pathname === "/api/note") result = { text: note, sha, siteSha, siteDiffers: true }
    if (url.pathname === "/api/save") {
      note = data.text
      sha = "saved"
      result = { sha }
    }
    if (url.pathname === "/api/publish") result = { ticket: "fixture" }
    if (url.pathname === "/api/finish-publish")
      result =
        ++checks > 1 ? { status: "deploying", commit: "a".repeat(40) } : { status: "validating" }
    if (url.pathname === "/api/deployment") {
      siteSha = "published"
      result = { status: "deployed" }
    }
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(result))
    return
  }
  const file = resolve(root, "." + (url.pathname === "/" ? "/index.html" : url.pathname))
  if (!file.startsWith(root + "\\") && !file.startsWith(root + "/")) {
    res.writeHead(404)
    res.end()
    return
  }
  try {
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript",
        ".css": "text/css",
        ".woff2": "font/woff2",
      }[extname(file)] || "application/octet-stream",
    )
    res.end(await readFile(file))
  } catch {
    res.writeHead(404)
    res.end()
  }
}).listen(8790, "127.0.0.1", () =>
  console.log("Local fixture: http://127.0.0.1:8790/?path=machine_learning/metrics/demo.md"),
)
