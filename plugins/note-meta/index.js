import { h } from "preact"
import readingTime from "reading-time"
import { asDate } from "../note-dates/index.js"

export const manifest = {
  name: "note-meta",
  displayName: "Note Metadata",
  version: "1.0.0",
  category: "component",
  components: {
    NoteMeta: {
      name: "NoteMeta",
      displayName: "Note Metadata",
      version: "1.0.0",
      defaultPosition: "beforeBody",
      defaultPriority: 20,
    },
  },
}

export const NoteMeta = () => {
  const Component = ({ fileData, displayClass }) => {
    if (!fileData.text) return null
    const segments = ["created", "modified"].flatMap((kind) => {
      const date = asDate(fileData.dates?.[kind])
      if (!date) return []
      const label = kind === "created" ? "최초 작성" : "마지막 수정"
      const explicit = fileData.dateSources?.[kind] === "frontmatter"
      const description = explicit
        ? "노트에 명시한 날짜"
        : kind === "created"
          ? "사이트 Git 이력의 최초 기록일입니다. 이전 작성 이력은 포함하지 않을 수 있습니다."
          : "사이트 Git 이력에서 이 파일을 마지막으로 변경한 날짜입니다."
      const formatted = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date)
      return [
        h(
          "span",
          { class: "note-meta__date", title: description },
          `${label} `,
          h("time", { datetime: date.toISOString() }, formatted),
        ),
      ]
    })
    segments.push(h("span", null, `읽는 데 ${Math.ceil(readingTime(fileData.text).minutes)}분`))
    return h(
      "p",
      { class: [displayClass, "content-meta", "note-meta"].filter(Boolean).join(" ") },
      ...segments,
    )
  }
  Component.css = `.note-meta { display: flex; flex-wrap: wrap; gap: .3rem 1rem; color: var(--darkgray); font-size: .9rem; margin: 0 0 1rem; }
.note-meta__date { white-space: nowrap; }
.note-meta > span { line-height: 1.6; }`
  return Component
}
export default NoteMeta
