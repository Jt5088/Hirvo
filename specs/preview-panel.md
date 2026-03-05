# Preview Panel -- Component Spec

**Author:** uiux-agent-3 (tb-uiux subbranch)
**Date:** 2026-03-05
**Input:** `pro-con-analysis.md` competitive synthesis, `CLAUDE.md` design tokens
**Status:** Draft spec -- awaiting review

---

## Overview

The Preview Panel is the right half of the split-pane editor. It renders a live US Letter resume document on a dark chrome surface. Zero competitors offer zoom controls, template-switch animation, skeleton loading, or manual page breaks. This panel delivers all four.

---

## 1. Preview Container

### Layout

The preview panel occupies the right portion of the split-pane layout. It sits inside a dark chrome wrapper that frames the white document.

```
.preview-panel
  .preview-toolbar          (zoom controls, focus toggle, page info)
  .preview-viewport         (scrollable area, dark chrome)
    .preview-document       (white US Letter pages)
      .preview-page         (individual page, repeats for multi-page)
      .preview-page
    .page-nav               (page indicators)
```

### HTML Structure

```html
<aside class="preview-panel" role="complementary" aria-label="Resume preview">
  <div class="preview-toolbar">
    <!-- zoom controls, focus toggle, page info -- see Section 2 & 6 -->
  </div>
  <div class="preview-viewport" tabindex="0" aria-label="Resume document preview">
    <div class="preview-document" style="--zoom: 1;">
      <div class="preview-page" data-page="1">
        <!-- rendered resume content -->
      </div>
      <div class="preview-page" data-page="2">
        <!-- page 2 if content overflows -->
      </div>
    </div>
    <div class="page-nav" role="navigation" aria-label="Page navigation">
      <!-- page dots -->
    </div>
  </div>
</aside>
```

### CSS -- `.preview-panel`

```css
.preview-panel {
  display: flex;
  flex-direction: column;
  background: var(--bg);             /* #060608 */
  min-height: 0;                     /* flex child -- allow shrink */
  overflow: hidden;
  position: relative;
}
```

### CSS -- `.preview-viewport`

```css
.preview-viewport {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 24px 64px;
  background: var(--bg);
  scrollbar-width: thin;
  scrollbar-color: var(--bdr2) transparent;
}
```

### CSS -- `.preview-document`

The document scales via CSS `transform: scale(var(--zoom))` from top-center origin. This avoids re-layout on zoom changes.

```css
.preview-document {
  transform: scale(var(--zoom));
  transform-origin: top center;
  transition: transform var(--d2) var(--ease);   /* 280ms spring */
  will-change: transform;
  display: flex;
  flex-direction: column;
  gap: 24px;                         /* space between pages */
}
```

### CSS -- `.preview-page`

US Letter: 8.5in x 11in. At 96 DPI that is 816px x 1056px. The document renders at a fixed pixel width and scales via the zoom transform.

```css
.preview-page {
  width: 816px;
  min-height: 1056px;
  aspect-ratio: 8.5 / 11;
  background: #FFFFFF;
  color: #1a1a1a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  /* depth shadow -- directional top-left, per CLAUDE.md rules */
  box-shadow:
    0 1px 2px var(--shadow-near),
    0 4px 8px var(--shadow-mid),
    0 12px 24px var(--shadow-far),
    0 24px 48px var(--shadow-ambient);
}
```

---

## 2. Zoom Controls

### Competitive Gap

Zero out of five researched competitors offer zoom. This is Hirvo's easiest visual win.

### Design

A horizontal control group in the toolbar. Button group (not slider) for predictable zoom levels. Current zoom is displayed as a percentage label.

```html
<div class="zoom-controls" role="group" aria-label="Zoom controls">
  <button class="zoom-btn" data-zoom="0.5" aria-label="Zoom 50%">50%</button>
  <button class="zoom-btn" data-zoom="0.75" aria-label="Zoom 75%">75%</button>
  <button class="zoom-btn zoom-btn--active" data-zoom="1" aria-label="Zoom 100%">100%</button>
  <button class="zoom-btn" data-zoom="fit" aria-label="Fit to width">Fit</button>
  <button class="zoom-btn" data-zoom="1.5" aria-label="Zoom 150%">150%</button>
</div>
```

