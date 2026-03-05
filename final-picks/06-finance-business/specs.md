# Template 6: Wharton/WSO Finance — CSS Specifications

## Typography
| Property | Value |
|---|---|
| Font Family | `Georgia, 'Times New Roman', Times, serif` |
| Name Size | 15pt |
| Name Weight | 700 (bold) |
| Name Alignment | centered |
| Contact Size | 10pt |
| Contact Alignment | centered, pipe-separated |
| Section Heading Size | 11.5pt |
| Section Heading Weight | 700 |
| Section Heading Style | uppercase, bold |
| Body Size | 10pt |
| Body Weight | 400 |
| Body Line-Height | 1.08 |
| Bullet Line-Height | 1.08 |
| Company Name Weight | 700 (bold) |
| Role Style | italic |
| Date Weight | 400 |
| Date Size | 10pt |

## Colors
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#000000` | All text — pure black |
| `--color-bg` | `#ffffff` | Page background — pure white |

No secondary or accent colors. Finance resumes are strictly black on white.

## Spacing
| Property | Value |
|---|---|
| Page Margins | 0.55in (all sides via `@page` and padding) |
| Header Bottom Margin | 12pt |
| Section Gap | 11pt |
| Entry Gap | 7pt |
| Bullet Gap | 2pt |
| Bullet Indent | 16pt (padding-left on `<ul>`) |

## Dividers
| Property | Value |
|---|---|
| Weight | 0.75pt |
| Color | `#000000` (black) |
| Style | solid, bottom border on section headings |
| Padding below heading text | 2pt |
| Margin below divider | 7pt |

## Layout
- Single column, full width
- No sidebar, no multi-column grid
- Centered header (name + contact)
- Flex row for entry lines: org/location left, date right
- Second flex row: italic role left, optional sub-date right
- `@page { size: letter; margin: 0.55in; }`
- Screen preview: 8.5in wide body, min-height 11in, centered with box-shadow

## Section Order (Finance Convention)
1. Education (always first in finance)
2. Experience
3. Additional Information (single catch-all section)

## Finance-Specific Conventions
- **No summary/objective section** — finance norms forbid it
- **Education before Experience** — standard for IB/PE resumes
- **Tight line-height (1.08)** — maximizes content density
- **Tight margins (0.55in)** — more space for deal bullets
- **Serif font (Georgia)** — finance industry standard
- **Pure black text only** — no grays, no accent colors
- **Deal bullet pattern:** Company/role header, then specific transaction bullets with dollar values
- **Additional Information** is a single section covering skills, languages, certifications, and interests
- **Modest name size (15pt)** — finance names are deliberately understated
- **Bold section dividers** — black rules, not light gray
