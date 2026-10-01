import { parse } from "yaml"

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const MAX_NOTE = 256 * 1024
const WORKFLOW = "web-note-publish-check.yml"
class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
const fail = (status, message) => {
  throw new HttpError(status, message)
}
const b64 = (bytes) => btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""))
const unb64 = (value) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0))
const url64 = (bytes) => b64(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
const from64 = (value) => unb64(value.replaceAll("-", "+").replaceAll("_", "/"))
const random = () => url64(crypto.getRandomValues(new Uint8Array(32)))
const seconds = () => Math.floor(Date.now() / 1000)
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
const fileURL = (repo, path, ref = "main") =>
  `/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(ref)}`
const cookie = (name, value, age) =>
  `__Host-${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${age}`
const getCookie = (req, name) =>
  (req.headers.get("Cookie") || "")
    .split("; ")
    .find((x) => x.startsWith(`__Host-${name}=`))
    ?.split("=")
    .slice(1)
    .join("=")

export function notePath(value) {
  if (
    typeof value !== "string" ||
    value.length > 600 ||
    !value.endsWith(".md") ||
    !value.includes("/") ||
    /[\\%\x00-\x1f\x7f]/.test(value)
  )
    fail(400, "노트 경로가 올바르지 않습니다.")
  if (
    value
      .split("/")
      .some((x) => !x || x.startsWith(".") || ["private", "node_modules", "_publish"].includes(x))
  )
    fail(403, "편집할 수 없는 경로입니다.")
  return value
}
export function validateNote(text) {
  if (typeof text !== "string" || encoder.encode(text).length > MAX_NOTE || text.includes("\0"))
    fail(400, "노트는 UTF-8 기준 256 KiB 이하여야 합니다.")
  const match = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) fail(400, "title이 포함된 YAML frontmatter가 필요합니다.")
  let meta
  try {
    meta = parse(match[1], { maxAliasCount: 20, uniqueKeys: true })
  } catch {
    fail(400, "YAML frontmatter를 확인하세요.")
  }
  if (!meta || typeof meta.title !== "string" || !meta.title.trim())
    fail(400, "title을 비워둘 수 없습니다.")
  if (meta.draft || meta.publish === false)
    fail(400, "첫 버전에서는 공개 노트를 비공개로 전환할 수 없습니다.")
  return text
}
async function key(secret) {
  if (!secret || secret.length < 43) fail(503, "서버 세션 키 설정이 필요합니다.")
  return crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", encoder.encode(secret)),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  )
}
export async function seal(data, secret, purpose) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(purpose) },
    await key(secret),
    encoder.encode(JSON.stringify(data)),
  )
  return `${url64(iv)}.${url64(new Uint8Array(encrypted))}`
}
export async function unseal(value, secret, purpose) {
  try {
    const [iv, encrypted] = (value || "").split(".")
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: from64(iv), additionalData: encoder.encode(purpose) },
      await key(secret),
      from64(encrypted),
    )
    const data = JSON.parse(decoder.decode(plain))
    if (!Number.isFinite(data.exp) || data.exp <= seconds()) throw Error()
    return data
  } catch {
    fail(401, "로그인 또는 발행 요청이 만료되었습니다. 다시 시도하세요.")
  }
}
async function github(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "zzong-note-editor",
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    if (response.status === 401) fail(401, "GitHub 로그인이 만료되었습니다.")
    if ([409, 422].includes(response.status))
      fail(409, "다른 수정이 먼저 저장됐습니다. 원본을 다시 불러와 비교하세요.")
    if (response.status === 404)
      fail(404, "파일·워크플로가 없거나 GitHub App 접근 권한이 없습니다.")
    fail(502, `GitHub 요청 실패 (${response.status}). 권한과 사용 한도를 확인하세요.`)
  }
  return response.status === 204 ? {} : response.json()
}
async function file(token, repo, path, ref) {
  const result = await github(token, fileURL(repo, path, ref))
  if (result.type !== "file" || result.encoding !== "base64" || result.size > MAX_NOTE)
    fail(400, "지원하지 않는 파일 형식 또는 크기입니다.")
  return { ...result, text: decoder.decode(unb64(result.content.replace(/\s/g, ""))) }
}
async function allowed(token, env, path) {
  notePath(path)
  const config = JSON.parse((await file(token, env.VAULT_REPO, "publish.config.json")).text)
  if (!config.include_roots.includes(path.split("/")[0])) fail(403, "공개 대상 폴더가 아닙니다.")
  // Existing public counterparts only: never expose a private/new note through a guessed URL.
  return file(token, env.SITE_REPO, `content/${path}`)
}
async function body(req) {
  if (!req.headers.get("Content-Type")?.startsWith("application/json"))
    fail(415, "JSON 요청만 허용됩니다.")
  if (Number(req.headers.get("Content-Length")) > MAX_NOTE * 2) fail(413, "요청이 너무 큽니다.")
  const raw = await req.text()
  if (encoder.encode(raw).length > MAX_NOTE * 2) fail(413, "요청이 너무 큽니다.")
  try {
    return JSON.parse(raw)
  } catch {
    fail(400, "JSON 요청을 확인하세요.")
  }
}
async function route(req, env) {
  const url = new URL(req.url)
  if (
    (req.method === "GET" && ["/", "/app.js", "/style.css"].includes(url.pathname)) ||
    (req.method === "GET" && url.pathname.startsWith("/fonts/"))
  ) {
    return env.ASSETS.fetch(req)
  }
  if (
    !env.APP_ORIGIN ||
    url.origin !== env.APP_ORIGIN ||
    !env.GITHUB_CLIENT_ID ||
    !env.GITHUB_CLIENT_SECRET
  )
    fail(503, "GitHub 로그인 연결을 아직 설정하지 않았습니다.")
  if (req.method === "GET" && url.pathname === "/login") {
    const path = notePath(url.searchParams.get("path"))
    const state = random(),
      verifier = random()
    const auth = new URL("https://github.com/login/oauth/authorize")
    auth.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${env.APP_ORIGIN}/callback`,
      state,
      code_challenge: url64(
        new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(verifier))),
      ),
      code_challenge_method: "S256",
      allow_signup: "false",
    }).toString()
    return new Response(null, {
      status: 302,
      headers: {
        Location: auth.href,
        "Set-Cookie": cookie(
          "oauth",
          await seal({ state, verifier, path, exp: seconds() + 600 }, env.SESSION_SECRET, "oauth"),
          600,
        ),
      },
    })
  }
  if (req.method === "GET" && url.pathname === "/callback") {
    const auth = await unseal(getCookie(req, "oauth"), env.SESSION_SECRET, "oauth")
    if (!url.searchParams.get("code") || url.searchParams.get("state") !== auth.state)
      fail(403, "로그인 요청이 일치하지 않습니다.")
    const exchange = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: url.searchParams.get("code"),
        code_verifier: auth.verifier,
        redirect_uri: `${env.APP_ORIGIN}/callback`,
      }),
    })
    const token = await exchange.json()
    if (!exchange.ok || !token.access_token) fail(401, "GitHub 인증에 실패했습니다.")
    const user = await github(token.access_token, "/user")
    if (String(user.id) !== env.ALLOWED_USER_ID) fail(403, "소유자만 편집할 수 있습니다.")
    const age = Math.min(Number(token.expires_in) || 3600, 3600)
    const session = await seal(
      { token: token.access_token, id: user.id, csrf: random(), exp: seconds() + age },
      env.SESSION_SECRET,
      "session",
    )
    const headers = new Headers({ Location: `/?path=${encodeURIComponent(auth.path)}` })
    headers.append("Set-Cookie", cookie("session", session, age))
    headers.append("Set-Cookie", cookie("oauth", "", 0))
    return new Response(null, { status: 302, headers })
  }
  const session = await unseal(getCookie(req, "session"), env.SESSION_SECRET, "session")
  if (String(session.id) !== env.ALLOWED_USER_ID) fail(403, "접근할 수 없습니다.")
  if (
    req.method !== "GET" &&
    (req.headers.get("Origin") !== env.APP_ORIGIN ||
      req.headers.get("X-CSRF-Token") !== session.csrf)
  )
    fail(403, "다른 사이트에서 보낸 요청은 허용되지 않습니다.")
  const token = session.token
  if (req.method === "GET" && url.pathname === "/api/session") return json({ csrf: session.csrf })
  if (req.method === "POST" && url.pathname === "/api/logout")
    return new Response("{}", {
      headers: { "Set-Cookie": cookie("session", "", 0), "Content-Type": "application/json" },
    })
  if (req.method === "GET" && url.pathname === "/api/note") {
    const path = notePath(url.searchParams.get("path"))
    const site = await allowed(token, env, path)
    const source = await file(token, env.VAULT_REPO, path)
    return json({
      path,
      text: source.text,
      sha: source.sha,
      siteSha: site.sha,
      siteDiffers: source.text !== site.text,
    })
  }
  if (req.method === "POST" && url.pathname === "/api/save") {
    const data = await body(req),
      path = notePath(data.path)
    await allowed(token, env, path)
    validateNote(data.text)
    const current = await file(token, env.VAULT_REPO, path)
    if (!data.sha || current.sha !== data.sha)
      fail(409, "원본이 변경됐습니다. 작성 내용을 내려받은 뒤 원본을 다시 불러오세요.")
    const saved = await github(token, fileURL(env.VAULT_REPO, path), {
      method: "PUT",
      body: JSON.stringify({
        message: "Edit public note from web editor",
        sha: data.sha,
        content: b64(encoder.encode(data.text)),
        branch: "main",
      }),
    })
    return json({ sha: saved.content.sha, revision: saved.commit.sha })
  }
  if (req.method === "POST" && url.pathname === "/api/publish") {
    const data = await body(req),
      path = notePath(data.path)
    const site = await allowed(token, env, path)
    if (site.sha !== data.siteSha) fail(409, "공개 사본이 변경됐습니다. 먼저 원본과 비교하세요.")
    const head = await github(token, `/repos/${env.VAULT_REPO}/git/ref/heads/main`)
    const source = await file(token, env.VAULT_REPO, path, head.object.sha)
    if (source.sha !== data.sha) fail(409, "저장 이후 원본이 변경됐습니다. 다시 불러오세요.")
    validateNote(source.text)
    const id = crypto.randomUUID()
    const ticket = await seal(
      {
        path,
        sha: source.sha,
        siteSha: site.sha,
        revision: head.object.sha,
        id,
        user: session.id,
        exp: seconds() + 3600,
      },
      env.SESSION_SECRET,
      "publish",
    )
    await github(token, `/repos/${env.VAULT_REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
      method: "POST",
      body: JSON.stringify({
        ref: "main",
        inputs: { note_path: path, revision: head.object.sha, request_id: id },
      }),
    })
    return json({ ticket, status: "validating" })
  }
  if (req.method === "POST" && url.pathname === "/api/finish-publish") {
    const data = await body(req),
      ticket = await unseal(data.ticket, env.SESSION_SECRET, "publish")
    if (ticket.user !== session.id) fail(403, "발행 요청 소유자가 다릅니다.")
    const runs = await github(
      token,
      `/repos/${env.VAULT_REPO}/actions/workflows/${WORKFLOW}/runs?event=workflow_dispatch&branch=main&per_page=100`,
    )
    const run = runs.workflow_runs.find(
      (r) => r.display_title === `web-publish:${ticket.id}` && r.actor?.id === session.id,
    )
    if (!run || run.status !== "completed")
      return json({ status: "validating", url: run?.html_url })
    if (run.conclusion !== "success")
      return json({ status: "validation_failed", url: run.html_url })
    const site = await allowed(token, env, ticket.path)
    const source = await file(token, env.VAULT_REPO, ticket.path, ticket.revision)
    const current = await file(token, env.VAULT_REPO, ticket.path)
    if (source.sha !== ticket.sha || current.sha !== ticket.sha)
      fail(409, "검사 도중 원본이 변경됐습니다. 새 버전으로 다시 발행하세요.")
    validateNote(source.text)
    // Retrying after a lost response is safe; never overwrite a newer public edit.
    if (site.text === source.text)
      return json({ status: "already_synced", url: `${env.SITE_URL}/` })
    if (site.sha !== ticket.siteSha)
      fail(409, "검사 도중 공개 사본이 변경됐습니다. 다시 비교하세요.")
    const published = await github(token, fileURL(env.SITE_REPO, `content/${ticket.path}`), {
      method: "PUT",
      body: JSON.stringify({
        message: "Publish validated note from web editor",
        sha: site.sha,
        content: b64(encoder.encode(source.text)),
        branch: "main",
      }),
    })
    return json({
      status: "deploying",
      commit: published.commit.sha,
      url: `https://github.com/${env.SITE_REPO}/actions`,
    })
  }
  if (req.method === "GET" && url.pathname === "/api/deployment") {
    const commit = url.searchParams.get("commit")
    if (!/^[a-f0-9]{40}$/.test(commit || "")) fail(400, "잘못된 배포 버전입니다.")
    const runs = await github(
      token,
      `/repos/${env.SITE_REPO}/actions/workflows/deploy.yml/runs?head_sha=${commit}&event=push&per_page=10`,
    )
    const run = runs.workflow_runs[0]
    return json({
      status:
        !run || run.status !== "completed"
          ? "deploying"
          : run.conclusion === "success"
            ? "deployed"
            : "deployment_failed",
      url: run?.html_url,
    })
  }
  fail(404, "요청한 기능이 없습니다.")
}
export default {
  async fetch(req, env) {
    let response
    try {
      response = await route(req, env)
    } catch (error) {
      response = json(
        {
          error:
            error instanceof HttpError
              ? error.message
              : "처리에 실패했습니다. 설정과 네트워크를 확인하세요.",
        },
        error instanceof HttpError ? error.status : 500,
      )
    }
    response = new Response(response.body, response)
    response.headers.set("Cache-Control", "no-store")
    response.headers.set("Referrer-Policy", "no-referrer")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://zzong2006.github.io; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`,
    )
    return response
  },
}
