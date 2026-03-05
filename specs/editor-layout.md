# Split-Pane Editor Layout -- Component Spec

**Author:** uiux-agent-1 (tb-uiux subbranch)
**Date:** 2026-03-05
**Status:** Build-ready spec
**Inputs:** pro-con-analysis.md (competitive synthesis), discussion-log.md (template research), CLAUDE.md (design tokens)

---

## 1. Layout Architecture

Three-panel structure: left sidebar (section navigation), center panel (form editor), right panel (live preview).

### Panel Widths

| Panel | Min Width | Default Width | Max Width | Flex Behavior |
|---|---|---|---|---|
| Left sidebar (`.ed-sidebar`) | 48px (collapsed icon rail) | 240px | 280px | Fixed width, not resizable |
| Center panel (`.ed-form`) | 340px | 1fr (fills remaining) | None | Flex-grow: 1 |
| Right panel (`.ed-preview`) | 320px | 480px | 640px | Resizable via drag divider |

### HTML Structure

```html
<div class="ed-shell">
  <!-- Top toolbar spans full width -->
  <header class="ed-toolbar">...</header>

  <!-- Three-panel body -->
  <div class="ed-body">
    <!-- Left: Section navigation -->
    <aside class="ed-sidebar" data-collapsed="false">
      <nav class="ed-sidebar__nav">...</nav>
      <button class="ed-sidebar__toggle" aria-label="Toggle sidebar">
        <svg><!-- chevron-left/right --></svg>
      </button>
    </aside>

    <!-- Resize divider: sidebar | form -->
    <!-- No divider here -- sidebar is fixed width, toggles open/closed -->

    <!-- Center: Form editor -->
    <main class="ed-form">
      <div class="ed-form__scroll">
        <div class="ed-form__content">...</div>
      </div>
    </main>

    <!-- Resize divider: form | preview -->
    <div class="ed-divider" role="separator" aria-orientation="vertical"
         aria-valuenow="480" aria-valuemin="320" aria-valuemax="640"
         tabindex="0">
      <div class="ed-divider__handle"></div>
    </div>

    <!-- Right: Live preview -->
    <section class="ed-preview">
      <div class="ed-preview__chrome">
        <div class="ed-preview__zoom">...</div>
      </div>
      <div class="ed-preview__viewport">
        <div class="ed-preview__document">
          <!-- White resume document rendered here -->
        </div>
      </div>
    </section>
  </div>
</div>
```

### CSS Grid Structure

```css
.ed-shell {
  display: grid;
  grid-template-rows: 48px 1fr;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg); /* #060608 */
  color: var(--t1);
}

.ed-toolbar {
  grid-column: 1 / -1;
}

.ed-body {
  display: grid;
  grid-template-columns: var(--sidebar-width, 240px) 1fr var(--divider-width, 6px) var(--preview-width, 480px);
  overflow: hidden;
  min-height: 0; /* prevent grid blowout */
}
```

---

## 2. Dark Theme Implementation

The editor chrome is fully dark using Hirvo's design tokens. The resume document inside the preview panel is white (standard paper).

### Panel Surfaces

```css
/* Sidebar */
.ed-sidebar {
  background: var(--surf); /* #0E0E11 */
  border-right: 1px solid var(--bdr); /* rgba(255,255,255,0.07) */
}

/* Form editor */
.ed-form {
  background: var(--bg); /* #060608 */
}

/* Form content area -- slightly elevated cards for form sections */
.ed-form__section {
  background: rgba(19, 19, 22, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bdr2); /* rgba(255,255,255,0.11) */
  border-radius: 14px;
  padding: 28px 24px;
  box-shadow:
    inset 0 1px 0 var(--highlight),
    0 1px 2px var(--shadow-near),
    0 4px 8px var(--shadow-mid),
    0 12px 24px var(--shadow-far),
    0 24px 48px var(--shadow-ambient);
}

/* Preview panel chrome */
.ed-preview {
  background: var(--surf); /* #0E0E11 */
  border-left: none; /* divider handles separation */
}

/* Preview viewport -- the scrollable area holding the document */
.ed-preview__viewport {
  background: var(--surf2); /* #151518 -- darker surround for contrast */
  padding: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
}

/* The actual resume document -- WHITE paper */
.ed-preview__document {
  background: #FFFFFF;
  color: #1A1A1A;
  width: 612px; /* US Letter: 8.5in at 72dpi */
  min-height: 792px; /* US Letter: 11in at 72dpi */
  border-radius: 4px;
  box-shadow:
    0 1px 3px var(--shadow-near),
    0 4px 12px var(--shadow-mid),
    0 16px 48px var(--shadow-far);
  transform-origin: top center;
  transform: scale(var(--preview-zoom, 1));
  transition: transform var(--d3) var(--ease);
}
```

