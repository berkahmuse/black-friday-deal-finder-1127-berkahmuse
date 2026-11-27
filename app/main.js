// DealHound's wiring: hash routes (#/ and #/deal/<id>), the filter bar,
// and URL parameters (?q=&category=&store=&minoff=&verdict=&sort=) so a
// filtered view can be linked and screenshotted directly.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES } from "./data.js";
import { filterDeals, sortDeals } from "./filters.js";
import { listPage, dealPage, missingPage } from "./views.js";

const app = document.getElementById("app");

function readState() {
  const params = new URLSearchParams(location.search);
  const num = (key, fallback) => {
    const v = Number.parseInt(params.get(key) ?? "", 10);
    return Number.isNaN(v) ? fallback : v;
  };
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "All",
    store: params.get("store") ?? "All",
    minOff: num("minoff", 0),
    verdict: params.get("verdict") ?? "All",
    sort: params.get("sort") ?? "best",
  };
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealHound`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    const state = readState();
    const shown = sortDeals(filterDeals(deals, state), state.sort);
    document.title = "DealHound — Real Black Friday Deals, Checked Today";
    app.innerHTML = listPage(state, CATEGORIES, STORES, shown, deals.length);
    const sync = () => {
      const next = new URLSearchParams();
      const q = app.querySelector("#q").value;
      const category = app.querySelector("#category").value;
      const store = app.querySelector("#store").value;
      const minoff = app.querySelector("#minoff").value;
      const verdict = app.querySelector("#verdict").value;
      const sort = app.querySelector("#sort").value;
      if (q) next.set("q", q);
      if (category !== "All") next.set("category", category);
      if (store !== "All") next.set("store", store);
      if (minoff !== "0") next.set("minoff", minoff);
      if (verdict !== "All") next.set("verdict", verdict);
      if (sort !== "best") next.set("sort", sort);
      const query = next.toString();
      history.replaceState(null, "", query ? `?${query}#/` : "#/");
      render();
    };
    app.querySelector("#q").addEventListener("input", sync);
    for (const id of ["category", "store", "minoff", "verdict", "sort"]) {
      app.querySelector(`#${id}`).addEventListener("change", sync);
    }
    const search = app.querySelector("#q");
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
