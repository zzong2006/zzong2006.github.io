declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
  render: CustomEvent<{}>
}

type ContentIndex = Record<FullSlug, Pick<ContentDetails, "slug" | "title">>
type SearchIndex = Record<FullSlug, Pick<ContentDetails, "slug" | "title" | "content">>
declare const fetchData: Promise<ContentIndex>
declare const fetchSearchData: () => Promise<SearchIndex>
