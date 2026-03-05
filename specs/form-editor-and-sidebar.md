# Component Specs: Form Editor Panel & Design Sidebar

**Author:** uiux-agent-5 (tb-uiux subbranch)
**Date:** 2026-03-05
**Inputs:** Competitive synthesis (pro-con-analysis.md), Enhancv sidebar research, Novoresume form research, CLAUDE.md design tokens

---

## A. Form Editor Panel

The form editor occupies the left portion of the split-pane layout. It is the primary content input surface. All styling uses Hirvo's dark design system -- no light-mode fallbacks.

### A.1 Panel Container

| Property | Value | Token |
|---|---|---|
| Width | `clamp(340px, 38vw, 480px)` | -- |
| Background | `var(--bg)` | `#060608` |
| Border-right | `1px solid var(--bdr)` | `rgba(255,255,255,0.07)` |
| Padding | `0` (sections handle their own padding) | -- |
| Overflow-y | `auto` with custom scrollbar | -- |
| Scrollbar track | `var(--bg)` | -- |
| Scrollbar thumb | `var(--surf3)` | `#1C1C20` |
| Scrollbar thumb hover | `var(--bdr3)` | `rgba(255,255,255,0.20)` |
| Scrollbar width | `6px`, `border-radius: 3px` | -- |

The panel scrolls independently from the preview. Scroll position persists when switching between sections.

---

### A.2 Experience-Level Selector

Positioned at the top of the form panel, above all sections. Determines which sections appear by default and adjusts spacing presets.

#### Layout
- Full-width bar pinned to top of the form scroll area (not sticky -- scrolls with content).
- Horizontal row of 5 pill-shaped radio buttons.
- Padding: `16px 24px`.
- Bottom border: gradient pseudo-element (`linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent)`).

#### Pill Buttons

| State | Background | Border | Text Color | Font |
|---|---|---|---|---|
| Default | `transparent` | `1px solid var(--bdr)` | `var(--t3)` | `.t-sm` (14px), weight 500 |
| Hover | `var(--surf)` | `1px solid var(--bdr2)` | `var(--t2)` | -- |
| Active/Selected | `var(--surf2)` | `1px solid var(--bdr3)` | `var(--t1)` | weight 600 |

- Border-radius: `8px`
- Padding: `8px 16px`
- Gap between pills: `8px`
- Transition: `var(--d2) var(--ease)` (280ms, spring) on background, border-color, color

#### Level Options & Default Section Sets

| Level | Default Sections |
|---|---|
| Student | Contact, Education, Skills, Projects, Extracurriculars |
| Junior | Contact, Summary, Experience, Education, Skills, Projects |
| Mid | Contact, Summary, Experience, Education, Skills |
| Senior | Contact, Summary, Experience, Skills, Education, Certifications |
| Executive | Contact, Summary, Experience, Leadership, Skills, Board Memberships |

Changing the level prompts a confirmation dialog if sections have content ("Switching levels will reset section order. Your content will be preserved. Continue?"). Content is never deleted -- sections are reordered and hidden/shown.

---

### A.3 Section Headers (Collapsible)

Each content section (Contact, Summary, Experience, etc.) is wrapped in a collapsible container with a glass-card header.

#### Header Bar

| Property | Value | Token |
|---|---|---|
| Background | `rgba(19,19,22,0.85)` | Glass card base |
| Backdrop-filter | `blur(8px)` | -- |
| Border | `1px solid var(--bdr2)` | `rgba(255,255,255,0.11)` |
| Border-radius | `14px` (top only when expanded, all corners when collapsed) | -- |
| Padding | `14px 16px` | -- |
| Cursor | `pointer` (entire header is clickable to collapse/expand) | -- |
| Box-shadow | `inset 0 1px 0 var(--highlight)` | Fresnel top edge |

#### Header Bar Contents (left to right)

1. **Drag handle** -- 6-dot grid (3 rows x 2 columns)
   - Color: `var(--t4)` (`rgba(237,237,236,0.16)`)
   - Size: `12px x 16px` total area, dots are `3px` diameter, `5px` gap
   - Cursor: `grab` (changes to `grabbing` while dragging)
   - Hover: dots transition to `var(--t3)` over `var(--d1)` (150ms)
   - Margin-right: `12px`

2. **Section name**
   - Font: `.t-h3` (17px, weight 600, `-0.01em` letter-spacing, line-height 1.3)
   - Color: `var(--t1)` (`#EDEDEC`)

3. **Spacer** -- `flex: 1`

4. **Add item button** (only on list-type sections: Experience, Education, Projects, etc.)
   - Icon: `+` symbol, 16px, `var(--t3)`
   - Hover: `var(--t2)`, background `var(--surf2)`, border-radius `6px`
   - Size: `28px x 28px` click target
   - Tooltip: "Add [section item]" on hover (e.g., "Add experience")
   - Transition: `var(--d1) var(--ease)`

