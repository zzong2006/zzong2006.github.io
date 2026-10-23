// 목차(table-of-contents) 항목의 수식을 그린다.
//
// 목차 플러그인은 빌드할 때 제목을 글자로만 바꿔 항목을 만든다. 그래서 "$\sqrt{d_k}$ 로 나누는 이유"
// 같은 제목이 목차에서는 "\sqrt{d_k} 로 나누는 이유" 로 보였다. 본문의 같은 제목은 이미 KaTeX 로
// 그려져 있으므로, 브라우저에서 그 제목의 내용을 복제해 목차 항목에 넣는다. 제목 옆 링크 아이콘
// (a[role=anchor])은 뺀다. 수식이 없는 항목은 건드리지 않는다.

function fixTocMath() {
  for (const link of document.querySelectorAll(".toc a[data-for]")) {
    if (link.dataset.mathFixed) continue
    const heading = document.getElementById(link.dataset.for || "")
    if (!heading || !heading.querySelector(".katex")) continue

    const fragment = document.createDocumentFragment()
    for (const node of heading.childNodes) {
      if (node.nodeType === 1 && node.matches('a[role="anchor"]')) continue
      fragment.appendChild(node.cloneNode(true))
    }
    link.replaceChildren(fragment)
    link.dataset.mathFixed = "1"
  }
}

const script = `
(() => {
  ${fixTocMath.toString()}
  document.addEventListener("nav", fixTocMath);
  fixTocMath();
})();
`

export const manifest = {
  name: "toc-math",
  displayName: "TOC Math",
  description: "Shows rendered math in table of contents entries.",
  version: "1.0.0",
  category: "transformer",
  defaultEnabled: true,
  defaultOptions: {},
}

export const TocMath = () => ({
  name: "TocMath",
  markdownPlugins() {
    return []
  },
  externalResources() {
    return {
      js: [
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          script,
        },
      ],
    }
  },
})

export default TocMath
