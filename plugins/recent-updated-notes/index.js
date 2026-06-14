export const manifest = {
  name: "recent-updated-notes",
  displayName: "Recent Updated Notes",
  description: "Display recently modified markdown notes on the home page.",
  version: "1.0.0",
  category: "component",
  defaultEnabled: true,
  defaultOptions: {
    title: "최근 수정한 노트",
    limit: 8,
    showPaths: true,
  },
  components: {
    RecentUpdatedNotes: {
      name: "RecentUpdatedNotes",
      displayName: "Recent Updated Notes",
      description: "Homepage list of recently modified notes.",
      version: "1.0.0",
      defaultPosition: "afterBody",
      defaultPriority: 50,
    },
  },
}

export { RecentUpdatedNotes } from "./components/index.js"
