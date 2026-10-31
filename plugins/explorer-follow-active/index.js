import {
  FOLDER_GROUPS,
  FOLDER_LABELS,
  OTHER_GROUP_TITLE,
  tidyFolderName,
} from "../shared/folder-names.js"

const defaultOptions = {
  datesPath: "",
}

function buildScript(options) {
  const config = JSON.stringify({
    datesPath: options.datesPath || "",
    groups: FOLDER_GROUPS,
    labels: FOLDER_LABELS,
    otherGroupTitle: OTHER_GROUP_TITLE,
  })

  return `
(() => {
  const config = ${config};
  // 폴더 페이지(folder-page-clean)와 같은 이름 규칙을 쓰려고 함수 소스를 그대로 심는다.
  ${tidyFolderName.toString()}
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
      // renderPage 가 fetch 에 우선순위 인자를 넘기므로 URL 뒤에 "," 가 올 수 있다.
      const match = text.match(/fetch\\(["']([^"']*static\\/contentIndex\\.json)["']\\s*[,)]/);
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

  function isFolderItem(item) {
    return Boolean(item.querySelector(":scope > .folder-container"));
  }

  // 밑줄은 저자에게는 경로지만 독자에게는 잡음이다. 공백으로만 바꾼다.
  // 대문자화는 LLM, DPO 같은 약어를 망치므로 하지 않는다.
  // 폴더 이름은 shared/folder-names.js 규칙을 따른다. 폴더 페이지 제목·경로 줄과 같은 이름이 된다.
  // 정해 둔 이름이 있으면 그것을, 없으면 원래 폴더 이름을 tidyFolderName 으로 다듬는다.
  // 원래 이름은 처음 본 글자를 data-original 에 남겨 두고 쓴다. 다듬은 결과를 다시 다듬어도
  // 같은 값이 나오지만, 원본을 기준으로 해야 규칙이 바뀌어도 결과가 꼬이지 않는다.
  const fixedLabels = new Map(Object.entries(config.labels));
  for (const group of config.groups) {
    for (const [key, label] of group.folders) fixedLabels.set(key, label);
  }

  function tidyFolderLabels(explorer) {
    for (const container of explorer.querySelectorAll(".folder-container")) {
      const label = container.querySelector(".folder-title");
      if (!label) continue;
      if (label.dataset.original === undefined) label.dataset.original = label.textContent || "";
      const key = normalizeSlug(container.dataset.folderpath || "").replace(/\\/index$/, "").toLowerCase();
      const name = fixedLabels.get(key) ?? tidyFolderName(label.dataset.original);
      if (label.textContent !== name) label.textContent = name;
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

  // ── 많이 링크되는 노트 고정 ──────────────────────────────────────
  // explorer-dates-index 가 폴더마다 다른 노트가 많이 링크하는 노트를 골라 pins 로 넘긴다.
  // 이름순 목록에서는 그 폴더의 중심 노트가 다른 노트 사이에 묻힌다. 몇 개만 맨 위에 올리고
  // 나머지는 이름순으로 둬서, 이름으로 찾는 길도 그대로 남긴다.
  function pinRankOf(item) {
    const rank = Number(item.dataset.pin);
    return rank > 0 ? rank : 0;
  }

  function markPin(link, pin) {
    const li = link.closest("li");
    if (!li) return;
    if (pin) {
      if (li.dataset.pin !== String(pin.rank)) li.dataset.pin = String(pin.rank);
    } else if (li.dataset.pin !== undefined) {
      delete li.dataset.pin;
    }
  }

  // 고정 노트가 맨 위(링크 수 순위대로), 그다음 폴더, 그다음 이름순. 예전에는 최근 수정순이었는데,
  // 동기화 한 번에 여러 폴더의 날짜가 같이 바뀌어서 앞쪽은 이름순, 뒤쪽은 뒤죽박죽으로 보였다.
  // 최근 글은 대문에 있다.
  function compareItems(left, right) {
    const leftPin = pinRankOf(left);
    const rightPin = pinRankOf(right);
    if (leftPin || rightPin) {
      if (!leftPin) return 1;
      if (!rightPin) return -1;
      if (leftPin !== rightPin) return leftPin - rightPin;
    }

    const leftFolder = isFolderItem(left);
    const rightFolder = isFolderItem(right);
    if (leftFolder !== rightFolder) return leftFolder ? -1 : 1;

    return labelOf(left).localeCompare(labelOf(right), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  function sortList(list) {
    const items = Array.from(list.children).filter((item) => !item.classList.contains("overflow-end"));

    // 정렬 결과는 목록이 바뀌지 않는 한 그대로다. sync 는 nav/render/load/재시도로
    // 여러 번 도는데, 매번 1725개를 다시 붙이면 순수한 낭비다.
    // 자식 수와 고정 노트 수를 지문으로 삼아 바뀐 목록만 다시 정렬한다.
    const fingerprint = items.length + ":" + items.filter((item) => item.dataset.pin).length;
    if (list.dataset.sortedFor === fingerprint) return;

    items.sort(compareItems);

    // 항목마다 appendChild 하면 목록 하나에 DOM 이동이 항목 수만큼 일어난다.
    // fragment 에 모아 한 번에 넣으면 삽입이 1회로 끝난다.
    const fragment = document.createDocumentFragment();
    for (const item of items) fragment.appendChild(item);
    list.appendChild(fragment);

    list.dataset.sortedFor = fingerprint;
  }

  function sortExplorer(explorer) {
    // 맨 위 목록은 묶음이 있으면 applyGroups 가 순서를 정한다.
    const selector = config.groups.length > 0 ? "ul.content" : "ul.explorer-ul, ul.content";
    for (const list of explorer.querySelectorAll(selector)) sortList(list);
  }

  // ── 맨 위 폴더 묶음 ───────────────────────────────────────────────
  // shared/folder-names.js 의 순서대로 묶음 제목(li.explorer-group)과 폴더를 놓는다.
  // 폴더 이름은 그 전에 tidyFolderLabels 가 바꿔 둔다.
  // 묶음에 없는 폴더와 맨 위 노트는 '기타' 묶음 뒤쪽에 이름순으로 붙는다.
  const groupIndexOf = new Map();
  const rankOf = new Map();
  config.groups.forEach((group, groupIndex) => {
    group.folders.forEach(([key], rank) => {
      groupIndexOf.set(key, groupIndex);
      rankOf.set(key, rank);
    });
  });

  function topFolderKey(item) {
    const folder = item.querySelector(":scope > .folder-container");
    if (!folder?.dataset?.folderpath) return "";
    return normalizeSlug(folder.dataset.folderpath).replace(/\\/index$/, "").toLowerCase();
  }

  function groupHeader(root, title) {
    for (const node of root.children) {
      if (node.classList.contains("explorer-group") && node.dataset.group === title) return node;
    }
    const header = document.createElement("li");
    header.className = "explorer-group";
    header.dataset.group = title;
    header.textContent = title;
    return header;
  }

  function applyGroups(explorer) {
    const root = explorer.querySelector("ul.explorer-ul");
    if (!root || config.groups.length === 0) return;

    const buckets = config.groups.map(() => []);
    const rest = [];
    for (const item of Array.from(root.children)) {
      if (item.classList.contains("overflow-end") || item.classList.contains("explorer-group")) continue;

      const key = topFolderKey(item);
      const groupIndex = groupIndexOf.get(key);
      if (groupIndex === undefined) rest.push(item);
      else buckets[groupIndex].push(item);
    }

    const order = [];
    let otherHeader = null;
    buckets.forEach((bucket, groupIndex) => {
      if (bucket.length === 0) return;
      bucket.sort((left, right) => rankOf.get(topFolderKey(left)) - rankOf.get(topFolderKey(right)));
      const header = groupHeader(root, config.groups[groupIndex].title);
      if (config.groups[groupIndex].title === config.otherGroupTitle) otherHeader = header;
      order.push(header, ...bucket);
    });
    if (rest.length > 0) {
      rest.sort(compareItems);
      if (!otherHeader) order.push(groupHeader(root, config.otherGroupTitle));
      order.push(...rest);
    }

    // 이미 그 순서면 건드리지 않는다. sync 가 여러 번 돌 때 DOM 이동을 피한다.
    const current = Array.from(root.children).filter((item) => !item.classList.contains("overflow-end"));
    if (current.length === order.length && current.every((item, index) => item === order[index])) return;

    const fragment = document.createDocumentFragment();
    for (const item of order) fragment.appendChild(item);
    for (const stale of current) {
      if (!order.includes(stale)) stale.remove();
    }
    root.appendChild(fragment);
  }

  function findActiveLink(explorer) {
    const currentSlug = normalizeUrlPath(location.href);
    let active = null;

    for (const link of explorer.querySelectorAll("a.nav-file-title")) {
      const linkSlug = normalizeUrlPath(link.href);
      if (linkSlug === currentSlug) {
        link.classList.add("active", "is-active");
        link.setAttribute("aria-current", "page");
        active = link;
      } else {
        link.classList.remove("active", "is-active");
        link.removeAttribute("aria-current");
      }
    }

    return active || explorer.querySelector("a.nav-file-title.active, a.nav-file-title.is-active");
  }

  // ── 지금 페이지 따라가기 ─────────────────────────────────────────
  // 노트 페이지든 폴더 페이지든 탐색기는 같은 모양이다. 전체 트리를 두고, 지금 페이지까지
  // 가는 길의 폴더만 펼치고 나머지는 접은 뒤, 지금 줄로 스크롤한다.
  // 예전에는 노트 페이지만 '현재 폴더만 보기'(경로 한 줄 + 그 폴더 목록)로 바뀌어서, 폴더
  // 페이지의 전체 트리와 전혀 다른 화면이 됐다. 문서 사이트들(VitePress, Docusaurus,
  // Obsidian Publish)도 페이지마다 목록 구조를 바꾸지 않고 위치만 표시한다.
  // 폴더 페이지는 탐색기에 링크가 아니라 폴더 줄이라 findActiveLink 로는 찾지 못한다.
  function findActiveFolder(explorer) {
    const current = normalizeUrlPath(location.href);
    let found = null;
    for (const container of explorer.querySelectorAll(".folder-container")) {
      const key = normalizeSlug(container.dataset.folderpath || "").replace(/\\/index$/, "");
      const isActive = key !== "" && key === current;
      container.classList.toggle("is-active-folder", isActive);
      if (isActive) {
        container.setAttribute("aria-current", "page");
        found = container;
      } else {
        container.removeAttribute("aria-current");
      }
    }
    return found;
  }

  // target: 지금 노트의 링크, 또는 지금 폴더의 .folder-container.
  // 폴더면 그 폴더 자신도 펼친다(그 줄의 li 가 경로에 들어가므로).
  function focusOn(explorer, target) {
    const onPath = new Set();
    let cursor = target.closest("li");
    while (cursor && cursor.tagName === "LI") {
      onPath.add(cursor);
      cursor = cursor.parentElement?.closest("li");
    }
    for (const outer of explorer.querySelectorAll(".folder-outer")) {
      outer.classList.toggle("open", onPath.has(outer.parentElement));
    }
    requestAnimationFrame(() => revealInList(explorer, target));
  }

  // 탐색기 목록만 스크롤한다. scrollIntoView 는 페이지 전체까지 움직일 수 있고, "nearest" 로는
  // 지금 줄이 목록 맨 위에 붙어 그 위의 폴더 줄(어느 폴더 안인지)이 가려졌다.
  // 지금 줄이 이미 보이면 건드리지 않는다. 같은 폴더 안에서 옆 노트로 옮길 때 목록이 튀지 않게.
  function revealInList(explorer, target) {
    let box = null;
    for (let node = target.parentElement; node && node !== explorer.parentElement; node = node.parentElement) {
      const overflowY = getComputedStyle(node).overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
        box = node;
        break;
      }
    }
    if (!box) return;

    const top = target.getBoundingClientRect().top - box.getBoundingClientRect().top;
    const bottom = top + target.getBoundingClientRect().height;
    if (top >= 0 && bottom <= box.clientHeight) return;
    // 목록 높이의 3분의 1 지점에 둔다.
    box.scrollTop += top - box.clientHeight / 3;
  }

  function syncExplorer(dates) {
    const explorers = document.querySelectorAll(".page > #quartz-body .sidebar.left .explorer");
    let foundActive = false;

    neutralizeDesktopToggle();

    for (const explorer of explorers) {
      // 탐색기 트리는 <template> 에서 클라이언트가 만든다. 아직 비어 있으면
      // 정렬할 것도 접을 것도 없다. 이 가드가 없으면 재시도 12회가 매번
      // 빈 트리를 훑고 지나간다.
      if (!explorer.querySelector("a.nav-file-title")) continue;

      tidyFolderLabels(explorer);
      for (const link of explorer.querySelectorAll("a.nav-file-title")) {
        const slug = normalizeUrlPath(link.href);
        const entry = dates?.labels?.[slug];
        const pin = dates?.pins?.[slug];
        markPin(link, pin);
        if (!entry && !pin) continue;
        if (entry && link.textContent !== entry.label) link.textContent = entry.label;
        const label = entry ? entry.label + " — " + entry.title : (link.textContent || "").trim();
        const note = pin ? "다른 노트 " + pin.backlinks + "개가 링크" : "";
        link.title = (entry ? entry.title : label) + (note ? " · " + note : "");
        link.setAttribute("aria-label", label + (note ? ", " + note : ""));
      }
      sortExplorer(explorer);
      applyGroups(explorer);
      // 둘 다 매번 부른다. 다른 페이지로 옮겨 가면 이전 강조를 지워야 하기 때문이다.
      const activeFolder = findActiveFolder(explorer);
      const active = findActiveLink(explorer);
      const target = active || activeFolder;
      if (!target) continue; // 대문: 독자가 펼쳐 둔 상태를 그대로 둔다

      foundActive = true;
      focusOn(explorer, target);
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
  description: "Keeps the explorer focused on the current note, sorted by name with pinned notes.",
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
            // Quartz 탐색기는 저장된 목록 위치(sessionStorage.explorerScrollTop)가 없으면, 즉
            // 세션의 첫 페이지에서 지금 노트에 scrollIntoView 를 부른다. 그 호출은 창 전체도
            // 스크롤해서, 큰 폴더 깊숙한 노트로 들어오면 본문이 중간부터 보였다. 탐색기가
            // 그리기 전에 0 을 넣어 두면 그 호출을 건너뛴다. 목록 위치는 아래 스크립트가 맞춘다.
            contentType: "inline",
            loadTime: "beforeDOMReady",
            script: `try { if (sessionStorage.getItem("explorerScrollTop") === null) sessionStorage.setItem("explorerScrollTop", "0") } catch {}`,
          },
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
