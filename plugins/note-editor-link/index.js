import { h } from "preact"

export const manifest = {
  name: "note-editor-link",
  displayName: "Note editor link",
  description: "Open the owner-only editor for an existing public note.",
  version: "1.0.0",
  category: "component",
  defaultEnabled: false,
  defaultOptions: { endpoint: "" },
  components: {
    NoteEditorLink: {
      name: "NoteEditorLink",
      displayName: "Note editor link",
      description: "Owner-only web editor entry",
      version: "1.0.0",
      defaultPosition: "beforeBody",
      defaultPriority: 90,
    },
  },
}
export const NoteEditorLink = (options = {}) => {
  let origin
  try {
    const endpoint = new URL(options.endpoint)
    if (endpoint.protocol === "https:") origin = endpoint.origin
  } catch {}
  return ({ fileData }) => {
    const path = String(fileData.relativePath || "")
    if (
      !origin ||
      !path.endsWith(".md") ||
      !path.includes("/") ||
      path.startsWith("private/") ||
      path === "resume/index.md"
    )
      return null
    return h(
      "a",
      {
        href: `${origin}/?path=${encodeURIComponent(path)}`,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "note-editor-link",
        title: "소유자 로그인 후 원본 편집 및 발행",
      },
      "노트 편집 ↗",
    )
  }
}
