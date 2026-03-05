# Template 03 — Serif/Sans-Serif Paired (Elegant Professional)

## Design Concept
Serif + sans-serif pairing creates editorial tension: EB Garamond headings feel literary and authoritative, Inter body text feels clean and modern. Single-column, full-width layout with generous margins.

## Fonts
| Element | Family | Weight | Size | Line-Height | Letter-Spacing |
|---------|--------|--------|------|-------------|----------------|
| Name | EB Garamond | 500 | 28pt | 1.15 | -0.01em |
| Contact | Inter | 400 | 10pt | 1.5 | normal |
| Section headings | EB Garamond | 600 | 13.5pt | 1.3 | 0.03em |
| Body / bullets | Inter | 400 | 10.5pt | 1.45 | normal |
| Bold text | Inter | 600 | 10.5pt | 1.45 | normal |
| Dates | Inter | 400 | 10pt | — | normal |
| Small text | Inter | 400 | 9.5pt | — | normal |

## Colors
| Token | Value | Use |
|-------|-------|-----|
| --color-primary | #000000 | Name, headings, bold text |
| --color-secondary | #333333 | Body text, bullets |
| --color-tertiary | #666666 | Dates, contact info, subtitles |
| --color-divider | #dddddd | Section heading underlines |
| --color-accent | rgba(115, 99, 255, 0.20) | Hirvo vertical spine |
| --color-bg | #ffffff | Page background |

## Layout
| Property | Value |
|----------|-------|
| Page size | US Letter (8.5 x 11 in) |
| Margins | 0.7in all sides |
| Columns | Single, full width |

## Spacing
| Element | Value |
|---------|-------|
| Section gap | 22pt |
| Entry gap | 12pt |
| Bullet gap | 5pt |
| Heading bottom padding | 5pt |
| Heading bottom margin | 10pt |
| Bullet list padding-left | 18pt |
| Skills grid column gap | 14pt |
| Skills grid row gap | 5pt |

## Dividers
- 0.5pt solid #dddddd horizontal line below each section heading
- Implemented via `border-bottom` on `.section-heading`

## Hirvo Twist
- 1px vertical accent line in `rgba(115, 99, 255, 0.20)` (#7363FF at 20% opacity)
- Runs along the left margin from first section to last
- Implemented as `::before` pseudo-element on `.sections` container
- Positioned 14px to the left of content area
- Does not affect layout or content flow

## Print
- `@page { size: letter; margin: 0.7in; }`
- Screen shadow and background removed in print
- Spine repositioned relative to print margin

## Sample Content
Marketing Director / VP of Marketing resume: Elena Vasquez
- Summary, Experience (4 entries), Education (2 entries), Skills (4 categories), Certifications (3)
