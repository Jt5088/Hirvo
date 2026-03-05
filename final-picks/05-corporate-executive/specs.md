# Template 5: Corporate Executive — CSS Specifications

## Typography
| Property | Value |
|---|---|
| Font Family | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Name Size | 26pt |
| Name Weight | 600 (semi-bold) |
| Section Heading Size | 14pt |
| Section Heading Weight | 700 |
| Section Heading Style | uppercase, letter-spacing: 0.06em |
| Body Size | 11pt |
| Body Weight | 400 |
| Body Line-Height | 1.48 |
| Date Size | 10pt |
| Date Weight | 400 |
| Contact Size | 10pt |
| Role/Title Weight | 600 |

## Colors
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#1a1a1a` | Name, headings, body text |
| `--color-secondary` | `#444444` | Organization names, contact info, summary text |
| `--color-tertiary` | `#777777` | Location text |
| `--color-date` | `#666666` | Date ranges |
| `--color-divider` | `#e0e0e0` | Section divider lines |
| `--color-bg` | `#ffffff` | Page background |

## Spacing
| Property | Value |
|---|---|
| Page Margins | 0.9in (all sides via `@page` and padding) |
| Header Bottom Gap | 30pt |
| Section Gap | 26pt |
| Entry Gap | 14pt |
| Bullet Gap | 5pt |
| Bullet Indent | 18pt (padding-left on `<ul>`) |

## Dividers
| Property | Value |
|---|---|
| Weight | 0.5pt |
| Color | `#e0e0e0` |
| Style | solid, bottom border on section headings |
| Padding below heading text | 6pt |
| Margin below divider | 14pt |

## Layout
- Single column, full width
- No sidebar, no multi-column grid
- Flex row for entry headers (role left, date right)
- `@page { size: letter; margin: 0.9in; }`
- Screen preview: 8.5in wide body, min-height 11in, centered with box-shadow

## Design Philosophy
- Executive whitespace throughout — generous margins and gaps
- No icons, no skill bars, no visual gimmicks
- Dividers are thin and light (#e0e0e0), not heavy
- Semi-bold name (600) rather than full bold for understated authority
- Color hierarchy: primary → secondary → tertiary → date for clear visual ranking