### Toolbar

```css
.ed-toolbar {
  background: var(--surf); /* #0E0E11 */
  border-bottom: 1px solid var(--bdr); /* rgba(255,255,255,0.07) */
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  height: 48px;
  z-index: 10;
}
```

### Form Inputs (Dark Theme)

```css
.ed-input {
  background: var(--surf2); /* #151518 */
  border: 1px solid var(--bdr); /* rgba(255,255,255,0.07) */
  border-radius: 8px;
  color: var(--t1); /* #EDEDEC */
  padding: 10px 14px;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  transition: border-color var(--d2) var(--ease), box-shadow var(--d2) var(--ease);
}

.ed-input:hover {
  border-color: var(--bdr2); /* rgba(255,255,255,0.11) */
}

.ed-input:focus {
  outline: none;
  border-color: var(--acc); /* #7363FF -- focus outlines ONLY */
  box-shadow: 0 0 0 3px rgba(115, 99, 255, 0.15);
}

.ed-input::placeholder {
  color: var(--t3); /* rgba(237,237,236,0.32) */
}

/* Textarea variant */
.ed-textarea {
  min-height: 80px;
  resize: vertical;
}

/* Labels */
.ed-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--t3);
  margin-bottom: 6px;
  display: block;
}
```

### Sidebar Navigation Items

```css
.ed-sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 8px;
  color: var(--t2); /* rgba(237,237,236,0.64) */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--d2) var(--ease), color var(--d2) var(--ease);
}

.ed-sidebar__item:hover {
  background: var(--highlight); /* rgba(255,255,255,0.08) */
  color: var(--t1);
}

.ed-sidebar__item--active {
  background: var(--highlight-hover); /* rgba(255,255,255,0.12) */
  color: var(--t1);
}

.ed-sidebar__item svg {
  width: 16px;
  height: 16px;
  color: var(--t3);
  flex-shrink: 0;
}

.ed-sidebar__item--active svg {
  color: var(--t2);
}
```

### Scrollbar Styling (Dark)

```css
.ed-form__scroll::-webkit-scrollbar,
.ed-preview__viewport::-webkit-scrollbar {
  width: 6px;
}

.ed-form__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.ed-form__scroll::-webkit-scrollbar-thumb {
  background: var(--bdr2);
  border-radius: 3px;
}

.ed-form__scroll::-webkit-scrollbar-thumb:hover {
  background: var(--bdr3);
}
```

---

## 3. Responsive Behavior

### Desktop (>1200px): Full Three-Panel

All three panels visible. Drag divider between form and preview.

```css
@media (min-width: 1201px) {
  .ed-body {
    grid-template-columns: var(--sidebar-width, 240px) 1fr 6px var(--preview-width, 480px);
  }
}
```

### Tablet (860px -- 1200px): Two-Panel

Sidebar collapses to 48px icon rail. Form and preview share remaining space.

```css
@media (max-width: 1200px) and (min-width: 861px) {
  .ed-body {
    grid-template-columns: 48px 1fr 6px var(--preview-width, 400px);
  }

  .ed-sidebar {
    --sidebar-collapsed: true;
    width: 48px;
    overflow: hidden;
  }

  /* Hide text labels, show icons only */
  .ed-sidebar__item-label {
    display: none;
  }

  .ed-sidebar__item {
    justify-content: center;
    padding: 10px;
  }

  .ed-sidebar__item svg {
    width: 20px;
    height: 20px;
  }

  /* Tooltip on hover for collapsed sidebar */
  .ed-sidebar__item {
    position: relative;
  }

  .ed-sidebar__item::after {
    content: attr(data-label);
    position: absolute;
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    background: var(--surf3);
    color: var(--t1);
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--bdr2);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--d2) var(--ease);
    z-index: 20;
  }

  .ed-sidebar__item:hover::after {
    opacity: 1;
  }
}
```

