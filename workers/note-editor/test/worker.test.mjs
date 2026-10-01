import test from "node:test"
import assert from "node:assert/strict"
import worker, { notePath, validateNote, seal, unseal } from "../src/worker.mjs"

const secret = "a-test-key-with-more-than-forty-three-characters-not-for-production"
const env = {
  SESSION_SECRET: secret,
  APP_ORIGIN: "https://editor.example",
  GITHUB_CLIENT_ID: "test",
  GITHUB_CLIENT_SECRET: "test",
  ALLOWED_USER_ID: "12367773",
  VAULT_REPO: "owner/vault",
  SITE_REPO: "owner/site",
  SITE_URL: "https://zzong2006.github.io",
}
const path = "machine_learning/metrics/분류.md"
const text = '---\ntitle: "분류"\ntags: [metrics]\n---\n\n# A) 확률\n\n[[cross-entropy]]\n'
const encoded = (value) => Buffer.from(value).toString("base64")
const blob = (text, sha = "note-sha") => ({
  type: "file",
  encoding: "base64",
  size: Buffer.byteLength(text),
  content: encoded(text),
  sha,
})
const sessionData = {
  token: "fake",
  id: 12367773,
  csrf: "csrf",
  exp: Math.floor(Date.now() / 1000) + 3600,
}
async function request(route, body, headers = {}) {
  const session = await seal(sessionData, secret, "session")
  return worker.fetch(
    new Request(`${env.APP_ORIGIN}${route}`, {
      method: body ? "POST" : "GET",
      headers: {
        Cookie: `__Host-session=${session}`,
        Origin: env.APP_ORIGIN,
        "X-CSRF-Token": "csrf",
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
    env,
  )
}

test("path allowlist rejects traversal, private files, percent encoding and runtime files", () => {
  assert.equal(notePath(path), path)
  for (const bad of [
    "../private/a.md",
    "private/a.md",
    "machine_learning/../a.md",
    "/math/a.md",
    "math//a.md",
    "math/%2e%2e/a.md",
    "math/a\\b.md",
    "math/.hidden.md",
    "math/node_modules/a.md",
    "math/a.md\n",
    "math/a.js",
  ])
    assert.throws(() => notePath(bad), bad)
})
test("frontmatter validation preserves exact source, rejects missing title, duplicates and drafts", () => {
  assert.equal(validateNote(text), text)
  for (const bad of [
    "# Hello",
    "---\ntitle: ''\n---\n",
    "---\ntitle: A\ntitle: B\n---\n",
    "---\ntitle: A\ndraft: true\n---\n",
    "---\ntitle: A\npublish: false\n---\n",
    text + "x".repeat(262144),
  ])
    assert.throws(() => validateNote(bad))
})
test("encrypted tokens enforce purpose, integrity and expiry", async () => {
  const value = await seal(sessionData, secret, "session")
  assert.equal((await unseal(value, secret, "session")).csrf, "csrf")
  await assert.rejects(unseal(value, secret, "publish"))
  await assert.rejects(unseal(value + "a", secret, "session"))
  await assert.rejects(unseal(await seal({ exp: 1 }, secret, "session"), secret, "session"))
})
test("anonymous and cross-origin writes fail closed without GitHub requests", async () => {
  assert.equal((await worker.fetch(new Request(`${env.APP_ORIGIN}/api/session`), env)).status, 401)
  assert.equal(
    (await request("/api/save", { path }, { Origin: "https://evil.example" })).status,
    403,
  )
  assert.equal((await request("/api/save", { path }, { "X-CSRF-Token": "wrong" })).status, 403)
})
test("save uses expected blob SHA and never writes public repository", async (t) => {
  const calls = []
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push([String(url), options])
    if (String(url).includes("publish.config.json"))
      return Response.json(blob(JSON.stringify({ include_roots: ["machine_learning"] })))
    if (options.method === "PUT")
      return Response.json({ content: { sha: "new" }, commit: { sha: "revision" } })
    return Response.json(blob(text))
  })
  const result = await request("/api/save", { path, text, sha: "note-sha" })
  assert.equal(result.status, 200)
  assert.equal((await result.json()).sha, "new")
  const writes = calls.filter(([, o]) => o.method === "PUT")
  assert.equal(writes.length, 1)
  assert.match(writes[0][0], /owner\/vault/)
  assert.equal(JSON.parse(writes[0][1].body).sha, "note-sha")
  assert.equal(Buffer.from(JSON.parse(writes[0][1].body).content, "base64").toString(), text)
})
test("conflict prevents saving", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.notEqual(options.method, "PUT")
    return Response.json(
      blob(
        String(url).includes("publish.config.json")
          ? JSON.stringify({ include_roots: ["machine_learning"] })
          : text,
        "changed",
      ),
    )
  })
  assert.equal((await request("/api/save", { path, text, sha: "old" })).status, 409)
})
test("failed private validation never writes to public repository", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.notEqual(options.method, "PUT")
    assert.match(String(url), /owner\/vault\/actions/)
    return Response.json({
      workflow_runs: [
        {
          display_title: "web-publish:id",
          actor: { id: 12367773 },
          status: "completed",
          conclusion: "failure",
          html_url: "https://github.com/test/run",
        },
      ],
    })
  })
  const ticket = await seal(
    { id: "id", user: 12367773, exp: sessionData.exp, path, sha: "note-sha" },
    secret,
    "publish",
  )
  assert.equal(
    (await (await request("/api/finish-publish", { ticket })).json()).status,
    "validation_failed",
  )
})
test("publish requires passed validation plus unchanged source and public SHA", async (t) => {
  const writes = []
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const u = String(url)
    if (u.includes("/actions/"))
      return Response.json({
        workflow_runs: [
          {
            display_title: "web-publish:id",
            actor: { id: 12367773 },
            status: "completed",
            conclusion: "success",
          },
        ],
      })
    if (u.includes("publish.config.json"))
      return Response.json(blob(JSON.stringify({ include_roots: ["machine_learning"] })))
    if (options.method === "PUT") {
      writes.push(JSON.parse(options.body))
      return Response.json({ commit: { sha: "published" } })
    }
    return Response.json(u.includes("owner/site") ? blob(text + "old", "site-sha") : blob(text))
  })
  const ticket = await seal(
    {
      id: "id",
      user: 12367773,
      exp: sessionData.exp,
      path,
      sha: "note-sha",
      siteSha: "site-sha",
      revision: "a".repeat(40),
    },
    secret,
    "publish",
  )
  assert.equal(
    (await (await request("/api/finish-publish", { ticket })).json()).status,
    "deploying",
  )
  assert.equal(writes.length, 1)
  assert.equal(writes[0].sha, "site-sha")
})
test("no cache and restrictive content policy on errors", async () => {
  const result = await request("/nope")
  assert.equal(result.headers.get("Cache-Control"), "no-store")
  assert.match(result.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/)
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), null)
})
