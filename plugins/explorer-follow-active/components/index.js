import { h } from "preact"

const defaultOptions = {
  datesPath: "",
}

const script = `
(() => {
  const state = {
    datesPromise: null,
    basePrefix: null,
    syncToken: 0,
  };

  function safeDecode(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function stripSlashes(value) {
    return String(value || "").replace(/^\\/+/, "").replace(/\\/+$/, "");
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

  function readConfig() {
    const el = document.querySelector("[data-explorer-follow-active]");
    return {
      datesPath: (el?.getAttribute("data-dates-path") || "").trim(),
    };
  }

  function datesUrl() {
    const config = readConfig();
    if (config.datesPath) return new URL(config.datesPath, document.baseURI).toString();

    const contentIndexUrl = findContentIndexUrl();
    if (contentIndexUrl) return contentIndexUrl.replace(/contentIndex\\.json$/, "explorerDates.json");
    return new URL("static/explorerDates.json", document.baseURI).toString();
  }

  async function loadDates() {
    if (!state.datesPromise) {
      state.datesPromise = fetch(datesUrl())
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null);
    }
    return state.datesPromise;
  }

  function normalizeUrlPath(value) {
    const url = new URL(value || location.href, location.origin);
    let pathname = safeDecode(url.pathname);
    const basePrefix = getBasePrefix();
    if (basePrefix && basePrefix !== "/" && pathname.startsWith(basePrefix)) {
      pathname = pathname.slice(basePrefix.length);
    }
    return stripSlashes(pathname) || "index";
  }

  function normalizeSlug(value) {
    return stripSlashes(safeDecode(value || ""));
  }

  function labelOf(item) {
    const label = item.querySelector(".folder-title, .nav-file-title");
    return (label?.textContent || "").trim();
  }

  function slugForItem(item) {
    const folder = item.querySelector(":scope > .folder-container");
    if (folder?.dataset?.folderpath) {
      return normalizeSlug(folder.dataset.folderpath);
    }

    const link = item.querySelector(":scope > a.nav-file-title");
    if (link?.href) return normalizeUrlPath(link.href);
    return "";
  }

  function latestForItem(item, dates) {
    const folder = item.querySelector(":scope > .folder-container");
    const slug = slugForItem(item);
    if (!slug) return 0;
    return Number(folder ? dates?.folders?.[slug] : dates?.files?.[slug]) || 0;
  }

  function isFolderItem(item) {
    return Boolean(item.querySelector(":scope > .folder-container"));
  }

  function sortList(list, dates) {
    const items = Array.from(list.children).filter((item) => !item.classList.contains("overflow-end"));
    items.sort((left, right) => {
      const leftFolder = isFolderItem(left);
      const rightFolder = isFolderItem(right);
      if (leftFolder !== rightFolder) return leftFolder ? -1 : 1;

      const leftLatest = latestForItem(left, dates);
      const rightLatest = latestForItem(right, dates);
      if (leftLatest !== rightLatest) return rightLatest - leftLatest;

      return labelOf(left).localeCompare(labelOf(right), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    for (const item of items) list.appendChild(item);
  }

  function sortExplorer(explorer, dates) {
    const lists = explorer.querySelectorAll("ul.explorer-ul, ul.content");
    for (const list of lists) sortList(list, dates);
  }

  function findActiveLink(explorer) {
    const currentSlug = normalizeUrlPath(location.href);
    let active = null;

    for (const link of explorer.querySelectorAll("a.nav-file-title")) {
      const linkSlug = normalizeUrlPath(link.href);
      if (linkSlug === currentSlug) {
        link.classList.add("active", "is-active");
        active = link;
      } else {
        link.classList.remove("active", "is-active");
      }
    }

    return active || explorer.querySelector("a.nav-file-title.active, a.nav-file-title.is-active");
  }

  function openActiveAncestors(active) {
    let cursor = active?.closest("li");
    while (cursor) {
      const outer = cursor.parentElement?.closest(".folder-outer");
      if (!outer) break;
      outer.classList.add("open");
      cursor = outer.closest("li");
    }
  }

  function syncExplorer(dates) {
    const explorers = document.querySelectorAll(".page > #quartz-body .sidebar.left .explorer");
    let foundActive = false;

    for (const explorer of explorers) {
      sortExplorer(explorer, dates);
      const active = findActiveLink(explorer);
      if (!active) continue;

      foundActive = true;
      openActiveAncestors(active);
      requestAnimationFrame(() => {
        active.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    }

    return foundActive;
  }

  function scheduleSync() {
    const token = ++state.syncToken;
    const trySync = async (attempt) => {
      const dates = await loadDates();
      if (token !== state.syncToken) return;

      const didSync = syncExplorer(dates);
      if (!didSync && attempt < 12) {
        setTimeout(() => trySync(attempt + 1), 80);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => trySync(0));
    });
  }

  document.addEventListener("nav", scheduleSync);
  document.addEventListener("render", scheduleSync);
  document.addEventListener("DOMContentLoaded", scheduleSync);
  window.addEventListener("load", scheduleSync);
  scheduleSync();
})();
`

export const ExplorerFollowActive = (userOpts = {}) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Component = () =>
    h("template", {
      "data-explorer-follow-active": "true",
      "data-dates-path": opts.datesPath,
    })

  Component.afterDOMLoaded = script
  return Component
}