### Mobile (<860px): Stacked with Bottom-Sheet Preview

Form is full-width. Preview slides up as a bottom sheet. Sidebar becomes a horizontal scrollable tab bar at top of form.

```css
@media (max-width: 860px) {
  .ed-shell {
    grid-template-rows: 48px auto 1fr;
  }

  .ed-body {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  /* Sidebar becomes horizontal tab bar */
  .ed-sidebar {
    flex: none;
    width: 100%;
    height: 44px;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    border-right: none;
    border-bottom: 1px solid var(--bdr);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .ed-sidebar::-webkit-scrollbar {
    display: none;
  }

  .ed-sidebar__nav {
    display: flex;
    flex-direction: row;
    gap: 0;
    padding: 0 8px;
  }

  .ed-sidebar__item {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 0;
    font-size: 13px;
    white-space: nowrap;
  }

  .ed-sidebar__item--active {
    box-shadow: inset 0 -2px 0 var(--t1);
    background: transparent;
  }

  .ed-sidebar__toggle {
    display: none;
  }

  /* Form fills remaining space */
  .ed-form {
    flex: 1;
    min-height: 0;
  }

  /* Divider hidden on mobile */
  .ed-divider {
    display: none;
  }

  /* Preview becomes bottom sheet */
  .ed-preview {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 85vh;
    border-radius: 16px 16px 0 0;
    border: 1px solid var(--bdr2);
    border-bottom: none;
    transform: translateY(calc(100% - 48px)); /* Peek: 48px visible */
    transition: transform var(--d4) var(--ease); /* 750ms spring */
    z-index: 30;
    box-shadow:
      0 -4px 16px var(--shadow-mid),
      0 -12px 48px var(--shadow-far);
  }

  .ed-preview[data-sheet="open"] {
    transform: translateY(0);
  }

  .ed-preview[data-sheet="peek"] {
    transform: translateY(calc(100% - 48px));
  }

  /* Bottom sheet drag handle */
  .ed-preview__handle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    cursor: grab;
    touch-action: none;
  }

  .ed-preview__handle::before {
    content: '';
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--bdr3);
  }

  .ed-preview__handle:active {
    cursor: grabbing;
  }

  /* Preview document scales down for mobile */
  .ed-preview__document {
    --preview-zoom: 0.55;
  }
}
```

---

## 4. Panel Resize (Drag Divider)

Draggable vertical divider between form and preview panels. Desktop and tablet only.

### Divider HTML

```html
<div class="ed-divider" role="separator" aria-orientation="vertical"
     aria-valuenow="480" aria-valuemin="320" aria-valuemax="640"
     tabindex="0">
  <div class="ed-divider__handle"></div>
</div>
```

### Divider CSS

```css
.ed-divider {
  width: 6px;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;
  background: transparent;
  /* Expand hit area without visual expansion */
  margin: 0 -4px;
  padding: 0 4px;
}

.ed-divider__handle {
  width: 2px;
  height: 40px;
  border-radius: 1px;
  background: var(--bdr2); /* rgba(255,255,255,0.11) */
  transition: background var(--d2) var(--ease), height var(--d3) var(--ease);
}

.ed-divider:hover .ed-divider__handle {
  background: var(--bdr3); /* rgba(255,255,255,0.20) */
  height: 64px;
}

.ed-divider:active .ed-divider__handle,
.ed-divider[data-dragging="true"] .ed-divider__handle {
  background: var(--t3); /* rgba(237,237,236,0.32) */
  height: 80px;
  width: 3px;
}
```

### Divider Constraints

| Property | Value |
|---|---|
| Preview min-width | 320px |
| Preview max-width | 640px |
| Preview default | 480px |
| Form min-width | 340px |
| Snap threshold | None (continuous drag) |
| Double-click behavior | Reset to default 480px width |

### Divider JS Behavior (IIFE)

