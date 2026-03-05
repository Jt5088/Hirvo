# Component Specs: ATS Score Widget & Button System

**Author:** uiux-agent-4 (tb-uiux subbranch)
**Date:** 2026-03-05
**Inputs:** pro-con-analysis.md, rezi-uiux.md, CLAUDE.md design tokens
**Status:** Draft specification -- ready for implementation review

---

## A. ATS Score Widget

### A.1 Overview

Floating bottom-right widget that displays a 0-100 ATS compatibility score. Expandable from a compact pill into a full criteria panel. Rezi's score (23 criteria, partially paywalled) is the reference -- Hirvo shows the full score free, locks AI fix suggestions behind premium.

### A.2 Layout & Position

#### Collapsed State (Default)
- **Position:** `fixed`, `bottom: 24px`, `right: 24px`, `z-index: 900`
- **Dimensions:** 56px height, auto width (min 180px), pill shape (`border-radius: 100px`)
- **Contains:** Mini circular indicator (36px diameter) + score number + expand chevron
- **Background:** `rgba(19,19,22,0.92)`, `backdrop-filter: blur(12px)`
- **Border:** `1px solid var(--bdr2)`
- **Shadow:** Full 4-layer depth stack:
  ```
  inset 0 1px 0 var(--highlight),
  0 1px 2px var(--shadow-near),
  0 4px 8px var(--shadow-mid),
  0 12px 24px var(--shadow-far),
  0 24px 48px var(--shadow-ambient)
  ```
- **Hover:** `border-color: rgba(255,255,255,0.15)`, `translateY(-2px)`, cursor pointer
- **Transition:** `var(--d2) var(--ease)` on all interactive properties

#### Expanded State (Full Panel)
- **Position:** Same fixed anchor (bottom-right)
- **Dimensions:** 380px wide, max-height `calc(100vh - 48px)`, overflow-y auto
- **Border-radius:** 14px
- **Background, border, shadow:** Same glass treatment as collapsed
- **Entry animation:** Scale from bottom-right origin. `transform-origin: bottom right`. Animate from `scale(0.92) translateY(8px) opacity(0)` to `scale(1) translateY(0) opacity(1)` over `var(--d4)` with `var(--ease)`
- **Exit animation:** Reverse, `var(--d3)` duration

#### Responsive Behavior
- **<=860px:** Expanded panel becomes bottom sheet, 100% width, max-height 70vh, `border-radius: 14px 14px 0 0`, slides up from bottom
- **<=480px:** Collapsed pill reduces to 48px height, score number hidden (circle indicator only). Tap expands to full bottom sheet

### A.3 Circular Progress Indicator

#### Ring Construction
- **Size:** 120px diameter in expanded panel, 36px in collapsed pill
- **Technique:** SVG `<circle>` with `stroke-dasharray` and `stroke-dashoffset` for animated fill. NOT conic-gradient (SVG gives smoother animation and better sub-pixel rendering)
- **Track (background ring):** `stroke: var(--bdr2)`, `stroke-width: 6px` (expanded) / `3px` (collapsed)
- **Progress ring:** `stroke-width: 6px` (expanded) / `3px` (collapsed), `stroke-linecap: round`
- **Rotation:** Ring starts at 12-o'clock (`transform: rotate(-90deg)` on the SVG)

