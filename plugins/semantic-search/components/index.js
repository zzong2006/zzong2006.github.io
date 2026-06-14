import { h } from "preact"

const defaultOptions = {
  endpoint: "",
  indexPath: "",
  limit: 8,
  minScore: 0.12,
  queryMaxLength: 300,
}

const script = `
(() => {
  const cleanupFns = [];
  const state = {
    indexPromise: null,
    basePrefix: null,
  };

  function addCleanup(fn) {
    cleanupFns.push(fn);
  }

  function runCleanups() {
    while (cleanupFns.length > 0) {
      const fn = cleanupFns.pop();
      try {
        fn();
      } catch {}
    }
  }

  function readConfig() {
    const el = document.querySelector("[data-semantic-search-config]");
    if (!el) return null;
    const endpoint = (el.getAttribute("data-endpoint") || "").trim();
    if (!endpoint) return null;
    return {
      endpoint,
      indexPath: (el.getAttribute("data-index-path") || "").trim(),
      limit: Number(el.getAttribute("data-limit") || "8"),
      minScore: Number(el.getAttribute("data-min-score") || "0.12"),
      queryMaxLength: Number(el.getAttribute("data-query-max-length") || "300"),
    };
  }

  function findContentIndexUrl() {
    const scripts = document.querySelectorAll("script");
    for (const scriptEl of scripts) {
      const text = scriptEl.textContent || "";
      const match = text.match(/fetch\\(["']([^"']*static\\/contentIndex\\.json)["']\\)/);
      if (match) return match[1];
    }
    return "";
  }

  function getBasePrefix() {
    if (state.basePrefix !== null) return state.basePrefix;
    const contentIndexUrl = findContentIndexUrl();
    state.basePrefix = contentIndexUrl
      ? contentIndexUrl.replace(/static\\/contentIndex\\.json$/, "")
      : new URL("./", document.baseURI).pathname;
    return state.basePrefix;
  }

  function semanticIndexUrl(config) {
    if (config.indexPath) {
      return new URL(config.indexPath, document.baseURI).toString();
    }
    const contentIndexUrl = findContentIndexUrl();
    if (contentIndexUrl) return contentIndexUrl.replace(/contentIndex\\.json$/, "semanticIndex.json");
    return new URL("static/semanticIndex.json", document.baseURI).toString();
  }

  function hrefForSlug(slug) {
    return getBasePrefix() + slug;
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseSearchQuery(input) {
    const tags = [];
    const queryParts = [];
    for (const token of String(input || "").split(/\\s+/)) {
      if (token.startsWith("#") && token.length > 1) {
        tags.push(token.substring(1));
      } else if (token !== "#") {
        queryParts.push(token);
      }
    }
    return { tags, query: queryParts.join(" ").trim() };
  }

  function decodeInt8Base64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int8Array(bytes.buffer);
  }

  function normalize(values) {
    if (!Array.isArray(values) || values.length === 0) return [];
    let norm = 0;
    for (const value of values) {
      norm += Number(value) * Number(value);
    }
    if (norm === 0) return [];
    const scale = 1 / Math.sqrt(norm);
    return values.map((value) => Number(value) * scale);
  }

  async function loadSemanticIndex(config) {
    if (!state.indexPromise) {
      state.indexPromise = fetch(semanticIndexUrl(config))
        .then((res) => {
          if (!res.ok) throw new Error("semantic index HTTP " + res.status);
          return res.json();
        })
        .then((data) => {
          const entries = Array.isArray(data.entries) ? data.entries : [];
          return {
            ...data,
            entries: entries
              .filter((entry) => entry && typeof entry.slug === "string" && typeof entry.vector === "string")
              .map((entry) => ({ ...entry, decodedVector: decodeInt8Base64(entry.vector) })),
          };
        });
    }
    return state.indexPromise;
  }

  async function embedQuery(config, query) {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload.error || "semantic query HTTP " + res.status);
    }
    const embedding = payload.embedding || (payload.embeddings && payload.embeddings[0] && payload.embeddings[0].values);
    if (!Array.isArray(embedding)) throw new Error("semantic query response missing embedding");
    return embedding;
  }

  function scoreEntry(queryVector, entry) {
    const docVector = entry.decodedVector;
    const length = Math.min(queryVector.length, docVector.length);
    if (length === 0) return 0;
    let score = 0;
    for (let i = 0; i < length; i++) {
      score += queryVector[i] * (docVector[i] / 127);
    }
    return score;
  }

  function renderMessage(results, title, message) {
    results.innerHTML = "";
    const item = document.createElement("a");
    item.className = "result-card no-match";
    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    const messageEl = document.createElement("p");
    messageEl.textContent = message;
    item.appendChild(titleEl);
    item.appendChild(messageEl);
    results.appendChild(item);
  }

  function renderResults(results, items) {
    results.innerHTML = "";
    for (const item of items) {
      const link = document.createElement("a");
      link.className = "result-card semantic-result-card";
      link.id = item.slug;
      link.href = hrefForSlug(item.slug);

      const title = document.createElement("h3");
      title.className = "card-title";
      title.innerHTML = escapeHTML(item.title || item.slug);
      link.appendChild(title);

      const snippet = document.createElement("p");
      snippet.className = "card-description";
      snippet.innerHTML = escapeHTML(item.snippet || "");
      link.appendChild(snippet);

      if (Array.isArray(item.tags) && item.tags.length > 0) {
        const tagList = document.createElement("ul");
        tagList.className = "tags";
        tagList.innerHTML = item.tags
          .slice(0, 5)
          .map((tag) => "<li><p>#" + escapeHTML(tag) + "</p></li>")
          .join("");
        link.appendChild(tagList);
      }

      results.appendChild(link);
    }

    const firstResult = results.querySelector(".result-card:not(.no-match)");
    if (firstResult) {
      firstResult.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }
  }

  function hasTags(entry, tags) {
    if (tags.length === 0) return true;
    const entryTags = Array.isArray(entry.tags) ? entry.tags.map((tag) => String(tag).toLowerCase()) : [];
    return tags.every((tag) => entryTags.includes(tag.toLowerCase()));
  }

  function setMode(searchEl, mode) {
    searchEl.setAttribute("data-semantic-search-mode", mode);
    const tabs = searchEl.querySelectorAll(".semantic-search-tab");
    tabs.forEach((tab) => {
      const active = tab.getAttribute("data-mode") === mode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function setupOne(searchEl, config) {
    const searchBar = searchEl.querySelector(".search-bar");
    const searchLayout = searchEl.querySelector(".search-layout");
    if (!searchBar || !searchLayout) return;

    const searchSpace = searchBar.parentElement;
    if (!searchSpace) return;

    let results = searchLayout.querySelector(".results-container");
    if (!results) {
      results = document.createElement("div");
      results.className = "results-container";
      results.setAttribute("role", "listbox");
      results.setAttribute("aria-label", "Search results");
      searchLayout.appendChild(results);
    }

    const tabs = document.createElement("div");
    tabs.className = "semantic-search-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.innerHTML =
      '<button type="button" class="semantic-search-tab active" data-mode="keyword" role="tab" aria-selected="true">키워드</button>' +
      '<button type="button" class="semantic-search-tab" data-mode="semantic" role="tab" aria-selected="false">의미</button>';
    searchSpace.insertBefore(tabs, searchBar);
    addCleanup(() => tabs.remove());

    let timer = null;
    let runToken = 0;

    async function runSemanticSearch() {
      const mode = searchEl.getAttribute("data-semantic-search-mode") || "keyword";
      if (mode !== "semantic") return;

      const parsed = parseSearchQuery(searchBar.value);
      const query = parsed.query.slice(0, config.queryMaxLength);
      const hasContent = query !== "";
      searchLayout.classList.toggle("display-results", hasContent || parsed.tags.length > 0);

      if (!hasContent) {
        renderMessage(results, "의미 검색어를 입력하세요.", "#태그는 필터로 같이 쓸 수 있습니다.");
        return;
      }

      const token = ++runToken;
      renderMessage(results, "의미로 찾는 중...", "Gemini embedding으로 가까운 글을 계산하고 있습니다.");

      try {
        const [index, queryEmbedding] = await Promise.all([
          loadSemanticIndex(config),
          embedQuery(config, "task: search result | query: " + query),
        ]);
        if (token !== runToken) return;

        const queryVector = normalize(queryEmbedding);
        const items = index.entries
          .filter((entry) => hasTags(entry, parsed.tags))
          .map((entry) => ({ ...entry, score: scoreEntry(queryVector, entry) }))
          .filter((entry) => entry.score >= config.minScore)
          .sort((a, b) => b.score - a.score)
          .slice(0, config.limit);

        if (items.length === 0) {
          renderMessage(results, "No results.", "다른 표현으로 검색해보세요.");
        } else {
          renderResults(results, items);
        }
      } catch (error) {
        if (token !== runToken) return;
        renderMessage(results, "의미 검색을 사용할 수 없습니다.", error && error.message ? error.message : "Worker 또는 semantic index를 확인하세요.");
      }
    }

    function scheduleSemanticSearch() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(runSemanticSearch, 250);
    }

    addCleanup(() => {
      if (timer) clearTimeout(timer);
      runToken++;
    });

    const onTabClick = (event) => {
      const tab = event.target.closest(".semantic-search-tab");
      if (!tab) return;
      const mode = tab.getAttribute("data-mode") || "keyword";
      setMode(searchEl, mode);
      if (mode === "semantic") {
        scheduleSemanticSearch();
      } else {
        runToken++;
        searchBar.dispatchEvent(new Event("input"));
      }
    };
    tabs.addEventListener("click", onTabClick);
    addCleanup(() => tabs.removeEventListener("click", onTabClick));

    const onInput = () => {
      if ((searchEl.getAttribute("data-semantic-search-mode") || "keyword") === "semantic") {
        scheduleSemanticSearch();
      }
    };
    searchBar.addEventListener("input", onInput);
    addCleanup(() => searchBar.removeEventListener("input", onInput));
  }

  function setupSemanticSearch() {
    runCleanups();
    const config = readConfig();
    if (!config) return;
    const searchElements = document.querySelectorAll(".search");
    searchElements.forEach((searchEl) => setupOne(searchEl, config));
  }

  document.addEventListener("nav", setupSemanticSearch);
  document.addEventListener("render", setupSemanticSearch);
})();
`

