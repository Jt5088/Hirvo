# Style Guide — Anti-AI Writing & Visual Patterns

## Why This Exists
AI-generated landing pages share recognizable patterns that signal "template" to visitors. This guide documents every pattern to avoid and what to do instead, derived from auditing the Hirvo codebase against Linear, Vercel, Raycast, and Stripe.

---

## Copy Rules

### Kill These Patterns
| Pattern | Example (bad) | Fix |
|---|---|---|
| Em-dash pivot | "Each with different red flags — and different reasons to pass" | Use a period. Two sentences > one em-dash sentence. |
| Exact-three list | "what gets extracted, what gets mangled, and what vanishes" | Name one or two. Imply the rest. |
| "Every X gets Y" | "Every bullet gets a signal strength score" | Use a concrete comparison instead: "'improved by 30%' scores differently than 'improved performance'" |
| Product name in every card | "HIRVO parses…" "HIRVO shows…" "HIRVO runs…" | Use "we" in 2-3 cards max. Leave 2-3 with no first-person at all. |
| "You see / you find / you know" payoff | "You see exactly which lines…" | End on the consequence, not on "you see." |
| Parallel sentence structure across cards | Every card: "[Thing] does X. [Product] does Y. You see Z." | Each card uses a different rhetorical approach (see below). |
| Category overlines | "Full toolkit" "Core features" | Use a claim or number: "6 rejection filters" or "The toolkit" |

### Vary Rhetorical Approach Per Card
Never use the same sentence structure in adjacent cards. Rotate between:
- **Contrast:** "A startup founder and an enterprise screener reject the same resume for completely different reasons."
- **Concrete example:** "'Improved performance by 30%' and 'improved performance' read almost the same to you."
- **Scenario:** "They read your resume, then ask why you left your last role."
- **Blunt fact → consequence:** "Visa sponsorship gets flagged before your resume reaches a person."
- **Imperative:** "Edit your resume. Re-run. See if the scores actually moved."
- **No first-person:** Cards that state reality without "we" or "HIRVO" feel more authoritative.

### Sentence Count
Vary deliberately. If one card has 3 sentences, the next should have 1-2. Never give all cards the same word count.

### Em-Dash Budget
Maximum 1 em-dash per section. If the heading uses one, zero cards can. If a card uses one, the heading cannot.

---

## Visual Rules — Dark Theme Elegance

### Line Dividers (not borders)
Flat `1px solid` borders look mechanical. Use gradient lines that fade at endpoints:

**Horizontal:**
```css
background: linear-gradient(90deg, transparent, var(--bdr2) 12%, var(--bdr2) 88%, transparent);
```

**Vertical:**
```css
background: linear-gradient(180deg, transparent, var(--bdr) 20%, var(--bdr) 80%, transparent);
```

**Left-aligned content (e.g., stacked list items):**
```css
/* Fade from visible on left to transparent on right */
background: linear-gradient(90deg, var(--bdr2) 0%, var(--bdr) 60%, transparent 100%);
```

Implementation: use `::before` / `::after` pseudo-elements with `position: absolute`, not `border` properties. This allows gradient treatment and endpoint fading.

### No Card Containers for Feature Lists
Feature grids and content lists should NOT use:
- `border-radius` card containers
- `background: rgba(...)` glass surfaces
- `backdrop-filter: blur()`
- Hover lifts (`translateY`)

Instead: bare content separated by gradient divider lines. Let the content breathe without chrome.

**Exception:** Interactive widgets (`.ui-frame`), pricing cards, and elements that represent actual product UI should keep card containers.

### Icon Treatment
**Never** use icon-in-a-box (a small SVG inside a rounded-square container with gradient border and shadow). This is the #1 AI-design tell.

**Do:**
- Bare SVGs using `currentColor`
- Size: 20px for feature grids, 16px for list items
- Color: `var(--t3)` default, `var(--t2)` on hover
- No containers, no backgrounds, no shadows on icons

**Differentiate icons semantically:** If a feature is "5 profiles," show 5 circles, not a generic grid icon. Match the icon to the content.

### Hover States
On dark backgrounds, hover needs to be visible but restrained:
- Feature grid cells: `background: rgba(255,255,255,0.035)` — subtle wash, no lift
- Card containers (where used): `translateY(-3px)` + layered shadow
- Icons: color shift from `--t3` to `--t2`
- Never use `translateY(-2px)` — too small to perceive. Minimum lift: `-3px`.

### Typography in Feature Sections
```css
/* Titles — tighter tracking feels deliberate */
.title { letter-spacing: -0.02em; line-height: 1.25; }

/* Body — slightly open for dark-bg legibility */
.body { letter-spacing: 0.005em; line-height: 1.72; }
```

### Spacing
Dark themes need more breathing room than light themes. Minimum padding for feature grid cells: `38px 32px`. Stat grids: `26px 24px`. Section header to content gap: `56px`.

---

## Stat Grid Pattern
Big numbers with descriptions, divided by gradient lines:

```css
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; position: relative; }

/* Horizontal divider via ::before */
.stats-grid::before {
  content: ''; position: absolute;
  top: 50%; left: 8%; right: 8%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--bdr2) 15%, var(--bdr2) 85%, transparent);
}

/* Vertical divider via ::after */
.stats-grid::after {
  content: ''; position: absolute;
  left: 50%; top: 10%; bottom: 10%; width: 1px;
  background: linear-gradient(180deg, transparent, var(--bdr) 20%, var(--bdr) 80%, transparent);
}
```

Stat numbers: `font-size: 38px; font-weight: 800; letter-spacing: -0.04em;`

---

## Scroll Animation Rules

### Stagger Principles
- Cards/items entering a viewport should stagger with 150-300ms delay per item (use CSS classes `d1`–`d5`)
- Never reveal all items at once — it reads as "no animation was designed"
- Never stagger more than 5 items — after 5, batch the rest

### Scroll-Driven Animations (JS)
For complex multi-element reveals (like the HIW card stack):
- Use `requestAnimationFrame` gated by `IntersectionObserver`
- EaseOutCubic: `1 - Math.pow(1 - t, 3)` — smooth deceleration on landing
- Animate X and Y together when cards need to move to offset positions
- Skew should animate in (from 0 to final) — don't start skewed
- Opacity fades in faster than position settles: `Math.min(1, progress * 1.5)`
- Once all elements reach final state, clear inline styles and add `.in` class to hand off to CSS
- Always provide `prefers-reduced-motion` fallback

### Drop Animation Parameters
```js
// Clear one-by-one stagger
var stagger = [0, 0.28, 0.52];  // card 1, 2, 3 start times
var cardRange = 0.42;            // each card's animation duration as % of scroll

// Progress: 0 at viewport bottom, 1 at ~30% from top
var progress = 1 - Math.max(0, Math.min(1,
  (rect.top - viewH * 0.3) / (viewH * 0.7)
));
```

---

## Checklist Before Shipping Any Section

1. **Em-dash count:** ≤1 per section total (heading + all cards/items)
2. **"HIRVO" count:** ≤2 per section. Prefer "we" or no first-person.
3. **Three-item lists:** 0 per section. Name 1-2 things, imply the rest.
4. **Parallel structure:** No two adjacent cards share the same sentence pattern.
5. **Icon containers:** None (bare SVGs only in feature/content sections).
6. **Line dividers:** Gradient, not flat `border`. Fade at endpoints.
7. **Hover visible:** Test on a dark monitor. If you can't see the hover, it's too subtle.
8. **Sentence count varies:** Not all cards have the same number of sentences.
9. **Scroll animation:** Staggered, eased, with reduced-motion fallback.
