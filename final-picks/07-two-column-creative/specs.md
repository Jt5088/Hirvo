# Template 07: Two-Column Structured Modern (Creative-ATS)

## Layout
- **Structure:** Two-column flex layout
- **Sidebar width:** 30%
- **Main content width:** 70%
- **Column gap:** Handled via padding (sidebar 24px, main 24px left)
- **Page size:** 8.5in x 11in (US Letter)
- **Right margin:** 0.6in
- **Sidebar:** Edge-to-edge on left, no outer margin

## Typography
- **Font:** Inter (Google Fonts), weights 400/500/600/700
- **Name:** 26pt, weight 700, letter-spacing -0.02em, line-height 1.1
- **Title line:** 11pt, color #666, weight 400
- **Section headings (main):** 12pt, weight 600, uppercase, letter-spacing 0.05em
- **Entry titles:** 11pt, weight 600
- **Body text:** 10.5pt, weight 400, line-height 1.4
- **Dates:** 9.5pt, color #666
- **Sidebar labels:** 10pt, weight 600, uppercase, letter-spacing 0.08em
- **Sidebar body:** 9.5pt, weight 400, line-height 1.45
- **Skill names:** 9.5pt, weight 500
- **Certifications org line:** 9pt, color #888

## Colors
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#1a1a1a` | Primary text, name, headings |
| `--color-secondary` | `#444444` | Body text, bullets |
| `--color-tertiary` | `#888888` | Bullet markers, cert orgs, project tech |
| `--color-date` | `#666666` | Dates, title line |
| `--color-sidebar-bg` | `#f7f7f7` | Sidebar background tint |
| `--color-skill-track` | `#e8e8e8` | Skill bar track |
| `--color-skill-fill` | `#1a1a1a` | Skill bar fill |
| `--color-divider` | `#e0e0e0` | Section heading underline |

## Spacing
| Element | Value |
|---|---|
| Sidebar padding | 24px (all sides), 28px top |
| Sidebar section gap | 22px |
| Main section gap | 20pt |
| Entry gap | 12pt |
| Bullet gap | 4pt |
| Section heading bottom border padding | 6px |
| Skill item internal gap | 4px |
| Skill item spacing | 6px between items |

## Skill Bars
- **Track height:** 4px
- **Border radius:** 2px
- **Track color:** #e8e8e8
- **Fill color:** #1a1a1a
- **Implementation:** Nested divs with percentage width on fill

## Dividers
- 1px solid #e0e0e0 below section headings in main column
- No dividers in sidebar (whitespace separation)

## Print
- `@page { size: letter; margin: 0; }`
- `print-color-adjust: exact` for sidebar background
- Box shadow and body background removed in print

## Sections (Sidebar)
1. Contact (email, phone, location, portfolio, LinkedIn)
2. Skills (8 items with bars)
3. Languages (3 items with proficiency levels)
4. Certifications (3 items)

## Sections (Main)
1. Name + title
2. Summary
3. Experience (3 entries)
4. Education (1 entry)
5. Projects (2 entries)
