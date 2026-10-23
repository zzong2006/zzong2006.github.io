// 브라우저에서 요약문·목차 속 수식을 그리는 공용 코드. 본문 수식은 빌드할 때 그려지지만,
// KaTeX 라이브러리는 Quartz latex 플러그인 안에만 설치되어 있어서 우리 플러그인에서는 불러올 수 없다.
// 그래서 수식이 있는 페이지에서만 CDN 에서 받는다. 버전은 모든 페이지가 이미 쓰는 katex.min.css 와
// 맞추고, SRI 로 파일이 바뀌면 실행되지 않게 한다.
//
// 이 함수들은 페이지에 심는 스크립트 문자열 안에 toString() 으로 그대로 들어간다(아래 katexClientSource).
// 그래서 바깥 변수를 참조하지 않는다. 여러 플러그인이 한 페이지에 같이 심어도 받는 것은 한 번이다
// (window.__katexLoading 을 같이 쓴다).

export function loadKatex() {
  if (window.katex) return Promise.resolve(window.katex)
  if (!window.__katexLoading) {
    window.__katexLoading = new Promise((resolve, reject) => {
      const el = document.createElement("script")
      el.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
      el.integrity = "sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg"
      el.crossOrigin = "anonymous"
      el.async = true
      el.onload = () => (window.katex ? resolve(window.katex) : reject(new Error("katex missing")))
      el.onerror = () => {
        window.__katexLoading = null
        reject(new Error("katex load failed"))
      }
      document.head.appendChild(el)
    })
  }
  return window.__katexLoading
}

// data-tex 에 TeX 원문을 담은 칸을 그린다. 못 불러오면 칸 안의 원문 글자가 그대로 남는다.
export function renderTexNodes(root, selector) {
  const nodes = Array.from(root.querySelectorAll(selector + ":not([data-rendered])"))
  if (nodes.length === 0) return
  loadKatex()
    .then((katex) => {
      for (const node of nodes) {
        if (!node.isConnected || node.dataset.rendered) continue
        try {
          katex.render(node.dataset.tex || "", node, { throwOnError: false, displayMode: false })
          node.dataset.rendered = "1"
        } catch {}
      }
    })
    .catch(() => {})
}

export const katexClientSource = loadKatex.toString() + "\n" + renderTexNodes.toString() + "\n"