### CSS -- `.zoom-controls`

```css
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--surf);           /* #0E0E11 */
  border: 1px solid var(--bdr);      /* rgba(255,255,255,0.07) */
  border-radius: 8px;
  padding: 2px;
}

.zoom-btn {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--t3);                  /* 32% opacity text */
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  transition:
    color var(--d1) var(--ease),       /* 150ms */
    background var(--d1) var(--ease);
}

.zoom-btn:hover {
  color: var(--t2);                  /* 64% opacity text */
  background: var(--highlight);      /* rgba(255,255,255,0.08) */
}

.zoom-btn--active {
  color: var(--t1);                  /* primary text */
  background: var(--surf2);          /* #151518 */
  border: 1px solid var(--bdr2);     /* rgba(255,255,255,0.11) */
}
```

### JS Behavior

```
ZOOM LOGIC:
- Click a zoom button -> set CSS custom property --zoom on .preview-document
- "Fit" calculates: viewportWidth / 816 (document width), capped at 1.5
- Transition: transform animates via CSS (--d2, 280ms, --ease)
- Keyboard: Cmd/Ctrl + = zooms in one step, Cmd/Ctrl + - zooms out
- Active button updates with .zoom-btn--active class swap
- Scroll position adjusts to keep the center of the viewport stable after zoom
```

### Zoom Levels Array

```js
const ZOOM_LEVELS = [0.5, 0.75, 1.0, 'fit', 1.5];
```

### Viewport Scroll Adjustment on Zoom

When zoom changes, the scroll position must be recalculated so the center of the visible area stays centered. Formula:

```
newScrollTop = (oldScrollTop + viewportHeight / 2) * (newZoom / oldZoom) - viewportHeight / 2
```

This runs inside a `requestAnimationFrame` after setting the `--zoom` property, so the transition and scroll adjustment start in the same frame.

---

## 3. Real-Time Update

### Target

< 100ms from keystroke in the form panel to visible change in the preview. No debounce. Direct propagation.

### Architecture

```
[Form Input] --(input event)--> [Data Store (JS object)] --(sync)--> [Render Function] --> [DOM patch on .preview-page]
```

**Data store:** A plain JS object holding structured resume data (contact, experience[], education[], skills[], etc.). Templates never own data. They receive it and return HTML.

**Render path:**
1. `input` event fires on form field.
2. Event handler updates the corresponding key in the data store.
3. Render function is called synchronously (no debounce, no setTimeout).
4. Render diffs against the current preview DOM and patches only changed nodes.
5. If content changes cause layout reflow (e.g., text wraps to a new line, a section grows), the reflow animates smoothly (see below).

### Text Reflow Animation

When content changes cause elements to shift position (e.g., adding a bullet pushes everything below it down), the shift should not be instant.

```css
.preview-page * {
  /* Opt-in: only applied to block-level resume elements */
}

.preview-page .resume-section,
.preview-page .resume-entry,
.preview-page .resume-header {
  transition: transform var(--d2) var(--ease);   /* 280ms spring */
}
```

**Implementation:** Use FLIP (First, Last, Invert, Play) technique:
1. Before DOM patch: record `getBoundingClientRect()` of all direct children of `.preview-page`.
2. Apply DOM patch.
3. After patch: record new positions.
4. For each moved element: apply `transform: translateY(deltaY)` immediately (invert), then remove the transform in the next frame to animate to the new position via CSS transition.

**Performance budget:**
- Render function must complete in < 16ms (one frame at 60fps).
- DOM patching uses `textContent` assignment for text-only changes (avoids innerHTML parse).
- Full re-render only on template switch; incremental patches for field edits.

---

## 4. Page Navigation

### Multi-Page Support

Resume content that exceeds one 1056px page flows onto subsequent `.preview-page` elements. The JS render function handles page splitting by measuring content height against the 1056px limit.

### Page Indicators

Fixed at the bottom of `.preview-viewport`. Dot indicators showing current page and total pages.

```html
<div class="page-nav" role="navigation" aria-label="Page navigation">
  <button class="page-dot page-dot--active" data-page="1" aria-label="Page 1" aria-current="true"></button>
  <button class="page-dot" data-page="2" aria-label="Page 2"></button>
  <span class="page-label lbl">1 / 2</span>
</div>
```

