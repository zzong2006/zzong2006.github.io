export const manifest = {
  name: "semantic-search",
  displayName: "Semantic Search",
  description: "Adds Gemini-powered semantic search mode to the Quartz search modal.",
  version: "1.0.0",
  category: "component",
  defaultEnabled: true,
  defaultOptions: {
    endpoint: "",
    indexPath: "",
    limit: 8,
    minScore: 0.12,
    queryMaxLength: 300,
  },
  components: {
    SemanticSearch: {
      name: "SemanticSearch",
      displayName: "Semantic Search",
      description: "Invisible enhancer for the built-in search component.",
      version: "1.0.0",
      defaultPosition: "beforeBody",
      defaultPriority: 1,
    },
  },
}

export { SemanticSearch } from "./components/index.js"
