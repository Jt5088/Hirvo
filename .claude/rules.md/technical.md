# Technical Rules

## File Structure
```
index-2.html                        ← monolithic original (reference only, do not edit)
website/landing-page/
├── build.sh                        ← concat sections → dist/index.html, copies all assets
├── dist/                           ← build output (do not edit directly)
├── index.html                      ← shell only — DO NOT add inline HTML here
├── signin.html / signin/index.html ← standalone sign-in page
├── fonts/fonts.css                 ← Google Fonts @import
├── styles/
│   ├── tokens.css                  ← ONLY place for colors, spacing, easing, durations
│   ├── base.css / typography.css / layout.css / buttons.css / animations.css
│   └── components/                 ← one file per section (includes auth.css, pricing.css)
├── sections/                       ← source of truth for HTML (no html/head/body wrappers)
└── js/                             ← one IIFE per concern, no modules, no bundler
```

## Architecture Rules
- **Sections are the source of truth.** `index.html` uses `<!-- INCLUDE: sections/foo.html -->` markers only — never inline HTML.
- **CSS load order is strict:** `tokens → base → typography → layout → buttons → animations → components/*`
- **JS load order:** `nav → animations → hero-parallax → ripple → faq → app-window → pricing → aurora → glow → scroll-anim` (Three.js CDN loads before all)
- **JS files are IIFEs** — `(function() { ... })();`. No `import`/`export`, no modules, no bundler.
- **All design tokens live only in `tokens.css`** — see `rules/design-rules.md` for full reference.
- **Do not add new CSS files** without permission — use existing component files.
- **Do not edit `index.html` directly** — edit in `sections/`, `styles/`, or `js/` only.

## JS File Responsibilities
| File | Responsibility |
|------|----------------|
| `nav.js` | Scroll-density class on nav, active-section highlighting |
| `animations.js` | `.reveal` fade-up on scroll, `[data-count]` counter animation |
| `hero-parallax.js` | Mouse → `.hero-glow` translate (±18px / ±8px) |
| `ripple.js` | Click ripple on `.btn-pri` |
| `faq.js` | Accordion open/close with `max-height` transition |
| `app-window.js` | Hero demo tab switcher — owns all 5 view HTML templates as strings |
| `pricing.js` | Pricing toggle (monthly/annual) |
| `aurora.js` | Three.js WebGL aurora shader (warm neutral colors, IntersectionObserver gated) |
| `glow.js` | `pointermove` glow — limited to `.ui-frame` elements only |
| `scroll-anim.js` | Additional scroll-triggered animations |

## External Dependencies
- Google Fonts Inter (via `<link>` in `<head>`)
- Three.js r128 (CDN `<script>` before `</body>`, used by `aurora.js`)
- No npm, no bundler, no framework