```js
(function initDivider() {
  var divider = document.querySelector('.ed-divider');
  var body = document.querySelector('.ed-body');
  if (!divider || !body) return;

  var MIN_PREVIEW = 320;
  var MAX_PREVIEW = 640;
  var DEFAULT_PREVIEW = 480;
  var MIN_FORM = 340;
  var dragging = false;
  var startX, startWidth;

  function onPointerDown(e) {
    dragging = true;
    startX = e.clientX;
    startWidth = parseInt(getComputedStyle(body).getPropertyValue('--preview-width')) || DEFAULT_PREVIEW;
    divider.setAttribute('data-dragging', 'true');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    var delta = startX - e.clientX; // dragging left = preview wider
    var newWidth = Math.min(MAX_PREVIEW, Math.max(MIN_PREVIEW, startWidth + delta));
    // Ensure form panel doesn't go below min
    var bodyWidth = body.offsetWidth;
    var sidebarWidth = parseInt(getComputedStyle(body).getPropertyValue('--sidebar-width')) || 240;
    var formWidth = bodyWidth - sidebarWidth - 6 - newWidth;
    if (formWidth < MIN_FORM) return;
    body.style.setProperty('--preview-width', newWidth + 'px');
    divider.setAttribute('aria-valuenow', newWidth);
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    divider.setAttribute('data-dragging', 'false');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  divider.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);

  // Double-click to reset
  divider.addEventListener('dblclick', function() {
    body.style.setProperty('--preview-width', DEFAULT_PREVIEW + 'px');
    divider.setAttribute('aria-valuenow', DEFAULT_PREVIEW);
  });

  // Keyboard: Arrow Left/Right to resize by 20px
  divider.addEventListener('keydown', function(e) {
    var current = parseInt(getComputedStyle(body).getPropertyValue('--preview-width')) || DEFAULT_PREVIEW;
    if (e.key === 'ArrowLeft') {
      body.style.setProperty('--preview-width', Math.max(MIN_PREVIEW, current - 20) + 'px');
    } else if (e.key === 'ArrowRight') {
      body.style.setProperty('--preview-width', Math.min(MAX_PREVIEW, current + 20) + 'px');
    }
  });
})();
```

---

## 5. Top Toolbar

Fixed 48px bar spanning full width. Contains template switcher, undo/redo, zoom, and export.

### HTML Structure

```html
<header class="ed-toolbar">
  <!-- Left cluster: branding + template switcher -->
  <div class="ed-toolbar__left">
    <a href="/" class="ed-toolbar__logo" aria-label="Back to dashboard">
      <svg><!-- Hirvo logo mark, 24px --></svg>
    </a>

    <div class="ed-toolbar__sep"></div>

    <button class="ed-toolbar__template-btn" aria-haspopup="listbox">
      <span class="ed-toolbar__template-name">Swiss Minimal</span>
      <svg><!-- chevron-down, 12px --></svg>
    </button>
  </div>

  <!-- Center cluster: undo/redo -->
  <div class="ed-toolbar__center">
    <button class="ed-toolbar__btn" aria-label="Undo" disabled>
      <svg><!-- undo icon, 16px --></svg>
    </button>
    <button class="ed-toolbar__btn" aria-label="Redo" disabled>
      <svg><!-- redo icon, 16px --></svg>
    </button>
  </div>

  <!-- Right cluster: zoom + export -->
  <div class="ed-toolbar__right">
    <div class="ed-toolbar__zoom">
      <button class="ed-toolbar__btn ed-toolbar__zoom-out" aria-label="Zoom out">
        <svg><!-- minus, 14px --></svg>
      </button>
      <span class="ed-toolbar__zoom-level">100%</span>
      <button class="ed-toolbar__btn ed-toolbar__zoom-in" aria-label="Zoom in">
        <svg><!-- plus, 14px --></svg>
      </button>
      <button class="ed-toolbar__btn ed-toolbar__zoom-fit" aria-label="Fit to width">
        <svg><!-- expand, 14px --></svg>
      </button>
    </div>

    <div class="ed-toolbar__sep"></div>

    <button class="ed-toolbar__export">
      Export
      <svg><!-- download icon, 14px --></svg>
    </button>
  </div>
</header>
```

### Toolbar CSS