const styles = `
.semantic-search-config {
  display: none !important;
}

.search > .search-container > .search-space > .semantic-search-tabs {
  display: inline-flex !important;
  width: auto !important;
  align-items: center;
  gap: 0.15rem;
  box-sizing: border-box;
  margin-bottom: 0.55rem !important;
  padding: 0.16rem;
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  background: var(--light);
  box-shadow: none !important;
}

.semantic-search-tab {
  appearance: none;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  line-height: 1.1;
  padding: 0.38rem 0.7rem;
}

.semantic-search-tab:hover,
.semantic-search-tab.active {
  background: var(--highlight);
  color: var(--secondary);
}

.semantic-result-card .tags {
  margin-top: 0.45rem;
}
`

export const SemanticSearch = (userOpts = {}) => {
  const env = typeof process !== "undefined" ? process.env : {}
  const options = {
    ...defaultOptions,
    endpoint: env.SEMANTIC_SEARCH_ENDPOINT ?? "",
    ...userOpts,
  }

  const Component = ({ displayClass }) =>
    h("div", {
      class: ["semantic-search-config", displayClass].filter(Boolean).join(" "),
      hidden: true,
      "data-semantic-search-config": "true",
      "data-endpoint": options.endpoint,
      "data-index-path": options.indexPath,
      "data-limit": String(options.limit),
      "data-min-score": String(options.minScore),
      "data-query-max-length": String(options.queryMaxLength),
    })

  Component.afterDOMLoaded = script
  Component.css = styles

  return Component
}

export default SemanticSearch
