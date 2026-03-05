# UIUX Handoff to Code Branch (tb-resume-code)

**From:** tb-uiux
**Date:** 2026-03-05
**Commits:** f196f6e, 685df42

---

## What Was Done

### Research (11 builders analyzed)
Full reports in `tb-uiux:Hirvo template builder/research/`:
- `agent-1-premium-builders.md` -- Reactive Resume, FlowCV, Resume.io
- `agent-2-opensource-builders.md` -- Resumake, JSON Resume, OpenResume, Standard Resume
- `agent-3-massmarket-builders.md` -- Canva, Zety, Novoresume, Enhancv

### Audits
- `uiux-review.md` -- 23 issues, prioritized P0-P3
- `template-audit.md` -- all 8 templates scored 7.0-8.5
- `code-audit.md` -- 18 bugs (3 critical, 6 medium, 9 low)

### Fixes Applied
- Created missing `classic.js` template (was referenced but didn't exist)
- Template swatches now use accent colors (distinguishable)
- Form labels bumped from 32% to 64% opacity
- Section count badges on accordion headers
- Add buttons use neutral colors (removed purple accent violation)
- Preview constrained to A4 aspect ratio
- Export JSON button wired up
- Keyboard nav on template cards
- Accordion max-height driven by JS only (removed CSS conflict)
- WCAG AA contrast fixes on all 8 templates
- Page break handling added to all 8 templates
- LinkedIn added to 4 templates that were missing it
- Print color-adjust for dark headers
- Import validation added to prevent malformed JSON crashes

---

## What the Coder Branch Needs to Know

### Architecture Decisions (from research consensus)
1. **Keep vanilla JS / IIFE pattern** -- no framework migration needed for v2
2. **Data model should be template-agnostic** -- JSON data separate from template rendering (already the case)
3. **Client-side PDF via browser print is fine for now** -- server-side Chromium is the upgrade path later
4. **All templates share the same `esc()` function** -- still duplicated in 8 files, consider centralizing in `template-engine.js`

### Remaining P2/P3 Items for Code Branch
These are UX features the coder should implement:

| Priority | Feature | Complexity |
|---|---|---|
| P2 | Entry reorder (up/down buttons in list-item-header) | Low |
| P2 | Autosave indicator ("Saved" flash in header) | Low |
| P2 | Template switch crossfade (opacity transition on iframe) | Low |
| P2 | Completeness indicator (progress bar under template selector) | Medium |
| P3 | Section reordering (drag or up/down on form-section headers) | Medium |
| P3 | Click-to-edit on preview (iframe postMessage to focus form field) | High |
| P3 | Undo/redo stack (last 20 states) | Medium |
| P3 | Centralize `esc()` into template-engine.js | Low |

### Template Design Notes for tb-resume-designs
- All 8 templates now pass WCAG AA contrast (minimum #6b7280 for secondary text)
- Design template (2-column) has inherent multi-page print issues -- sidebar won't repeat
- Creative template is most expressive but least ATS-friendly -- consider adding ATS warnings
- Classic scored 8.0, Modern scored highest at 8.5
- Any new templates should include: LinkedIn rendering, @page margins, page-break-inside:avoid, print-color-adjust if using dark backgrounds

### Preview System Notes for tb-preview
- Preview is iframe-based with `doc.open()/write()/close()` on each render
- Debounced at 150ms for typing, immediate for template switches
- Google Fonts re-fetched on each render (cached by browser, but consider optimizing)
- Error state now shows red error message in iframe instead of blank
- A4 aspect ratio enforced via CSS `aspect-ratio: 210 / 297`

---

## File Locations

All UIUX work lives in:
```
tb-uiux worktree: /Users/josephtian/Desktop/hirvo-tb-uiux/
  Hirvo template builder/
    research/           -- 7 research + audit files
    resume-builder-v2/  -- full updated codebase
```

The main repo (tb-resume-code) codebase is at:
```
/Users/josephtian/Desktop/Hirvo/Hirvo Template Builder/resume-builder-v2/
```

Coder should pull fixes from tb-uiux or reference the files there.
