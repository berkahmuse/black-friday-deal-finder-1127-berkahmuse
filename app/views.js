// HTML for DealHound's pages, built from the deal data. Every value is
// escaped before it goes into the page, and every price shown is computed
// from the deal's own sale and usual prices, never typed twice.

import { discountPercent, dollarsSaved } from "./filters.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const usd = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

const VERDICT_LABEL = {
  "new-low": "NEW LOW",
  strong: "STRONG DEAL",
  fair: "FAIR DEAL",
};

const day = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

export function verdictBadge(deal) {
  return `<span class="verdict verdict-${deal.verdict}">${VERDICT_LABEL[deal.verdict]}</span>`;
}

export function dealCard(d) {
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${discountPercent(d)}% off</span></p>
  <p class="saved">You save ${usd(dollarsSaved(d))}</p>
  <p class="signal">${verdictBadge(d)} <span class="evidence">${escape(d.evidence)}</span></p>
  <p class="meta">Checked ${day(d.checked)} · ${escape(d.source)}</p>
  <p class="cta"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} ↗</a></p>
</article>`;
}

export function dealRows(shown) {
  if (shown.length === 0) {
    return `<p class="empty">No deal matches those filters. Loosen the discount or clear the search.</p>`;
  }
  return `<div class="grid">${shown.map(dealCard).join("")}</div>`;
}

export function filterBar(state, categories, stores, total) {
  const option = (value, label, current) =>
    `<option value="${escape(value)}"${value === current ? " selected" : ""}>${escape(label)}</option>`;
  return `<section class="filters" aria-label="Search and filter deals">
  <label class="search">Search <input id="q" type="search" placeholder="Try “AirPods”, “vacuum”, “LEGO”…" value="${escape(state.query)}"></label>
  <label>Category <select id="category">${option("All", "All categories", state.category)}${categories.map((c) => option(c, c, state.category)).join("")}</select></label>
  <label>Store <select id="store">${option("All", "All stores", state.store)}${stores.map((s) => option(s, s, state.store)).join("")}</select></label>
  <label>Discount <select id="minoff">
    ${option("0", "Any discount", String(state.minOff))}
    ${option("30", "30% off or more", String(state.minOff))}
    ${option("40", "40% off or more", String(state.minOff))}
    ${option("50", "50% off or more", String(state.minOff))}
  </select></label>
  <label>Verdict <select id="verdict">
    ${option("All", "Any verdict", state.verdict)}
    ${option("new-low", "New lows only", state.verdict)}
    ${option("strong", "Strong deals only", state.verdict)}
    ${option("fair", "Fair deals only", state.verdict)}
  </select></label>
  <label>Sort <select id="sort">
    ${option("best", "Best deals first", state.sort)}
    ${option("discount", "Biggest % off", state.sort)}
    ${option("saved", "Biggest $ saving", state.sort)}
    ${option("price-low", "Lowest price", state.sort)}
    ${option("price-high", "Highest price", state.sort)}
  </select></label>
  <p class="count"><strong id="count">${total} deals</strong> · prices checked 27 Nov 2026</p>
</section>`;
}

export function listPage(state, categories, stores, shown, total) {
  return `<h1>Real Black Friday deals, checked today.</h1>
<p class="lede">31 deals from Amazon, Best Buy, Target and Walmart — every price read at the store or in a deals source that names the store, on 27 November 2026. Each card says honestly whether it is really a deal.</p>
${filterBar(state, categories, stores, shown.length)}
<p class="showing">Showing <strong>${shown.length}</strong> of ${total} deals</p>
${dealRows(shown)}`;
}

export function dealPage(d) {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${discountPercent(d)}% off</span></p>
  <p class="saved">You save ${usd(dollarsSaved(d))} off the usual price of ${usd(d.was)}.</p>
  <p class="signal big">${verdictBadge(d)}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${day(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p class="cta"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View this deal at ${escape(d.store)} ↗</a></p>
  <p class="note">Prices move fast on Black Friday — check the live price at the store before you buy.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