5. **Visibility toggle** (eye icon)
   - Icon: eye-open / eye-closed, 16px
   - Color: `var(--t3)` when visible, `var(--t4)` when hidden
   - Toggles section visibility on the resume without deleting content (Novoresume pattern -- content preservation)
   - Size: `28px x 28px` click target
   - Transition: `var(--d2) var(--ease)`
   - Margin-left: `4px`

6. **Collapse chevron**
   - Icon: chevron-down (rotates 180deg when expanded)
   - Color: `var(--t3)`
   - Size: `16px`
   - Rotation transition: `var(--d2) var(--ease)` (280ms spring)
   - Margin-left: `4px`

#### Collapse/Expand Animation

| Property | Collapsed | Expanded | Transition |
|---|---|---|---|
| Content max-height | `0` | `auto` (use `scrollHeight` in JS) | `var(--d3) var(--ease-reveal)` (450ms) |
| Content opacity | `0` | `1` | `var(--d2) var(--ease-out)` (280ms) |
| Content padding-top | `0` | `16px` | `var(--d3) var(--ease-reveal)` |
| Header border-radius | `14px` all corners | `14px 14px 0 0` | `var(--d2)` |

The content area clips with `overflow: hidden` during animation. Use JS to measure `scrollHeight` for the target max-height, then transition. After transition completes, set `max-height: none` to allow content reflow.

#### Hover State (Header)

| Property | Default | Hover |
|---|---|---|
| Border-color | `var(--bdr2)` | `rgba(255,255,255,0.15)` |
| Background | `rgba(19,19,22,0.85)` | `rgba(19,19,22,0.92)` |
| Transition | -- | `var(--d2) var(--ease)` |

#### Disabled/Hidden State

When a section is toggled invisible via the eye icon:
- Header opacity: `0.5`
- Section name gets a strikethrough: `text-decoration: line-through; text-decoration-color: var(--t4)`
- Content area remains collapsed and cannot be expanded until visibility is re-enabled

---

### A.4 Input Fields

All text inputs, textareas, date pickers, and select dropdowns share a unified dark-themed style.

#### Text Input / Textarea

| Property | Value | Token |
|---|---|---|
| Background | `var(--surf2)` | `#151518` |
| Border | `1px solid var(--bdr)` | `rgba(255,255,255,0.07)` |
| Border-radius | `10px` | -- |
| Padding | `12px 14px` | -- |
| Font | `'Inter'`, 15px, weight 400 | Body font |
| Color | `var(--t1)` | `#EDEDEC` |
| Placeholder color | `var(--t3)` | `rgba(237,237,236,0.32)` |
| Line-height | `1.6` | -- |
| Caret-color | `var(--t1)` | -- |

#### Focus State

| Property | Value | Token |
|---|---|---|
| Border-color | `var(--acc)` | `#7363FF` |
| Box-shadow | `0 0 0 3px rgba(115,99,255,0.15)` | Derived from `--acc` |
| Outline | `none` | -- |
| Background | `var(--surf3)` | `#1C1C20` |
| Transition | `var(--d2) var(--ease)` | 280ms spring |

The purple glow is a subtle focus ring only -- not a fill or card glow. Complies with the design rule: `--acc` for focus outlines only.

#### Hover State (unfocused)

| Property | Value |
|---|---|
| Border-color | `var(--bdr2)` (`rgba(255,255,255,0.11)`) |
| Transition | `var(--d1) var(--ease)` |

#### Error State

| Property | Value |
|---|---|
| Border-color | `var(--red)` (`#F87171`) |
| Box-shadow | `0 0 0 3px rgba(248,113,113,0.12)` |
| Error message | Below input, `var(--red)`, `.t-sm` (14px), margin-top `6px` |

#### Input Labels

| Property | Value |
|---|---|
| Font | `.t-sm` (14px), weight 500 |
| Color | `var(--t2)` (`rgba(237,237,236,0.64)`) |
| Margin-bottom | `6px` |
| Letter-spacing | `0.005em` |

#### Input Field Spacing

- Gap between label+input groups: `16px`
- Two-column field layout for short fields (e.g., Start Date / End Date side by side): `gap: 12px`, each field `flex: 1`
- Section content padding: `0 16px 20px 16px` (inside the collapsible body)

#### Select Dropdown

Same base styles as text input, plus:
- Custom chevron icon (right-aligned, `var(--t3)`, 14px)
- `appearance: none` with custom SVG chevron via `background-image`
- Dropdown menu: `var(--surf)` background, `1px solid var(--bdr2)` border, `border-radius: 10px`, `box-shadow` matching card depth system
- Dropdown items: `padding: 10px 14px`, hover background `var(--surf2)`, selected item has `var(--acc)` left border indicator (2px)

