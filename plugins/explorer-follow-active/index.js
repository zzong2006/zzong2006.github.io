const defaultOptions = {
  datesPath: "",
}

function buildScript(options) {
  const config = JSON.stringify({
    datesPath: options.datesPath || "",
  })

  return `
(() => {
  const config = ${config};
  const state = {
    datesPromise: null,
    basePrefix: null,
    scriptBasePrefix: inferScriptBasePrefix(),
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

  function inferScriptBasePrefix() {
    const scriptSrc = document.currentScript?.getAttribute("src") || "";
    if (!scriptSrc) return "/";

    const pathname = new URL(scriptSrc, document.baseURI).pathname;
    const staticIndex = pathname.lastIndexOf("/static/");
    if (staticIndex === -1) return "/";
    return pathname.slice(0, staticIndex + 1) || "/";
  }

  function getBasePrefix() {
    if (state.basePrefix !== null) return state.basePrefix;
    const contentIndexUrl = findContentIndexUrl();
    state.basePrefix = contentIndexUrl
      ? contentIndexUrl.replace(/static\\/contentIndex\\.json$/, "")
      : state.scriptBasePrefix;
    return state.basePrefix;
  }

  function datesUrl() {
    if (config.datesPath) return new URL(config.datesPath, document.baseURI).toString();

    const contentIndexUrl = findContentIndexUrl();
    if (contentIndexUrl) return contentIndexUrl.replace(/contentIndex\\.json$/, "explorerDates.json");
    return new URL(getBasePrefix() + "static/explorerDates.json", location.origin).toString();
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

  function folderLabelOf(li) {
    const container = li.querySelector(":scope > .folder-container");
    return container ? (container.textContent || "").trim() : "";
  }

  // ── 현재 섹션만 보여주기 ─────────────────────────────────────────
  // 이 vault 는 폴더 65개 중 자식이 하나뿐인 폴더가 0개다. machine_learning 의
  // 직계 자식은 204개(폴더 5 + 파일 199)이고 root 는 34개다. 전체 트리를 펼쳐
  // 보여주는 방식은 이 규모에서 조망 수단이 못 된다. 활성 노트가 속한 폴더의
  // 형제만 남기고, 조상은 위에 경로 한 줄로 접는다.
  //
  // 조상 체인 "밖의" 가지만 숨긴다. 활성 폴더 안쪽은 건드리지 않으므로
  // inference 같은 하위 폴더를 펼쳐도 정상으로 보인다.

  function clearSectionView(explorer) {
    for (const node of explorer.querySelectorAll("[data-sv]")) {
      node.removeAttribute("data-sv");
    }
    explorer.removeAttribute("data-section-view");
    const previous = explorer.querySelector(".explorer-crumb");
    if (previous) previous.remove();
  }

  function ancestorChainOf(activeLi) {
    const chain = [];
    let list = activeLi.parentElement;
    while (list) {
      const outer = list.closest(".folder-outer");
      if (!outer) break;
      const li = outer.parentElement;
      if (!li || li.tagName !== "LI") break;
      chain.unshift(li);
      list = li.parentElement;
    }
    return chain;
  }

  function buildCrumb(explorer, chain) {
    const crumb = document.createElement("nav");
    crumb.className = "explorer-crumb";
    crumb.setAttribute("aria-label", "현재 위치");

    for (let index = 0; index < chain.length; index += 1) {
      if (index > 0) {
        const separator = document.createElement("span");
        separator.className = "explorer-crumb-sep";
        separator.textContent = "/";
        crumb.appendChild(separator);
      }

      const li = chain[index];
      const isLast = index === chain.length - 1;
      const container = li.querySelector(":scope > .folder-container");
      const source = container
        ? container.querySelector(":scope > div > a")
        : null;

      let node;
      if (source && !isLast) {
        // 폴더 페이지가 있으면 링크를 살린다. href 를 새로 만들지 않고 복제한다.
        node = source.cloneNode(true);
        node.className = "explorer-crumb-link";
      } else {
        node = document.createElement("span");
        node.className = isLast ? "explorer-crumb-current" : "explorer-crumb-text";
        node.textContent = folderLabelOf(li);
      }
      crumb.appendChild(node);
    }

    const content = explorer.querySelector(".explorer-content");
    if (content) content.insertBefore(crumb, content.firstChild);
  }

  function applySectionView(explorer, activeLink) {
    clearSectionView(explorer);

    const root = explorer.querySelector("ul.explorer-ul");
    if (!root || !activeLink) return; // 폴더 페이지 / 인덱스에서는 트리를 그대로 둔다

    const activeLi = activeLink.closest("li");
    if (!activeLi) return;

    const chain = ancestorChainOf(activeLi);
    if (chain.length === 0) return; // 루트 직속 노트면 접을 조상이 없다

    let list = root;
    for (const ancestor of chain) {
      for (const li of Array.from(list.children)) {
        if (li.classList.contains("overflow-end")) continue;
        if (li !== ancestor) li.setAttribute("data-sv", "hidden");
      }
      ancestor.setAttribute("data-sv", "ancestor");

      const outer = ancestor.querySelector(":scope > .folder-outer");
      list = outer ? outer.querySelector(":scope > ul") : null;
      if (!list) break;
    }

    explorer.setAttribute("data-section-view", "1");
    buildCrumb(explorer, chain);
  }

  // 밑줄은 저자에게는 경로지만 독자에게는 잡음이다. 공백으로만 바꾼다.
  // 대문자화는 LLM, DPO 같은 약어를 망치므로 하지 않는다.
  function tidyFolderLabels(explorer) {
    for (const label of explorer.querySelectorAll(".folder-title")) {
      const text = label.textContent || "";
      if (text.indexOf("_") === -1) continue; // 이미 처리됨 - 멱등
      label.textContent = text.replace(/_+/g, " ");
    }
  }

  // 데스크톱에서는 접기가 공간을 회수하지 못한다(사이드바 칸이 320px 고정).
  // CSS 로 마우스는 막았지만 키보드와 aria 는 여기서 정리한다.
  function neutralizeDesktopToggle() {
    const wide = window.matchMedia("(min-width: 800px)").matches;
    for (const button of document.querySelectorAll(
      ".page > #quartz-body .sidebar.left .explorer button.desktop-explorer",
    )) {
      if (wide) {
        button.tabIndex = -1;
        button.setAttribute("aria-disabled", "true");
      } else {
        button.removeAttribute("tabindex");
        button.removeAttribute("aria-disabled");
      }
    }
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

    neutralizeDesktopToggle();

    for (const explorer of explorers) {
      tidyFolderLabels(explorer);
      sortExplorer(explorer, dates);
      // 폴더 페이지나 인덱스로 이동하면 활성 링크가 없다. 그때 이전 섹션 표시가
      // 남지 않도록 continue 하기 전에 먼저 지운다.
      clearSectionView(explorer);
      const active = findActiveLink(explorer);
      if (!active) continue;

      foundActive = true;
      openActiveAncestors(active);
      // 조상이 열린 뒤에 접어야 한다. 매 실행마다 이전 표시를 지우고 다시 계산하므로
      // SPA 로 다른 노트로 이동해도 섹션이 따라온다.
      applySectionView(explorer, active);
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
}

export const manifest = {
  name: "explorer-follow-active",
  displayName: "Explorer Follow Active",
  description: "Keeps the explorer focused on the current note and recent folders.",
  version: "1.0.0",
  category: "transformer",
  defaultEnabled: true,
  defaultOptions,
}

export const ExplorerFollowActive = (userOpts = {}) => {
  const options = { ...defaultOptions, ...userOpts }

  return {
    name: "ExplorerFollowActive",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        js: [
          {
            contentType: "inline",
            loadTime: "afterDOMReady",
            script: buildScript(options),
          },
        ],
      }
    },
  }
}

export default ExplorerFollowActive
