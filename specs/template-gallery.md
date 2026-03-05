# Component Spec: Template Gallery

**Component:** Template Gallery (browse and select resume templates)
**Author:** uiux-agent-2 (tb-uiux subbranch)
**Date:** 2026-03-05
**Status:** Draft
**Dependencies:** Hirvo design tokens (`tokens.css`), Final 8 template slate (tb-resume-designs)

---

## 1. Gallery Layout

### Grid System

The gallery uses CSS Grid with responsive column counts. Cards sit inside a `.wrap` container (max-width: 1320px, padding-inline: 24px desktop / 16px mobile).

```
.tg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-block: 32px;
}
```

| Breakpoint | Columns | Gap | Notes |
|---|---|---|---|
| > 860px | 3 | 16px | Desktop default |
| 481px -- 860px | 2 | 16px | Tablet |
| <= 480px | 1 | 12px | Mobile, cards stretch full width |

### Card Sizing

Each card uses a fixed aspect ratio container for the thumbnail plus a metadata footer. The thumbnail area enforces US Letter proportions (8.5:11 = ~0.7727:1).

```
.tg-card {
  display: flex;
  flex-direction: column;
  min-width: 0; /* prevent grid blowout */
}

.tg-thumb-wrap {
  position: relative;
  aspect-ratio: 8.5 / 11;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  background: var(--surf);
}
```

The thumbnail image (`<img>` or rendered `<canvas>`) fills the wrapper with `object-fit: cover`. On desktop at 3-col in a 1320px container, each card is approximately 416px wide, producing a thumbnail area of ~416 x 539px.

### Section Header

Above the grid, a section header with the gallery title and the category filter bar.

```html
<section class="tg" id="template-gallery">
  <div class="wrap">
    <div class="tg-head">
      <h2 class="t-h2 reveal-h">Choose a template</h2>
      <p class="t-body reveal-f" style="color: var(--t2); max-width: 540px;">
        8 archetypes. Zero overlap. Every template is ATS-tested and recruiter-validated.
      </p>
    </div>
    <div class="tg-filters reveal-l">
      <!-- filter pills here -->
    </div>
    <div class="tg-level-toggle reveal-l">
      <!-- career level toggle here -->
    </div>
    <div class="tg-grid">
      <!-- template cards here -->
    </div>
  </div>
</section>
```

---

## 2. Card Design

### Glass Card Treatment

All cards use the unified Hirvo glass card system. The card wraps the thumbnail and a metadata bar.

```
.tg-card {
  background: rgba(19, 19, 22, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bdr2);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color var(--d2) var(--ease),
    background var(--d2) var(--ease),
    transform var(--d2) var(--ease),
    box-shadow var(--d2) var(--ease);

  /* Depth shadow stack */
  box-shadow:
    inset 0 1px 0 var(--highlight),
    0 1px 2px var(--shadow-near),
    0 4px 8px var(--shadow-mid),
    0 12px 24px var(--shadow-far),
    0 24px 48px var(--shadow-ambient);
}
```

### Hover State

```
.tg-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(19, 19, 22, 0.92);
  transform: translateY(-4px);
  box-shadow:
    inset 0 1px 0 var(--highlight),
    0 2px 4px var(--shadow-near),
    0 8px 16px var(--shadow-mid),
    0 16px 32px var(--shadow-far),
    0 32px 64px var(--shadow-ambient);
}
```

### Focus State (Keyboard Navigation)

```
.tg-card:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 2px;
  border-color: rgba(255, 255, 255, 0.15);
}
```

### Thumbnail Area

The thumbnail sits inside `.tg-thumb-wrap`. The resume preview image renders on a white background (the document itself is white, matching real paper). A subtle bottom fade prevents a hard edge against the metadata bar.

