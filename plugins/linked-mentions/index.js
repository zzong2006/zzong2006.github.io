export const manifest = {
  name: "linked-mentions",
  displayName: "Linked Mentions",
  description: "Shows Obsidian-style linked mentions with short context snippets.",
  version: "1.0.0",
  category: "component",
  defaultOptions: {
    hideWhenEmpty: true,
    maxMentions: 8,
    snippetLength: 180,
  },
  components: {
    LinkedMentions: {
      name: "LinkedMentions",
      displayName: "Linked Mentions",
      description: "Shows pages that link to the current page with context snippets.",
      version: "1.0.0",
      defaultPosition: "afterBody",
      defaultPriority: 5,
    },
  },
}

export { LinkedMentions } from "./components/index.js"