### CSS -- `.page-nav`

```css
.page-nav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0 16px;
  background: linear-gradient(180deg, transparent 0%, var(--bg) 40%);
  z-index: 2;
}

.page-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bdr2);           /* rgba(255,255,255,0.11) */
  border: none;
  cursor: pointer;
  transition:
    background var(--d2) var(--ease),
    transform var(--d2) var(--ease);
}

.page-dot:hover {
  background: var(--bdr3);           /* rgba(255,255,255,0.20) */
}

.page-dot--active {
  background: var(--t2);             /* 64% primary text */
  transform: scale(1.25);
}

.page-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--t3);
  margin-left: 8px;
}
```

### JS Behavior

```
PAGE NAVIGATION:
- Click a page dot -> smooth-scroll .preview-viewport to the target .preview-page
- scrollBehavior: 'smooth' on the viewport, or use scrollTo with { behavior: 'smooth' }
- IntersectionObserver on each .preview-page (threshold: 0.5) updates the active dot
- Keyboard: Page Up / Page Down scrolls between pages
- Active dot tracks the most-visible page during free scroll
```

---

## 5. Page Break Markers

### Competitive Gap

No competitor offers manual page break placement. This is a power-user feature.

### Visual Design

A horizontal dashed line that appears at the boundary between pages. Draggable to adjust where content splits.

```html
<div class="page-break" data-break="1" role="separator" aria-label="Page break between page 1 and 2" tabindex="0">
  <span class="page-break__label lbl">Page Break</span>
  <span class="page-break__handle" aria-hidden="true">
    <!-- drag grip icon: 6 dots in 2x3 grid -->
  </span>
</div>
```

### CSS -- `.page-break`

```css
.page-break {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  z-index: 5;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  /* The line itself */
  border-top: 2px dashed var(--bdr3);    /* rgba(255,255,255,0.20) */
  /* Wider hit target */
  padding: 12px 0;
  margin: -12px 0;
}

.page-break::before {
  /* Extended hit area for easier drag */
  content: '';
  position: absolute;
  inset: -8px 0;
}

.page-break__label {
  position: absolute;
  right: -80px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--t4);                  /* 16% text, very subtle */
  white-space: nowrap;
  transition: color var(--d1) var(--ease);
}

.page-break__handle {
  width: 24px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surf2);          /* #151518 */
  border: 1px solid var(--bdr2);
  border-radius: 4px;
  opacity: 0;
  transition: opacity var(--d2) var(--ease);
}

.page-break:hover .page-break__handle,
.page-break:focus-visible .page-break__handle {
  opacity: 1;
}

.page-break:hover .page-break__label,
.page-break:focus-visible .page-break__label {
  color: var(--t3);
}

/* Active drag state */
.page-break--dragging {
  border-top-color: var(--t2);
}

.page-break--dragging .page-break__label {
  color: var(--t2);
}
```

### Drag Interaction Spec

```
DRAG BEHAVIOR:
- mousedown / touchstart on .page-break initiates drag
- mousemove / touchmove updates the break position (translateY)
- Position is constrained: minimum 200px from top of page, minimum 200px from bottom
- SNAP: on mouseup/touchend, snap to the nearest block-level element boundary
  - Measure all .resume-section and .resume-entry top edges
  - Find the closest edge to the drop position
  - Animate snap with var(--d2) var(--ease) (280ms spring)
- After snap: re-render pages with the new break point
  - Content above the break stays on page N
  - Content below flows to page N+1
- Keyboard: arrow up/down moves break by 10px increments, snap on Enter
- Visual feedback during drag: dashed line becomes solid, label text changes to current Y position
```

### Snap Calculation

```js
function snapToNearestBlock(dropY, blocks) {
  let closest = blocks[0].top;
  let minDist = Infinity;
  for (const block of blocks) {
    const dist = Math.abs(block.top - dropY);
    if (dist < minDist) {
      minDist = dist;
      closest = block.top;
    }
  }
  return closest;
}
```

---

## 6. Focus Mode

### Behavior

A toggle that maximizes the preview panel to fill the entire editor viewport, hiding the form panel. Useful for reviewing the final layout before export.

