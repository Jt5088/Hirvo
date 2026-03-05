# Hirvo Resume Builder v2 -- Code Audit

**Date:** 2026-03-04
**Scope:** All JS modules, index.html, styles.css
**Files reviewed:** app.js, form-handler.js, preview.js, template-engine.js, export.js, storage.js, sample-data.js, 8 template files, index.html, styles.css

---

## Critical Issues

### BUG-01: `esc()` defined outside `render()` scope -- inaccessible in strict mode contexts
- **Severity:** Critical
- **Files:** All 8 template files (classic.js:116, modern.js:121, simple.js:107, design.js:121, elegant.js:108, perfecto.js:117, professional.js:111, creative.js:120)
- **Description:** Each template's `esc()` function is defined as a standalone function inside the IIFE, but outside the `render` method assigned to `window.HirvoTemplates[id].render`. The `render()` method calls `esc()` by closure reference. This works correctly because `esc()` is hoisted within the IIFE scope. **Not actually a bug** -- this is valid JS scoping via closure + hoisting. However, the duplication across 8 files is a maintenance risk. If one template's `esc()` is updated and others aren't, you get inconsistent sanitization.
- **Fix recommendation:** Extract `esc()` into a shared utility on `window.HirvoTemplates._esc` or on `TemplateEngine`:
```js
// template-engine.js
function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// Expose: TemplateEngine.esc = esc;
```

### BUG-02: `fromJSON` import accepts any JSON structure without validation
- **Severity:** Critical
- **Files:** export.js:32-46, app.js:117-126
- **Description:** When importing a JSON file, `fromJSON` parses it and passes the result directly to the callback. There is zero structural validation. If the imported file contains `{ "personal": 42 }` or `{ "experience": "not-an-array" }`, the templates will crash when trying to iterate `data.experience` with a `for` loop over a non-array, or when accessing `data.personal.firstName` on a non-object. The app will show a blank preview with no error feedback to the user.
- **Fix recommendation:** Add a validation function:
```js
function validateResumeData(data) {
    if (!data || typeof data !== 'object') return false;
    if (data.personal && typeof data.personal !== 'object') return false;
    var arrays = ['experience', 'education', 'skills', 'languages', 'certifications'];
    for (var i = 0; i < arrays.length; i++) {
        if (data[arrays[i]] && !Array.isArray(data[arrays[i]])) return false;
    }
    return true;
}
```

