export const manifest = {
  name: "explorer-follow-active",
  displayName: "Explorer Follow Active",
  description: "Keeps the explorer focused on the current note and recent folders.",
  version: "1.0.0",
  category: "component",
  defaultEnabled: true,
  defaultOptions: {
    datesPath: "",
  },
  components: {
    ExplorerFollowActive: {
      name: "ExplorerFollowActive",
      displayName: "Explorer Follow Active",
      description: "Invisible explorer navigation enhancer.",
      version: "1.0.0",
      defaultPosition: "left",
      defaultPriority: 51,
    },
  },
}

export { ExplorerFollowActive } from "./components/index.js"