### Toggle Button (in `.preview-toolbar`)

```html
<button class="focus-toggle" aria-label="Toggle focus mode" aria-pressed="false">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <!-- expand icon: four outward arrows -->
  </svg>
</button>
```

### CSS -- Focus Mode Transition

The split-pane parent (`.editor-layout`) controls the column widths. Focus mode changes the grid template.

```css
.editor-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  transition: grid-template-columns var(--d4) var(--ease);  /* 750ms spring */
}

.editor-layout--focus {
  grid-template-columns: 0fr 1fr;
}

/* Form panel collapses */
.editor-layout--focus .form-panel {
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  transition: opacity var(--d3) var(--ease-out);  /* 450ms, smooth decel */
}

/* Preview fills available space */
.editor-layout--focus .preview-panel {
  border-left: none;
}
```

### JS Behavior

```
FOCUS MODE:
- Click .focus-toggle -> toggle .editor-layout--focus on parent
- Update aria-pressed on the button
- Swap icon from expand to collapse
- Keyboard: Cmd/Ctrl + Shift + F toggles focus mode
- ESC exits focus mode (if active)
- On enter: form panel opacity fades to 0 over 450ms (--d3), then grid collapses over 750ms (--d4)
- On exit: grid expands over 750ms, then form fades in over 450ms
- Sequence is staggered so the grid animation and fade don't fight
```

### Focus Toggle Button CSS

```css
.focus-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--t3);
  cursor: pointer;
  transition:
    color var(--d1) var(--ease),
    background var(--d1) var(--ease),
    border-color var(--d1) var(--ease);
}

.focus-toggle:hover {
  color: var(--t2);
  background: var(--highlight);
  border-color: var(--bdr);
}

.focus-toggle[aria-pressed="true"] {
  color: var(--t1);
  background: var(--surf2);
  border-color: var(--bdr2);
}
```

---

## 7. Template Switch Crossfade

### Competitive Gap

All five competitors do instant re-renders with zero transition. A 300ms crossfade is an immediate differentiator.

### Mechanism

Two layers: the outgoing template render and the incoming render. The crossfade uses absolute positioning within `.preview-document` to stack them.

```
TEMPLATE SWITCH SEQUENCE (total ~600ms):

T+0ms:    User selects new template.
           - Skeleton shimmer overlay fades in (150ms, --d1)
           - Outgoing .preview-page gets class .preview-page--exiting
           - New template render begins (off-screen or in a DocumentFragment)

T+~50ms:  New template render completes (target: <50ms for HTML generation).
           - New .preview-page elements created with class .preview-page--entering
           - Inserted into DOM behind the exiting pages

T+150ms:  Skeleton fades out (150ms, --d1).
           - .preview-page--exiting begins opacity fade to 0 (300ms, --ease-out)
           - .preview-page--entering begins opacity fade to 1 (300ms, --ease-out)
           - Both transitions run simultaneously = crossfade

T+450ms:  Crossfade complete.
           - Remove .preview-page--exiting elements from DOM
           - Remove transition classes from new pages
           - Update page break positions for new template layout
```

### CSS -- Crossfade Classes

```css
.preview-page--exiting {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity 300ms var(--ease-out);
  z-index: 1;
}

.preview-page--exiting.fade-out {
  opacity: 0;
}

.preview-page--entering {
  opacity: 0;
  transition: opacity 300ms var(--ease-out);
  z-index: 2;
}

.preview-page--entering.fade-in {
  opacity: 1;
}
```

### Content Preservation

Templates are pure renderers. The data store is never cleared during a switch. The new template's render function receives the same data object. Content persists because the data layer is decoupled from the presentation layer.

---

## 8. Skeleton Loading

### When Skeletons Appear

1. **Initial load** -- before the first template render completes.
2. **Template switch** -- during the ~150ms render gap (see Section 7).
3. **PDF import parsing** -- while extracting content from an uploaded file.

### Skeleton Structure

Placeholder blocks that mirror typical resume layout: header bar, section title bars, text line blocks.

