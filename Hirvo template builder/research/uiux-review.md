# UIUX Review — Hirvo Resume Builder v2

**Reviewer:** UIUX Agent
**Date:** 2026-03-04
**Codebase:** `/Users/josephtian/Desktop/Hirvo/Hirvo template builder/resume-builder-v2/`
**Screenshot:** `/tmp/hirvo-builder-screenshot.png`

---

## 1. Visual Polish Issues

### 1.1 Template Selector Swatches Are Useless

The template swatches are flat colored rectangles with a single `background` fill. They communicate nothing about the template's actual layout or personality. The "Classic" swatch is dark gray (#333 fallback), "Modern" is navy (#3b82f6 accent), "Design" is sky blue (#0ea5e9), etc. Users cannot distinguish between templates without clicking each one.

**Evidence (screenshot):** All 8 swatches look like identically-sized colored blocks. Row 1: dark, dark, dark, teal. Row 2: dark, dark, blue, pinkish-dark. No layout silhouette, no typography hint, nothing.

**Root cause:**
`src/js/app.js` line 54: `swatch.style.background = colors.primary || '#333';`
Most templates have `colors.primary` set to near-black values (#1a1a1a, #0f172a, #111827, #18181b, #1f2937, #2c2c2c), making 6 of 8 swatches nearly indistinguishable on a dark UI.

### 1.2 Header Gradient Divider Is Invisible

`styles.css` line 88: The gradient divider on `.header::after` uses `var(--bdr2)` which is `rgba(255,255,255,0.11)`. On the dark header surface this is barely perceptible. It works, but it's so subtle the header feels unseparated from the form panel.

**Fix:** Bump the divider to `var(--bdr3)` (`rgba(255,255,255,0.20)`) for the header specifically:
```css
/* styles.css line 88 */
background: linear-gradient(90deg, transparent, var(--bdr3) 12%, var(--bdr3) 88%, transparent);
```

### 1.3 Brand Mark Weight Inconsistency

`styles.css` line 107: `.brand-mark` uses `font-weight: 800` with Plus Jakarta Sans, but `.brand-text` at line 113 uses `font-weight: 600`. The "H" mark looks heavy while "Hirvo Builder" looks thin by comparison. For a cohesive brand lockup, bump `.brand-text` to `font-weight: 700`.

### 1.4 No Export JSON Button

The header has Import JSON but no Export JSON. Users can import but not export their data — a half-implemented feature. `src/js/export.js` has a `toJSON()` function that's never wired up.

**Fix:** Add an "Export JSON" button in `index.html` line 22, and wire it in `src/js/app.js` `bindActions()`.

---

## 2. Template Selector UX — Critical Redesign Needed

### 2.1 Problem: Colored Rectangles Tell Nothing

Current state: 32px-tall color swatches that only show `colors.primary`. Six templates have near-black primaries. Users must click-and-wait through each to understand layout differences (single-column vs two-column, header styles, serif vs sans-serif).

### 2.2 Recommended Fix: Mini Layout Silhouettes

Replace the color swatch with an SVG or CSS-drawn miniature layout diagram. Each template card should show:

1. **Layout structure** — single column, two-column (sidebar), header-with-body
2. **Accent color stripe** — a thin colored line showing the template's accent
3. **Typography hint** — serif vs sans indicator via the template name font

**Implementation approach:**

Each template should define a `thumbnail` property — a small inline SVG string (40px tall) showing rectangles representing the layout. Example for "Design" (two-column):

```javascript
// In design.js, add to the template object:
thumbnail: '<svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">'
  + '<rect x="0" y="0" width="20" height="40" fill="#0f172a" rx="2"/>'
  + '<rect x="23" y="4" width="34" height="3" fill="#e5e7eb" rx="1"/>'
  + '<rect x="23" y="10" width="34" height="2" fill="#e5e7eb" rx="1" opacity="0.5"/>'
  + '<rect x="23" y="16" width="34" height="2" fill="#e5e7eb" rx="1" opacity="0.5"/>'
  + '<rect x="23" y="22" width="34" height="2" fill="#e5e7eb" rx="1" opacity="0.3"/>'
  + '</svg>'
```

In `app.js`, replace `buildTemplateGrid()` swatch creation (lines 51-54):
```javascript
var swatch = document.createElement('div');
swatch.className = 'template-card-swatch';
if (t.thumbnail) {
    swatch.innerHTML = t.thumbnail;
} else {
    var colors = t.colors || {};
    swatch.style.background = colors.accent || colors.primary || '#333';
}
```

**Minimum viable quick fix** (if thumbnails are deferred): Use `colors.accent` instead of `colors.primary` for the swatch background. This immediately differentiates templates since accent colors are diverse:

- Classic: #1a1a1a (still dark — needs special handling)
- Modern: #3b82f6 (blue)
- Simple: #6b7280 (gray)
- Design: #0ea5e9 (sky)
- Elegant: #b8860b (gold)
- Perfecto: #a855f7 (purple)
- Professional: #059669 (green)
- Creative: #f43f5e (rose)

**Fix in `app.js` line 54:**
```javascript
swatch.style.background = colors.accent || colors.primary || '#333';
```

### 2.3 Swatch Height Too Short

`styles.css` line 323: `.template-card-swatch` is only `height: 32px`. This is too small to show layout differences even with thumbnails. Increase to `height: 48px` and adjust card padding.

### 2.4 Missing Keyboard Navigation

Template cards are `<div>` elements, not `<button>` or `role="button"` with `tabindex`. Users cannot tab through templates.

**Fix in `app.js` `buildTemplateGrid()`, after line 48:**
```javascript
card.setAttribute('tabindex', '0');
card.setAttribute('role', 'button');
card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
    }
});
```

---

## 3. Form Panel Issues

### 3.1 Accordion Max-Height Collision

`styles.css` line 417: `.form-section.open .section-body` sets `max-height: 800px`, but `form-handler.js` line 59 dynamically sets `maxHeight = scrollHeight + 'px'` then bumps to `2000px` after 300ms. These two approaches conflict:

- CSS says 800px
- JS overrides to scrollHeight, then 2000px
- If a section has content taller than 800px (e.g., Experience with 5+ entries), the CSS rule clips it before JS can override

**Fix:** Remove the CSS `max-height: 800px` declaration entirely (line 417). Let JS handle it exclusively:
```css
/* styles.css — DELETE line 417 */
/* .form-section.open .section-body { max-height: 800px; } — REMOVE */
```

Keep only the JS-driven approach in `form-handler.js`, which already handles the full flow.

### 3.2 Accordion Close Animation Is Janky

`form-handler.js` lines 67-76: `closeSection()` sets `maxHeight = scrollHeight`, then on next rAF removes `.open` and sets `maxHeight = '0px'`. But the CSS transition (line 411) targets `max-height` with `var(--d3)` (450ms). The problem: when JS sets `maxHeight = 2000px` (line 63), the close starts from 2000px, creating a perceived delay before visible shrinking.

**Fix in `form-handler.js`:** Before closing, snap max-height to actual scrollHeight first, then close:
```javascript
function closeSection(section) {
    if (!section) return;
    var body = section.querySelector('.section-body');
    if (!body) return;
    // Snap to actual height first (may be at 2000px)
    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight; // force reflow
    requestAnimationFrame(function() {
        section.classList.remove('open');
        body.style.maxHeight = '0px';
    });
}
```

This is mostly what the code does already, but the `body.offsetHeight` force reflow is missing, which means the browser may batch the two maxHeight changes into one and skip the transition.

### 3.3 Form Labels Are Too Dim

`styles.css` line 447: `.form-label` uses `color: var(--t3)` which is `rgba(237,237,236,0.32)` — 32% opacity. On a dark background this is barely readable. Compare to the section headers at `color: var(--t1)`.

**Fix:** Change to `var(--t2)` for labels:
```css
/* styles.css line 447 */
color: var(--t2); /* was var(--t3) */
```

### 3.4 Scrollbar on Form Sections Clips Content

`styles.css` line 346: `.form-sections` has `overflow-y: auto` AND `.panel-form` (line 235) also has `overflow-y: auto` (inherited from `.panel` line 236). Two nested scroll containers. The inner `.form-sections` scrollbar is redundant and confusing because the outer panel also scrolls.

**Fix:** Remove `overflow-y: auto` from `.panel` (line 236) and keep it only on `.form-sections`. Or better: remove it from `.form-sections` and let only `.panel-form` scroll:
```css
/* styles.css line 236 — change to */
.panel { overflow: visible; }

/* line 346 — .form-sections keeps overflow-y: auto */
```

### 3.5 No Visual Indicator for Filled vs Empty Sections

Collapsed accordion sections all look identical. Users cannot tell at a glance which sections have data. Experience could have 5 entries or 0 — both show the same header.

**Fix:** Add a count badge next to section titles. In `form-handler.js`, add a function to update counts:
```javascript
function updateSectionCounts() {
    var sections = ['experience', 'education', 'skills', 'languages', 'certifications'];
    for (var i = 0; i < sections.length; i++) {
        var name = sections[i];
        var count = (data[name] || []).length;
        var header = document.querySelector('[data-section="' + name + '"] .section-title');
        if (!header) continue;
        var badge = header.querySelector('.section-count');
        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'section-count';
                header.appendChild(badge);
            }
            badge.textContent = count;
        } else if (badge) {
            badge.remove();
        }
    }
}
```

Add CSS:
```css
.section-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--acc);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    margin-left: 8px;
}
```

### 3.6 Field Spacing Inside Dynamic Lists Is Tight

`styles.css` line 430: `.field` has `margin-bottom: 10px`. Inside `.list-item` (which has `padding: 12px`), fields feel cramped. The outer margin and inner padding combine to only 22px between elements.

**Fix:** Increase `.list-item` padding to 14px and add `gap` approach:
```css
.list-item {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
```

### 3.7 "Add" Buttons Have Purple Accent — Inconsistent

`styles.css` line 172: `.btn-add` uses `color: var(--acc2)` (#9B8FFF purple). Per the design system, `--acc` is for focus outlines ONLY. The add button should use `var(--t2)` or `var(--t1)` for text color.

**Fix:**
```css
/* styles.css lines 172-173 */
.btn-add {
    color: var(--t2);
    border: 1px dashed var(--bdr2);
}
.btn-add:hover {
    color: var(--t1);
    background: var(--highlight);
    border-color: var(--bdr3);
}
```

---

## 4. Preview Panel Issues

### 4.1 Preview Fills Full Height — Not A4 Proportioned

`styles.css` line 527-540: `.preview-container` has `height: 100%` which fills the viewport. Real resumes are A4 (210x297mm, ratio ~1:1.414). The preview shows a document that's wider-than-tall when the viewport is wide, which misrepresents how the final PDF will look.

**Fix:** Constrain the preview to A4 aspect ratio:
```css
.preview-container {
    width: 100%;
    max-width: 850px;
    aspect-ratio: 210 / 297;
    max-height: calc(100vh - 56px - 48px); /* viewport minus header minus padding */
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow:
        inset 0 1px 0 var(--highlight),
        0 1px 2px var(--shadow-near),
        0 4px 8px var(--shadow-mid),
        0 12px 24px var(--shadow-far),
        0 24px 48px var(--shadow-ambient);
}
```

### 4.2 Preview Has No Scroll Indicator

The iframe is `height: 100%` with `overflow: hidden` by default on the container. If resume content exceeds the visible area, users may not realize there's more content below. The iframe itself scrolls, but the white border-radius clips the scrollbar.

**Fix:** Add a subtle bottom fade to indicate more content:
```css
.preview-container {
    position: relative;
}
.preview-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, white, transparent);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--d2) var(--ease-out);
}
/* JS would toggle a .has-overflow class */
```

### 4.3 Preview Shadow Inset Highlight Is Wrong on White

`styles.css` line 535: `inset 0 1px 0 var(--highlight)` puts a white highlight on a white background — invisible and pointless. Remove it:
```css
box-shadow:
    0 1px 2px var(--shadow-near),
    0 4px 8px var(--shadow-mid),
    0 12px 24px var(--shadow-far),
    0 24px 48px var(--shadow-ambient);
```

### 4.4 Preview Padding Is Tight

`styles.css` line 259: `.panel-preview` has `padding: 24px`. On large screens this puts the resume sheet too close to the form border. Increase to `padding: 32px` for desktop, keeping 24px for mobile.

---

## 5. Template Quality Review

### 5.1 Classic — GOOD, Minor Issues

- **ATS readiness:** Excellent. Clean semantic HTML, no complex layouts.
- **Print readiness:** Good. Has `@media print` padding reduction.
- **Issue:** `border-bottom: 2px solid #1a1a1a` on header (line 14 of style) — hardcoded color, not tokenized. Acceptable since it's inside iframe, but inconsistent.
- **Issue:** LinkedIn missing from contact section if user fills it — wait, it IS included (line 51). Good.
- **Issue:** No `@page` margin rule for print. Add: `@page { margin: 0.5in; }`

### 5.2 Modern — GOOD

- **Layout:** Dark header, white body. Clear visual hierarchy.
- **Issue:** Contact items in header have no separators (just gap), making them run together visually. Consider adding a subtle `|` or `·` separator.
- **Print issue:** `background: #0f172a` on header won't print by default (browsers strip backgrounds). Add `print-color-adjust: exact; -webkit-print-color-adjust: exact;` to `.header`.
- **Issue:** Skill tags `.skill-tag` at line 31 use `background: #f1f5f9` — may not print. Add print override.

### 5.3 Simple — GOOD

- Cleanest template. Good whitespace.
- **Issue:** `.divider` (line 17) uses a `<div>` element with `height: 1px; background: #e5e7eb`. This is an empty presentational div. Should use `border-bottom` on sections instead for cleaner semantics.
- **Issue:** Contact items have no separator — they just float with `gap: 12px`. Hard to distinguish items visually.

### 5.4 Design — HAS PROBLEMS

- **Two-column layout:** Sidebar + main. Visually distinct.
- **Critical print issue:** `grid-template-columns: 260px 1fr` with `min-height: 100vh` — this will create multi-page issues. The sidebar won't repeat or flow to page 2. Content that overflows the first page will break layout.
- **Print fix needed:** Add `@media print { .resume { min-height: auto; display: block; } }` — but this breaks the two-column layout entirely. Two-column templates are inherently problematic for multi-page print.
- **Sidebar background:** `background: #0f172a` won't print without `-webkit-print-color-adjust: exact`. Add it.
- **Missing:** LinkedIn not shown in sidebar contact section.

### 5.5 Elegant — GOOD, Niche

- **Typography:** Playfair Display serif is a strong choice. Gold accents (#b8860b) are distinctive.
- **Issue:** `font-style: italic` on `.summary` (line 18) combined with `text-align: center` and `max-width: 620px` creates a decorative feel that may not suit all industries.
- **Issue:** Hardcoded `style="color:#b8860b"` inline on language proficiency (line 89) and certifications (line 98). Should be a CSS class.
- **Print:** Good. Single column, minimal backgrounds.

### 5.6 Perfecto — GOOD

- **Distinctive feature:** Section titles with `::after` line filler (line 21). Unique and professional.
- **Issue:** Summary box has `background: #fafafa; border-radius: 8px; border-left: 3px solid #a855f7` — the purple accent bar may not print. Add `print-color-adjust: exact`.
- **Issue:** Skill pills with `border: 1px solid #e4e4e7; border-radius: 20px` — good, but may not survive ATS parsing.
- **Print:** Has explicit `@media print { .summary { background: #fff; } }` — good, but this removes the accent bar context.

### 5.7 Professional — SOLID

- **ATS readiness:** Best of all templates. Clean, corporate, table-based skills.
- **Issue:** `.contact` has `border-top: 2px solid #059669` (line 17). This green bar is the only accent — good for print.
- **Issue:** Section title label says "Professional Experience" (line 53 of template JS) while all other templates say "Experience". Inconsistency in naming convention.
- **Print:** Excellent. Minimal color, clear hierarchy.

### 5.8 Creative — HAS PROBLEMS

- **Visual:** Most expressive. Dark gradient header, rose accents, left border on entries.
- **Critical print issue:** `background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)` on header with `::after` pseudo-element radial gradient overlay. Complex backgrounds rarely print correctly.
- **Issue:** `.summary` and `.info-item` have `background: #fafafa` — handled in print override to `#fff`, good.
- **ATS warning:** The `::before` bars on section titles, left borders on entries, and pill-shaped skill chips may confuse ATS parsers. Not a code issue, but a UX consideration — should warn users.
- **Missing LinkedIn:** Contact section doesn't render `p.linkedin` (line 49 stops at `p.website`).

### 5.9 Cross-Template Issues

**All templates share these problems:**

1. **No `@page` rule.** None of the 8 templates define `@page { margin: ... }`. Browser defaults vary. Add to each:
   ```css
   @page { margin: 0.5in 0.6in; }
   ```

2. **No page-break control.** No template uses `page-break-inside: avoid` on `.entry` or `.section`. Long resumes will break mid-entry.
   ```css
   .entry { page-break-inside: avoid; }
   .section-title { page-break-after: avoid; }
   ```

3. **Duplicated `esc()` function.** Every template file defines its own `esc()` function (HTML escaping). This should be in `template-engine.js` once:
   ```javascript
   // template-engine.js — add:
   function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
   ```
   Then expose via `TemplateEngine.esc` and remove from each template. This reduces 8 copies to 1.

4. **Inconsistent font loading.** Templates declare `fonts: ['Source Serif 4', 'Inter']` etc., but `template-engine.js` line 36 loads them with weights `300;400;500;600;700;800`. Some fonts (Playfair Display, Lato, Poppins) don't have weight 800. Wasted bytes, potential FOIT.

5. **No font preconnect in iframe.** The iframe rebuilds its full `<head>` each render. Google Fonts requests cold-start every time. Consider caching or preloading.

---

## 6. Interaction Issues

### 6.1 No Active/Pressed State on Buttons

`styles.css` line 124: `.btn` has hover transitions but no `:active` state. Buttons don't feel tactile when clicked.

**Fix:**
```css
.btn:active {
    transform: scale(0.97);
    transition-duration: 50ms;
}
```

### 6.2 Template Card Hover translateY Fights Active State

`styles.css` line 304: `.template-card:hover` applies `transform: translateY(-2px)`. When a card is `.active`, clicking it triggers hover + active simultaneously. The card lifts UP while being active, creating visual noise.

**Fix:** Disable hover lift on active cards:
```css
.template-card.active:hover {
    transform: none;
}
```

### 6.3 No Transition on Template Switch

When clicking a different template, the preview iframe does `doc.open(); doc.write(); doc.close()` (preview.js line 34-36). This causes a full white flash as the iframe re-renders. There's no crossfade or loading state.

**Fix:** Add a brief opacity transition on the iframe:
```css
#preview-frame {
    transition: opacity 150ms ease-out;
}
#preview-frame.loading {
    opacity: 0.4;
}
```
In `preview.js`, toggle `.loading` class before and after write:
```javascript
function renderNow(data) {
    if (!iframe) return;
    iframe.classList.add('loading');
    try {
        var html = TemplateEngine.render(currentTemplate, data);
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
    } catch (e) { console.error('Preview render error:', e); }
    setTimeout(function() { iframe.classList.remove('loading'); }, 50);
}
```

### 6.4 Responsive Layout Breaks at 860px

`styles.css` line 572: At `max-width: 860px`, layout stacks vertically with `.panel-form` at `max-height: 50vh`. This means only half the screen is available for the form, and on tablets the preview gets `min-height: 60vh` — but the form is cramped.

**Issue:** No intermediate layout (sidebar could narrow to 320px before stacking).

**Fix:** Add a breakpoint at ~1024px that narrows the form:
```css
@media (max-width: 1024px) {
    .panel-form {
        width: 360px;
        min-width: 360px;
    }
    .template-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
    }
}
```

### 6.5 No Focus Trap for Keyboard Users

Tab order goes: header buttons -> template cards (not focusable!) -> form inputs. The template grid is completely skipped. See fix in section 2.4.

### 6.6 Clear Button Has No Undo

`app.js` line 98: `confirm('Clear all data and start fresh?')` is the only safeguard. Once confirmed, data is gone. No undo, no backup.

**Fix:** Before clearing, save a snapshot:
```javascript
btnClear.addEventListener('click', function() {
    if (confirm('Clear all data and start fresh?')) {
        // Save backup for potential undo
        var backup = ResumeStorage.load();
        if (backup) {
            try { localStorage.setItem('hirvo_resume_backup', JSON.stringify(backup)); } catch(e) {}
        }
        ResumeStorage.clear();
        // ... rest of clear logic
    }
});
```

---

## 7. Missing UX Patterns

### 7.1 No Section Reordering

Users cannot reorder resume sections (e.g., put Education before Experience). The section order is hardcoded in `index.html` lines 87-144. For users who want to prioritize education (recent grads) or skills (career changers), this is a major limitation.

**Recommendation:** Add drag handles to each `.form-section` header. Implement via HTML5 Drag and Drop API or simple up/down buttons. The template render functions would need to accept a section order array.

### 7.2 No Entry Reordering Within Sections

Experience entries, education entries, etc. cannot be reordered. Users must delete and re-add to change order.

**Minimum fix:** Add up/down arrow buttons to `.list-item-header` alongside the remove button.

### 7.3 No Click-to-Edit on Preview

The preview is a read-only iframe. Users cannot click on a name, title, or description in the preview to edit it inline. This is the single highest-impact UX improvement possible.

**Implementation complexity:** High. Would require the iframe to post messages back to the parent to identify which field was clicked, then focus the corresponding form input.

### 7.4 No Completeness Indicator

Users have no sense of how "complete" their resume is. A progress bar or checklist showing filled vs empty fields would add motivation and guidance.

**Quick implementation:**
```javascript
function getCompleteness() {
    var filled = 0, total = 0;
    var checks = [
        data.personal.firstName, data.personal.lastName, data.personal.title,
        data.personal.email, data.personal.phone, data.personal.location,
        data.personal.summary,
        (data.experience || []).length > 0,
        (data.education || []).length > 0,
        (data.skills || []).length > 0
    ];
    total = checks.length;
    for (var i = 0; i < checks.length; i++) {
        if (checks[i]) filled++;
    }
    return Math.round((filled / total) * 100);
}
```

Display as a thin progress bar under the template selector.

### 7.5 No Autosave Indicator

`storage.js` saves on every change, but users get no visual confirmation. They may worry their data is lost.

**Fix:** Add a subtle "Saved" indicator in the header that flashes briefly after each save. A small text element or checkmark near the brand.

### 7.6 No Undo/Redo

Every keystroke triggers a save and re-render. There's no undo history. A simple undo stack (last 20 states) would be straightforward:
```javascript
var undoStack = [];
var redoStack = [];

function notifyChange() {
    undoStack.push(JSON.parse(JSON.stringify(data)));
    if (undoStack.length > 20) undoStack.shift();
    redoStack = [];
    if (onChangeCallback) onChangeCallback(getData());
}
```

### 7.7 No Keyboard Shortcut for Export

Power users expect Cmd+P or Cmd+S to trigger export/save. Currently these invoke browser defaults (print page, save HTML).

---

## 8. Specific CSS/JS Fixes — Summary Table

| # | File | Line(s) | Issue | Fix |
|---|------|---------|-------|-----|
| 1 | `src/css/styles.css` | 54 | `swatch.style.background = colors.primary` | Change to `colors.accent` in `app.js:54` |
| 2 | `src/css/styles.css` | 88 | Header divider too subtle | Change `var(--bdr2)` to `var(--bdr3)` |
| 3 | `src/css/styles.css` | 113 | Brand text weight thin | `font-weight: 700` |
| 4 | `src/css/styles.css` | 304 | Hover lift on active card | Add `.template-card.active:hover { transform: none; }` |
| 5 | `src/css/styles.css` | 323 | Swatch too short (32px) | Change to `height: 48px` |
| 6 | `src/css/styles.css` | 417 | CSS max-height conflicts with JS | Remove the CSS declaration entirely |
| 7 | `src/css/styles.css` | 447 | Labels too dim (--t3) | Change to `var(--t2)` |
| 8 | `src/css/styles.css` | 172-173 | Add button uses purple accent | Change to `color: var(--t2)` |
| 9 | `src/css/styles.css` | 527-540 | Preview not A4 ratio | Add `aspect-ratio: 210 / 297` |
| 10 | `src/css/styles.css` | 535 | Inset highlight on white bg | Remove `inset 0 1px 0 var(--highlight)` |
| 11 | `src/css/styles.css` | 259 | Preview padding tight | Increase to `padding: 32px` |
| 12 | `src/js/app.js` | 54 | Swatches indistinguishable | Use `colors.accent` instead of `colors.primary` |
| 13 | `src/js/app.js` | 48 | No keyboard nav on cards | Add `tabindex="0"` and `role="button"` |
| 14 | `src/js/form-handler.js` | 59-64 | Accordion open has max-height race | Remove CSS max-height, let JS handle exclusively |
| 15 | `src/js/form-handler.js` | 67-76 | Close animation janky | Add `body.offsetHeight` force reflow before rAF |
| 16 | `src/js/preview.js` | 30-41 | Template switch white flash | Add opacity transition on iframe |
| 17 | `src/templates/*.js` | all | Duplicate `esc()` function | Move to `template-engine.js`, expose as global |
| 18 | `src/templates/*.js` | all | No `@page` rule | Add `@page { margin: 0.5in 0.6in; }` to all |
| 19 | `src/templates/*.js` | all | No `page-break-inside: avoid` | Add to `.entry` and `page-break-after: avoid` to `.section-title` |
| 20 | `src/templates/creative.js` | 49 | Missing LinkedIn | Add `if (p.linkedin) html += '<span>' + esc(p.linkedin) + '</span>';` |
| 21 | `src/templates/design.js` | 38 | Print breaks two-column | Add `min-height: auto` and consider `display: block` fallback |
| 22 | `src/templates/modern.js` | 38 | Header bg won't print | Add `print-color-adjust: exact; -webkit-print-color-adjust: exact;` |
| 23 | `src/templates/creative.js` | 37 | Header gradient won't print | Add `print-color-adjust: exact; -webkit-print-color-adjust: exact;` |

---

## Priority Ranking

**P0 — Fix Immediately (blocks usability):**
1. Template swatches indistinguishable (items 1, 12)
2. Preview not A4 proportioned (item 9)
3. Accordion max-height conflict (items 6, 14)

**P1 — Fix Before Launch (quality bar):**
4. Form labels too dim (item 7)
5. Print readiness across all templates (items 18, 19, 22, 23)
6. Keyboard accessibility on template cards (item 13)
7. Add button purple accent violation (item 8)
8. Missing LinkedIn in Creative template (item 20)

**P2 — Polish (differentiation):**
9. Template thumbnail SVGs (section 2.2)
10. Section count badges (section 3.5)
11. Template switch crossfade (item 16)
12. Completeness indicator (section 7.4)
13. Autosave indicator (section 7.5)
14. Entry reorder buttons (section 7.2)

**P3 — Future (competitive advantage):**
15. Click-to-edit on preview (section 7.3)
16. Section reordering (section 7.1)
17. Undo/redo stack (section 7.6)
18. Export JSON button (section 1.4)
