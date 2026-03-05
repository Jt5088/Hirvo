# UIUX Handoff to Preview Branch (tb-preview)

**From:** tb-uiux
**Date:** 2026-03-05

---

## Current Preview System (in resume-builder-v2)

The preview is already functional. Here's how it works:

### Architecture
- **Rendering:** iframe-based with `doc.open()/write()/close()` on each data change
- **Debounce:** 150ms for typing input, immediate for template switches
- **Template loading:** Templates register on `window.HirvoTemplates`, each exposes `render(data)` returning `{style, html}`
- **Font loading:** Google Fonts re-fetched via `<link>` tag on each render (browser-cached, but suboptimal)
- **Error handling:** On render failure, displays red error message inside the iframe instead of going blank

### What Was Fixed (by tb-uiux)
- Preview container now uses `aspect-ratio: 210 / 297` (A4) with `max-height: calc(100vh - 56px - 48px)`
- Removed inset shadow that was adding visual noise
- Panel padding increased from 24px to 32px for breathing room
- Error state shows in-iframe error message (red text) instead of blank white

### Performance Observations
- Google Fonts `<link>` is injected into every `doc.write()` call — browser caches help but it's a full DOM teardown each render
- No virtual DOM diffing — full rewrite on every keystroke (debounced)
- No lazy loading of template JS files — all 8 load on page init

### Upgrade Path (from research consensus)
1. **Short-term:** Keep `doc.write()` approach but optimize font loading (preload fonts once, inject via `@font-face` rules instead of Google Fonts link)
2. **Medium-term:** Use `srcdoc` attribute instead of `doc.open()/write()/close()` for cleaner lifecycle
3. **Long-term:** Server-side Chromium (Puppeteer/Playwright) for pixel-perfect PDF generation — this is what Resume.io and Reactive Resume use

### Print/PDF Notes
- Currently uses browser `window.print()` for PDF — adequate for v1
- Print styles are embedded in every template (`@page` margins, `page-break-inside: avoid`)
- Dark-background templates (modern header, design sidebar, creative header) have `print-color-adjust: exact`
- Two-column templates (design.js) have inherent multi-page print issues — sidebar won't repeat on page 2

### Template Render Contract
Every template's `render(data)` receives:
```js
{
  personal: { firstName, lastName, email, phone, linkedin, website, location, summary },
  experience: [{ role, company, startDate, endDate, location, description }],
  education: [{ degree, institution, startDate, endDate, description }],
  skills: [{ category, items }],
  languages: [{ language, proficiency }],
  certifications: [{ name, year }]
}
```
Returns: `{ style: '<css string>', html: '<html string>' }`

### Relevant Files
```
resume-builder-v2/src/js/preview.js      — iframe render logic
resume-builder-v2/src/js/template-engine.js — template registry + render dispatch
resume-builder-v2/src/templates/*.js      — 8 template files
```

---

## P2/P3 Preview Features (from UIUX review)

| Priority | Feature | Notes |
|---|---|---|
| P2 | Template switch crossfade | Opacity transition on iframe during template change |
| P3 | Click-to-edit on preview | iframe postMessage to focus corresponding form field — high complexity |

---