```html
<div class="skeleton-page" aria-hidden="true">
  <!-- Header -->
  <div class="skel skel--name"></div>
  <div class="skel skel--contact"></div>
  <!-- Section 1 -->
  <div class="skel skel--heading"></div>
  <div class="skel skel--line skel--full"></div>
  <div class="skel skel--line skel--full"></div>
  <div class="skel skel--line skel--short"></div>
  <!-- Section 2 -->
  <div class="skel skel--heading"></div>
  <div class="skel skel--line skel--full"></div>
  <div class="skel skel--line skel--full"></div>
  <div class="skel skel--line skel--mid"></div>
</div>
```

### CSS -- Skeleton Base

```css
.skeleton-page {
  width: 816px;
  min-height: 1056px;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 48px 56px;
  box-shadow:
    0 1px 2px var(--shadow-near),
    0 4px 8px var(--shadow-mid),
    0 12px 24px var(--shadow-far),
    0 24px 48px var(--shadow-ambient);
}

.skel {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #E8E8E8 0%,
    #F5F5F5 40%,
    #E8E8E8 80%
  );
  background-size: 400% 100%;
  animation: skel-shimmer 1.6s var(--ease-out) infinite;
}

@keyframes skel-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### CSS -- Skeleton Variants

```css
.skel--name {
  width: 220px;
  height: 24px;
  margin-bottom: 8px;
}

.skel--contact {
  width: 320px;
  height: 12px;
  margin-bottom: 32px;
}

.skel--heading {
  width: 140px;
  height: 14px;
  margin-bottom: 16px;
  margin-top: 24px;
}

.skel--line {
  height: 10px;
  margin-bottom: 8px;
}

.skel--full  { width: 100%; }
.skel--mid   { width: 72%; }
.skel--short { width: 45%; }
```

### Skeleton Fade Transition

```css
.skeleton-page {
  transition: opacity var(--d1) var(--ease-out);  /* 150ms fade */
}

.skeleton-page--hidden {
  opacity: 0;
  pointer-events: none;
}
```

---

## 9. CSS Architecture

### File Location

All preview panel styles live in a single component file:

```
styles/components/preview-panel.css
```

### Class Naming Convention

Flat BEM-inspired. No nesting beyond one level. Prefix: `preview-`, `zoom-`, `page-`, `skel-`, `focus-`.

### Complete Class Reference

| Class | Element | Notes |
|---|---|---|
| `.preview-panel` | `<aside>` root | Right side of split-pane |
| `.preview-toolbar` | Toolbar bar | Contains zoom, focus toggle, page info |
| `.preview-viewport` | Scroll container | Dark chrome, centers document |
| `.preview-document` | Document wrapper | Holds pages, applies zoom transform |
| `.preview-page` | Single page | 816x1056, white, shadow stack |
| `.preview-page--exiting` | Outgoing template | Absolute positioned during crossfade |
| `.preview-page--entering` | Incoming template | Fades in during crossfade |
| `.zoom-controls` | Button group wrapper | Pill-shaped group |
| `.zoom-btn` | Individual zoom button | Mono font, subtle states |
| `.zoom-btn--active` | Current zoom level | Highlighted surface |
| `.page-nav` | Page indicator bar | Sticky bottom, gradient fade |
| `.page-dot` | Page indicator dot | 8px circles |
| `.page-dot--active` | Current page dot | Scaled up, brighter |
| `.page-label` | "1 / 2" text | Uppercase label style |
| `.page-break` | Draggable break line | Dashed, ns-resize cursor |
| `.page-break--dragging` | Active drag state | Solid line, brighter label |
| `.page-break__label` | "Page Break" text | Positioned outside document |
| `.page-break__handle` | Drag grip icon | Appears on hover |
| `.focus-toggle` | Expand/collapse button | 32px square, icon only |
| `.skeleton-page` | Loading placeholder | Matches .preview-page dimensions |
| `.skeleton-page--hidden` | Fade-out state | opacity: 0 |
| `.skel` | Placeholder block base | Shimmer animation |
| `.skel--name` | Name placeholder | 220px wide |
| `.skel--contact` | Contact line placeholder | 320px wide |
| `.skel--heading` | Section heading placeholder | 140px wide |
| `.skel--line` | Text line placeholder | Variable width via modifiers |
| `.skel--full` | Full-width line | 100% |
| `.skel--mid` | Medium line | 72% |
| `.skel--short` | Short line | 45% |

### Token Usage Summary

Every visual value references a design token. No hardcoded hex, timing, or easing anywhere in the component CSS.

| Category | Tokens Used |
|---|---|
| Backgrounds | `--bg`, `--surf`, `--surf2` |
| Borders | `--bdr`, `--bdr2`, `--bdr3` |
| Text colors | `--t1`, `--t2`, `--t3`, `--t4` |
| Shadows | `--shadow-near`, `--shadow-mid`, `--shadow-far`, `--shadow-ambient` |
| Highlights | `--highlight` |
| Durations | `--d1` (150ms), `--d2` (280ms), `--d3` (450ms), `--d4` (750ms) |
| Easing | `--ease` (spring), `--ease-out` (smooth decel) |
| Typography | `.lbl` class (11px/700/0.11em), monospace for zoom labels |

### Toolbar Layout

```css
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--surf);
  border-bottom: none;    /* no flat borders -- see divider rule below */
  position: relative;
  z-index: 3;
}

