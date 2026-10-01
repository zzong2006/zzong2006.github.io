export const manifest = {
  name: "ml-practice", displayName: "ML Practice Links",
  description: "Links public notes to their implementation exercises.",
  version: "1.0.0", category: "component", defaultEnabled: true,
  components: { PracticeLinks: {
    name: "PracticeLinks", displayName: "ML Practice Links",
    description: "Related Python exercises for a note.", version: "1.0.0",
    defaultPosition: "beforeBody", defaultPriority: 30,
  } },
}
export { PracticeLinks } from "./components/index.js"