```css
.ed-toolbar__left,
.ed-toolbar__center,
.ed-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ed-toolbar__left {
  flex: 1;
}

.ed-toolbar__center {
  flex: 0 0 auto;
}

.ed-toolbar__right {
  flex: 1;
  justify-content: flex-end;
}

/* Vertical separator */
.ed-toolbar__sep {
  width: 1px;
  height: 20px;
  background: var(--bdr2);
  margin: 0 4px;
}

/* Generic toolbar button */
.ed-toolbar__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--t2);
  cursor: pointer;
  transition: background var(--d1) var(--ease), color var(--d1) var(--ease);
}

.ed-toolbar__btn:hover {
  background: var(--highlight);
  color: var(--t1);
}

.ed-toolbar__btn:active {
  background: var(--highlight-hover);
}

.ed-toolbar__btn:disabled {
  color: var(--t4); /* rgba(237,237,236,0.16) */
  cursor: default;
}

.ed-toolbar__btn:disabled:hover {
  background: transparent;
  color: var(--t4);
}

.ed-toolbar__btn svg {
  width: 16px;
  height: 16px;
}

/* Template switcher button */
.ed-toolbar__template-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--bdr);
  background: transparent;
  color: var(--t1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color var(--d2) var(--ease), background var(--d2) var(--ease);
}

.ed-toolbar__template-btn:hover {
  border-color: var(--bdr2);
  background: var(--highlight);
}

.ed-toolbar__template-btn svg {
  width: 12px;
  height: 12px;
  color: var(--t3);
}

/* Zoom level display */
.ed-toolbar__zoom-level {
  font-size: 12px;
  font-weight: 600;
  color: var(--t2);
  min-width: 36px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* Export button -- primary CTA style */
.ed-toolbar__export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  background: var(--cta); /* #FFFFFF */
  color: var(--cta-text); /* #060608 */
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--d2) var(--ease), transform var(--d2) var(--ease);
}

.ed-toolbar__export:hover {
  background: var(--cta-hover); /* #E8E5E0 */
  transform: translateY(-1px);
}

.ed-toolbar__export:active {
  transform: translateY(0);
}

.ed-toolbar__export svg {
  width: 14px;
  height: 14px;
}
```

### Zoom Levels

Discrete steps: 50%, 75%, 100%, 125%, 150%, fit-to-width.

| Control | Action |
|---|---|
| Zoom out button | Step down to next level |
| Zoom in button | Step up to next level |
| Fit-to-width button | Calculate scale to fit document width in viewport |
| Cmd/Ctrl + mouse wheel | Continuous zoom within 50-150% range |
| Display | Shows current percentage, tabular-nums for stable width |

Zoom is applied via `--preview-zoom` CSS custom property on `.ed-preview__document`, using `transform: scale()`. The `transform-origin: top center` keeps the document anchored at top.

---

## 6. CSS Architecture

### File Structure

All editor styles live in one CSS file to avoid violating the "no new CSS files without permission" rule. Recommended path: `styles/components/editor.css`.

### Custom Properties (Editor-Specific)

These extend Hirvo's token system for editor-specific values:

```css
:root {
  /* Editor layout */
  --ed-toolbar-h: 48px;
  --ed-sidebar-w: 240px;
  --ed-sidebar-collapsed-w: 48px;
  --ed-divider-w: 6px;
  --ed-preview-w: 480px;
  --ed-preview-min-w: 320px;
  --ed-preview-max-w: 640px;
  --ed-form-min-w: 340px;

  /* Editor surfaces -- inherits from Hirvo tokens */
  --ed-chrome: var(--surf);       /* #0E0E11 */
  --ed-canvas: var(--bg);         /* #060608 */
  --ed-preview-bg: var(--surf2);  /* #151518 */
  --ed-doc-bg: #FFFFFF;
  --ed-doc-text: #1A1A1A;

  /* Zoom */
  --preview-zoom: 1;

  /* Mobile bottom sheet */
  --ed-sheet-peek: 48px;
  --ed-sheet-h: 85vh;
}
```

### Class Naming Convention

BEM-style with `ed-` prefix (editor namespace):

| Block | Elements | Modifiers |
|---|---|---|
| `.ed-shell` | -- | -- |
| `.ed-toolbar` | `__left`, `__center`, `__right`, `__btn`, `__sep`, `__template-btn`, `__template-name`, `__zoom`, `__zoom-level`, `__zoom-out`, `__zoom-in`, `__zoom-fit`, `__export`, `__logo` | -- |
| `.ed-sidebar` | `__nav`, `__item`, `__item-label`, `__item-icon`, `__toggle`, `__section-count` | `[data-collapsed]` |
| `.ed-sidebar__item` | -- | `--active`, `--error`, `--complete` |
| `.ed-form` | `__scroll`, `__content`, `__section`, `__section-header`, `__section-body` | -- |
| `.ed-divider` | `__handle` | `[data-dragging]` |
| `.ed-preview` | `__chrome`, `__zoom`, `__viewport`, `__document`, `__handle`, `__page-num` | `[data-sheet]` |
| `.ed-input` | -- | `--error` |
| `.ed-label` | -- | -- |
| `.ed-textarea` | -- | -- |

