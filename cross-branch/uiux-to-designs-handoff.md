# UIUX Handoff to Designs Branch (tb-resume-designs)

**From:** tb-uiux
**Date:** 2026-03-05

---

## Template Audit Results

All 8 templates were audited. Scores:

| Template | Score | Layout | Key Strength | Key Weakness |
|---|---|---|---|---|
| Modern | 8.5 | Header+body | Best hierarchy, skill tags | Date contrast (fixed) |
| Classic | 8.0 | Single col | ATS-safe, serif headings | Conservative |
| Professional | 8.0 | Single col | Corporate, table skills | Meta contrast (fixed) |
| Perfecto | 7.5 | Single col | Geometric ::after lines | Missing LinkedIn (fixed) |
| Design | 7.5 | 2-column | Strong sidebar | Print issues with sidebar |
| Simple | 7.0 | Single col | Whitespace, minimal | Was missing LinkedIn + location |
| Elegant | 7.0 | Single col | Serif + gold accents | Gold contrast borderline |
| Creative | 7.0 | Header+body | Personality, timeline entries | ATS unfriendly |

## Fixes Already Applied
- WCAG AA contrast fixed on ALL templates (minimum #6b7280 for secondary text)
- LinkedIn added to Simple, Elegant, Perfecto, Creative
- Page break handling added to all templates
- Print color-adjust added for dark backgrounds
- Location added to Simple template entries

## Design Guidelines for New Templates

Any new template MUST include:
1. `p.linkedin` rendering in contact section
2. `@page { margin: 0.5in 0.6in; }` in print styles
3. `.entry { page-break-inside: avoid; break-inside: avoid; }` in print styles
4. Secondary text color no lighter than #6b7280 on white (WCAG AA 4.5:1)
5. If dark backgrounds: `print-color-adjust: exact; -webkit-print-color-adjust: exact;`
6. `overflow-wrap: break-word; word-break: break-word;` on description fields
7. Font weights that actually exist for the chosen Google Font

## Template Selector UX
- Swatches now use `colors.accent` instead of `colors.primary`
- Accent colors should be visually distinct from existing templates
- Swatch height is 44px -- consider adding SVG layout thumbnails in future

## Research Insights for Template Design
- **ATS-friendly templates are the most requested** -- prioritize clean single-column layouts
- **Two-column templates break on multi-page print** -- warn users or avoid for ATS category
- **Skill display variety matters**: tags, pills, tables, inline, grids -- each template should differ
- **Template naming with social proof** works better than abstract names (e.g., "Dublin: 11M users")
- **8-15 templates at launch** is sufficient if each is highly customizable

## Full Reports
See `tb-uiux:Hirvo template builder/research/template-audit.md` for the complete per-template breakdown.
