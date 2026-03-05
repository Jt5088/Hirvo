# Template 04 — Harvard Bullet Point (Traditional/Institutional)

## Design Concept
Ultra-conservative, institutional format. All-serif typography, pure black on white, zero decorative elements. Education first (Harvard convention). Dense, information-forward layout optimized for finance/consulting recruiting where content volume matters more than visual flair.

## Fonts
| Element | Family | Weight | Size | Line-Height | Letter-Spacing |
|---------|--------|--------|------|-------------|----------------|
| Name | Times New Roman | 700 (bold) | 17pt | 1.2 | normal |
| Contact | Times New Roman | 400 | 10pt | 1.4 | normal |
| Section headings | Times New Roman | 700 (bold) | 12pt | 1.2 | 0.02em |
| Company name | Times New Roman | 700 (bold) | 11pt | — | normal |
| Role title | Times New Roman | 400 italic | 11pt | — | normal |
| Body / bullets | Times New Roman | 400 | 10.5pt | 1.15 | normal |
| Dates | Times New Roman | 400 | 10.5pt | — | normal |

## Colors
| Token | Value | Use |
|-------|-------|-----|
| --color-text | #000000 | All text |
| --color-bg | #ffffff | Page background |

Zero color. Pure black on white throughout.

## Layout
| Property | Value |
|----------|-------|
| Page size | US Letter (8.5 x 11 in) |
| Margins | 0.7in all sides |
| Columns | Single, full width |
| Name alignment | Centered |
| Contact alignment | Centered |
| Section order | Education, Experience, Leadership & Activities, Skills & Interests |

## Spacing
| Element | Value |
|---------|-------|
| Section gap | 15pt |
| Entry gap | 8pt |
| Bullet gap | 3pt |
| Bullet indent | 0.25in |
| Section heading bottom padding | 2pt |
| Section heading bottom margin | 8pt |
| Bullet list top margin | 2pt |
| Skills row gap | 4pt |
| Contact separator margin | 4px each side |

## Dividers
- 0.5pt solid black horizontal rule below each section heading (ALL CAPS heading text)
- Implemented via `border-bottom` on `.section-heading`

## Section Heading Style
- ALL CAPS via `text-transform: uppercase`
- Bold, 12pt
- Full-width thin rule below

## Entry Format
- Company name: bold, left-aligned
- Role: italic, below company name
- Location: right-aligned
- Date: right-aligned, below location
- Bullets: disc list, 0.25in indent

## Print
- `@page { size: letter; margin: 0.7in; }`
- Screen shadow and background removed in print
- No web fonts needed (Times New Roman is system-installed)

## Sample Content
Finance/Consulting professional resume: James R. Whitfield
- Education: Harvard Business School (MBA), Georgetown University (BS)
- Experience: McKinsey & Company, Goldman Sachs, Lazard
- Leadership & Activities: HBS Finance Club, Habitat for Humanity, CFA
- Skills & Interests: Technical, Languages, Interests