### Grid/Flexbox Decision Map

| Component | Layout Method | Reason |
|---|---|---|
| `.ed-shell` | CSS Grid (rows) | Fixed toolbar height + fluid body |
| `.ed-body` | CSS Grid (columns) | Named tracks with CSS var widths for resize |
| `.ed-toolbar` | Flexbox | Three clusters with space-between behavior |
| `.ed-sidebar__nav` | Flexbox (column) | Vertical stack of nav items |
| `.ed-form__content` | Flexbox (column) | Vertical stack of form sections with gap |
| `.ed-preview__viewport` | Flexbox (center) | Centers the document horizontally |

### Form Section Stack

```css
.ed-form__scroll {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 20px;
}

.ed-form__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto;
}

.ed-form__section {
  /* Glass card treatment (see Section 2) */
}

.ed-form__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ed-form__section-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--t1);
}
```

---

## 7. Animations

All animations use Hirvo's easing tokens. No raw `cubic-bezier` values.

### Sidebar Collapse / Expand

```css
.ed-sidebar {
  width: var(--ed-sidebar-w);
  transition: width var(--d4) var(--ease); /* 750ms, spring */
  overflow: hidden;
}

.ed-sidebar[data-collapsed="true"] {
  width: var(--ed-sidebar-collapsed-w); /* 48px */
}

/* Text labels fade out before width shrinks */
.ed-sidebar__item-label {
  opacity: 1;
  transition: opacity var(--d2) var(--ease); /* 280ms, faster than width */
}

.ed-sidebar[data-collapsed="true"] .ed-sidebar__item-label {
  opacity: 0;
  transition-delay: 0ms;
}

/* On expand, labels fade in AFTER width animation settles */
.ed-sidebar[data-collapsed="false"] .ed-sidebar__item-label {
  transition-delay: 400ms;
}

/* Toggle button rotates */
.ed-sidebar__toggle svg {
  transition: transform var(--d3) var(--ease); /* 450ms */
}

.ed-sidebar[data-collapsed="true"] .ed-sidebar__toggle svg {
  transform: rotate(180deg);
}
```

### Divider Drag Feedback

```css
/* During drag: subtle overlay to prevent iframe/content interference */
.ed-body[data-resizing="true"]::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 4;
  cursor: col-resize;
}

/* Divider handle grows smoothly on hover/drag (defined in Section 4) */
.ed-divider__handle {
  transition: background var(--d2) var(--ease),
              height var(--d3) var(--ease),
              width var(--d2) var(--ease);
}
```

### Mobile Bottom Sheet

```css
.ed-preview {
  /* Base transition for sheet open/close */
  transition: transform var(--d4) var(--ease); /* 750ms spring */
}

/* Backdrop overlay when sheet is open */
.ed-body::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: background var(--d3) var(--ease-out); /* 450ms smooth deceleration */
  z-index: 25;
}

.ed-body[data-sheet-open="true"]::before {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}
```

### Template Switch Crossfade

When the user switches templates, the resume document crossfades. This is the competitive differentiator -- zero competitors animate this transition.

```css
.ed-preview__document {
  transition: opacity var(--d3) var(--ease-out),
              transform var(--d3) var(--ease);
}

/* Applied via JS during template switch */
.ed-preview__document--switching {
  opacity: 0;
  transform: scale(var(--preview-zoom, 1)) translateY(4px);
}
```

JS sequence for template switch:
1. Add `.ed-preview__document--switching` class
2. Wait 300ms (match `--d3`)
3. Swap template content
4. Remove `.ed-preview__document--switching` class
5. Document fades back in via CSS transition

### Form Section Expand/Collapse

```css
.ed-form__section-body {
  overflow: hidden;
  transition: max-height var(--d4) var(--ease),
              opacity var(--d3) var(--ease);
}

.ed-form__section[data-collapsed="true"] .ed-form__section-body {
  max-height: 0;
  opacity: 0;
}

.ed-form__section[data-collapsed="false"] .ed-form__section-body {
  max-height: 2000px; /* Arbitrary large value; JS can set exact */
  opacity: 1;
}
```

