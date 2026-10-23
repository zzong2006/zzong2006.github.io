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
      description: "Public site-wide visit count from GoatCounter",
      version: "1.0.0",
      defaultPosition: "left",
      defaultPriority: 40,
    },
  },
}

// GoatCounter 의 TOTAL 카운터(https://CODE.goatcounter.com/counter/TOTAL.json)를 읽어 표시한다.
// 사이트 코드는 configuration.analytics 에서 가져오므로 따로 적지 않는다.
// GoatCounter 설정의 "Allow adding visitor counts on your website" 가 꺼져 있거나
// 요청이 실패하면 요소를 숨긴 채로 둔다.
const script = `
(() => {
  let totalPromise = null;
  function loadTotal(endpoint) {
    if (!totalPromise) {
      totalPromise = fetch(endpoint)
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => (data && typeof data.count === "string" ? data.count : null))
        .catch(() => null);
    }
    return totalPromise;
  }
  document.addEventListener("nav", async () => {
    for (const el of document.querySelectorAll(".site-visits[data-endpoint]")) {
      const count = await loadTotal(el.dataset.endpoint);
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
        "data-endpoint": `https://${analytics.websiteId}.${host}/counter/TOTAL.json`,
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