```
.tg-thumb-wrap {
  position: relative;
  aspect-ratio: 8.5 / 11;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  background: #FFFFFF;
}

.tg-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

/* Bottom fade into card surface */
.tg-thumb-wrap::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(
    to top,
    rgba(19, 19, 22, 0.85) 0%,
    rgba(19, 19, 22, 0.6) 30%,
    rgba(19, 19, 22, 0.3) 60%,
    transparent 100%
  );
  pointer-events: none;
}
```

### Metadata Bar

Below the thumbnail, a compact metadata area with template name, category label, and ATS score badge.

```html
<div class="tg-meta">
  <div class="tg-meta-top">
    <h3 class="t-h3 tg-name">Jake's Resume</h3>
    <span class="tg-ats-badge">ATS 98</span>
  </div>
  <span class="lbl tg-category">Classic Tech</span>
</div>
```

```
.tg-meta {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tg-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tg-name {
  color: var(--t1);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tg-category {
  color: var(--t3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
```

### ATS Score Badge

A small inline badge showing the ATS compatibility score. Color-coded using status tokens.

```
.tg-ats-badge {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Score tiers */
.tg-ats-badge[data-score="high"] {
  color: var(--green);
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.tg-ats-badge[data-score="mid"] {
  color: var(--amber);
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.tg-ats-badge[data-score="low"] {
  color: var(--red);
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
}
```

Score thresholds: 90+ = high (green), 70-89 = mid (amber), <70 = low (red). Based on the Final 8 slate, most templates will be high (single-column, ATS-optimized). The Two-Column Structured Modern template may show mid.

### Full Card HTML Structure

```html
<article class="tg-card reveal d2" tabindex="0" role="button"
         aria-label="Jake's Resume template, Classic Tech, ATS score 98"
         data-template="jakes-resume" data-category="classic-tech">
  <div class="tg-thumb-wrap">
    <img src="/templates/thumbs/jakes-resume.webp"
         alt="Preview of Jake's Resume template"
         loading="lazy"
         width="960" height="1243" />
  </div>
  <div class="tg-meta">
    <div class="tg-meta-top">
      <h3 class="t-h3 tg-name">Jake's Resume</h3>
      <span class="tg-ats-badge" data-score="high">ATS 98</span>
    </div>
    <span class="lbl tg-category">Classic Tech</span>
  </div>
</article>
```

Thumbnail images should be served as WebP at 960px wide (matching US Letter aspect ratio: 960 x 1243px). Use `loading="lazy"` on all cards below the fold.

---

## 3. Category Filter

### Filter Bar Layout

Horizontally scrollable row of pill-shaped filter buttons. On desktop, pills fit in a single row. On mobile, the row scrolls horizontally with overscroll padding.

```html
<div class="tg-filters" role="tablist" aria-label="Template categories">
  <button class="tg-pill tg-pill--active" role="tab" aria-selected="true" data-filter="all">
    All
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="classic-tech">
    Classic Tech
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="modern-designer">
    Modern Designer
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="elegant-professional">
    Elegant Professional
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="traditional">
    Traditional
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="executive">
    Executive
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="ats-dense">
    ATS-Dense
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="creative-ats">
    Creative-ATS
  </button>
  <button class="tg-pill" role="tab" aria-selected="false" data-filter="polished-technical">
    Polished Technical
  </button>
</div>
```

### 9 Filter Categories (All + 8 Archetypes)

Mapping from the Final 8 slate to filter pills:

| Filter Pill | Template(s) | data-filter Value |
|---|---|---|
| All | Shows all 8 | `all` |
| Classic Tech | Jake's Resume | `classic-tech` |
| Modern Designer | Swiss/International Typographic | `modern-designer` |
| Elegant Professional | Serif/Sans-Serif Paired (Cordova) | `elegant-professional` |
| Traditional | Harvard / Wharton hybrid | `traditional` |
| Executive | FlowCV Corporate + Butterick | `executive` |
| ATS-Dense | Rezi Executive | `ats-dense` |
| Creative-ATS | Two-Column Structured Modern | `creative-ats` |
| Polished Technical | Standard Resume Pender | `polished-technical` |