#### Date Picker

- Uses two side-by-side select dropdowns (Month / Year)
- "Present" checkbox: `var(--acc)` checkmark color, replaces End Date fields when checked
- Checkbox: `16px x 16px`, `var(--surf2)` background, `var(--bdr2)` border, `border-radius: 4px`
- Checked state: `var(--acc)` background, white checkmark SVG

---

### A.5 Rich Text Editor (Bullet Points)

Used within Experience, Projects, and other description-heavy sections. Each entry gets a rich text area for bullet points.

#### Toolbar

| Property | Value |
|---|---|
| Position | Top of the textarea, inside the input container |
| Background | `var(--surf)` (`#0E0E11`) |
| Border-bottom | `1px solid var(--bdr)` |
| Padding | `6px 10px` |
| Border-radius | `10px 10px 0 0` (toolbar), `0 0 10px 10px` (textarea below) |
| Height | `32px` |

#### Toolbar Buttons

4 formatting controls in a single row:

| Button | Icon | Shortcut |
|---|---|---|
| Bold | **B** (16px, weight 700) | Cmd/Ctrl + B |
| Italic | *I* (16px, italic) | Cmd/Ctrl + I |
| Underline | U with underline (16px) | Cmd/Ctrl + U |
| Link | Chain-link icon (16px) | Cmd/Ctrl + K |

| State | Background | Color | Border-radius |
|---|---|---|---|
| Default | `transparent` | `var(--t3)` | `6px` |
| Hover | `var(--surf2)` | `var(--t2)` | `6px` |
| Active (formatting applied) | `var(--surf3)` | `var(--t1)` | `6px` |

- Button size: `28px x 28px`
- Gap between buttons: `2px`
- Separator after Underline: `1px` vertical line, `var(--bdr)` color, `12px` height, `margin: 0 6px`
- Transition: `var(--d1) var(--ease)` (150ms)

#### Textarea Body

- Same styles as standard textarea input (A.4) but with top border-radius removed (toolbar sits above)
- Min-height: `80px`
- Auto-grows with content (no max-height cap, scroll-within handled by panel scroll)
- Bullet points auto-insert on Enter key (unordered list, `list-style: disc`)
- Bullet color: `var(--t3)`
- Bullet indent: `20px` padding-left

#### Link Insertion Dialog

When the link button is clicked with text selected:
- Small popover appears below the toolbar button
- Background: `var(--surf)`, border: `1px solid var(--bdr2)`, border-radius: `10px`
- Shadow: card depth system
- Contains: URL text input (same style as A.4) + "Apply" button (small, `var(--surf3)` bg, `var(--t1)` text)
- Width: `280px`
- Padding: `12px`
- Escape or click-outside dismisses

---

### A.6 Drag-and-Drop Reordering

