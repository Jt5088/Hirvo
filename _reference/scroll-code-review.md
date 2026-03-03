# Hirvo Scroll Animation — Code Review

**Date:** 2026-03-02
**Scope:** scroll-anim.js, animations.js, nav.js, animations.css, base.css, tokens.css, all component CSS, all sections/*.html

---

## How the .reveal System Works

### Trigger Mechanism

- `nav.js:8` — synchronous `no-js` → `js` class replacement on `<html>`, gates all reveal CSS
- `animations.js` — IntersectionObserver adds `.in` to `.reveal` elements at threshold, then unobserves (one-shot)

### Current Reveal Classes (post-refactor)

| Class | Purpose | Travel | Duration | Easing |
|---|---|---|---|---|
| `.reveal` | Cards, lists, default | 12px | 600ms | ease-out-quint |
| `.reveal-h` | Section headings (h2) | 14px | 700ms | ease-out-quint |
| `.reveal-f` | Body text, subtitles | opacity only | 600ms | ease-out-cubic |
| `.reveal-l` | Labels, badges | 6px | 500ms | ease-out-quint |
| `.reveal-w` | Product widgets/demos | 20px + scale(0.98) | 800ms | ease-out-quint |

### Stagger Delays

`.d1` through `.d6` at 120ms intervals (relaxed cascade).

### Observer Configuration

- Headings (`ioHead`): threshold 0.2, rootMargin `-60px 0px 0px 0px`
- Cards/text (`io`): threshold 0.15, rootMargin `-40px 0px 0px 0px`
- Widgets (`ioWidget`): threshold 0.1, rootMargin `-40px 0px 0px 0px`

---

## Industry Reference — Gap Analysis

| Property | Hirvo (Current) | Industry Standard |
|---|---|---|
| translateY | 6–14px (differentiated) | 8–24px (differentiated) |
| Duration | 500–800ms (differentiated) | 400–700ms (differentiated) |
| Easing | ease-out-quint / ease-out-cubic | ease-out-expo or ease-out-quint |
| Threshold | 0.1–0.2 (per type) | 0.10–0.40 (per type) |
| rootMargin | top-only inset | top-only inset |
| Stagger | 120ms CSS classes | 80–120ms, CSS custom props inline |
| Observer count | 3 (heading, standard, widget) | 2–3, differentiated |
| will-change | Declared on all reveal types | Declared on animating elements |
| Body text Y | opacity only | opacity only |
| Widget scale | 0.98 → 1.0 | 0.97 → 1.0 |

---

## Key Findings

### MAJOR — Metrics cards desync (proof.css + animations.js)
`.mcard` opacity:0 not guarded by `html.js` — invisible without JS. Counter and card fade-in feel desynced.

### MAJOR — Hero scroll-tilt race condition (scroll-anim.js)
`updateTransform()` called at init regardless of hero entrance state. Can cause simultaneous rise + tilt on mid-scroll page load.

### MINOR — Magic number timeout (animations.js:24)
`3500ms` hardcoded for hero overflow restore. Should use `transitionend` event.

### MINOR — prefers-reduced-motion uses `*` selector
Overly broad — zeroes all transition-delay including non-animation UX delays.

---

## Commendations

1. `prefers-reduced-motion` is thorough with three layers of specificity
2. `no-js` → `js` gate is correct progressive enhancement
3. Hero entrance and scroll-tilt on separate DOM elements prevents transform conflicts
4. Compositor-only animation: `transform` + `opacity` only, no layout properties

---

## Sources

- Linear.app (CSS inspection, rebuilding-linear.app GitHub repo)
- Stripe Connect front-end experience blog
- Vercel Geist design system
- Raycast.com (CSS analysis)
- Nielsen Norman Group animation duration research
- Material Design 3 motion tokens