### Pill Styling

```
.tg-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px; /* prevent clipping of focus outlines */
  margin-bottom: 24px;
}

.tg-filters::-webkit-scrollbar {
  display: none;
}

.tg-pill {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 100px; /* full pill */
  border: 1px solid var(--bdr2);
  background: transparent;
  color: var(--t2);
  cursor: pointer;
  transition:
    background var(--d2) var(--ease),
    border-color var(--d2) var(--ease),
    color var(--d2) var(--ease);
  flex-shrink: 0;
}

.tg-pill:hover {
  background: var(--highlight);
  border-color: var(--bdr3);
  color: var(--t1);
}

.tg-pill--active {
  background: var(--cta);
  border-color: var(--cta);
  color: var(--cta-text);
}

.tg-pill--active:hover {
  background: var(--cta-hover);
  border-color: var(--cta-hover);
  color: var(--cta-text);
}

.tg-pill:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 2px;
}
```

### Filter Behavior (JS)

Clicking a filter pill:
1. Updates `aria-selected` on all pills.
2. Toggles `.tg-pill--active` class.
3. Filters cards by matching `data-category` on `.tg-card` against `data-filter` on the pill.
4. Non-matching cards get `.tg-card--hidden` which animates out, then `display: none` after transition completes.

```
.tg-card--hidden {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
  pointer-events: none;
  transition:
    opacity var(--d2) var(--ease-out),
    transform var(--d2) var(--ease-out);
}
```

After the 280ms transition, JS sets `display: none` to collapse grid space. When a card re-enters, JS removes `display: none`, forces reflow, then removes `.tg-card--hidden` to trigger the enter animation.

---

## 4. Template Switch Animation

When a user selects a template (clicks a card) and the editor preview updates, the switch uses a crossfade rather than an instant re-render. This is a universal gap -- zero competitors animate template switches.

### Crossfade Spec

- **Duration:** 300ms
- **Easing:** `var(--ease-out)` (`cubic-bezier(0.33, 1, 0.68, 1)`)
- **Method:** The outgoing template preview fades to `opacity: 0` while the incoming preview fades from `opacity: 0` to `opacity: 1`. Both are absolutely positioned within the preview container so they overlap during the transition.

```
.tg-preview-outgoing {
  animation: tg-fadeout 300ms var(--ease-out) forwards;
}

.tg-preview-incoming {
  animation: tg-fadein 300ms var(--ease-out) forwards;
}

@keyframes tg-fadeout {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.98); }
}

@keyframes tg-fadein {
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
}
```

The slight scale shift (0.98 out, 1.02 in) adds depth to the crossfade without being distracting.

### Skeleton Shimmer (Loading State)

If template rendering takes >100ms, show a skeleton screen with a shimmer animation. This covers the gap between user click and rendered preview.

```html
<div class="tg-skeleton" aria-hidden="true">
  <div class="tg-skeleton-line tg-skeleton-line--name"></div>
  <div class="tg-skeleton-line tg-skeleton-line--contact"></div>
  <div class="tg-skeleton-line tg-skeleton-line--section"></div>
  <div class="tg-skeleton-line tg-skeleton-line--body"></div>
  <div class="tg-skeleton-line tg-skeleton-line--body"></div>
  <div class="tg-skeleton-line tg-skeleton-line--body tg-skeleton-line--short"></div>
  <div class="tg-skeleton-line tg-skeleton-line--section"></div>
  <div class="tg-skeleton-line tg-skeleton-line--body"></div>
  <div class="tg-skeleton-line tg-skeleton-line--body"></div>
</div>
```

