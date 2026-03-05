# Template 08: Pender (Premium Minimalist)

## Layout
- **Structure:** Single column
- **Page size:** 8.5in x 11in (US Letter)
- **Margins:** 0.95in (all sides) — generous whitespace IS the design
- **Target whitespace ratio:** ~40%

## Typography
- **Font:** Inter (Google Fonts), weights 400/500/600/700/800
- **Name:** 30pt, weight 800, letter-spacing -0.03em, line-height 1.05, color #000
- **Summary:** 15pt, weight 400, line-height 1.5, color #444 — deliberately oversized
- **Section headings:** 11pt, weight 700, uppercase, letter-spacing 0.1em, color #333
- **Entry titles:** 12pt, weight 600, color #333
- **Entry org:** 10.5pt, weight 400, color #888
- **Body text:** 10.5pt, weight 400, line-height 1.5, color #444
- **Dates:** 10pt, weight 400, color #888
- **Skills text:** 10.5pt, weight 400, color #444
- **Skills category labels:** weight 600, color #333

## Colors
| Token | Value | Use |
|---|---|---|
| `--color-name` | `#000000` | Name only |
| `--color-heading` | `#333333` | Section headings, entry titles, skill labels |
| `--color-body` | `#444444` | Body text, summary, skills |
| `--color-date` | `#888888` | Dates, org lines, bullet markers, contact info |

Zero accent colors. Zero decoration. The hierarchy is built entirely through weight, size, and grayscale value.

## Spacing
| Element | Value |
|---|---|
| Page margin | 0.95in |
| Contact to name gap | 8pt |
| Summary to name gap | 24pt |
| Section gap | 32pt |
| Section heading to first entry | 16pt |
| Entry gap | 16pt |
| Bullet gap | 6pt |
| Bullets to entry header | 6pt |
| Education detail to org | 4pt |
| Skills category gap | 6pt |

## Decorative Elements
None. Zero lines, borders, rules, icons, or accent colors.

## Contact Line
- Inline format with middot separators
- Separator color: #ccc
- Separator margin: 0 6px

## Print
- `@page { size: letter; margin: 0.95in; }`
- Page padding set to 0 in print (margin handled by @page)
- Box shadow and body background removed in print

## Sections (in order)
1. Name (h1)
2. Contact (inline, single line)
3. Summary (oversized paragraph — deliberate design choice)
4. Experience (4 entries)
5. Education (2 entries)
6. Skills (3 categories, inline comma-separated)

## Design Philosophy
The Pender template achieves premium feel through absence. Every element earns its place through typographic hierarchy alone: the 800-weight name anchors the page, the oversized summary forces engagement, and generous margins create breathing room that signals confidence. There are no visual shortcuts — no lines to scan, no icons to decode. The reader's eye follows the natural weight hierarchy from name to summary to section headings to entry titles.
