# Cross-Branch Sync — Template Builder Team Lead

This file tracks communication between worktree branches. Updated after each sync.

---

## Branch Map
| Branch | Worktree | Focus |
|---|---|---|
| `template-builder` | `hirvo-template-builder` | Resume template designs + code |
| `tb-uiux` | `hirvo-tb-uiux` | UX research + resume builder app |
| `tb-resume-designs` | `hirvo-tb-resume-designs` | Design research (feeds into template-builder) |
| `tb-preview` | `hirvo-tb-preview` | Preview system research |

---

## Sync #1 — 2026-03-05

### FROM template-builder TO tb-uiux:

**What we built:** 8 coded resume templates (HTML/CSS) across distinct archetypes:
1. Jake's Classic Tech — dense single-col, serif, 0.5in margins
2. Swiss Modern — Inter light-weight, 3-tone gray, whitespace-only separators (Hirvo twist: purple hover accent)
3. Serif-Paired Elegant — EB Garamond + Inter editorial pairing (Hirvo twist: vertical spine line)
4. Harvard Traditional — Times New Roman, education-first, full-width rules
5. Corporate Executive — Inter, 0.9in margins, executive whitespace
6. Finance Business — Georgia, tight 1.08 line-height, deal-bullet pattern
7. Two-Column Creative — 30/70 sidebar with skill bars, faint tint
8. Pender Minimal — Inter multi-weight, zero decoration, whitespace IS the design

**What tb-uiux needs to know:**
- All templates use CSS custom properties — designed to be driven by a template builder UI
- Key CSS vars across all templates: `--margin`, `--font-body`, `--font-heading`, `--body-size`, `--heading-size`, `--name-size`, `--line-height`, `--section-gap`, `--entry-gap`, `--bullet-gap`, `--color-primary`, `--color-secondary`, `--color-tertiary`
- Templates are standalone HTML — the builder app should inject user content into these structures
- Print rules (`@page`, `@media print`) are already embedded
- The builder should offer these as selectable templates in the three-panel editor (per tb-uiux research finding)

**Spacing sweet spots (consensus from 24-template analysis):**
- Body text: 10-10.5pt
- Name: 20-28pt (varies by archetype)
- Section headings: 12-14pt
- Margins: 0.6-0.75in (default), scales 0.5in (dense) to 1.0in (executive)
- Section gaps: 18-24pt
- Entry gaps: 10-12pt
- Bullet spacing: 4-6pt
- Line height: 1.15 (compact) to 1.45 (comfortable)

**Font pairing system (5 validated pairings for the builder):**
1. Inter only (modern universal)
2. EB Garamond + Inter (editorial)
3. Merriweather + Lato (warm editorial)
4. Helvetica/Arial only (Swiss canonical)
5. Georgia + Helvetica (traditional formal)

**Career-level scaling (product differentiator):**
- Junior: 0.5in margins, 1.0 line-height, 8-10pt section gaps
- Mid-career: 0.7in margins, 1.15 line-height, 12-16pt gaps
- Executive: 0.9-1.0in margins, 1.45 line-height, 22-28pt gaps

### FROM tb-uiux TO template-builder (reading their research):

**What tb-uiux found (relevant to us):**
- Three-panel editor (content | preview | design) is the gold standard
- Real-time preview on every keystroke is non-negotiable
- Reactive Resume's approach: TanStack/React + Tailwind + headless Chromium PDF
- FlowCV's drag-sections-between-columns is the best layout control
- Dark mode editor aligns with Hirvo brand
- Templates should be named with social proof (city names + user counts > abstract names)
- Server-side Chromium PDF = pixel-perfect output
- Template naming matters: "London", "Berlin" (Resume.io style) vs abstract

**Action items for template-builder:**
- [ ] Ensure all 8 templates work with dynamic content injection (not just static HTML)
- [ ] Add template metadata (name, category, recommended-for, preview-thumbnail-description)
- [ ] Consider naming convention: archetype names or city names?
- [ ] Templates need to handle variable content lengths gracefully (1-page vs 2-page)

### FROM tb-preview TO template-builder:
- tb-preview is mostly empty (initial commit only). No findings to sync yet.
- When preview system is built, it needs to render our 8 templates in real-time.

---