```
.tg-skeleton {
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #FFFFFF;
  border-radius: 4px;
  aspect-ratio: 8.5 / 11;
}

.tg-skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #E8E8E8 0%,
    #F5F5F5 40%,
    #E8E8E8 80%
  );
  background-size: 200% 100%;
  animation: tg-shimmer 1.5s ease-in-out infinite;
}

.tg-skeleton-line--name {
  height: 20px;
  width: 45%;
  margin-bottom: 4px;
}

.tg-skeleton-line--contact {
  height: 8px;
  width: 60%;
  margin-bottom: 16px;
}

.tg-skeleton-line--section {
  height: 14px;
  width: 30%;
  margin-top: 8px;
  margin-bottom: 2px;
}

.tg-skeleton-line--short {
  width: 65%;
}

@keyframes tg-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

The skeleton layout roughly mirrors the structure of a typical resume (name, contact line, section headings, body text lines) so the transition from skeleton to rendered template feels natural.

### Timing Diagram

```
User clicks card
  |
  +-- t=0ms:     Card gets .tg-card--selected (ring highlight)
  +-- t=0ms:     Begin rendering new template (async)
  +-- t=0ms:     If render not instant, show skeleton shimmer
  +-- t=Xms:     Template render complete
  +-- t=Xms:     Crossfade skeleton/old -> new (300ms, --ease-out)
  +-- t=X+300ms: Transition complete, clean up old DOM
```

If render completes in <100ms, skip the skeleton entirely and crossfade directly from old to new.

---

## 5. Hover Preview

On desktop, hovering a card for 400ms triggers an enlarged preview overlay. This gives users a detailed look before committing to a template.

### Trigger

- **Desktop only** (> 860px). No hover preview on touch devices.
- **Delay:** 400ms hover dwell time before showing. Prevents accidental triggers during casual browsing.
- **Dismiss:** Moving cursor off the card or preview dismisses immediately with a 200ms fade-out.

### Preview Overlay Layout

The preview appears as an enlarged card that floats above the grid, anchored to the hovered card's position. It scales up the thumbnail to approximately 480px wide and adds a detail panel.

```html
<div class="tg-hover-preview" role="tooltip" aria-hidden="true">
  <div class="tg-hover-thumb">
    <img src="/templates/thumbs/jakes-resume-hd.webp"
         alt="Enlarged preview of Jake's Resume template" />
  </div>
  <div class="tg-hover-details">
    <h4 class="t-h3 tg-hover-name">Jake's Resume</h4>
    <span class="lbl tg-hover-archetype">Classic Tech</span>
    <div class="tg-hover-specs">
      <span class="tg-hover-spec">Single column</span>
      <span class="tg-hover-spec">Sans-serif</span>
      <span class="tg-hover-spec">Dense</span>
    </div>
    <div class="tg-hover-score">
      <span class="tg-ats-badge" data-score="high">ATS 98</span>
    </div>
    <button class="tg-hover-cta">Use Template</button>
  </div>
</div>
```

### Preview Styling

```
.tg-hover-preview {
  position: fixed;
  z-index: 100;
  display: flex;
  gap: 0;
  background: rgba(19, 19, 22, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bdr3);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 4px 8px var(--shadow-near),
    0 16px 32px var(--shadow-mid),
    0 32px 64px var(--shadow-far),
    0 48px 96px var(--shadow-ambient);
  pointer-events: auto;
  max-width: 520px;

  /* Entry animation */
  opacity: 0;
  transform: scale(0.96) translateY(4px);
  transition:
    opacity var(--d2) var(--ease),
    transform var(--d2) var(--ease);
}

.tg-hover-preview--visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.tg-hover-thumb {
  width: 320px;
  flex-shrink: 0;
  background: #FFFFFF;
}

.tg-hover-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.tg-hover-details {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-width: 180px;
}

.tg-hover-name {
  color: var(--t1);
  font-size: 17px;
  font-weight: 600;
}

.tg-hover-archetype {
  color: var(--t3);
}

.tg-hover-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tg-hover-spec {
  font-size: 11px;
  font-weight: 500;
  color: var(--t2);
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--highlight);
  border: 1px solid var(--bdr);
}
```

### "Use Template" CTA

White maximum-contrast button matching Hirvo CTA system.

```
.tg-hover-cta {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: var(--cta);
  color: var(--cta-text);
  cursor: pointer;
  margin-top: 8px;
  transition:
    background var(--d2) var(--ease),
    transform var(--d1) var(--ease);
}

