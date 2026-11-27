// Deal math and filtering for DealHound: one small job each, no DOM here
// so the numbers can be checked on their own.

export function discountPercent(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function dollarsSaved(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

// Verdict strength, strongest first, for the "best first" sort.
const VERDICT_RANK = { "new-low": 0, strong: 1, fair: 2 };

export function verdictRank(deal) {
  return VERDICT_RANK[deal.verdict] ?? 3;
}

export function filterDeals(all, state) {
  const q = state.query.trim().toLowerCase();
  return all.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPercent(d) < state.minOff) return false;
    if (state.verdict !== "All" && d.verdict !== state.verdict) return false;
    return true;
  });
}

export function sortDeals(shown, mode) {
  const list = [...shown];
  if (mode === "discount") list.sort((a, b) => discountPercent(b) - discountPercent(a));
  else if (mode === "saved") list.sort((a, b) => dollarsSaved(b) - dollarsSaved(a));
  else if (mode === "price-low") list.sort((a, b) => a.price - b.price);
  else if (mode === "price-high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => verdictRank(a) - verdictRank(b) || discountPercent(b) - discountPercent(a));
  return list;
}
