import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize, resolve } from "node:path"

const root = resolve("public")
const port = Number.parseInt(process.env.PORT ?? "8080", 10)

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
}

function resolveFile(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "")
  const candidate = resolve(root, normalize(cleanPath))

  if (!candidate.startsWith(root)) {
    return null
  }

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate
  }

  const htmlCandidate = `${candidate}.html`
  if (existsSync(htmlCandidate) && statSync(htmlCandidate).isFile()) {
    return htmlCandidate
  }

  const indexCandidate = join(candidate, "index.html")
  if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
    return indexCandidate
  }

  return join(root, "404.html")
}

createServer((request, response) => {
  const file = resolveFile(request.url ?? "/")

  if (!file || !existsSync(file)) {
    response.writeHead(404)
    response.end("Not found")
    return
  }

  response.writeHead(file.endsWith("404.html") ? 404 : 200, {
    "Content-Type": mime[extname(file)] ?? "application/octet-stream",
  })
  createReadStream(file).pipe(response)
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`)
})
