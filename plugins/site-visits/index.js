import { h } from "preact"

export const manifest = {
  name: "site-visits",
  displayName: "Site visits",
  description: "Show the site-wide visit count from GoatCounter.",
  version: "1.0.0",
  category: "component",
  defaultEnabled: false,
  defaultOptions: { label: "방문" },
  components: {
    SiteVisits: {
      name: "SiteVisits",
      displayName: "Site visits",
      description: "Site-wide visit count from GoatCounter, one per visitor session",
      version: "1.0.0",
      defaultPosition: "left",
      defaultPriority: 40,
    },
  },
}

// GoatCounter 의 TOTAL 은 사람 수가 아니다. GoatCounter 는 (IP, User-Agent) 세션이
// 처음 본 경로마다 1을 세므로, 한 사람이 다섯 페이지를 보면 TOTAL 이 5 오른다.
// 그래서 세션마다 `site-visit` 이벤트를 한 번 더 보내고, 그 이벤트의 카운터
// (https://CODE.goatcounter.com/counter/site-visit.json)를 표시한다. GoatCounter 가
// 같은 세션의 같은 경로는 8시간 동안 한 번만 세므로, 한 사람이 여러 페이지를 돌아도 1이다.
// 페이지별 집계는 Quartz 의 기본 GoatCounter 스크립트가 그대로 보낸다.
// 사이트 코드는 configuration.analytics 에서 가져오므로 따로 적지 않는다.
// GoatCounter 설정의 "Allow adding visitor counts on your website" 가 꺼져 있거나
// 요청이 실패하면 요소를 숨긴 채로 둔다.
const VISIT_EVENT = "site-visit"

const script = `
(() => {
  const SENT_KEY = "site-visits:sent";
  let countPromise = null;
  function loadCount(endpoint) {
    if (!countPromise) {
      countPromise = fetch(endpoint)
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => (data && typeof data.count === "string" ? data.count : null))
        .catch(() => null);
    }
    return countPromise;
  }
  // 탭마다 한 번만 보낸다. 새 탭에서 다시 보내도 GoatCounter 가 같은 세션으로 걸러 낸다.
  function recordVisit(event) {
    try {
      if (sessionStorage.getItem(SENT_KEY)) return;
    } catch {}
    const send = () => {
      window.goatcounter.count({ path: event, title: "사이트 방문", event: true });
      try {
        sessionStorage.setItem(SENT_KEY, "1");
      } catch {}
    };
    if (typeof window.goatcounter?.count === "function") return send();
    document.querySelector("script[data-goatcounter]")?.addEventListener("load", send, { once: true });
  }
  document.addEventListener("nav", async () => {
    for (const el of document.querySelectorAll(".site-visits[data-endpoint]")) {
      recordVisit(el.dataset.event);
      const count = await loadCount(el.dataset.endpoint);
      const target = el.querySelector(".site-visits__count");
      if (!count || !target) continue;
      target.textContent = count;
      el.hidden = false;
    }
  });
})();
`

export const SiteVisits = (options = {}) => {
  const label = options.label || manifest.defaultOptions.label
  const Component = ({ cfg, displayClass }) => {
    const analytics = cfg.analytics
    if (analytics?.provider !== "goatcounter" || !analytics.websiteId) return null
    const host = analytics.host ?? "goatcounter.com"
    return h(
      "p",
      {
        class: [displayClass, "site-visits"].filter(Boolean).join(" "),
        "data-endpoint": `https://${analytics.websiteId}.${host}/counter/${VISIT_EVENT}.json`,
        "data-event": VISIT_EVENT,
        hidden: true,
      },
      `${label} `,
      h("span", { class: "site-visits__count" }),
    )
  }
  Component.afterDOMLoaded = script
  Component.css = `.site-visits { margin: 0; color: var(--gray); font-size: .85rem; }
.site-visits__count { font-variant-numeric: tabular-nums; }`
  return Component
}
export default SiteVisits