### BUG-03: `setNestedValue` creates objects for array-index path segments
- **Severity:** Critical
- **Files:** form-handler.js:99-107
- **Description:** `setNestedValue` always creates `{}` for missing intermediate path segments. If a path like `"experience.0.role"` were ever used (it isn't currently, but could be introduced), `current[parts[i]] = {}` would create `{ "0": {} }` instead of an array. More immediately: if `data` is somehow corrupted and `data.personal` is `undefined`, `setNestedValue` silently creates a plain object, which may not match the expected schema.
- **Fix recommendation:** Add a guard:
```js
function setNestedValue(obj, path, value) {
    if (!obj || typeof obj !== 'object') return;
    var parts = path.split('.');
    var current = obj;
    for (var i = 0; i < parts.length - 1; i++) {
        if (current[parts[i]] == null || typeof current[parts[i]] !== 'object') {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}
```

---

## Medium Issues

### BUG-04: Accordion CSS `max-height: 800px` conflicts with JS inline styles
- **Severity:** Medium
- **Files:** form-handler.js:59-64, styles.css:417
- **Description:** CSS sets `.form-section.open .section-body { max-height: 800px; }` but the JS immediately overrides this with inline `style.maxHeight`. The CSS rule is dead code. On initial page load, `openSection('personal')` sets `scrollHeight` then `2000px` via timeout. If JS fails to load or execute, the CSS fallback of 800px kicks in, which could clip the personal section if it grows beyond 800px (currently unlikely but possible with long summary text). More importantly, the `2000px` magic number in JS is fragile -- if a section has many dynamic items (e.g., 20 experience entries), content could exceed 2000px and get clipped.
- **Fix recommendation:** Use `body.style.maxHeight = 'none'` instead of `'2000px'` after the transition completes:
```js
setTimeout(function() {
    if (section.classList.contains('open')) {
        body.style.maxHeight = 'none';
    }
}, 300);
```

### BUG-05: Accordion rapid-click race condition
- **Severity:** Medium
- **Files:** form-handler.js:50-76
- **Description:** `openSection` uses a 300ms `setTimeout` to set `maxHeight: '2000px'`. If a user clicks to open, then clicks to close within 300ms, the sequence is:
  1. Open: class added, maxHeight = scrollHeight
  2. Close (within 300ms): class removed, maxHeight = scrollHeight then 0
  3. setTimeout fires: class check passes (close removed it), so the 2000px assignment is skipped -- OK.

  However, if user clicks open-close-open rapidly:
  1. First open: class added, maxHeight = scrollHeight, setTimeout queued
  2. Close: class removed, maxHeight = 0
  3. Second open: class added, maxHeight = scrollHeight (which may be 0 since content is collapsed), setTimeout queued
  4. First setTimeout fires, sets 2000px -- correct but accidental
  5. Second setTimeout fires, sets 2000px -- correct

  The real bug: step 3 reads `scrollHeight` while content is mid-collapse (maxHeight transitioning to 0), so `scrollHeight` could return 0 or a partial value, causing the section to appear empty briefly.
- **Fix recommendation:** Cancel any pending timeout and force a reflow:
```js
var openTimers = {};
function openSection(sectionOrName) {
    // ... resolve section ...
    var id = section.getAttribute('data-section');
    clearTimeout(openTimers[id]);
    section.classList.add('open');
    body.style.maxHeight = 'none'; // temporarily remove cap
    var h = body.scrollHeight;
    body.style.maxHeight = '0px';
    body.offsetHeight; // force reflow
    body.style.maxHeight = h + 'px';
    openTimers[id] = setTimeout(function() {
        if (section.classList.contains('open')) {
            body.style.maxHeight = 'none';
        }
    }, 300);
}
```

### BUG-06: `getNestedValue` returns `''` for falsy values (0, false)
- **Severity:** Medium
- **Files:** form-handler.js:109-117
- **Description:** Line 116: `return current || '';` means if a data value is `0`, `false`, or `null`, the function returns `''` instead of the actual value. While current data is all strings, this is a latent bug if numeric fields are ever added (e.g., years of experience).
- **Fix recommendation:**
```js
return (current == null) ? '' : current;
```

### BUG-07: `getDefaultData` does not return a deep copy
- **Severity:** Medium
- **Files:** storage.js:55-57, sample-data.js:7-86
- **Description:** `SampleData.get()` returns a fresh object literal each time it's called, so it IS a new copy. This is safe. However, `ResumeStorage.getDefaultData()` is a pass-through to `SampleData.get()` with no documentation of this guarantee. If `SampleData.get()` were ever refactored to cache its result (e.g., `var cached = {...}; return cached;`), all callers would share the same mutable reference. The `clear` button in app.js:100 calls `getDefaultData()` and assigns it to `currentData` -- if it weren't a fresh copy, clearing would mutate the "default" data permanently for the session.
- **Fix recommendation:** Add explicit deep copy in `getDefaultData`:
```js
function getDefaultData() {
    return JSON.parse(JSON.stringify(SampleData.get()));
}
```

### BUG-08: `doc.open()/write()/close()` on every debounced keystroke -- potential iframe document leak
- **Severity:** Medium
- **Files:** preview.js:30-41
- **Description:** Every render call does `doc.open(); doc.write(html); doc.close();` on the iframe's document. This replaces the entire document. In most modern browsers this is handled correctly, but:
  1. Each `doc.write()` creates a full HTML document with Google Fonts `<link>` tags. The browser initiates font fetches on each render, though they'll hit cache after the first load.
  2. In older browsers (IE11, rare now), repeated `doc.open()/close()` could leak document objects.
  3. The debounce at 150ms is reasonable for typing, but rapid template switching calls `renderImmediate` which bypasses the debounce entirely and could cause font flicker.
- **Fix recommendation:** Consider using `srcdoc` attribute or only updating the `<body>` innerHTML after initial document setup. For the font issue, render the font links once and only update body content:
```js
// On template change: full rewrite (already done via renderImmediate)
// On data change: update body only if template hasn't changed
```

### BUG-09: `toJSON` export button not wired up in UI
- **Severity:** Medium
- **Files:** export.js:20-29, app.js:85-131, index.html
- **Description:** `ResumeExport.toJSON(data)` exists as a function but there is no button in the UI that calls it. The user can import JSON but cannot export it. This is either an incomplete feature or an oversight.
- **Fix recommendation:** Add an "Export JSON" button to the header:
```html
<button class="btn btn-ghost" id="btn-export-json">Export JSON</button>
```
```js
var btnJson = document.getElementById('btn-export-json');
if (btnJson) {
    btnJson.addEventListener('click', function() {
        ResumeExport.toJSON(currentData);
    });
}
```

---

## Low Issues

### BUG-10: `esc()` does not escape single quotes
- **Severity:** Low
- **Files:** All 8 template files
- **Description:** The `esc()` function escapes `&`, `<`, `>`, `"` but not `'` (single quote). If any template ever uses single-quoted HTML attributes (e.g., `onclick='...'`), this would be an XSS vector. Currently all templates use double-quoted attributes or no attributes with user data, so this is not exploitable. However, it's defense-in-depth to include it.
- **Fix recommendation:** Add `replace(/'/g, '&#39;')` to the chain.

### BUG-11: `populateStaticInputs` sets value to `''` for undefined paths, hiding data structure issues
- **Severity:** Low
- **Files:** form-handler.js:90-97
- **Description:** If a `data-path` attribute references a path that doesn't exist in the data (e.g., a typo like `personal.fistName`), the input silently gets `''` with no warning. During development, this makes typos in HTML `data-path` attributes invisible.
- **Fix recommendation:** Add a dev-mode warning:
```js
if (val === '' && path.indexOf('.') !== -1) {
    console.warn('FormHandler: empty value for path "' + path + '" -- check data structure');
}
```

### BUG-12: Template card click handler uses `this` -- fragile with arrow functions or future refactors
- **Severity:** Low
- **Files:** app.js:63-66
- **Description:** The click handler uses `this.getAttribute('data-template')` which relies on `this` binding to the clicked element. This works with `function()` but would break if refactored to an arrow function. The `data-template` attribute approach is fine but could use event delegation for better performance.
- **Fix recommendation:** Use closure variable instead:
```js
(function(templateId) {
    card.addEventListener('click', function() {
        selectTemplate(templateId);
    });
})(t.id);
```

### BUG-13: `btn-add` selector `[data-list].btn-add` could match dynamically created elements
- **Severity:** Low
- **Files:** form-handler.js:277
- **Description:** The selector `[data-list].btn-add` correctly matches only the add buttons (not the input fields with `data-list`). However, `bindAddButtons` is called once during `init()`. If `buildDynamicLists()` were ever to create elements with `class="btn-add"` and `data-list`, they'd get double-bound on the next `bindAddButtons` call. Currently safe because `bindAddButtons` is only called once.
- **Fix recommendation:** No action needed unless architecture changes. Consider using event delegation on the form container.

### BUG-14: No `type="button"` on remove buttons created in JS (already present)
- **Severity:** Low (non-issue, documenting for completeness)
- **Files:** form-handler.js:195
- **Description:** The dynamically created remove button correctly sets `removeBtn.type = 'button'` (line 195), preventing accidental form submission. Good.

### BUG-15: `localStorage` quota exceeded silently swallowed
- **Severity:** Low
- **Files:** storage.js:12-16
- **Description:** When `localStorage.setItem` throws (quota exceeded), the error is caught and logged to console only. The user gets no feedback that their data is not being saved. If they close the tab, all changes since the quota was exceeded are lost.
- **Fix recommendation:** Surface the error to the user:
```js
function save(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Storage: failed to save', e);
        // Show non-blocking warning
        var banner = document.getElementById('error-banner');
        if (banner) {
            banner.style.display = 'block';
            banner.textContent = 'Warning: Could not save. Storage may be full. Export your data as JSON.';
            setTimeout(function() { banner.style.display = 'none'; }, 8000);
        }
    }
}
```

### BUG-16: `ResumeStorage` naming -- `var` vs `window.` inconsistency
- **Severity:** Low
- **Files:** storage.js:6, index.html:184
- **Description:** `storage.js` assigns to `window.ResumeStorage` explicitly (to avoid conflict with the browser's `Storage` constructor). The module check in index.html line 184 uses `typeof ResumeStorage === 'undefined'` which works because `window.ResumeStorage` is accessible as a global. Other modules use `var X = (function(){...})()` pattern. The inconsistency is documented in a comment (storage.js:3-5), which is good. No functional bug, just a style inconsistency.
- **Fix recommendation:** None needed. The comment explains the reasoning.

### BUG-17: `toPDF` cross-browser print -- Safari iframe print restrictions
- **Severity:** Low
- **Files:** export.js:7-17
- **Description:** `iframe.contentWindow.print()` works in Chrome, Firefox, and Edge. In Safari, calling `print()` on a cross-origin or sandboxed iframe may fail silently or print the parent page instead. Since the iframe is same-origin (no `src` attribute, populated via `doc.write`), this should work. However, Safari has historically had bugs with `contentWindow.print()` on dynamically-written iframe documents. The try/catch on line 15 handles the error case with a user-friendly alert.
- **Fix recommendation:** As a fallback, open the rendered HTML in a new window and call `print()` there:
```js
function toPDF() {
    var iframe = document.getElementById('preview-frame');
    if (!iframe || !iframe.contentWindow) {
        alert('Preview not ready.');
        return;
    }
    try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    } catch (e) {
        // Fallback: open in new window
        var win = window.open('', '_blank');
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        win.document.write(doc.documentElement.outerHTML);
        win.document.close();
        win.print();
    }
}
```

### BUG-18: Template `render()` errors not surfaced to user
- **Severity:** Low
- **Files:** template-engine.js:26-54, preview.js:32-40
- **Description:** If `t.render(data)` throws (e.g., accessing a property on undefined within a template), the error is caught in `preview.js:38` and logged to console. The user sees a blank or stale preview with no indication of what went wrong. The `template-engine.js:29` throws for unknown template ID, but individual template render errors (e.g., from malformed data) bubble up silently.
- **Fix recommendation:** Show an error state in the iframe:
```js
} catch (e) {
    console.error('Preview render error:', e);
    if (iframe) {
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write('<body style="font-family:monospace;padding:40px;color:#dc2626;">Render error: ' + e.message + '</body>');
        doc.close();
    }
}
```

---

## Architecture Notes (Not Bugs)

### NOTE-01: Script load order dependency
- **Files:** index.html:159-175
- **Description:** All scripts must load in exact order: templates first, then template-engine, sample-data, preview, export, storage, form-handler, app. The inline module-check script at line 177 verifies this. No module system means any reordering breaks the app silently. The current approach is correct but fragile.

### NOTE-02: No undo/redo capability
- **Description:** Every form change immediately saves to localStorage and re-renders preview. There's no undo stack. The "Clear" button is destructive with only a `confirm()` dialog as protection. Consider adding a simple undo buffer (store last N states).

### NOTE-03: No input sanitization on import beyond JSON parse
- **Description:** (Expanded from BUG-02) An imported JSON file could contain extremely long strings (e.g., 10MB summary field) that would cause the preview to render slowly or crash the tab. Consider adding string length limits during import validation.

---

## Summary

| Severity | Count | IDs |
|----------|-------|-----|
| Critical | 3 | BUG-01 (maintenance risk), BUG-02, BUG-03 |
| Medium   | 6 | BUG-04, BUG-05, BUG-06, BUG-07, BUG-08, BUG-09 |
| Low      | 9 | BUG-10 through BUG-18 |

**Top 3 priorities:**
1. **BUG-02** -- Import validation. Malformed JSON will crash templates with no user feedback. Quick fix, high impact.
2. **BUG-09** -- Export JSON button missing. Feature exists in code but no UI. Likely an oversight.
3. **BUG-04/BUG-05** -- Accordion max-height. Replace `2000px` with `none`, cancel timeouts on rapid clicks.