.tg-hover-cta:hover {
  background: var(--cta-hover);
  transform: translateY(-1px);
}

.tg-hover-cta:active {
  transform: translateY(0);
}

.tg-hover-cta:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 2px;
}
```

### Positioning Logic (JS)

The preview's position is computed relative to the hovered card:
1. Get the card's bounding rect.
2. Place the preview to the right of the card if space allows (card.right + 16px gap).
3. If insufficient space on the right, place it to the left (card.left - preview.width - 16px).
4. Vertically center the preview relative to the card, clamped to viewport bounds with 16px margin.

---

## 6. Career Level Toggle

Research finding: spacing correlates with career seniority. Junior templates use tight spacing (1.0 line height, 0.5in margins). Executive templates use generous spacing (1.4-1.5 line height, 1.0in margins). The career level toggle lets users preview templates at different spacing presets without changing the template itself.

### Toggle Design

A segmented control with 3 options: Compact, Comfortable, Executive.

```html
<div class="tg-level" role="radiogroup" aria-label="Template spacing">
  <span class="lbl" style="color: var(--t3); margin-right: 12px;">Spacing</span>
  <button class="tg-level-btn tg-level-btn--active" role="radio" aria-checked="true" data-level="compact">
    Compact
  </button>
  <button class="tg-level-btn" role="radio" aria-checked="false" data-level="comfortable">
    Comfortable
  </button>
  <button class="tg-level-btn" role="radio" aria-checked="false" data-level="executive">
    Executive
  </button>
</div>
```

### Toggle Styling

```
.tg-level {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
}

.tg-level-btn {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 6px 14px;
  border: 1px solid var(--bdr2);
  background: transparent;
  color: var(--t2);
  cursor: pointer;
  transition:
    background var(--d2) var(--ease),
    border-color var(--d2) var(--ease),
    color var(--d2) var(--ease);
}

/* Segmented control: rounded ends, flat joins */
.tg-level-btn:first-of-type {
  border-radius: 8px 0 0 8px;
}

.tg-level-btn:last-of-type {
  border-radius: 0 8px 8px 0;
}

.tg-level-btn + .tg-level-btn {
  border-left: none; /* prevent double borders */
}

.tg-level-btn:hover {
  background: var(--highlight);
  color: var(--t1);
}

.tg-level-btn--active {
  background: var(--highlight-hover);
  border-color: var(--bdr3);
  color: var(--t1);
}