#### Color Thresholds
| Score Range | Stroke Color | Label |
|---|---|---|
| 0-40 | `var(--red)` (#F87171) | Poor |
| 41-70 | `var(--amber)` (#FBBF24) | Needs Work |
| 71-85 | `var(--green)` (#34D399) | Good |
| 86-100 | `var(--green2)` (#4ADE80) | Excellent |

#### Color Transition
When the score crosses a threshold, the ring color transitions smoothly. Use CSS `transition: stroke var(--d3) var(--ease-out)` on the progress circle element. No hard color jumps.

#### Score Number (Center of Ring)
- **Font:** `var(--font-display)` (Plus Jakarta Sans), weight 800
- **Size:** 32px in expanded panel, 14px in collapsed pill
- **Color:** Matches current ring color token
- **Suffix:** "/100" in `var(--t3)` at 14px weight 400 (expanded only, omitted in collapsed)

### A.4 Real-Time Score Animation

#### Number Count Animation
- When score changes, the displayed number counts up or down to the new value
- **Method:** `requestAnimationFrame` loop, interpolating from current displayed value to target value
- **Duration:** `var(--d4)` (750ms)
- **Easing:** `var(--ease)` -- applied via a JS easing function matching `cubic-bezier(0.16,1,0.3,1)`. Start fast, decelerate into final value
- **Step granularity:** Integer steps only (no decimals displayed). Internal calculation uses floats, rounds for display
- **Queuing:** If a new target arrives mid-animation, smoothly redirect to the new target from current interpolated position. Do not restart from previous value

#### Ring Fill Animation
- `stroke-dashoffset` transitions via CSS: `transition: stroke-dashoffset var(--d4) var(--ease)`
- Synchronized with number count (both use --d4 duration)
- On first load, ring animates from 0 to current score (entrance effect)

#### Micro-Feedback on Change
- When score increases: brief pulse glow on the ring. A `0 0 12px` box-shadow matching the current color at 30% opacity, fading out over `var(--d3)`. Use `mix-blend-mode: screen` on the glow layer
- When score decreases: no glow, just the smooth transition. Decreases should not feel punishing

### A.5 Score Breakdown Panel (Expanded State)

#### Panel Header
- Score circle (120px) centered at top of panel
- Below circle: status label ("Poor" / "Needs Work" / "Good" / "Excellent") in `var(--t2)`, 14px weight 600
- Below label: "X of Y criteria passing" in `var(--t3)`, 13px

#### Criteria List
- Expandable accordion list below the header
- **Section dividers:** Gradient pseudo-elements per CLAUDE.md rules (horizontal, `linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent)`)
- Each criterion is a row, 48px min-height, padding `12px 16px`

#### Individual Criterion Row
```
[Status Icon]  [Criterion Name]           [Score/Status]  [Chevron]
               [One-line description]                      (if expandable)
```

- **Status icons:** Bare SVG, 16px. Colors:
  - Pass: `var(--green)` checkmark
  - Warning: `var(--amber)` triangle-alert
  - Fail: `var(--red)` x-circle
- **Criterion name:** `var(--t1)`, 14px weight 500
- **Description (collapsed):** `var(--t3)`, 13px, single line truncated with ellipsis
- **Chevron:** 12px, `var(--t4)`, rotates 90deg on expand. `transition: transform var(--d2) var(--ease)`

#### Expanded Criterion Detail
- Slides open with `max-height` transition (from 0 to auto, use a JS-measured approach for smooth animation since `max-height: auto` doesn't transition). Duration `var(--d3)`, easing `var(--ease)`
- Shows: full explanation text in `var(--t2)` at 13px, line-height 1.7
- For premium-locked criteria: shows explanation + specific AI fix suggestion with lock icon overlay

#### Criteria Checklist (23 checks, grouped)

**Content Quality (8 checks)**
| Criterion | What It Measures |
|---|---|
| Bullet length | Each bullet 1-2 lines (20-120 characters). Flag over-long or stub bullets |
| Action verb usage | First word of each bullet is a strong action verb. Flag passive voice, weak verbs ("helped", "assisted") |
| Quantification | Percentage of bullets containing metrics/numbers. Target >=40% |
| Tense consistency | Current role = present tense, past roles = past tense |
| Specificity | Flags vague phrases ("responsible for", "worked on", "various tasks") |
| Redundancy | Detects repeated verbs or nearly-identical bullets |
| Summary quality | Professional summary exists, 2-4 sentences, no first person |
| Section completeness | Required sections present: contact, experience, education, skills |

**Keyword Optimization (5 checks)**
| Criterion | What It Measures |
|---|---|
| Hard skill keywords | Matched against JD (if provided) or industry database |
| Soft skill balance | Presence without overuse. Max 3-4 soft skills |
| Job title alignment | Resume title/headline matches target role terminology |
| Industry terminology | Domain-specific terms present and correctly used |
| Keyword density | Not stuffed -- flags if any keyword appears >3 times |

**Formatting Compliance (6 checks)**
| Criterion | What It Measures |
|---|---|
| Font ATS-safety | Using an ATS-parseable font (no decorative fonts) |
| Section header clarity | Standard naming (Experience not "Where I've Worked") |
| Date format consistency | All dates use same format (MMM YYYY preferred) |
| Contact info completeness | Name, email, phone, location, LinkedIn URL |
| File format | PDF with text layer (not rasterized), or DOCX |
| Page count | 1 page for <10yr experience, 2 max. Flag 3+ |

**Structure & Readability (4 checks)**
| Criterion | What It Measures |
|---|---|
| Visual hierarchy | Clear size/weight differentiation between name, headings, body |
| White space | Adequate margins (>=0.5in) and section spacing |
| Bullet count per role | 3-6 bullets per position. Flag <2 or >8 |
| Reverse chronological | Most recent experience first |

### A.6 Job Description Targeting

#### JD Input Area
- Accessible via a "Target a Job" button at the top of the expanded panel
- Opens a textarea overlay within the panel. 100% panel width, 200px height (expandable by dragging bottom edge)
- **Textarea styling:**
  - Background: `var(--surf)` (#0E0E11)
  - Border: `1px solid var(--bdr2)`, focus: `1px solid var(--acc)` (purple -- one of the few valid uses)
  - Text: `var(--t1)`, 14px, `font-family: var(--font-primary)` (Inter)
  - Placeholder: "Paste the job description here..." in `var(--t4)`
  - Border-radius: 10px
  - Padding: 14px 16px
  - Transition on border-color: `var(--d2) var(--ease)`

#### Keyword Gap Visualization
- After JD is pasted and analyzed (debounce 500ms after typing stops):
- Display below the textarea as a two-column layout:
  - **Left column: "Found" keywords** -- pills with `var(--green)` left border (2px), background `rgba(52,211,153,0.08)`, text `var(--t2)`
  - **Right column: "Missing" keywords** -- pills with `var(--red)` left border (2px), background `rgba(248,113,113,0.06)`, text `var(--t2)`
- **Pill styling:** height 28px, padding `4px 12px`, border-radius 6px, font 13px weight 500
- **Pill entrance:** Staggered reveal. Each pill fades in with `translateY(4px)` to `translateY(0)`, 80ms stagger between pills, `var(--d2)` duration, `var(--ease)` easing
- Missing keywords are clickable -- clicking scrolls to the relevant resume section in the editor where the keyword should be added (emit a custom event for the editor to handle)

#### Score Recalculation on JD
- When a JD is provided, the Keyword Optimization criteria group recalculates against the JD
- Overall score updates with the standard count animation (A.4)
- A small label appears below the score: "Targeted: [Job Title]" in `var(--t3)`, 12px, italic

### A.7 Free vs Premium Gating

#### Free Tier (Full Access)
- Complete 0-100 score visible
- All 23 criteria visible with pass/fail/warning status
- Criterion names and descriptions visible
- JD targeting and keyword gap analysis functional
- Score updates in real-time

#### Premium Tier (AI Fix Suggestions)
- Each criterion that fails or warns shows an "AI Fix" button
- **Lock treatment on free tier:**
  - "AI Fix" button visible but dimmed: `opacity: 0.5`, with a lock SVG icon (14px, `var(--t4)`) overlaid
  - On hover: tooltip appears -- "Upgrade to Pro for AI-powered fixes" in a dark tooltip (background `var(--surf2)`, border `1px solid var(--bdr2)`, border-radius 8px, padding `8px 12px`, font 13px `var(--t2)`)
  - On click: opens upgrade modal (separate component, out of scope for this spec)
- **Premium unlocked state:**
  - "AI Fix" button uses secondary button style (see B.2)
  - Clicking generates a specific, actionable suggestion inline below the criterion
  - Suggestion text appears with a typewriter-style stream (characters appear left-to-right, 30ms per character, interruptible)

### A.8 Accessibility

- Widget is keyboard-navigable. Tab focuses the collapsed pill, Enter/Space expands
- Expanded panel traps focus (focus trap) until Escape closes it
- Circular progress has `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="ATS compatibility score"`
- Criteria accordion uses `aria-expanded`, `aria-controls` pattern
- Color is never the sole indicator -- every status has an icon shape (check, triangle, x) in addition to color
- Score changes announced via `aria-live="polite"` region
- `prefers-reduced-motion`: disable ring entrance animation, number counts instantly, pill entrance uses opacity-only (no transform)

---

## B. Button System

### B.1 Primary CTA Button

The highest-emphasis action in any context. White on dark -- maximum contrast, zero gimmick.

#### Appearance
- **Background:** `var(--cta)` (#FFFFFF)
- **Text color:** `var(--cta-text)` (#060608)
- **Font:** `var(--font-primary)` (Inter), weight 600
- **Border:** none
- **Border-radius:** `100px` (full pill)
- **Shadow (resting):**
  ```
  0 1px 2px var(--shadow-near),
  0 2px 4px var(--shadow-mid)
  ```
- **Cursor:** pointer

#### Hover
- **Background:** `var(--cta-hover)` (#E8E5E0)
- **Transform:** `translateY(-2px)`
- **Shadow (hover):**
  ```
  0 2px 4px var(--shadow-near),
  0 4px 8px var(--shadow-mid),
  0 8px 16px var(--shadow-far)
  ```
- **Transition:** `var(--d2) var(--ease)` on background, transform, box-shadow

#### Active (Pressed)
- **Background:** `var(--cta-hover)`
- **Transform:** `translateY(0px)` (snaps back)
- **Shadow:** Resting shadow (collapses back)
- **Transition:** `80ms var(--ease)` (faster snap for tactile feel)

#### Focus-Visible
- **Outline:** `2px solid var(--acc)` (#7363FF), `outline-offset: 2px`
- No background change on focus-visible (reserve visual change for hover/active)

### B.2 Secondary Button (Ghost/Outline)

For secondary actions: "Cancel", "View Details", "Export DOCX", etc.

#### Appearance
- **Background:** transparent
- **Text color:** `var(--t2)` (rgba(237,237,236,0.64))
- **Font:** `var(--font-primary)` (Inter), weight 500
- **Border:** `1px solid var(--bdr2)` (rgba(255,255,255,0.11))
- **Border-radius:** `100px` (pill)
- **Shadow:** none

#### Hover
- **Background:** `var(--highlight-hover)` (rgba(255,255,255,0.12))
- **Border-color:** `rgba(255,255,255,0.18)`
- **Text color:** `var(--t1)`
- **Transform:** `translateY(-1px)`
- **Transition:** `var(--d2) var(--ease)`

#### Active
- **Background:** `var(--highlight)` (rgba(255,255,255,0.08))
- **Transform:** `translateY(0px)`
- **Transition:** `80ms var(--ease)`

#### Focus-Visible
- Same as primary: `2px solid var(--acc)`, `outline-offset: 2px`

### B.3 Tertiary Button (Text-Only)

Lowest emphasis. For inline actions: "Learn more", "Skip", "Show all".

#### Appearance
- **Background:** transparent
- **Text color:** `var(--t3)` (rgba(237,237,236,0.32))
- **Font:** `var(--font-primary)` (Inter), weight 500
- **Border:** none
- **Border-radius:** `8px` (subtle rounding for hover background containment)
- **Padding:** `4px 8px` (tighter than pill buttons)

#### Hover
- **Background:** `rgba(255,255,255,0.05)` (barely visible, just enough to confirm interactivity)
- **Text color:** `var(--t2)`
- **Transition:** `var(--d2) var(--ease)`

#### Active
- **Text color:** `var(--t1)`
- **Transition:** `80ms var(--ease)`

#### Focus-Visible
- Same outline pattern: `2px solid var(--acc)`, `outline-offset: 2px`

### B.4 Disabled State (All Variants)

Applies uniformly to primary, secondary, and tertiary.

- **Opacity:** `0.4`
- **Cursor:** `not-allowed`
- **Pointer-events:** `none`
- **Hover/Active/Focus:** No visual change whatsoever. All transitions suppressed
- **Implementation:** `.btn[disabled]` or `.btn--disabled` class. Both should work identically

### B.5 Loading State

Replaces content with a spinner while preserving button dimensions.

#### Behavior
- On trigger: button `width` is locked to its current computed width (`min-width` set via JS before swapping content). This prevents layout shift
- Text fades out (`opacity: 0`, `var(--d1)` duration)
- Spinner fades in at center (`opacity: 1`, `var(--d1)` duration, 50ms delay after text fade starts)
- Button remains in its current variant style (primary stays white, secondary keeps border, etc.)
- All hover/active states are suppressed during loading (behaves like disabled but without dimming)
- `aria-busy="true"` set on the button element
- `pointer-events: none` during loading

#### Spinner Design
- **Type:** CSS-only rotating ring. NOT a full circle -- 270deg arc with a gap
- **Size:** 18px diameter (all button sizes)
- **Stroke:** 2px, `currentColor` (inherits from button text color -- dark on primary, light on secondary/tertiary)
- **Animation:** `rotate 600ms linear infinite`
- **Technique:** `border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%;`

### B.6 Size Scale

Three sizes, consistent across all variants.

| Size | Height | Padding (inline) | Font Size | Line-Height | Icon Size (if present) |
|---|---|---|---|---|---|
| `sm` | 32px | 14px | 13px | 1 | 14px |
| `md` | 40px | 20px | 14px | 1 | 16px |
| `lg` | 48px | 28px | 15px | 1 | 18px |

- **Default size:** `md`
- **Font sizes adjusted from brief:** 13/14/15px instead of 14/15/16px. Reason: pill-shaped buttons at these heights look better with slightly smaller text. The 16px body text size is for paragraph content, not buttons
- All sizes use `display: inline-flex; align-items: center; justify-content: center; gap: 8px` (gap for icon + text combinations)
- Height is enforced via `height` property, NOT `padding-block` (ensures exact pixel height across browsers)

### B.7 Icon Buttons (Toolbar Actions)

Square buttons for actions like bold, italic, undo, alignment, etc.

#### Appearance
- **Dimensions:** 36px x 36px
- **Border-radius:** 8px
- **Background:** transparent
- **Border:** none
- **Icon:** Bare SVG, 18px, `color: var(--t3)`

#### Hover
- **Background:** `var(--highlight)` (rgba(255,255,255,0.08))
- **Icon color:** `var(--t2)`
- **Transition:** `var(--d2) var(--ease)`

#### Active (Pressed)
- **Background:** `var(--highlight-hover)` (rgba(255,255,255,0.12))
- **Icon color:** `var(--t1)`

#### Toggled State (e.g., Bold is active)
- **Background:** `var(--highlight-hover)`
- **Icon color:** `var(--t1)`
- **Border:** `1px solid var(--bdr2)` (appears on toggle, creating subtle containment)
- **`aria-pressed="true"`** for accessibility

#### Focus-Visible
- `2px solid var(--acc)`, `outline-offset: 1px` (tighter offset for compact buttons)

#### Grouped Icon Buttons (Toolbar Segments)
- Adjacent icon buttons in a toolbar group share a container with `border-radius: 8px`, `background: var(--surf)`, `border: 1px solid var(--bdr)`, `padding: 2px`, `gap: 2px`
- Individual buttons within the group lose their own border-radius on adjacent sides (first-child gets left radius, last-child gets right radius, middle children get 4px radius)
- Dividers between groups: 1px vertical line using `var(--bdr)`, 20px height, centered vertically

### B.8 Button with Icon + Text

When a button contains both an icon and a label.

- Icon placed before text (leading position) by default
- Trailing icon position for "next" / "expand" actions (chevron-right, external-link)
- **Gap:** 8px between icon and text
- Icon inherits `currentColor` from text
- Icon size follows the size scale table (B.6)
- Icon should be vertically centered with text -- the `inline-flex` + `align-items: center` handles this

### B.9 Global Button Transition Rules

All interactive state changes on all button variants:
- **Duration:** `var(--d2)` (280ms)
- **Easing:** `var(--ease)` (cubic-bezier(0.16,1,0.3,1))
- **Properties animated:** `background-color, color, border-color, transform, box-shadow, opacity`
- **Exception:** Active/pressed state uses 80ms for snappy tactile feedback
- **`prefers-reduced-motion`:** Remove `transform` transitions (no translateY). Keep color/opacity transitions

### B.10 CSS Class Naming

```
.btn                    -- base (includes md size, transition rules)
.btn--primary           -- white CTA
.btn--secondary         -- ghost/outline
.btn--tertiary          -- text-only
.btn--sm                -- small size
.btn--lg                -- large size
.btn--icon              -- square icon button
.btn--loading           -- loading state (JS-toggled)
.btn[disabled]          -- disabled (native attribute)
.btn--toggled           -- toggled state for icon buttons
```

No BEM nesting beyond one level. Keep flat for specificity sanity.

---

## Implementation Notes

### File Placement
- **ATS Score CSS:** `styles/components/ats-score.css` (new file -- requires permission per CLAUDE.md rules)
- **ATS Score JS:** `js/ats-score.js` (IIFE pattern, IntersectionObserver-gated)
- **Button CSS:** `styles/components/buttons.css` (exists already -- extend it)
- **Button JS:** None needed for base states. Loading state toggle is a utility function in whichever JS file manages form submissions

### Token Dependencies
All values reference existing tokens from `tokens.css`. No new tokens required. If the implementation finds a need for a new token, propose it and wait for approval before adding.

### Performance Constraints
- ATS score recalculation must complete in <200ms for real-time feel
- Ring animation uses CSS transitions (GPU-composited `stroke-dashoffset`), not JS-driven repaints
- Score number count uses a single `requestAnimationFrame` loop, not `setInterval`
- Keyword gap analysis debounced at 500ms after last keystroke in JD textarea
- Expanded panel uses `will-change: transform, opacity` only during open/close animation, removed after transition ends

---

## Sources

- Competitive synthesis: `research/synthesis/pro-con-analysis.md`
- Rezi ATS score reference: `research/preview-agent-3/rezi-uiux.md` (Section 7)
- Design tokens: `CLAUDE.md` (Color Palette, Motion & Animation, Card Depth System)