### Preview Zoom Transition

```css
.ed-preview__document {
  transform: scale(var(--preview-zoom, 1));
  transform-origin: top center;
  transition: transform var(--d3) var(--ease); /* 450ms spring */
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .ed-sidebar,
  .ed-sidebar__item-label,
  .ed-sidebar__toggle svg,
  .ed-divider__handle,
  .ed-preview,
  .ed-preview__document,
  .ed-form__section-body {
    transition-duration: 0ms !important;
    transition-delay: 0ms !important;
  }
}
```

---

## 8. Animated Component Documentation

```
ANIMATED COMPONENT: Split-Pane Editor Layout
+-- Sidebar collapse: .ed-sidebar width -- toggle click -- 750ms / --ease
+-- Sidebar labels: .ed-sidebar__item-label opacity -- toggle click -- 280ms / --ease (400ms delay on expand)
+-- Sidebar toggle icon: .ed-sidebar__toggle svg transform -- toggle click -- 450ms / --ease
+-- Divider handle: .ed-divider__handle height+bg -- hover/drag -- 280-450ms / --ease
+-- Bottom sheet: .ed-preview transform -- swipe/tap -- 750ms / --ease
+-- Bottom sheet backdrop: .ed-body::before background -- sheet state -- 450ms / --ease-out
+-- Template crossfade: .ed-preview__document opacity+translate -- template switch -- 300ms / --ease-out
+-- Form section collapse: .ed-form__section-body max-height+opacity -- section toggle -- 450-750ms / --ease
+-- Preview zoom: .ed-preview__document transform scale -- zoom control -- 450ms / --ease
+-- Toolbar buttons: .ed-toolbar__btn background+color -- hover -- 150ms / --ease
+-- Export button: .ed-toolbar__export transform -- hover -- 280ms / --ease
Dependencies: editor.css, ed-divider.js (IIFE), ed-sheet.js (IIFE), Hirvo tokens (--ease, --ease-out, --d1-d5)
```

---

## 9. Keyboard & Accessibility

| Interaction | Key | Behavior |
|---|---|---|
| Resize divider | Arrow Left/Right (when focused) | Adjust preview width by 20px per press |
| Sidebar toggle | `Cmd/Ctrl + \` | Toggle sidebar collapsed state |
| Undo | `Cmd/Ctrl + Z` | Undo last form edit |
| Redo | `Cmd/Ctrl + Shift + Z` | Redo |
| Zoom in | `Cmd/Ctrl + =` | Step zoom up |
| Zoom out | `Cmd/Ctrl + -` | Step zoom down |
| Zoom reset | `Cmd/Ctrl + 0` | Reset to 100% |
| Export | `Cmd/Ctrl + Shift + E` | Open export dialog |
| Navigate sections | `Tab` through sidebar items | Focus moves through sidebar, form, preview |

ARIA roles:
- `.ed-sidebar`: `role="navigation"`, `aria-label="Resume sections"`
- `.ed-divider`: `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow/min/max`
- `.ed-preview`: `role="region"`, `aria-label="Resume preview"`
- `.ed-form`: `role="main"`, `aria-label="Resume editor"`
- `.ed-toolbar__export`: `aria-label="Export resume"`

---

## 10. Summary of Competitive Advantages

This layout addresses every universal gap identified in the competitive analysis:

| Gap (from pro-con-analysis.md) | How This Spec Addresses It |
|---|---|
| No template switch animation (all 5 competitors) | 300ms crossfade with --ease-out on `.ed-preview__document` |
| No zoom controls (all 5 competitors) | Discrete zoom steps (50-150%) + fit-to-width + Cmd+scroll |
| No dark-first design | Full dark theme using Hirvo's token system; only the resume document is white |
| No skeleton/shimmer loaders | Spec accommodates loading states (class hooks on `--switching`) |
| No smooth micro-interactions | Every interactive element has token-based transitions (--d1 through --d4, --ease) |
| Mobile editing broken everywhere | Bottom-sheet preview with swipe gesture; sidebar becomes horizontal tabs |
| No keyboard accessibility documented | Full keyboard shortcut map + ARIA roles on every panel |
