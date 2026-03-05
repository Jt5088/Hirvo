# Template Quality Audit

**Auditor:** Claude (Template Quality Auditor)
**Date:** 2026-03-04
**Codebase:** `resume-builder-v2/src/templates/`
**Templates reviewed:** 8 (classic, modern, simple, design, elegant, perfecto, professional, creative)

---

## Executive Summary

All 8 templates share a consistent architecture: IIFE pattern, local `esc()` function, `{ style, html }` return shape, and `data.personal || {}` guard. The codebase is solid at a structural level. The critical issues are: **3 templates omit LinkedIn from contact info**, **no template handles page breaks**, **inline styles appear in 2 templates instead of class-based styling**, and the **Design template sidebar background will not print** without `-webkit-print-color-adjust`.

**Overall range:** 6.0 - 8.5 / 10

---

## Template Comparison Matrix

| Feature | Classic | Modern | Simple | Design | Elegant | Perfecto | Professional | Creative |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **LinkedIn rendered** | Yes | Yes | NO | Yes | NO | NO | Yes | NO |
| **Summary** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Experience** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Education** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Skills** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Languages** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Certifications** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Location in entries** | Yes | Yes | NO | Yes | Yes | Yes | Yes | Yes |
| **Skills display** | Table | Tags | Inline | Sidebar list | Grid | Pills | Table | Chips |
| **@media print** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Print bg fix** | N/A | N/A | N/A | NO | N/A | NO | N/A | Partial |
| **Page break handling** | NO | NO | NO | NO | NO | NO | NO | NO |
| **esc() function** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Null guards on sections** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Layout** | Single | Header+body | Single | 2-column | Single | Single | Single | Header+body |
| **Fonts** | Serif+Sans | Sans | Sans | Sans | Serif+Sans | Geo+Sans | Sans | Sans |
| **Accent color** | #1a1a1a | #3b82f6 | #6b7280 | #0ea5e9 | #b8860b | #a855f7 | #059669 | #f43f5e |

---

## Per-Template Audit

---

### 1. CLASSIC (classic.js)
**Score: 8.0 / 10**

**Typography**
- Hierarchy is clear: serif headings (Source Serif 4) vs sans body (Inter). Good separation.
- Body at 13px (line 29: `.entry-desc`) with line-height 1.7 -- readable.
- Section titles 14px uppercase (line 22) -- appropriate.
- H1 at 28px (line 15) -- slightly conservative but suitable for "classic" positioning.

**Spacing**
- Resume padding 48px/52px (line 13) -- generous, good.
- Section margin-bottom 22px (line 21) -- tight but workable.
- Entry margin-bottom 16px (line 23) -- adequate.

**Color**
- Text #333 on white -- contrast ratio ~12.6:1. Excellent.
- Date text #888 on white -- 3.5:1. BORDERLINE. Fails WCAG AA for normal text (needs 4.5:1).
- Contact #666 -- 5.7:1. Passes AA.

**Print**
- Has `@media print` (line 38) -- only reduces padding. Minimal.
- No `page-break-inside: avoid` on entries.
- No background colors to worry about. Clean for print.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 27 | `.entry-date` color #888 fails WCAG AA (3.5:1) | Medium | Change to #707070 or darker |
| 38 | No `page-break-inside: avoid` on `.entry` | Medium | Add `@media print { .entry { page-break-inside: avoid; } }` |
| 38 | No `page-break-after: avoid` on `.section-title` | Low | Prevents orphaned section headers |
| 14 | Header `border-bottom: 2px solid #1a1a1a` -- thick for a "classic" feel | Nitpick | Consider 1px solid #333 |

---

### 2. MODERN (modern.js)
**Score: 8.5 / 10**

**Typography**
- Single font (Inter) used well with weight variation.
- H1 at 30px weight 800 (line 15) -- bold, impactful.
- Section titles 11px uppercase (line 22) -- small but with 0.12em letter-spacing, works as label.
- Entry role 15px bold (line 26) -- clear hierarchy.

