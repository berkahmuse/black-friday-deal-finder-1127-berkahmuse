# DealHound — Real Black Friday Deals, Checked Today

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/berkahmuse/black-friday-deal-finder-1127-berkahmuse/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/berkahmuse/black-friday-deal-finder-1127-berkahmuse/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

A Black Friday / Cyber Monday deal finder for the [make.fun Black Friday deal finder bounty](https://make.fun/c/black-friday-deal-finder-01).

**31 real deals** from Amazon, Best Buy, Target and Walmart. Every price was
found and checked by the maker on 27 November 2026, reading the price at the
named store or in a deals source that names the store — each card shows the
sale price, the usual price, the discount, the store link, when the price was
checked, and the source it was read in. Each deal also carries an honest
verdict — **NEW LOW**, **STRONG DEAL** or **FAIR DEAL** — with the evidence
behind it, so shoppers can tell a true bargain from a routine sale.

## What it does

- Search across products, stores and categories
- Filter by category, store, minimum discount and verdict
- Sort by best deal first, biggest % off, biggest $ saving, or price
- A detail page for every deal with its full price history note, source and check time
- The same product compared across stores (Nintendo Switch 2 bundle: Target vs Walmart)
- Works on desktop and on a phone; fully static, zero network requests

## Run it

```sh
node serve.ts        # http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
