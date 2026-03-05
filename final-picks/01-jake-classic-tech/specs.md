# Jake's Resume -- Classic Tech Template Specs

## Typography
| Element          | Font                                    | Size    | Weight | Line-Height | Letter-Spacing |
|------------------|-----------------------------------------|---------|--------|-------------|----------------|
| Body default     | CMU Serif, Georgia, Times New Roman     | 10.5pt  | 400    | 1.1         | normal         |
| Name             | (same)                                  | 25pt    | 700    | 1.15        | 0.04em         |
| Section heading  | (same)                                  | 13.5pt  | 700    | 1.3         | 0.06em         |
| Small text       | (same)                                  | 9.5pt   | 400    | 1.4         | normal         |

## Name Treatment
- `font-variant: small-caps`
- Centered, 25pt, bold

## Section Headings
- `font-variant: small-caps` + `text-transform: uppercase`
- Full-width horizontal rule below: `border-bottom: 0.8pt solid #000`
- 1pt padding below text, 5pt margin below rule

## Colors
| Token         | Value    | Use              |
|---------------|----------|------------------|
| --color-text  | #000000  | All text         |
| --color-bg    | #ffffff  | Page background  |
| --color-link  | #0000EE  | Hyperlinks       |
| --color-rule  | #000000  | Section rules    |

## Page Layout
| Property        | Value    |
|-----------------|----------|
| Page size       | US Letter (8.5in x 11in) |
| All margins     | 0.5in    |
| Page width      | 8.5in    |
| Page min-height | 11in     |

## Spacing
| Element                | Value   |
|------------------------|---------|
| Section gap (top)      | 10pt    |
| Bullet gap             | 2pt     |
| Entry tight (negative) | -4pt    |
| Bullet indent          | 15pt    |

## Entry Layout
- Two-row flex layout per entry
- Row 1: Bold primary (left) + date (right)
- Row 2: Italic secondary (left) + italic date/location (right)
- `justify-content: space-between; align-items: baseline`

## Skills Layout
- Label (bold, 100pt min-width) + value inline on each row
- 2pt gap between rows

## Print Rules
- `@page { size: letter; margin: 0.5in; }`
- Page container removes shadow/border in print
- Body resets to zero margin

## Bullet Style
- Unicode bullet `\2022` via `::before` pseudo-element
- 9pt size, positioned 12pt left of text
