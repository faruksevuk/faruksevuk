# DESIGN.md — faruksevuk.com

Visual system of the "Bottle Green Ledger" design (July 2026). Read with [PRODUCT.md](PRODUCT.md).

## Theme

Drenched: the surface IS the color. The whole page soaks in deep bottle green; one squeezed-lime accent carries every call to action. No neutral gray anywhere — all secondary text is a green-tinted alpha-of-ink.

## Color tokens (`style.css :root`)

| Token | Value | Role | Contrast (on --surface) |
|---|---|---|---|
| `--surface` | `#11241c` | body drench | — |
| `--surface-2` | `#0d1c16` | contact recess | — |
| `--card` / `--meld` | `#163027` / `#19392c` | panels / flagship panel | — |
| `--rope` / `--rope-soft` | `#2c4a3c` / `#21382e` | hairlines | — |
| `--paper` | `#eef4e9` | primary ink | 14.50:1 |
| `--dim` / `--dim2` | `#a9c0a5` / `#bcd0b7` | secondary ink | 8.33:1 / — |
| `--faint` | `#7f9a7c` | decorative captions only | 5.27:1 |
| `--zest` | `#c6f24e` | THE accent — CTAs, links, focus | 12.54:1 |
| `--zest-deep` / `--zest-ink` | `#9fd815` / `#11241c` | hover fill / ink-on-zest | — |

Rule: never introduce neutral gray; tint toward the surface hue or use alpha of `--paper`.

## Typography

- **Display:** Clash Display 500/600/700 (Fontshare) — headings, ledger head, phone dish name.
- **Body:** Familjen Grotesk 400/500/600/700 (Fontshare) — everything else.
- Fallback chains end in system-ui; layout must survive a blocked Fontshare CDN.
- Fluid modular scale ratio ≈1.28 (`--step--1` … `--step-hero`, hero max 5.6rem ≤ 6rem cap). Headings `text-wrap: balance`, prose `pretty`, letter-spacing floor −0.03em.

## Signature elements (do not genericize)

- **The shipping ledger** — proof points as annotated tick line-items under "Shipped, not slideware" / "Four things that are true, and checkable:". Never stat-cards, never numbered 01/02/03.
- **Drafting corner-brackets** on the portrait (two L-shaped zest corners) + "Istanbul → open to the EU" caption chip.
- **Meld phone mock** — CSS-built fusion recipe card (Today's fusion, cuisine chips, dish, Halal/45-min pills, EN·TR·DE·JA·+8 language strip, "Meld it again"). Flagship gets the richest visual; supporting projects get one bespoke SVG artifact each (before/after bars = the 70% cut; three overlapping rings = Dreamie's three readings).
- **Matrix easter egg** — double-click (or 2× Enter/Space) on the portrait → ~5s green rain → "You found the treasure! It's me, hehe :)" → self-cleanup. Sound `sounds/matrix.mp3` lazy-loaded, credited in the footer. Keep it; it's his signature.

## Motion

Progressive enhancement only: base state fully visible; JS adds `.reveal-armed` on `<html>`, IntersectionObserver adds `.is-in`, 1800ms safety-net force-shows everything. Ease: `--ease` (quart-ish) / `--ease-expo`. `prefers-reduced-motion: reduce` collapses all animation and swaps the egg's rain for a static message. Never gate content visibility on JS.

## Hard constraints

Zero build step, three files (index.html / style.css / script.js), WCAG 2.1 AA minimum (verified ratios above), 44px touch targets, skip link + `:focus-visible` everywhere, works 360px+, no custom cursors, no horizontal overflow (`overflow-x: clip` is a backstop, not a mask — verify at 360/390/768/1280 when editing).
