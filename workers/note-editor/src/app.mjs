import { marked } from "marked"
import DOMPurify from "dompurify"
import renderMathInElement from "katex/contrib/auto-render"

const $ = (id) => document.getElementById(id)
const path = new URL(location.href).searchParams.get("path") || ""
$("path").textContent = path || "사이트의 노트에서 편집 버튼을 눌러주세요."
$("login").href = `/login?path=${encodeURIComponent(path)}`
let csrf,
  sha,
  siteSha,
  saved = "",
  busy = false,
  loaded = false,
  pending
const storageKey = `note-publish:${path}`
try {
  pending = JSON.parse(sessionStorage.getItem(storageKey) || "null")
} catch {}
const dirty = () => loaded && $("source").value !== saved
const status = (message, error = false) => {
  $("status").textContent = message
  $("status").className = error ? "error" : ""
}
function ask(message) {
  return new Promise((resolve) => {
    const dialog = $("confirm-dialog")
    $("confirm-message").textContent = message
    const done = (value) => {
      dialog.close()
      resolve(value)
    }
    $("confirm-yes").onclick = () => done(true)
    $("confirm-no").onclick = () => done(false)
    dialog.oncancel = (event) => {
      event.preventDefault()
      done(false)
    }
    dialog.showModal()
  })
}
function controls() {
  for (const id of ["reload", "save", "publish"]) $(id).disabled = !loaded || busy
  $("save").disabled ||= !dirty()
  $("publish").disabled ||= dirty() || Boolean(pending)
  $("download").disabled = !loaded
  $("source").disabled = !loaded || busy
  $("resume").hidden = !pending || busy
  $("clear").hidden = !pending || busy
  $("logout").disabled = busy
}
async function api(route, data) {
  const response = await fetch(route, {
    method: data ? "POST" : "GET",
    headers: data ? { "Content-Type": "application/json", "X-CSRF-Token": csrf } : {},
    body: data ? JSON.stringify(data) : undefined,
  })
  const result = await response.json()
  if (!response.ok) {
    if (response.status === 401) $("login").hidden = false
    throw Error(result.error || `요청 실패 (${response.status})`)
  }
  return result
}
function preview() {
  const text = $("source").value.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
  // Keep TeX untouched by Markdown escaping. All raw HTML is sanitized before use.
  const math = []
  const protectedText = text.replace(/\$\$([\s\S]*?)\$\$|\$([^\n$]+)\$/g, (value) => {
    const index = math.push(value) - 1
    return `ZZNOTEEDITOR${index}MATHZZ`
  })
  $("preview").innerHTML = DOMPurify.sanitize(marked.parse(protectedText), {
    FORBID_TAGS: ["style", "iframe", "form", "input", "button"],
    FORBID_ATTR: ["style"],
  })
  const walker = document.createTreeWalker($("preview"), NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  for (const node of nodes) {
    node.textContent = node.textContent.replace(
      /ZZNOTEEDITOR(\d+)MATHZZ/g,
      (_, i) => math[Number(i)] ?? "",
    )
    if (node.parentElement.closest("pre,code")) continue
    const fragment = document.createDocumentFragment()
    let end = 0
    for (const match of node.textContent.matchAll(/\[\[([^\]\n]+)\]\]/g)) {
      fragment.append(node.textContent.slice(end, match.index))
      const span = document.createElement("span")
      span.className = "wikilink"
      span.title = match[1].split("|")[0]
      span.textContent = match[1].split("|").at(-1)
      fragment.append(span)
      end = match.index + match[0].length
    }
    if (end) {
      fragment.append(node.textContent.slice(end))
      node.replaceWith(fragment)
    }
  }
  for (const link of $("preview").querySelectorAll("a")) {
    link.target = "_blank"
    link.rel = "noopener noreferrer"
  }
  renderMathInElement($("preview"), {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
    trust: false,
    strict: "warn",
    maxExpand: 500,
    maxSize: 20,
  })
}
async function task(fn) {
  busy = true
  controls()
  try {
    await fn()
  } catch (error) {
    status(error.message, true)
  } finally {
    busy = false
    controls()
  }
}
async function load() {
  if (
    dirty() &&
    !(await ask(
      "저장하지 않은 편집을 버리고 원본을 불러올까요? 먼저 내려받기로 보관할 수 있습니다.",
    ))
  )
    return
  const note = await api(`/api/note?path=${encodeURIComponent(path)}`)
  sha = note.sha
  siteSha = note.siteSha
  saved = note.text
  $("source").value = saved
  loaded = true
  preview()
  status("원본을 불러왔습니다.")
  $("detail").textContent = note.siteDiffers
    ? "원본과 공개 사본이 다릅니다(형식 차이일 수도 있습니다). 발행하면 현재 원본으로 공개 사본을 갱신합니다."
    : "저장은 원본만 갱신합니다. 발행을 눌러야 공개 사이트에 반영됩니다."
}
function remember(value) {
  pending = value
  if (value) sessionStorage.setItem(storageKey, JSON.stringify(value))
  else sessionStorage.removeItem(storageKey)
}
async function poll() {
  for (let i = 0; i < 90 && pending; i++) {
    const result = pending.commit
      ? await api(`/api/deployment?commit=${pending.commit}`)
      : await api("/api/finish-publish", { ticket: pending.ticket })
    if (result.url) {
      $("run").href = result.url
      $("run").hidden = false
    }
    if (result.commit) remember({ commit: result.commit })
    if (result.status === "deployed") {
      remember(null)
      siteSha = (await api(`/api/note?path=${encodeURIComponent(path)}`)).siteSha
      status("배포가 완료되었습니다. 사이트에서 결과를 확인하세요.")
      return
    }
    if (result.status === "already_synced") {
      remember(null)
      siteSha = (await api(`/api/note?path=${encodeURIComponent(path)}`)).siteSha
      $("run").href = "https://github.com/zzong2006/zzong2006.github.io/actions"
      $("run").hidden = false
      status("공개 저장소에 같은 내용이 있습니다. 진행 내역에서 배포 상태를 확인하세요.")
      return
    }
    if (result.status.endsWith("_failed")) {
      remember(null)
      throw Error(
        result.status === "validation_failed"
          ? "검증에 실패했습니다. 사이트는 변경하지 않았습니다. 진행 내역에서 원인을 확인하세요."
          : "저장소 반영 후 사이트 배포가 실패했습니다. 진행 내역을 확인하세요.",
      )
    }
    status(
      result.status === "validating"
        ? "발행할 버전의 형식과 비공개 정보를 검사하고 있습니다."
        : "공개 저장소 반영 완료. 사이트를 배포하고 있습니다.",
    )
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
  if (pending) status("아직 진행 중입니다. 진행 상태 다시 확인 버튼으로 이어서 확인하세요.")
}
$("source").addEventListener("input", () => {
  controls()
  preview()
  status("저장하지 않은 변경이 있습니다.")
})
window.addEventListener("beforeunload", (event) => {
  if (dirty() || (busy && pending)) {
    event.preventDefault()
    event.returnValue = ""
  }
})
$("reload").onclick = () => task(load)
$("save").onclick = () =>
  task(async () => {
    const result = await api("/api/save", { path, sha, text: $("source").value })
    sha = result.sha
    saved = $("source").value
    status("원본 저장 완료. 사이트는 아직 변경하지 않았습니다.")
  })
$("publish").onclick = () =>
  task(async () => {
    if (!(await ask("저장된 이 노트를 검증한 뒤 공개 사이트에 발행할까요?"))) return
    remember(await api("/api/publish", { path, sha, siteSha }))
    await poll()
  })
$("resume").onclick = () => task(poll)
$("clear").onclick = () =>
  task(async () => {
    if (
      await ask("요청 추적을 종료할까요? 이미 시작한 GitHub 검사나 배포 자체는 취소되지 않습니다.")
    ) {
      remember(null)
      controls()
      status("추적을 종료했습니다. 원본을 다시 불러온 뒤 새 요청을 시작할 수 있습니다.")
    }
  })
$("download").onclick = () => {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(
    new Blob([$("source").value], { type: "text/markdown;charset=utf-8" }),
  )
  link.download = path.split("/").at(-1) || "note.md"
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}
$("logout").onclick = () =>
  task(async () => {
    if (dirty() && !(await ask("저장하지 않은 내용이 있습니다. 로그아웃할까요?"))) return
    await api("/api/logout", {})
    loaded = false
    saved = ""
    $("source").value = ""
    $("preview").textContent = ""
    $("login").hidden = false
    $("logout").hidden = true
    status("로그아웃했습니다.")
  })
await task(async () => {
  if (!path) {
    status("사이트의 노트에서 편집 버튼을 눌러주세요.")
    return
  }
  const session = await api("/api/session")
  csrf = session.csrf
  $("logout").hidden = false
  await load()
})