Single unified interaction model for both section-level and item-level reordering. No separate "rearrange mode" (avoiding Enhancv's two-mode pattern).

#### Section Drag

- Initiated by grabbing the 6-dot drag handle on the section header.
- The entire section (header + collapsed content indicator) lifts as the drag element.

#### Item Drag (within a section)

- Each item within list-type sections (Experience entries, Education entries, etc.) has its own 6-dot drag handle to the left of the item.
- Only the individual item lifts.

#### Drag States

| State | Visual Treatment |
|---|---|
| **Idle** | Drag handle dots at `var(--t4)` |
| **Hover on handle** | Dots transition to `var(--t3)`, cursor: `grab` |
| **Dragging** | Grabbed element: `opacity: 0.9`, `scale(1.02)`, elevated shadow (`0 8px 32px var(--shadow-near), 0 2px 8px var(--shadow-mid)`), `border-color: var(--bdr3)`, cursor: `grabbing`. Background: `rgba(19,19,22,0.95)` |
| **Drop zone indicator** | A horizontal line appears at the valid drop position: `2px` height, `var(--acc)` color (`#7363FF`), `border-radius: 1px`, horizontal padding matches section padding. Animated in with `var(--d1) var(--ease)` (150ms, opacity 0 to 1 + scaleX 0.8 to 1) |
| **Invalid drop zone** | No indicator appears; element snaps back to origin |
| **Drop complete** | Element settles into new position with `var(--d3) var(--ease)` (450ms spring). Other elements reflow with the same timing. |

#### Keyboard Reordering (Accessibility)

- When a drag handle is focused (via Tab), pressing Enter or Space activates drag mode.
- Arrow Up/Down moves the section/item. Enter confirms, Escape cancels.
- Screen reader announcement: "Grabbed [Section Name]. Use arrow keys to reorder. Press Enter to drop."
- ARIA attributes: `role="listbox"` on the section container, `role="option"` on each section, `aria-grabbed`, `aria-dropeffect`.

---

### A.7 "Add Section" Button & Section Type Picker

#### Button

Positioned at the bottom of all sections, inside the scrollable form area.

| Property | Value |
|---|---|
| Width | `calc(100% - 32px)` (16px margin on each side) |
| Background | `transparent` |
| Border | `1px dashed var(--bdr2)` |
| Border-radius | `14px` |
| Padding | `16px` |
| Text | "+ Add Section" |
| Font | `.t-sm` (14px), weight 500 |
| Color | `var(--t3)` |
| Text-align | `center` |
| Cursor | `pointer` |

| State | Border | Color | Background |
|---|---|---|---|
| Hover | `1px dashed var(--bdr3)` | `var(--t2)` | `var(--surf)` |
| Active/Pressed | `1px solid var(--acc)` | `var(--t1)` | `var(--surf)` |
| Transition | `var(--d2) var(--ease)` | -- | -- |

#### Section Type Picker (Popover)

Opens above the "Add Section" button as a popover panel.

| Property | Value |
|---|---|
| Width | `calc(100% - 32px)` (same as button) |
| Max-height | `400px` |
| Overflow-y | `auto` (custom scrollbar, same style as panel) |
| Background | `var(--surf)` |
| Border | `1px solid var(--bdr2)` |
| Border-radius | `14px` |
| Box-shadow | Card depth system (full 4-layer stack) |
| Padding | `8px` |
| Animation in | `var(--d2) var(--ease-reveal)` -- opacity 0 to 1, translateY(8px) to 0 |
| Animation out | `var(--d1) var(--ease-out)` -- opacity to 0, translateY(4px) |

#### Progressive Disclosure

The popover is split into two groups:

**Core Sections** (always visible):
- Summary / Objective
- Experience
- Education
- Skills
- Projects
- Certifications
- Languages
- Volunteer

**"More Sections" Expandable** (collapsed by default):
- Awards & Honors
- Publications
- References
- Interests / Hobbies
- Courses
- Organizations
- Military Service
- Presentations
- Patents
- Board Memberships
- Leadership
- Extracurriculars
- Custom Section (user-named)

The "More Sections" toggle:
- Text: "More sections" with a chevron-down icon
- Color: `var(--t3)`, hover `var(--t2)`
- Separator above: gradient horizontal line (`linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent)`)
- Chevron rotates 180deg on expand, transition `var(--d2) var(--ease)`
- Content expands with same collapse animation as section headers (A.3)

#### Section Type Items

| Property | Value |
|---|---|
| Padding | `10px 14px` |
| Border-radius | `10px` |
| Font | `.t-sm` (14px), weight 500 |
| Color | `var(--t2)` |
| Icon | Semantic SVG, 16px, `var(--t3)`, left-aligned |
| Gap (icon to text) | `10px` |
| Hover background | `var(--surf2)` |
| Hover text | `var(--t1)` |
| Hover icon | `var(--t2)` |
| Transition | `var(--d1) var(--ease)` |
| Already-added indicator | `var(--t4)` text + "Added" badge, non-clickable |

Items that are already present in the form show "Added" in `var(--t4)` and are visually muted (`opacity: 0.4`, `pointer-events: none`).

---

### A.8 Section Content Patterns

#### Contact Section

Fields arranged in a 2-column grid where appropriate:

| Field | Type | Width | Required |
|---|---|---|---|
| Full Name | text input | full width | yes |
| Email | text input | 1/2 | yes |
| Phone | text input | 1/2 | no |
| Location (City, State) | text input | full width | no |
| LinkedIn URL | text input | full width | no |
| Portfolio / Website | text input | full width | no |

No rich text editor. All plain text inputs.

#### Summary Section

Single textarea with rich text toolbar (A.5). Character count indicator below: `var(--t4)`, `.t-sm`, right-aligned. Shows "X / 400" (recommended max). Count turns `var(--amber)` at 350+, `var(--red)` at 400+.

#### Experience Section (Repeatable)

Each experience entry is a card-like container within the section:

| Property | Value |
|---|---|
| Background | `var(--surf)` |
| Border | `1px solid var(--bdr)` |
| Border-radius | `12px` |
| Padding | `16px` |
| Margin-bottom | `12px` |

Entry fields:

| Field | Type | Width |
|---|---|---|
| Job Title | text input | full |
| Company | text input | 1/2 |
| Location | text input | 1/2 |
| Start Date | date picker (month/year) | 1/2 |
| End Date | date picker or "Present" | 1/2 |
| Description / Bullets | rich text editor (A.5) | full |

Each entry has:
- Drag handle (6-dot, left side) for reordering within the section
- Delete button (trash icon, `var(--t4)`, hover `var(--red)`) in top-right corner, `24px x 24px`
- Delete confirmation: inline "Remove this entry?" with "Remove" (`var(--red)`) and "Cancel" (`var(--t3)`) text buttons

#### Education Section (Repeatable)

Same card pattern as Experience. Fields:

| Field | Type | Width |
|---|---|---|
| Degree | select dropdown (Associate / Bachelor / Master / PhD / Other) | 1/2 |
| Field of Study | text input | 1/2 |
| Institution | text input | full |
| Start Date | date picker | 1/2 |
| End Date | date picker or "Expected" | 1/2 |
| GPA (optional) | text input | 1/4 |
| Relevant Courses | text input | 3/4 |

#### Skills Section

Tag-based input rather than a textarea:
- Input field for typing a skill name
- Press Enter or comma to create a tag pill
- Tag pill: `var(--surf2)` background, `1px solid var(--bdr)`, `border-radius: 6px`, `padding: 4px 10px`, `var(--t2)` text, `.t-sm` font
- "x" delete button on each pill: `var(--t4)`, hover `var(--t2)`, `12px`
- Tags wrap in a flex container with `gap: 8px`
- Drag-and-drop reordering of individual skill tags

---

## B. Design Sidebar

Collapsible right-side panel for visual customization controls. Positioned between the form editor and the preview panel.

### B.1 Sidebar Container

| Property | Value | Token |
|---|---|---|
| Width | `280px` (fixed) | -- |
| Background | `var(--surf)` | `#0E0E11` |
| Border-left | `1px solid var(--bdr)` | `rgba(255,255,255,0.07)` |
| Height | `100vh - toolbar height` | -- |
| Overflow-y | `auto` (custom scrollbar, same as form panel) | -- |
| Padding | `16px` | -- |
| Z-index | Above preview, below modals | -- |

#### Collapse/Expand

- Toggle button in the main toolbar (paintbrush icon or sliders icon)
- Sidebar slides in/out from the right edge
- Transition: `var(--d3) var(--ease)` (450ms spring)
- Transform: `translateX(0)` when open, `translateX(280px)` when closed
- Preview panel expands to fill the freed space when sidebar is closed

#### Sidebar Header

| Property | Value |
|---|---|
| Text | "Design" |
| Font | `.t-h3` (17px, weight 600) |
| Color | `var(--t1)` |
| Padding-bottom | `16px` |
| Border-bottom | Gradient pseudo-element (`linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent)`) |
| Close button | X icon, `var(--t3)`, right-aligned, `28px x 28px`, hover `var(--t2)` |

---

### B.2 Sidebar Sections (Collapsible)

Each design category is a collapsible section within the sidebar. Same collapse mechanic as form sections (A.3) but simplified -- no drag handles, no visibility toggles.

#### Section Header

| Property | Value |
|---|---|
| Padding | `14px 0` |
| Font | `.t-sm` (14px), weight 600, uppercase, `letter-spacing: 0.06em` |
| Color | `var(--t2)` |
| Chevron | Right side, `var(--t3)`, 14px, rotates on expand |
| Separator | Gradient bottom border between sections |
| Cursor | `pointer` |

All sections open by default on first load. Collapse state persists in `localStorage`.

---

### B.3 Template Selector

First section in the sidebar. Shows current template and allows switching.

#### Current Template Preview

| Property | Value |
|---|---|
| Thumbnail | Miniature resume preview, `248px x 350px` (A4 aspect ratio) |
| Background | `white` |
| Border | `1px solid var(--bdr2)` |
| Border-radius | `10px` |
| Overflow | `hidden` |
| Box-shadow | `0 2px 8px var(--shadow-mid)` |

#### "Change Template" Button

| Property | Value |
|---|---|
| Width | `100%` |
| Background | `var(--surf2)` |
| Border | `1px solid var(--bdr)` |
| Border-radius | `10px` |
| Padding | `10px` |
| Font | `.t-sm`, weight 500 |
| Color | `var(--t2)` |
| Text-align | `center` |
| Margin-top | `10px` |
| Hover | Background `var(--surf3)`, border `var(--bdr2)`, color `var(--t1)` |
| Transition | `var(--d2) var(--ease)` |

Clicking opens the full template gallery modal (separate component spec). Template switching triggers a 300ms crossfade on the preview (`var(--d3) var(--ease-out)`), which is a key differentiator vs. all competitors (zero of them animate template switches).

---

### B.4 Font Selector

#### Heading Font & Body Font

Two dropdown selectors, each with the same pattern:

| Property | Value |
|---|---|
| Label | "Heading Font" / "Body Font", `.t-sm`, `var(--t2)` |
| Dropdown trigger | Same style as select inputs (A.4) |
| Current value | Rendered in the actual font being previewed |
| Width | `100%` |
| Margin-bottom | `12px` between the two dropdowns |

#### Font Dropdown Menu

| Property | Value |
|---|---|
| Background | `var(--surf)` |
| Border | `1px solid var(--bdr2)` |
| Border-radius | `10px` |
| Box-shadow | Card depth system |
| Max-height | `320px` |
| Overflow-y | `auto` |
| Width | `280px` (full sidebar width, overlays sidebar edge) |
| Padding | `6px` |

#### Font List Items

| Property | Value |
|---|---|
| Padding | `10px 12px` |
| Border-radius | `8px` |
| Display | `flex`, `justify-content: space-between`, `align-items: center` |

Left side:
- Font name rendered **in the font itself** (live preview in dropdown)
- Font: 15px, `var(--t1)`
- Fallback: if font not yet loaded, show in Inter with a shimmer placeholder

Right side:
- **ATS-safety badge** for safe fonts
  - Green checkmark icon: `var(--green)` (`#34D399`), `14px`
  - Tooltip on hover: "ATS-safe font" in a small popover
  - Fonts with badge: Inter, Arial, Calibri, Georgia, Garamond, Cambria, Helvetica, Times New Roman
- Non-ATS fonts show no badge (absence of badge, not a warning icon -- reduce anxiety)

| State | Background | Color |
|---|---|---|
| Default | `transparent` | `var(--t2)` |
| Hover | `var(--surf2)` | `var(--t1)` |
| Selected | `var(--surf2)` | `var(--t1)`, plus `var(--acc)` left border (2px) |
| Transition | `var(--d1) var(--ease)` | -- |

#### Font Size Control

Below the font dropdowns:
- Label: "Font Size", `.t-sm`, `var(--t2)`
- Slider (see B.8 for slider spec): range `9pt` to `12pt`, step `0.5pt`
- Current value label: right-aligned, `var(--t2)`, `.t-sm`, monospace font

---

### B.5 Color Picker

#### Single Accent Color Philosophy

Following Enhancv's recommendation and competitive research: one accent color applied across section headers, name, and rule lines on the resume. This reduces visual noise and improves ATS compatibility.

#### Preset Swatches

A grid of 12 color swatches:

| Property | Value |
|---|---|
| Layout | 6 columns x 2 rows, `gap: 8px` |
| Swatch size | `32px x 32px` |
| Border-radius | `8px` |
| Border | `1px solid var(--bdr)` |
| Selected swatch | `2px solid var(--t1)`, `box-shadow: 0 0 0 2px var(--bg)` (creates a gap between swatch and ring) |
| Hover | `scale(1.1)`, `border-color: var(--bdr2)` |
| Transition | `var(--d1) var(--ease)` |

Default swatch palette (dark-on-light resume context, so these are saturated enough to read on white):
`#1A1A2E`, `#2C3E50`, `#34495E`, `#1B4332`, `#3D5A80`, `#5B2C6F`, `#7B2D26`, `#4A4A4A`, `#0D47A1`, `#1565C0`, `#2E7D32`, `#6A1B9A`

#### Custom Color Picker

Below the swatches:
- "Custom" button: small text link, `var(--t3)`, `.t-sm`, hover `var(--t2)`
- Expands to reveal a hex input field + hue/saturation picker
- Hex input: same style as text inputs (A.4), `width: 100px`, prefix `#` in `var(--t4)`
- Hue slider: horizontal, full width, rainbow gradient track
- Saturation/brightness square: `248px x 150px`, with a small circle indicator (`10px`, `2px white border`, drop shadow)
- All pickers update the preview in real-time (<100ms latency)

---

### B.6 Spacing Controls

Three slider controls for fine-tuning resume layout density.

#### Margins (Page Margins)

| Property | Value |
|---|---|
| Label | "Page Margins" |
| Range | `0.5in` to `1.0in` |
| Step | `0.05in` |
| Default | `0.75in` |
| Value display | Right of label, `var(--t2)`, monospace, `.t-sm` |
| Value format | `X.XX in` |

#### Section Gap

| Property | Value |
|---|---|
| Label | "Section Spacing" |
| Range | `12pt` to `28pt` |
| Step | `2pt` |
| Default | `18pt` |
| Value display | Right of label, `var(--t2)`, monospace, `.t-sm` |
| Value format | `XX pt` |

#### Line Height

| Property | Value |
|---|---|
| Label | "Line Height" |
| Range | `1.0` to `1.5` |
| Step | `0.05` |
| Default | `1.15` |
| Value display | Right of label, `var(--t2)`, monospace, `.t-sm` |
| Value format | `X.XX` |

All sliders update the preview in real-time. No debounce -- direct binding.

---

### B.7 Layout Controls

#### Column Layout Toggle

Three visual radio buttons arranged horizontally:

| Option | Icon Description | Value |
|---|---|---|
| Single Column | Rectangle with horizontal lines | `single` |
| Two-Column Left | Rectangle split ~1/3 left sidebar + 2/3 right | `two-col-left` |
| Two-Column Right | Rectangle split 2/3 left + ~1/3 right sidebar | `two-col-right` |

| Property | Value |
|---|---|
| Button size | `72px x 96px` (portrait A4 aspect ratio, miniature) |
| Background | `var(--surf2)` |
| Border | `1px solid var(--bdr)` |
| Border-radius | `10px` |
| Icon | Simplified rectangle layout diagram, strokes in `var(--t3)`, `1.5px` stroke width |
| Gap between buttons | `10px` |
| Label below each | "Single" / "Left" / "Right", `.t-sm` (14px), `var(--t3)`, `text-align: center` |

| State | Border | Background | Icon stroke |
|---|---|---|---|
| Default | `var(--bdr)` | `var(--surf2)` | `var(--t3)` |
| Hover | `var(--bdr2)` | `var(--surf3)` | `var(--t2)` |
| Selected | `var(--bdr3)` | `var(--surf3)` | `var(--t1)` |
| Transition | `var(--d2) var(--ease)` | -- | -- |

Selected state also shows a small `var(--acc)` dot indicator centered below the label (`4px` diameter).

#### Two-Column ATS Warning

When a two-column layout is selected, a small inline notice appears below the layout toggle:

| Property | Value |
|---|---|
| Text | "Some ATS systems may not parse two-column layouts correctly." |
| Font | `.t-sm` (14px), weight 400 |
| Color | `var(--amber)` (`#FBBF24`) |
| Icon | Warning triangle, `var(--amber)`, 14px, left of text |
| Background | `rgba(251,191,36,0.06)` |
| Border | `1px solid rgba(251,191,36,0.15)` |
| Border-radius | `8px` |
| Padding | `8px 10px` |
| Margin-top | `10px` |
| Animation in | `var(--d2) var(--ease-reveal)`, opacity + translateY(4px) |

---

### B.8 Slider Specification (Shared Component)

All spacing sliders (margins, section gap, line height) and font size use this unified slider style.

#### Track

| Property | Value | Token |
|---|---|---|
| Height | `4px` | -- |
| Background | `var(--surf2)` | `#151518` |
| Border-radius | `2px` | -- |
| Filled portion (left of thumb) | `var(--acc)` at 40% opacity | `rgba(115,99,255,0.4)` |

#### Thumb

| Property | Value | Token |
|---|---|---|
| Size | `16px x 16px` | -- |
| Background | `var(--acc)` | `#7363FF` |
| Border | `2px solid var(--bg)` | Creates visual separation from track |
| Border-radius | `50%` | Circle |
| Box-shadow | `0 1px 4px var(--shadow-near)` | -- |
| Cursor | `grab` (dragging: `grabbing`) | -- |

| State | Thumb Size | Box-shadow |
|---|---|---|
| Default | `16px` | `0 1px 4px var(--shadow-near)` |
| Hover | `18px` | `0 2px 6px var(--shadow-near), 0 0 0 4px rgba(115,99,255,0.12)` |
| Active/Dragging | `18px` | `0 2px 8px var(--shadow-near), 0 0 0 6px rgba(115,99,255,0.15)` |
| Transition | `var(--d1) var(--ease)` | -- |

#### Label Row

```
[Label text]                    [Current value]
[========O---------------------------] (slider)
```

- Label: `.t-sm`, weight 500, `var(--t2)`, left-aligned
- Value: `.t-sm`, weight 400, `var(--t2)`, `font-family: 'SF Mono', 'Fira Code', monospace`, right-aligned
- Both on the same line (flex row, `justify-content: space-between`)
- Margin-bottom from label row to slider: `8px`
- Margin-bottom from slider to next control: `20px`

---

### B.9 Paper Size Toggle

Two-option toggle at the bottom of the Layout section.

#### Segmented Control

| Property | Value |
|---|---|
| Width | `100%` |
| Height | `36px` |
| Background | `var(--surf2)` |
| Border | `1px solid var(--bdr)` |
| Border-radius | `10px` |
| Padding | `3px` |

#### Segments

| Option | Label |
|---|---|
| US Letter | "US Letter" |
| A4 | "A4" |

| State | Background | Color | Font |
|---|---|---|---|
| Inactive | `transparent` | `var(--t3)` | `.t-sm`, weight 500 |
| Active | `var(--surf3)` | `var(--t1)` | `.t-sm`, weight 600 |
| Hover (inactive) | `var(--surf)` | `var(--t2)` | -- |

- Active indicator: slides between positions with `var(--d2) var(--ease)` (280ms spring)
- Active segment background uses a pseudo-element that translates left/right, `border-radius: 8px`
- Transition feels tactile due to the spring easing

Changing paper size triggers an immediate preview re-render. The preview panel adjusts its aspect ratio accordingly.

---

## Accessibility Requirements

### Keyboard Navigation

| Component | Key | Action |
|---|---|---|
| Section headers | Enter / Space | Toggle collapse |
| Section headers | Tab | Move to next interactive element |
| Drag handles | Enter / Space | Activate drag mode |
| Drag handles (active) | Arrow Up/Down | Move section |
| Drag handles (active) | Enter | Confirm position |
| Drag handles (active) | Escape | Cancel reorder |
| Input fields | Tab | Move to next field |
| Rich text toolbar | Tab | Cycle through formatting buttons |
| Sidebar sliders | Arrow Left/Right | Adjust value by one step |
| Sidebar sliders | Page Up/Down | Adjust value by 5 steps |
| Layout radio buttons | Arrow Left/Right | Cycle options |
| Popovers | Escape | Close |

### ARIA Attributes

| Component | Attribute |
|---|---|
| Collapsible sections | `aria-expanded="true/false"` on header, `aria-controls="[content-id]"` |
| Drag handles | `aria-grabbed="true/false"`, `aria-roledescription="draggable"` |
| Section containers | `role="listbox"` for reorderable lists |
| Visibility toggle | `aria-label="Toggle [section] visibility"`, `aria-pressed="true/false"` |
| Sliders | `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` |
| Layout radio buttons | `role="radiogroup"` container, `role="radio"` items, `aria-checked` |
| Font ATS badge | `aria-label="ATS-safe font"` on the checkmark icon |
| Color swatches | `aria-label="[color name]"`, `role="radio"` within `role="radiogroup"` |
| Paper size toggle | `role="radiogroup"`, segments are `role="radio"` |

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
- Collapse/expand: instant (no transition)
- Drag-and-drop: positions snap without spring animation
- Slider thumbs: no scale transitions
- Sidebar open/close: instant
- Popovers: opacity only, no translateY

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Responsive Behavior

### At 860px (Tablet)

- Form editor becomes full-width; preview switches to a bottom-sheet or separate tab
- Design sidebar becomes a bottom drawer (280px height, slides up from bottom)
- Sidebar toggle moves to a floating action button (bottom-right, `48px`, `var(--acc)` background)

### At 480px (Mobile)

- Experience-level selector: pills wrap to 2 rows
- Input fields: all full-width (no 2-column layouts)
- Section type picker popover: full-screen modal instead of popover
- Design sidebar: full-screen overlay with swipe-down to dismiss
- Font dropdown: full-screen overlay
- Slider thumb size increased to `24px` for touch targets

---

## Animation Documentation

```
ANIMATED COMPONENT: Form Editor Panel
+-- Section collapse/expand: content max-height + opacity -- click on header -- d3/ease-reveal + d2/ease-out
+-- Chevron rotation: transform rotate(180deg) -- on collapse toggle -- d2/ease
+-- Drag lift: opacity + scale + shadow -- grab drag handle -- d2/ease
+-- Drop zone indicator: opacity + scaleX -- on drag hover -- d1/ease
+-- Drop settle: translateY to final position -- on drop -- d3/ease
+-- Popover open: opacity + translateY(8px) -- click "Add Section" -- d2/ease-reveal
+-- Popover close: opacity + translateY(4px) -- click outside / Escape -- d1/ease-out
+-- Input focus ring: border-color + box-shadow -- focus event -- d2/ease
+-- Visibility toggle: opacity on section header -- click eye icon -- d2/ease
Dependencies: scroll-anim.js (IntersectionObserver), tokens.css (easing, durations, colors)

ANIMATED COMPONENT: Design Sidebar
+-- Sidebar slide: translateX(0 <-> 280px) -- toolbar toggle click -- d3/ease
+-- Slider thumb hover: scale(1 -> 1.125) + box-shadow -- hover -- d1/ease
+-- Paper size indicator slide: translateX between segments -- click option -- d2/ease
+-- Layout radio selection: border-color + background -- click option -- d2/ease
+-- Color swatch hover: scale(1.1) -- hover -- d1/ease
+-- ATS warning appear: opacity + translateY(4px) -- on two-column select -- d2/ease-reveal
+-- Font dropdown open: opacity + translateY -- click trigger -- d2/ease-reveal
Dependencies: tokens.css (easing, durations, colors, surfaces)
```