.tg-level-btn:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 2px;
  z-index: 1;
  position: relative;
}
```

### Spacing Presets

Each level adjusts the template thumbnail rendering:

| Level | Line Height | Page Margins | Section Gap | Body Size | Use Case |
|---|---|---|---|---|---|
| Compact | 1.0-1.15 | 0.5-0.6in | 8-10pt | 9-10pt | Entry-level, dense content, 2+ pages worth on 1 page |
| Comfortable | 1.15-1.3 | 0.6-0.75in | 12-16pt | 10-10.5pt | Mid-career, balanced readability and density |
| Executive | 1.4-1.5 | 0.75-1.0in | 18-24pt | 10.5-11pt | Senior/executive, authority through whitespace |

When toggled, all template thumbnails in the grid re-render at the new spacing. The re-render uses the same crossfade animation from Section 4 (300ms, `--ease-out`) but applied per-card thumbnail rather than a single preview.

---

## 7. Responsive Behavior

### Breakpoint: > 860px (Desktop)

- 3-column grid, gap 16px.
- Hover preview enabled (400ms dwell, overlay with enlarged thumbnail + detail panel).
- Category filters in a single row.
- Career level toggle inline with filters.
- Section padding-block: 100px.

### Breakpoint: 481px -- 860px (Tablet)

- 2-column grid, gap 16px.
- Hover preview disabled. Tapping a card navigates directly to the editor with that template.
- Category filters horizontally scrollable.
- Career level toggle below filters, full width.
- Section padding-block: 80px.

```
@media (max-width: 860px) {
  .tg-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tg-hover-preview {
    display: none;
  }

  .tg-level {
    width: 100%;
    justify-content: center;
  }
}
```

### Breakpoint: <= 480px (Mobile)

- 1-column grid, gap 12px.
- Cards stretch to full width. Thumbnail area remains aspect-ratio: 8.5/11.
- Category filter pills become smaller (padding: 6px 12px, font-size: 12px).
- Career level toggle stacks below filters.
- Metadata bar padding reduces to 12px 16px 16px.
- Section padding-block: 64px.
- Container padding-inline: 16px.

```
@media (max-width: 480px) {
  .tg-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .tg-pill {
    padding: 6px 12px;
    font-size: 12px;
  }

  .tg-meta {
    padding: 12px 16px 16px;
  }

  .tg-name {
    font-size: 15px;
  }

  .tg-level-btn {
    font-size: 11px;
    padding: 5px 10px;
  }

  .tg {
    padding-block: 64px;
  }

  .wrap {
    padding-inline: 16px;
  }
}
```

### Reduced Motion

Users with `prefers-reduced-motion: reduce` get instant state changes. No crossfades, no hover translateY, no shimmer animation.

```
@media (prefers-reduced-motion: reduce) {
  .tg-card,
  .tg-pill,
  .tg-hover-preview,
  .tg-hover-cta,
  .tg-level-btn {
    transition: none;
  }

  .tg-preview-outgoing,
  .tg-preview-incoming {
    animation: none;
  }

  .tg-skeleton-line {
    animation: none;
    background: #E8E8E8;
  }

  .tg-card:hover {
    transform: none;
  }

  .tg-card--hidden {
    transition: none;
  }
}
```

---

## 8. CSS Architecture

### File Location

All styles for this component go in a single file:

```
styles/components/template-gallery.css
```

This file is loaded via a `<link>` tag in the HTML head, following the existing pattern of one CSS file per component.

### Class Naming Convention

All classes are prefixed with `tg-` (template gallery) to avoid collisions.

| Class | Element |
|---|---|
| `.tg` | Section root `<section>` |
| `.tg-head` | Section header (title + subtitle) |
| `.tg-filters` | Category filter bar container |
| `.tg-pill` | Individual filter pill button |
| `.tg-pill--active` | Active filter pill modifier |
| `.tg-level` | Career level toggle container |
| `.tg-level-btn` | Individual toggle button |
| `.tg-level-btn--active` | Active toggle button modifier |
| `.tg-grid` | Template card grid |
| `.tg-card` | Individual template card |
| `.tg-card--selected` | Currently selected template |
| `.tg-card--hidden` | Filtered-out card (animating out) |
| `.tg-thumb-wrap` | Thumbnail aspect-ratio container |
| `.tg-meta` | Card metadata bar |
| `.tg-meta-top` | Name + badge row |
| `.tg-name` | Template name heading |
| `.tg-category` | Category label |
| `.tg-ats-badge` | ATS score badge |
| `.tg-hover-preview` | Enlarged hover preview overlay |
| `.tg-hover-preview--visible` | Visible state for hover preview |
| `.tg-hover-thumb` | Preview thumbnail area |
| `.tg-hover-details` | Preview detail panel |
| `.tg-hover-name` | Preview template name |
| `.tg-hover-archetype` | Preview archetype label |
| `.tg-hover-specs` | Preview spec tags container |
| `.tg-hover-spec` | Individual spec tag |
| `.tg-hover-score` | Preview ATS score area |
| `.tg-hover-cta` | "Use Template" button |
| `.tg-skeleton` | Skeleton loading state |
| `.tg-skeleton-line` | Individual skeleton line |
| `.tg-skeleton-line--name` | Skeleton name line modifier |
| `.tg-skeleton-line--contact` | Skeleton contact line modifier |
| `.tg-skeleton-line--section` | Skeleton section heading modifier |
| `.tg-skeleton-line--short` | Shorter skeleton line modifier |

### Token Dependencies

This component relies on the following tokens from `tokens.css`:

**Colors:** `--bg`, `--surf`, `--surf2`, `--bdr`, `--bdr2`, `--bdr3`, `--t1`, `--t2`, `--t3`, `--cta`, `--cta-text`, `--cta-hover`, `--acc`, `--highlight`, `--highlight-hover`, `--green`, `--amber`, `--red`, `--shadow-near`, `--shadow-mid`, `--shadow-far`, `--shadow-ambient`

**Motion:** `--ease`, `--ease-out`, `--d1` (150ms), `--d2` (280ms)

**Typography classes:** `.t-h2`, `.t-h3`, `.t-body`, `.lbl`

**Reveal classes:** `.reveal`, `.reveal-h`, `.reveal-f`, `.reveal-l` (with stagger delays `.d1`-`.d6`)

### JS File

```
js/template-gallery.js
```

IIFE pattern. Responsibilities:
- Category filter click handling (pill active state, card show/hide).
- Career level toggle click handling (re-render thumbnails).
- Hover preview positioning and show/hide (desktop only, 400ms dwell).
- Template switch crossfade orchestration.
- Skeleton shimmer show/hide based on render timing.
- IntersectionObserver for scroll-reveal gating (cards animate in when scrolled into view).

---

## Appendix: Template-to-Card Mapping (Final 8 Slate)

| # | Template Name | Category Pill | data-template | data-category | Expected ATS Score |
|---|---|---|---|---|---|
| 1 | Jake's Resume | Classic Tech | `jakes-resume` | `classic-tech` | 98 |
| 2 | Swiss Typographic | Modern Designer | `swiss-typographic` | `modern-designer` | 95 |
| 3 | Cordova Serif | Elegant Professional | `cordova-serif` | `elegant-professional` | 94 |
| 4 | Harvard Professional | Traditional | `harvard-professional` | `traditional` | 97 |
| 5 | Corporate Executive | Executive | `corporate-executive` | `executive` | 96 |
| 6 | Rezi Executive | ATS-Dense | `rezi-executive` | `ats-dense` | 99 |
| 7 | Two-Column Modern | Creative-ATS | `two-column-modern` | `creative-ats` | 82 |
| 8 | Pender Minimal | Polished Technical | `pender-minimal` | `polished-technical` | 96 |

---

## Animated Component Documentation

```
ANIMATED COMPONENT: Template Gallery
+-- Filter pills: .tg-pill -- background/border-color/color -- click -- var(--d2)/var(--ease)
+-- Card hover: .tg-card -- translateY(-4px), border-color, background, box-shadow -- hover -- var(--d2)/var(--ease)
+-- Card filter hide: .tg-card--hidden -- opacity 0, scale(0.96), translateY(8px) -- filter click -- var(--d2)/var(--ease-out)
+-- Hover preview: .tg-hover-preview -- opacity, scale(0.96->1) -- 400ms hover dwell -- var(--d2)/var(--ease)
+-- Template crossfade: .tg-preview-outgoing/.tg-preview-incoming -- opacity + scale -- template select -- 300ms/var(--ease-out)
+-- Skeleton shimmer: .tg-skeleton-line -- background-position sweep -- continuous -- 1.5s ease-in-out infinite
+-- Career level toggle: .tg-level-btn -- background/border-color/color -- click -- var(--d2)/var(--ease)
+-- Scroll reveal: .reveal + stagger classes -- translateY(14px), opacity -- IntersectionObserver -- 720ms/var(--ease-reveal)
Dependencies: tokens.css (colors, shadows, easing, durations), template-gallery.js (filter logic, hover preview, crossfade orchestration), nav.js (gates .reveal via .js class on html)
```