/* Gradient divider instead of border (per CLAUDE.md rules) */
.preview-toolbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent);
}
```

### Responsive Behavior

```css
/* Tablet: <= 860px -- preview goes below form */
@media (max-width: 860px) {
  .preview-panel {
    min-height: 60vh;
  }
  .preview-document {
    --zoom: 0.65;      /* default smaller on tablet */
  }
}

/* Mobile: <= 480px -- bottom sheet mode (spec TBD in separate mobile spec) */
@media (max-width: 480px) {
  .preview-viewport {
    padding: 16px 8px 48px;
  }
  .preview-document {
    --zoom: 0.45;
  }
  .page-break {
    display: none;       /* page breaks not draggable on mobile */
  }
}
```

---

## Accessibility

| Requirement | Implementation |
|---|---|
| Screen reader | `role="complementary"`, `aria-label` on viewport, pages, and controls |
| Keyboard zoom | Cmd/Ctrl + Plus/Minus steps through zoom levels |
| Keyboard page nav | Page Up / Page Down scrolls between pages |
| Keyboard page break | Arrow keys move break, Enter snaps |
| Keyboard focus mode | Cmd/Ctrl + Shift + F toggles; ESC exits |
| Focus visible | All interactive elements use `:focus-visible` with `outline: 2px solid var(--acc)` (purple, focus outlines only) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables zoom transform transition, crossfade, skeleton shimmer, FLIP reflow animation. Instant state changes instead. |
| High contrast | Document shadow stack ensures separation from dark chrome even in forced-colors mode |

### Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  .preview-document,
  .preview-page--exiting,
  .preview-page--entering,
  .zoom-btn,
  .page-dot,
  .page-break,
  .focus-toggle,
  .skel {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

---

## Animated Component Documentation

```
ANIMATED COMPONENT: Preview Panel
+-- Zoom transform: .preview-document -- scale(var(--zoom)) -- zoom button click -- --d2/--ease
+-- Zoom button states: .zoom-btn -- color + background -- hover/active -- --d1/--ease
+-- Text reflow (FLIP): .resume-section, .resume-entry -- translateY -- form input keystroke -- --d2/--ease
+-- Page dot active: .page-dot -- background + scale -- IntersectionObserver -- --d2/--ease
+-- Page break drag: .page-break -- translateY -- pointer drag -- direct (no transition during drag)
+-- Page break snap: .page-break -- translateY to snap point -- pointer up -- --d2/--ease
+-- Focus mode grid: .editor-layout -- grid-template-columns -- toggle click -- --d4/--ease
+-- Focus mode fade: .form-panel -- opacity -- toggle click -- --d3/--ease-out
+-- Template crossfade out: .preview-page--exiting -- opacity 1->0 -- template select -- 300ms/--ease-out
+-- Template crossfade in: .preview-page--entering -- opacity 0->1 -- template select -- 300ms/--ease-out
+-- Skeleton shimmer: .skel -- background-position -- continuous -- 1.6s/--ease-out
+-- Skeleton fade: .skeleton-page -- opacity -- render complete -- --d1/--ease-out
Dependencies: preview-panel.css, preview-panel.js (IIFE), IntersectionObserver, requestAnimationFrame, tokens.css
```