**Spacing**
- Header padding 40px/48px (line 14) -- well proportioned.
- Body padding 32px/48px (line 19) -- good.
- Entry margin-bottom 18px with bottom border (line 23) -- excellent separation.

**Color**
- Dark header (#0f172a) with white text -- maximum contrast.
- Accent blue #3b82f6 -- vibrant, professional.
- Body text #334155 on white -- 8.6:1. Excellent.
- Date text #94a3b8 -- 3.0:1. FAILS WCAG AA.

**Print**
- Has print styles (line 38) -- adjusts padding.
- Dark header background WILL print as white in most browsers unless `color-adjust: exact` is set.
- No page break handling.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 27 | `.entry-date` #94a3b8 fails WCAG AA (3.0:1) | High | Change to #64748b (4.6:1) |
| 17 | Header `.contact` color #94a3b8 on #0f172a -- 4.5:1 barely passes | Low | Acceptable but tight |
| 38 | Dark header bg needs `-webkit-print-color-adjust: exact` for print | Medium | Add to print styles |
| 38 | No page-break-inside handling | Medium | Add for `.entry` |
| 61 | Em-dash `—` used as literal character vs `\u2014` in classic | Nitpick | Consistency: pick one encoding |

---

### 3. SIMPLE (simple.js)
**Score: 7.0 / 10**

**Typography**
- Single font Inter throughout. Clean but lacks character.
- H1 at 24px (line 14) -- smallest of all templates. May feel underwhelming.
- Section titles 12px (line 20) -- small.
- Consistent 13px body text.

**Spacing**
- Resume padding 52px/56px (line 13) -- very generous. Matches "lots of whitespace" intent.
- Section margin-bottom 0 (line 19) -- relies on `.divider` for separation. Works.
- Divider `margin: 24px 0` (line 17) provides rhythm.

**Color**
- Muted palette. Primary #111827, text #374151.
- Contact/date color #9ca3af -- 2.8:1. FAILS WCAG AA.
- Section title #9ca3af -- also fails.

**Print**
- Minimal print adjustment (line 31).
- `.divider` is a `background` 1px line -- will NOT print unless `color-adjust` is set.
- No page break handling.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 16,24 | Color #9ca3af fails WCAG AA (2.8:1 on white) | High | Use #6b7280 (4.6:1) minimum |
| 20 | `.section-title` also uses #9ca3af -- same issue | High | Same fix |
| 42 | **LinkedIn omitted from contact** -- only email, phone, location, website | High | Add `if (p.linkedin) html += '<span>' + esc(p.linkedin) + '</span>';` after line 41 |
| 17 | `.divider` uses background color, won't print | Medium | Use `border-top: 1px solid #e5e7eb` instead |
| 87-88 | Inline `style="color:#9ca3af"` instead of class | Low | Create `.meta-value` class |
| 97 | Same inline style on certifications | Low | Same fix |
| 55 | Experience entries don't show location | Medium | Add location to entry-meta like other templates |

---

### 4. DESIGN (design.js)
**Score: 7.5 / 10**

**Typography**
- DM Sans -- modern, clean.
- Sidebar h1 22px (line 15) -- constrained by sidebar width, appropriate.
- Name split with `<br>` (line 45) -- nice touch for sidebar.
- Section titles 10px in sidebar (line 18) -- very small but with 0.14em tracking, readable.

**Spacing**
- Sidebar 260px (line 13) -- standard sidebar width.
- Main padding 40px/36px (line 26) -- adequate.
- Section margin 22-24px -- consistent.

**Color**
- Sidebar dark bg #0f172a with light text -- good contrast.
- Sidebar text #cbd5e1 on #0f172a -- 8.8:1. Excellent.
- Sidebar muted #94a3b8 on #0f172a -- 4.5:1. Passes AA barely.
- `.lang-level` #64748b on #0f172a -- 3.3:1. FAILS AA.
- Main content -- standard dark on white, fine.

**Layout**
- Two-column grid works well for sidebar templates.
- Skills, languages, certs in sidebar; experience, education in main. Logical.

**Print**
- Sidebar bg #0f172a will NOT print. Needs `-webkit-print-color-adjust: exact; print-color-adjust: exact;`.
- Grid reduces to 220px/1fr (line 38) -- good.
- No page break handling.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 25 | `.lang-level` #64748b on #0f172a sidebar fails AA (3.3:1) | High | Use #94a3b8 minimum |
| 38 | Sidebar bg won't print without `print-color-adjust: exact` | High | Add to `.sidebar` in print |
| 36 | `.cert-item` color #cbd5e1 -- styled for sidebar but class lives in main scope too | Low | No conflict currently but fragile |
| 13 | `min-height: 100vh` on grid -- will force blank space on short resumes | Medium | Change to `min-height: auto` or remove |
| 38 | No page-break handling, especially important for 2-col where content may split awkwardly | Medium | Add `page-break-inside: avoid` on `.entry` |

---

### 5. ELEGANT (elegant.js)
**Score: 7.0 / 10**

**Typography**
- Playfair Display headings + Lato body -- beautiful pairing.
- H1 at 32px (line 15) -- largest among templates. Commanding.
- Subtitle uses gold accent with 0.15em letter-spacing uppercase (line 16) -- elegant but may feel dated.
- Summary in italic (line 18) -- intentional style choice, works for "elegant" positioning.

**Spacing**
- Resume padding 56px/60px (line 13) -- most generous. Premium feel.
- Section margin-bottom 28px (line 19) -- comfortable.
- Entry margin 18px (line 21) -- good.

**Color**
- Gold accent #b8860b -- distinctive.
- Text #555 body -- 7.1:1 on white. Good.
- Contact #888 -- 3.5:1. FAILS AA.
- Date in gold #b8860b on white -- 3.8:1. FAILS AA.

**Print**
- Minimal print adjustments (line 33).
- No background colors that would be problematic.
- Border-bottom on header uses #e8e0d0 -- warm tone, prints fine.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 17 | Contact color #888 fails WCAG AA | Medium | Use #666 (5.7:1) |
| 24 | Date color #b8860b fails AA (3.8:1) -- but it's the accent, visible | Medium | Darken to #96710a or use as bold to qualify for large text |
| 44 | **LinkedIn omitted from contact** | High | Add after website on line 44 |
| 89 | Inline `style="color:#b8860b"` on language proficiency | Low | Use class-based styling |
| 98 | Same inline style on certifications year | Low | Same fix |
| 33 | No page break handling | Medium | Add |

---

### 6. PERFECTO (perfecto.js)
**Score: 7.5 / 10**

**Typography**
- Space Grotesk headings + Inter body -- distinctive geometric feel.
- H1 28px (line 15) -- solid.
- Section titles use CSS `::after` for a line extending to the right (line 21) -- polished detail.
- Skill pills with rounded borders (line 29) -- modern.

**Spacing**
- Resume padding 44px/48px (line 13) -- slightly tight.
- Summary has padding + background + border-left (line 18) -- good callout treatment.
- Section margin 26px (line 19) -- adequate.

**Color**
- Purple accent #a855f7 -- vibrant.
- Date in accent purple -- same concern as Elegant.
- `.meta-value` #a1a1aa -- 2.6:1. FAILS AA badly.
- Text #52525b -- 7.0:1. Good.

**Print**
- Summary background set to white in print (line 36) -- good.
- Summary `background: #fafafa` -- very subtle, won't cause issues.
- No page break handling.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 35 | `.meta-value` #a1a1aa fails AA (2.6:1) | High | Use #71717a (4.7:1) |
| 25 | `.entry-date` accent #a855f7 on white -- 3.1:1, fails AA | High | Darken to #7c3aed or use font-weight 700 |
| 47 | **LinkedIn omitted from contact** (header-right only has email, phone, location, website) | High | Add `if (p.linkedin) html += '<br>' + esc(p.linkedin);` after line 47 |
| 18 | Summary bg #fafafa -- barely visible. Intended? | Nitpick | Intentional subtle callout |
| 36 | No page-break-inside on entries | Medium | Add |

---

### 7. PROFESSIONAL (professional.js)
**Score: 8.0 / 10**

**Typography**
- Roboto -- universally safe, corporate-friendly.
- H1 26px (line 15) -- conservative, appropriate for "professional."
- Section titles 13px (line 20) -- slightly larger than others' 11px. More readable.
- Uses "Professional Experience" (line 53) instead of just "Experience" -- nice corporate touch.

**Spacing**
- Resume padding 44px/52px (line 13) -- balanced.
- Section margin 22px (line 19) -- tight but fits corporate density.
- Skills table with 6px row padding (line 28) -- well spaced.

**Color**
- Green accent #059669 -- professional, trustworthy.
- Contact border-top in accent (line 17) -- distinctive.
- Date in accent green #059669 on white -- 4.6:1. PASSES AA.
- `.meta-value` #9ca3af -- 2.8:1. FAILS AA.
- Text #4b5563 -- 6.3:1. Good.

**Print**
- Minimal print adjustments.
- Contact `border-top: 2px solid #059669` will print fine.
- Skills table renders cleanly in print.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 34 | `.meta-value` #9ca3af fails AA (2.8:1) | High | Use #6b7280 |
| 35 | No page-break handling | Medium | Add |
| 58 | Company/location separator is `|` while others use `·` | Low | Consistency preference only |

---

### 8. CREATIVE (creative.js)
**Score: 7.0 / 10**

**Typography**
- Poppins -- friendly, rounded. Matches creative positioning.
- H1 at 32px (line 16) -- large, impactful.
- Section titles 14px (line 22) with a colored bar `::before` (line 23) -- strong visual anchor.
- Entry left border (line 24) creates timeline feel.

**Spacing**
- Header padding 44px/48px (line 14) -- generous.
- Body padding 36px/48px (line 19) -- good.
- Entry padding-left 18px for border offset (line 24) -- good.
- Entry margin 20px (line 24) -- most generous of all templates.

**Color**
- Rose accent #f43f5e -- bold and memorable.
- Header has decorative gradient blob `::after` (line 15) -- creative but may distract in print.
- Contact text `rgba(255,255,255,0.6)` on dark header -- 7.5:1. Passes.
- Entry meta #999 on white -- 2.8:1. FAILS AA.
- Summary bg #fafafa with border -- fine.

**Print**
- Print styles address header bg, summary bg, info-item bg (line 37) -- good coverage.
- Uses `!important` on print -- acceptable for print overrides.
- Header `::after` radial gradient -- will be invisible in print, harmless.

**Issues**
| Line | Issue | Severity | Fix |
|---|---|---|---|
| 26 | `.entry-meta` #999 fails AA (2.8:1) | High | Use #666 |
| 48 | **LinkedIn omitted from contact** | High | Add after website |
| 61 | Extra `· ` before date when location is missing: outputs `Company ·  · Jan 2021 — Present` | Medium | Guard the separator: `(e.location ? ' · ' + esc(e.location) : '') + ' · '` always emits ` · ` before date. If location is empty, you get ` · Jan...` which is fine, but if company is also the last thing, double separator is possible. Actually this is fine as-is -- only one `·` if no location. |
| 37 | Header gradient `background: #1a1a1a !important` strips gradient -- may look different | Low | Intentional simplification for print |
| 30 | `.skill-chip` bg #fff0f3 -- won't print without color-adjust | Low | Add `print-color-adjust: exact` or remove bg in print |

---

## Cross-Template Issues (Systemic)

### 1. WCAG AA Contrast Failures (affects 7 of 8 templates)

Nearly every template has at least one text color that fails WCAG AA 4.5:1 minimum for normal-sized text. Most common offenders:

| Color | Contrast on white | Templates using it |
|---|---|---|
| #9ca3af | 2.8:1 | Simple, Professional |
| #94a3b8 | 3.0:1 | Modern, Design |
| #a1a1aa | 2.6:1 | Perfecto |
| #888 / #888888 | 3.5:1 | Classic, Elegant |
| #999 / #999999 | 2.8:1 | Creative |

**Recommendation:** Establish a minimum secondary text color of **#6b7280** (4.6:1 on white) or darker across all templates. Date text, contact info, and meta values are the consistent failure points.

### 2. No Page Break Handling (affects all 8 templates)

No template includes `page-break-inside: avoid` or `break-inside: avoid` on entries. For multi-page resumes, experience entries can split across pages mid-description.

**Recommendation:** Add to every template's `@media print`:
```css
.entry { page-break-inside: avoid; break-inside: avoid; }
.section-title { page-break-after: avoid; break-after: avoid; }
```

### 3. LinkedIn Omitted (affects 4 templates)

| Template | LinkedIn in contact? |
|---|---|
| Simple | NO (line 42) |
| Elegant | NO (line 44) |
| Perfecto | NO (line 47) |
| Creative | NO (line 48) |

The data model includes `linkedin` in `personal`. These 4 templates simply never check for it.

### 4. Inline Styles Instead of Classes (affects 2 templates)

- **Simple** (lines 87, 97): `style="color:#9ca3af"` on language/cert values
- **Elegant** (lines 89, 98): `style="color:#b8860b"` on language/cert values

Other templates use `.meta-value` or equivalent classes. These 2 should be consistent.

### 5. Experience Location Display (affects 1 template)

- **Simple** (line 55): Shows only `e.company` in `.entry-meta`. Does NOT include `e.location`, unlike every other template.

### 6. esc() Function Duplication

Every template defines its own identical `esc()` function inside its IIFE. This is 8 copies of the same 1-liner. Functionally harmless (IIFEs need local scope), and actually the correct pattern for isolated template files. No action needed, but noting for awareness.

### 7. Em-Dash Encoding Inconsistency

- **Classic**: Uses `\u2014` (Unicode escape) on line 62
- **All others**: Use literal `—` character

Functionally identical, but inconsistent. Minor.

### 8. Print Background Colors

Templates with colored backgrounds that won't print by default:
- **Modern**: Dark header (#0f172a)
- **Design**: Dark sidebar (#0f172a)
- **Creative**: Dark header gradient
- **Perfecto**: Summary bg #fafafa (too subtle to matter)
- **Creative**: Skill chips bg #fff0f3, info items bg #fafafa

Only Creative partially addresses this with `!important` overrides. Modern and Design do not add `print-color-adjust` properties.

---

## Score Summary

| Template | Score | Strengths | Key Weakness |
|---|---|---|---|
| **Modern** | 8.5 | Best overall design, clear hierarchy, skill tags | Date contrast, header print |
| **Classic** | 8.0 | ATS-safe, clean, complete | Date contrast, conservative |
| **Professional** | 8.0 | Corporate-ready, all sections, good accent | Meta-value contrast |
| **Perfecto** | 7.5 | Unique geometric style, good print handling | Missing LinkedIn, contrast issues |
| **Design** | 7.5 | Strong 2-column layout, sidebar works well | Sidebar print, min-height issue |
| **Simple** | 7.0 | True minimalism, generous whitespace | Missing LinkedIn, worst contrast, no location |
| **Elegant** | 7.0 | Beautiful font pairing, premium feel | Missing LinkedIn, gold contrast |
| **Creative** | 7.0 | Personality, timeline entries, bold header | Missing LinkedIn, meta contrast |

---

## Priority Fix List (ordered by impact)

1. **HIGH -- Fix WCAG contrast on ALL templates.** Establish `#6b7280` as the floor for secondary text. Affects date, contact, and meta-value colors across 7 of 8 templates.
2. **HIGH -- Add LinkedIn to Simple, Elegant, Perfecto, Creative.** One line each, identical pattern to existing contact checks.
3. **HIGH -- Add page break handling to ALL templates.** Two CSS rules in each `@media print` block.
4. **MEDIUM -- Add `print-color-adjust: exact` to Modern header, Design sidebar.** Or provide fallback colors.
5. **MEDIUM -- Add location to Simple template entries.** Currently the only template that drops entry location.
6. **LOW -- Replace inline styles in Simple and Elegant.** Use class-based styling for maintainability.
7. **LOW -- Normalize em-dash encoding.** Pick one approach (literal `—` is cleaner).
