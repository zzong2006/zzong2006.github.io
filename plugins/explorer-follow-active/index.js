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

  function isFolderItem(item) {
    return Boolean(item.querySelector(":scope > .folder-container"));
  }

  function folderLabelOf(li) {
    const container = li.querySelector(":scope > .folder-container");
    // 컨테이너 전체 텍스트에는 노트 수 배지(.explorer-count)가 섞이므로 이름 칸만 읽는다.
    const name = container?.querySelector(":scope > div") || container;
    return name ? (name.textContent || "").trim() : "";
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

  // 폴더마다 안에 든 노트 수를 오른쪽에 붙인다. 펼치기 전에 크기를 가늠하게 한다.
  // 트리는 처음부터 전부 DOM 에 있으므로(접힌 폴더도) 하위 폴더까지 센다.
  function addFolderCounts(explorer) {
    for (const container of explorer.querySelectorAll(".folder-container")) {
      const li = container.parentElement;
      if (!li) continue;
      let badge = container.querySelector(":scope > .explorer-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "explorer-count";
        badge.setAttribute("aria-hidden", "true");
        container.appendChild(badge);
      }
      // Resume 처럼 폴더 페이지 하나뿐인 폴더는 0 이 된다. 0 은 빈 폴더로 오해되므로 숨긴다.
      const count = li.querySelectorAll("a.nav-file-title").length;
      const text = count > 0 ? String(count) : "";
      if (badge.textContent !== text) badge.textContent = text;
      badge.hidden = count === 0;
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

  // ── 폴더 페이지에서 따라가기 ─────────────────────────────────────
  // 노트 페이지는 탐색기에 그 노트 링크가 있어서 findActiveLink 로 찾지만, 폴더 페이지
  // (논문, 생성형 AI 같은)는 링크가 아니라 폴더 줄이라 아무것도 표시되지 않았다. 그래서
  // 예전에 펼쳐 둔 다른 폴더(머신러닝 등)가 그대로 열려 있고 지금 폴더는 접혀 있었다.
  // 폴더 페이지에서는 전체 트리를 두고, 지금 폴더를 강조하고, 그 폴더까지 가는 길만 펼친다.
  // (노트 페이지의 '현재 폴더만 보기'를 쓰지 않는 것은, 폴더 페이지 본문이 이미 그 폴더의
  // 목록이라 탐색기까지 같은 목록을 보여 줄 필요가 없어서다. 탐색기는 위치를 보여 준다.)
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

  function focusFolder(explorer, container) {
    const onPath = new Set();
    let cursor = container.parentElement;
    while (cursor && cursor.tagName === "LI") {
      onPath.add(cursor);
      cursor = cursor.parentElement?.closest("li");
    }
    for (const outer of explorer.querySelectorAll(".folder-outer")) {
      outer.classList.toggle("open", onPath.has(outer.parentElement));
    }
    requestAnimationFrame(() => {
      container.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
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
      addFolderCounts(explorer);
      // 폴더 페이지나 인덱스로 이동하면 활성 링크가 없다. 그때 이전 섹션 표시가
      // 남지 않도록 continue 하기 전에 먼저 지운다.
      clearSectionView(explorer);
      const activeFolder = findActiveFolder(explorer);
      const active = findActiveLink(explorer);
      if (!active) {
        if (activeFolder) {
          foundActive = true;
          focusFolder(explorer, activeFolder);
        }
        continue;
      }

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
  description: "Keeps the explorer focused on the current note, sorted by name with pinned notes and note counts.",
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
