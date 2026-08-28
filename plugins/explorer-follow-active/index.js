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

  // 폴더 라벨의 실제 요소. 폴더 페이지가 있으면 a, 없으면 접기 button 이다.
  function labelElementOf(container) {
    return container.querySelector(":scope > div > a, :scope > div > button");
  }

  // machine_learning > generative_ai > LLM 처럼 자식이 하나뿐인 폴더 사슬을 한 줄로 합친다.
  // 부모의 li / .folder-container / .folder-outer 는 그대로 남긴다. 정렬이 쓰는
  // data-folderpath 와 labelOf 의 첫 .folder-title 이 부모 쪽에 있기 때문이다.
  function compactChainAt(li) {
    if (li.dataset.chainCompacted === "1") return;

    const container = li.querySelector(":scope > .folder-container");
    const outer = li.querySelector(":scope > .folder-outer");
    if (!container || !outer) return;

    const holder = container.querySelector(":scope > div");
    if (!holder) return;

    const segments = [];
    let list = outer.querySelector(":scope > ul");

    while (list) {
      const kids = Array.from(list.children).filter(
        (node) => !node.classList.contains("overflow-end"),
      );
      if (kids.length !== 1) break;

      const childLi = kids[0];
      const childContainer = childLi.querySelector(":scope > .folder-container");
      const childOuter = childLi.querySelector(":scope > .folder-outer");
      if (!childContainer || !childOuter) break; // 파일 하나뿐이면 합치지 않는다

      const childList = childOuter.querySelector(":scope > ul");
      if (!childList) break;

      segments.push({
        element: labelElementOf(childContainer),
        text: (childContainer.textContent || "").trim(),
      });

      // 손자들을 부모 목록으로 끌어올린다. 목록 전체를 replaceChildren 하면
      // Quartz 의 .overflow-end 마커("더 보기" 장치)까지 지워지므로 해당 li 만 바꾼다.
      childLi.replaceWith.apply(childLi, Array.from(childList.children));
    }

    if (segments.length === 0) return;

    for (const segment of segments) {
      const separator = document.createElement("span");
      separator.className = "folder-chain-sep";
      separator.textContent = "/";
      holder.appendChild(separator);

      // 링크는 살려서 옮긴다. 접기 button 이었다면 그 button 이 토글하던 폴더는
      // 방금 사라졌으므로 평문으로 바꾼다.
      if (segment.element && segment.element.tagName === "A") {
        holder.appendChild(segment.element);
      } else {
        const plain = document.createElement("span");
        plain.className = "folder-chain-text";
        plain.textContent = segment.text;
        holder.appendChild(plain);
      }
    }

    // 마지막 세그먼트가 실제로 열리는 폴더다. 앞쪽은 경로 표시이므로 약하게 둔다.
    const parts = Array.from(holder.children).filter(
      (node) => !node.classList.contains("folder-chain-sep"),
    );
    for (let index = 0; index < parts.length; index += 1) {
      parts[index].classList.toggle("folder-chain-lead", index < parts.length - 1);
    }

    container.setAttribute("data-chain", String(segments.length + 1));
    li.dataset.chainCompacted = "1";
  }

  // 밑줄은 저자에게는 경로지만 독자에게는 잡음이다. 공백으로만 바꾼다.
  // 대문자화는 LLM, DPO 같은 약어를 망치므로 하지 않는다.
  function tidyFolderLabels(explorer) {
    for (const label of explorer.querySelectorAll(".folder-title, .folder-chain-text")) {
      const text = label.textContent || "";
      if (text.indexOf("_") === -1) continue; // 이미 처리됨 - 멱등
      label.textContent = text.replace(/_+/g, " ");
    }
  }

  function compactFolderChains(list) {
    if (!list) return;
    for (const li of Array.from(list.children)) {
      if (li.classList.contains("overflow-end")) continue;
      compactChainAt(li);
      const outer = li.querySelector(":scope > .folder-outer");
      const nested = outer && outer.querySelector(":scope > ul");
      if (nested) compactFolderChains(nested);
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
      // 압축이 목록 구조를 바꾸므로 정렬보다 먼저 돌린다.
      compactFolderChains(explorer.querySelector("ul.explorer-ul"));
      tidyFolderLabels(explorer);
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
