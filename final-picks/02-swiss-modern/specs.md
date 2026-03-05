# Swiss/International Typographic Resume -- Specs

## Typography
| Element          | Font  | Size  | Weight | Line-Height | Letter-Spacing |
|------------------|-------|-------|--------|-------------|----------------|
| Body default     | Inter | 10pt  | 400    | 1.45        | normal         |
| Name             | Inter | 30pt  | 300    | 1.1         | -0.01em        |
| Section heading  | Inter | 11pt  | 700    | 1.2         | 0.12em         |
| Entry role       | Inter | 10pt  | 600    | 1.45        | 0.005em        |
| Entry org / date | Inter | 9pt   | 400    | 1.5         | 0.02em (date)  |
| Skill label      | Inter | 8pt   | 700    | --          | 0.1em          |
| Watermark        | SF Mono / Fira Code | 7pt | 400 | -- | 0.05em     |
| Small text       | Inter | 9pt   | 400    | 1.5         | normal         |

## Name Treatment
- Weight 300 (LIGHT -- Swiss signature)
- 30pt, left-aligned
- Below: subtitle line in 10pt weight 400, color #555555
- Contact meta in 9pt, flex-wrapped with 20pt horizontal gap

## Section Headings
- ALL CAPS, weight 700, letter-spacing 0.12em
- NO rules, NO lines -- pure whitespace separation
- 14pt margin below heading

## Colors (Three-Tone Gray)
| Token              | Value                  | Use                        |
|--------------------|------------------------|----------------------------|
| --color-primary    | #000000                | Name, headings, role text  |
| --color-secondary  | #333333                | Body text, bullets, org    |
| --color-tertiary   | #555555                | Dates, locations, labels   |
| --color-bg         | #ffffff                | Page background            |
| --accent           | #7363FF                | Hover accent bar (Hirvo)   |
| --accent-hover     | rgba(115,99,255,0.08)  | Reserved                   |

## Page Layout
| Property        | Value                    |
|-----------------|--------------------------|
| Page size       | US Letter (8.5in x 11in) |
| All margins     | 0.75in                   |
| Page width      | 8.5in                    |
| Page min-height | 11in                     |

## Spacing
| Element             | Value  |
|---------------------|--------|
| Section gap         | 28pt   |
| Entry gap           | 14pt   |
| Bullet gap          | 5pt    |
| Skills grid gap     | 10pt vertical, 32pt horizontal |
| Header bottom       | 28pt   |

## Dividers
- NONE. All separation through whitespace only (Swiss principle).

## Bullet Style
- 4px circle, filled, color #555555
- Positioned via ::before pseudo-element
- 14pt left padding for text

## Skills Layout
- 2-column CSS grid (1fr 1fr)
- Labels: 8pt, uppercase, 700 weight, tertiary color
- Values: 10pt, 400 weight, secondary color

## Hirvo Twist
1. **Accent bar on hover:** `::before` pseudo-element on `.section`
   - Position: 16pt left of section, 20% from top
   - Size: 3px wide, animates from 0% to 60% height
   - Color: var(--accent) = #7363FF
   - Easing: cubic-bezier(0.16, 1, 0.3, 1) -- springy ease
   - Opacity: 0 to 1 over 0.25s
   - Hidden in @media print

2. **Watermark:** `built with hirvo`
   - Font: monospace (SF Mono / Fira Code)
   - Size: 7pt
   - Opacity: 0.15
   - Position: absolute, bottom-right (20pt from bottom, 0.75in from right)
   - `user-select: none`

## Print Rules
- `@page { size: letter; margin: 0.75in; }`
- Page container removes shadow in print
- Accent hover bars hidden via `display: none !important`
- Watermark remains visible in print (subtle branding)

## Anti-aliasing
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`
- (Standard for Inter on screens)
