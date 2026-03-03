# HIRVO Landing Page — UX Audit: Scroll Reveals, Card Sections, Hero App Entrance
Date: 2026-03-02

---

## 1. SCROLL REVEAL SYSTEM AUDIT

### Current System Snapshot

The reveal system lives across two files:

`styles/animations.css` lines 1–13:
```css
html.js .reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity var(--d3) var(--ease-out), transform var(--d3) var(--ease-out);
}
html.js .reveal.in { opacity: 1; transform: translateY(0) }

html.js .d1 { transition-delay: 80ms }
html.js .d2 { transition-delay: 160ms }
html.js .d3 { transition-delay: 240ms }
html.js .d4 { transition-delay: 320ms }
```

`js/animations.js` lines 34–43:
```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
```

`--d3` resolves to `450ms`. `--ease-out` is `cubic-bezier(0.33,1,0.68,1)`.
The translate distance is 12px. Threshold is 12%.

---

### Diagnosis: What Feels Wrong

**Problem 1 — The threshold (0.12) fires too early for wide-element groups.**

A three-column card grid like `.hiw-cards` or `.fgrid` has each card observed individually. At 12% threshold, a card only needs ~35px of its height visible before it fires. On a typical 1080p display, a 200px card snaps in while its label is just barely peeking above the fold. The user gets no sense of the card "arriving" — it appears mid-scroll, before they've had a chance to commit their attention to that section.

The correct threshold per element type:
- Section headings (`.hiw-head`, `.fgrid-head`, `.meth-layout > div > .lbl`): **0.30**. The entire label + h2 block is short enough that 30% visible means the headline is nearly centered in view. This forces the animation to fire where the user's eye actually lands.
- Body/subtext (`.sc-body`, `.meth-body`, `.hiw-sub`): **0.20**. These are longer and start revealing as the user is reading the heading above — 20% means ~3–4 lines are visible, enough to read the opening clause.
- Cards in groups (`.hiw-card`, `.fcard`, `.meth-card`, `.pcard`): **0.15**. Cards in a horizontal grid are tall but wide — 15% of a card is roughly the top 30–40px including the icon/number, so the card enters view with its top chrome visible, then transitions. This is correct, but the stagger delays need adjustment (see below).
- Stats and metrics (`.stat-card`, `.mcard`): **0.25**. These need to be mostly in view before the counter animation fires. Currently `countObs` uses `threshold: 0.5`, which is correct for the counter trigger — but the `.reveal` class on `.mcard` fires at 0.12, meaning the card appears before the counter starts. This desync is visible: the card fades in showing "0" then a moment later starts counting. The fix is to unify: observe the mcard with 0.5 threshold (matching `countObs`) so the card arrives and counts simultaneously.
- CTAs (`.cta-btns`, `hero-btns`): the hero CTAs use the hero blur-dissolve system, not `.reveal`. The CTA section at the bottom uses `.reveal`. CTA elements should use **0.25** — they need to be well into view before firing; a CTA that snaps in at the page edge is easy to miss.

**Problem 2 — translateY(12px) is too small to feel intentional. It reads as a glitch.**

12px is below the perceptual threshold for "this element intentionally slid up." The eye reads it as content snapping rather than arriving. Reference: Linear.app uses approximately 20–24px of Y travel on scroll reveals. Stripe's card reveals use 20–28px. The movement needs to be large enough that the brain categorizes it as a motion event, not a rendering artifact.

Recommended translateY values by element type:
- Section headings: **24px** — large block, needs proportionally larger travel
- Body/subtext: **16px** — smaller visual mass, medium travel
- Cards: **20px** — enough to read as a lift, not enough to feel dramatic
- Stats: **16px**
- CTAs: **20px**

**Problem 3 — Duration (450ms / --d3) is consistent but undifferentiated.**

Every reveal uses the same 450ms. This means a major section heading and a small metadata chip feel identical. The page "loads all at once" because everything has the same energy. Differentiate:

Recommended durations:
- Section headings: **600ms** with `--ease` (`cubic-bezier(0.16,1,0.3,1)`). The springy ease-out makes the heading feel confident and intentional.
- Body/subtext: **480ms** with `--ease-out`. Slightly faster, subordinate to the heading.
- Cards (individual): **400ms** with `--ease-out`. Cards are small units — snappier is better. The stagger creates the "unfolding" sense, not the individual duration.
- Stats: **500ms** with `--ease`. Slightly weighted, matches the gravitas of large numbers.
- CTAs: **500ms** with `--ease`. Same weight as stats — conversion elements should feel deliberate.

**Problem 4 — Stagger delays (80/160/240/320ms) are too fast across card groups.**

With 80ms between cards, all three How It Works cards finish their stagger cascade in 240ms. On a 450ms duration, the last card is fully visible only 690ms after the first. The stagger is effectively invisible — everything reads as simultaneous.

For a 3-card group: 120ms stagger means the cascade takes 240ms, and with a 400ms individual duration, the last card completes at 640ms. The separation is perceptible.
For a 6-card grid: 100ms stagger with 400ms duration means the last card starts at 500ms. This creates a visible ripple effect.
For the methodology mini-cards (`.meth-card`): 140ms stagger — these are vertically stacked, so the stagger reads as a downward cascade.
For stats (`.stat-card`): 150ms — these need the most breathing room because each card has a number that needs to be read.

**Problem 5 — The "unfolds as you scroll" problem.**

The fundamental issue is that the IntersectionObserver is configured with a single `rootMargin` of zero and a single threshold. All reveals in the viewport fire simultaneously when you reach them. The page doesn't unfold — it loads by section in batch fires.

The fix is `rootMargin`. A rootMargin of `-80px 0px -80px 0px` means an element must be 80px inside the viewport on both top and bottom before triggering. This prevents elements near the viewport edge from firing until the user's eye has visually arrived at that content.

Current: `{ threshold: 0.12 }` — fires when 12% is barely in view
Recommended: `{ threshold: 0.15, rootMargin: '-60px 0px -60px 0px' }` for the general reveal observer. Then use a separate observer instance for headings with a higher threshold.

The simplest approach that avoids restructuring the JS: add a data attribute to heading elements (`data-reveal="heading"`) and card groups (`data-reveal="card"`), then query-select separately with per-type observer configs.

**Problem 6 — `.hiw-head`, `.fgrid-head`, and the methodology label/h2 are all single `.reveal` elements.**

These compound blocks (label + heading + subtext) reveal as one unit. The label (`lbl`) and h2 animate together, which wastes the hierarchy. The label appearing slightly before the h2 would reinforce the information architecture. This requires either splitting them into separate `.reveal` elements with small stagger (preferred, no JS change needed) or using CSS `:nth-child` selectors on reveal children. The split approach:

In `how-it-works.html`, the `.hiw-head` wraps label + h2 + p as a single `.reveal`. Split into:
- `.lbl` → `.reveal`
- `h2` → `.reveal d1`
- `.hiw-sub` → `.reveal d2`

Same pattern for `feature-grid.html`'s `.fgrid-head`.

**Problem 7 — methodology.html mixes reveal timing concerns.**

The `.meth-layout` splits into two columns: the left column has label → h2 → p → cards (each a separate reveal), and the right column has the stats grid (each stat-card a separate reveal). But both columns share the same d1/d2/d3/d4 delay classes, so left-column card #3 (d3, 240ms delay) fires at the same moment as right-column stat-card #3 (d3, 240ms delay). On a wide screen this looks fine; on tablet they're stacked and the stats all fire when only the top stat is visible. This works correctly — no change needed here. But confirm the stats fire correctly on mobile.

**Problem 8 — `.pricing` section headings have no `.reveal` class.**

`sections/pricing.html` line 36–39:
```html
<div class="pricing-head">
  <span class="lbl lbl-c">Pricing</span>
  <h2 class="t-h2">Simple, transparent pricing</h2>
  <p class="pricing-sub">Start free...</p>
</div>
```
The `pricing-head` container has no `.reveal` class. The heading instantly appears. This is inconsistent with every other section. Add `.reveal` to `.pricing-head`.

**Problem 9 — `testimonials.html` section heading uses inline style instead of a reveal class.**

Line 4: `<div style="text-align:center;margin-bottom:56px;" class="reveal">`. The `.reveal` class is present, which is correct. But the inline style should be a CSS class. Minor issue, not a reveal timing problem.

**Problem 10 — `.cta-outer` has no landmark reveal on the CTA heading.**

`sections/cta.html` line 5: `.cta-h1` has `.reveal` directly. This is correct, but the threshold will fire this while the heading is still near the fold edge. For a bottom-of-page CTA, the default 12% threshold means the headline fires when only ~30px is visible. With a 600ms duration, it finishes animating before the user has scrolled it center-screen. Recommend 0.30 threshold for this element specifically.

---

### Should blur be used on scroll reveals?

No. Blur should be exclusive to the hero load.

The hero blur-dissolve works because it is a first-load experience — the page is rendering and elements are appearing from nothing. Blur signals "this is becoming focused and real." Applied on scroll, blur loses this association. Worse, scroll-triggered blur is computationally expensive: `filter: blur()` triggers a compositing layer on every element it's applied to simultaneously, and when 6 cards all blur-reveal at once (threshold fires in batch), Chrome often drops frames. The `filter` property does not use the GPU compositor path as efficiently as `opacity` + `transform`.

Rule: hero = blur-dissolve. All scroll reveals = opacity + translateY only.

---

### Recommended Reveal System — Summary Table

| Element Type              | translateY | Duration | Easing       | Threshold | rootMargin |
|---------------------------|-----------|----------|--------------|-----------|------------|
| Section labels (.lbl)     | 16px      | 500ms    | --ease       | 0.25      | -60px      |
| Section headings (h2)     | 24px      | 600ms    | --ease       | 0.20      | -60px      |
| Body/subtext              | 16px      | 480ms    | --ease-out   | 0.20      | -60px      |
| Feature cards (row 1)     | 20px      | 400ms    | --ease-out   | 0.15      | -40px      |
| Feature cards (stagger)   | +120ms/card gap                                          |
| Methodology mini-cards    | 20px      | 380ms    | --ease-out   | 0.20      | -40px      |
| Stat cards                | 16px      | 500ms    | --ease       | 0.30      | -60px      |
| Metric cards (.mcard)     | 16px      | 500ms    | --ease       | 0.45      | 0          |
| CTA heading               | 24px      | 600ms    | --ease       | 0.30      | -60px      |
| CTA subtext               | 16px      | 480ms    | --ease-out   | 0.25      | -60px      |
| CTA buttons               | 20px      | 500ms    | --ease       | 0.25      | -60px      |
| Pricing cards             | 20px      | 420ms    | --ease-out   | 0.15      | -40px      |
| Showcase .ui-frame        | 24px      | 550ms    | --ease       | 0.12      | 0          |

The key insight: headings and CTAs need higher thresholds (they should only reveal when the user has clearly arrived at that section). Cards need lower thresholds but larger travel distance and longer per-card stagger to create the cascade. Stats/metrics need high thresholds to unify their reveal with the counter animation start.

---

## 2. CARD SECTIONS — GENERIC/SOFT ELEMENT FLAGS

### How It Works (`sections/how-it-works.html` + `styles/components/how-it-works.css`)

**Generic/template signals:**

1. The numbered badges (`.hiw-num`) render "01", "02", "03" in a small square. The numbers are correct and intentional, but the badge treatment is indistinguishable from every other SaaS "steps" section in existence. The badge has a gradient border and a box-shadow, but the actual number is in `--t2` (64% opacity white). It reads as inactive. A user scanning the page might not register that 01/02/03 is communicating sequence — it looks like a category tag.

   Fix: Make the number the most visually prominent thing in the card-head, not subordinate. Font-size 13px at 64% opacity reads as metadata. Try `font-size: 15px; font-weight: 900; color: var(--t1); letter-spacing: -0.02em`. The badge box can stay — make the number inside it louder.

2. The h3 → p hierarchy within each card is flat. The heading (`t-h3`, 17px/600 weight) and the paragraph (`t-sm`, 14px) are close enough in weight that the card reads as a block of text, not a headed feature. The margin between h3 and p is 12px, which is tight for the size difference.

   Fix: Increase `h3` color to `var(--t1)` explicitly (currently inherits, which is fine, but worth confirming). Increase margin-bottom on h3 to 14px. Add a 1px bottom border or a subtle horizontal rule under h3, fading from `var(--bdr2)` to transparent — this visually separates the claim from the explanation without adding hierarchy clutter.

3. No hover visual payoff beyond `background: var(--surf2)`. The card hover changes the background and lifts the badge slightly — this is correct. But there's no signal to the user that they've engaged with meaningful content. The hover state is purely cosmetic.

   Fix: On `.hiw-card:hover`, add `color: var(--t1)` to the paragraph text (from `var(--t2)`). This subtle brightening makes the hovered card feel "active" — the content becomes slightly more readable. Also: the current hover transitions include `background` and `box-shadow` but not `color` on `.t-sm`. Add `transition: color var(--d2) var(--ease)` to `.hiw-card` and add `color: inherit` to `.hiw-card p` so the hover propagates.

4. The three-card horizontal divider layout (`gap: 1px; background: var(--bdr)`) is the same pattern used by `.fgrid`, `.mgrid`, and `.pcard`. These sections all read as the same component with different content. The structural repetition is the template tell.

   What to preserve: the grid pattern itself is correct per constraints.
   What to differentiate: the `hiw-card` should have a distinct hover direction. Currently all grid cards lift with `translateY(-2px)`. The How It Works cards could instead do a subtle `scale(1.01) translateY(-2px)` — giving them a slightly more physical feel befitting a "step" narrative.

---

### Feature Grid (`sections/feature-grid.html` + `styles/components/feature-grid.css`)

**Generic/template signals:**

1. The icon treatment (`.fcard-icon`) is a 38px square with an SVG stroke icon centered inside. This is the canonical "feature grid icon" from every template on Figma Community and ThemeForest. The icons themselves are thin-stroke monochrome SVG at `var(--t3)` — nearly invisible against the dark surface. At 32% opacity white, the icons are decorative rather than communicative.

   Fix within constraints: The icon squares currently use `var(--t3)` for the SVG strokes. On hover, the `.fcard-icon` lifts via `translateY(-2px)` and the box-shadow deepens, but the icon color doesn't change. Adding `svg { transition: stroke var(--d2) var(--ease) }` and on `.fcard:hover .fcard-icon svg { stroke color shift to var(--t2) }` creates a responsive payoff. Better: a very subtle glow — `filter: drop-shadow(0 0 6px rgba(237,237,236,0.15))` on icon hover. This makes the icon feel like it "activates."

2. The 6-card 3-column layout has no visual hierarchy between cards. "5 Recruiter Profiles" and "Progress Tracking" get equal weight despite the former being the core differentiator. The grid is read left-to-right, top-to-bottom — which means the most important feature needs to be in position [0,0].

   Current order: Recruiter Profiles → ATS Parsing → Bullet Scoring → Interview Sim → International Mode → Progress Tracking.
   This order is reasonable. The concern is the visual weight is identical across all six. Premium grids (see Linear's feature page) give the hero feature a slightly larger or more prominent visual treatment — a wider card, a different surface color, or a larger icon.

   Without asymmetric grids (per constraint): the first card could use `background: var(--surf2)` permanently (not just on hover), making it subtly elevated from the rest. A single lifted card in a sea of flat cards draws the eye and creates hierarchy without breaking the grid structure.

3. The `h3` font (`t-h3`: 17px/600) sits too close to the body copy (`t-sm`: 14px). At 14px and `--t2` color, the descriptions read as fine print. The feature benefit is buried.

   Fix: Keep `t-sm` but increase it to 14.5px within `.fcard p` only. Or: change `color` from `var(--t2)` to something between `--t2` and `--t1` — there's a gap in the token scale between 64% and 100% opacity. A local variable `rgba(237,237,236,0.78)` could be defined as `--t1-5` in tokens.css and used for high-importance body copy in feature cards.

4. No active state or selection indicator on the feature cards. The cards are informational, not interactive, which is correct. But the hover state reveals nothing that wasn't visible before — just a slightly lighter background and a lifted icon. Premium: add a subtle left border accent on hover.

   On `.fcard:hover`: `box-shadow: inset 3px 0 0 rgba(237,237,236,0.10), inset 0 1px 0 var(--highlight-hover), ...rest`. A 3px left-edge inset shadow (not a border — inset shadow avoids layout shift) marks the hovered card as "selected" without changing the structure.

---

### Methodology (`sections/methodology.html` + `styles/components/methodology.css`)

**Generic/template signals:**

1. The `.meth-card-icon` icons are thin-stroke SVG at `var(--t3)`. The three icons represent: a plus sign (Zero optimism bias), a 2x2 grid (Role-specific logic), and a star (Silent filters). The plus sign icon does not communicate "zero optimism bias" — it reads as "add" or "new." The 2x2 grid reads as "dashboard" not "role-specific." Only the star has any semantic resonance.

   This is a copy/design alignment problem. Without changing structure: at minimum, ensure hover state on `.meth-card-icon` makes the icon color shift to `var(--t2)` — `transition` is already applied, but the hover rule for the icon only changes `box-shadow` and `transform`. The CSS at line 31 targets `.meth-card:hover .meth-card-icon` — add `filter: drop-shadow(0 0 5px rgba(237,237,236,0.12))` to the icon SVG on hover. This creates a subtle glow that signals "this concept is active."

2. The `.meth-card` hover lifts the entire card by `-2px`. With three stacked cards, the lift creates a visual rhythm when the user moves their cursor down the column. This is the best hover behavior in any card section on the page. Preserve it.

3. The stat cards (`.stat-card`) display "6–10s", "5", "3", "0" — four numbers in a 2x2 grid. The large font (48px/900 weight) is correct and impactful. The weakness: `stat-desc` at 13px/`--t2` reads small against the 48px number. The description is the thing that gives the number meaning — it should not feel like fine print.

   Fix: Change `stat-desc` from 13px to 13.5px and from `line-height: 1.55` to `line-height: 1.65`. This is a very small change with meaningful readability improvement.

4. The stat "0" (zero pieces of motivational fluff) is the cleverest content on the page. But it renders identically to "5" and "3" — no visual distinction for the intentional zero. This is a missed opportunity. A stat card where the number is "0" could have a slightly different treatment — perhaps the number in `--t3` instead of `--t1`, with `--t2` or `--t1` on hover, and a tooltip or microtext that explains the irony. Minor detail, but it's the kind of thing Linear would execute.

5. The section has no stagger differentiation between left-column content and right-column stat cards. Both columns use `d1/d2/d3/d4` delays (80/160/240/320ms). The right column's stat cards could use `d2/d3/d4/d5` (160/240/320ms+) to create a sense of the stats arriving slightly after the methodology is explained — reinforcing the narrative "here's how it works → here are the numbers."

   This requires adding a `d5` class (currently undefined — `--d4` is the last stagger at 320ms). Define `.d5 { transition-delay: 400ms }` in `animations.css`.

---

### Stats / Proof (`sections/proof.html` + `styles/components/proof.css`)

**Generic/template signals:**

1. The proof strip (institution names as text in a marquee) is intentionally minimal. The `proof-logo` class renders university names at `var(--t4)` — 16% opacity. These are nearly invisible against `--bg`. On first scroll, they read as ghost text, not as a credibility signal. The marquee hover pauses correctly, but there's no hover state that communicates interactivity.

   The template-like feel: every SaaS landing page has a customer logo strip. The HIRVO version is weaker than most because the logos are text-only. Without adding image assets: increase `proof-logo` from `var(--t4)` to `var(--t3)` (32% opacity) as the default, with `var(--t2)` on hover. This makes the names readable without being loud.

2. The metrics section (`.mgrid`) uses the same 4-column grid+1px-gap treatment as How It Works and Feature Grid. The structural homogeneity is a template tell. The metric cards are also the widest application of this pattern — four cells spanning 1200px means each cell is ~295px wide with 28px padding, and the content is a large number + a 13.5px description.

   The "12x More detailed" metric has the most impact but is last in the reading order (right-most cell). Reading order places "2,400+ Resumes scanned" first — this is the weakest social proof (volume) in the group. Reordering: "89% Found a hidden rejection reason" → "5 min To your first rejection reason" → "12x More detailed" → "2,400+ Resumes scanned" — puts the most compelling metrics first.

3. The `.mnum` counter starts at 0 and animates to its target value. The animation uses cubic ease-out over 1600ms. This is good. The weakness: the counter starts animating at `threshold: 0.5` — meaning the card must be 50% in view before counting starts. But the card's `.reveal` fires at `threshold: 0.12`. The user sees the card appear showing "0", and then — potentially several hundred milliseconds later — the count begins. This is a timing desync. The fix: remove `.reveal` from `.mcard` and instead trigger both the visibility and the counter from the `countObs` at `threshold: 0.5`. The card should be invisible until the counter starts, at which point both the card fades in and the counter begins simultaneously.

4. The metric "5 min — To your first rejection reason" uses `data-suffix=" min"`. The counter renders as "5 min". This looks correct. But "5 min" is not a compelling animated number — it counts 0→1→2→3→4→5 and ends. Uneventful. Consider whether this metric benefits from the counter animation at all. A static "5 min" in 48px/900 weight is more impactful than watching a counter increment through 0→5 in 1600ms.

---

## 3. HERO APP WINDOW ENTRANCE — EVALUATION

### Current Configuration

`styles/animations.css` lines 32–46:
```css
.hero-animate.hero-app-entrance {
  filter: blur(4px);
  transform: translateY(60px) scale(0.94);
  transition:
    opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1),
    filter 1.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

The app window starts with: `blur(4px)`, `translateY(60px)`, `scale(0.94)`.
It enters with a 1.4s spring ease-out.
Its stagger delay is `hd5` = 1100ms after hero-loaded fires.
The hero-loaded trigger fires 50ms after DOM ready.

Text elements start at 1s into load (hd0=300ms, hw0–2=400–466ms, hd3=600ms, hd4=700ms).
App window starts at: 1100ms delay + 50ms JS trigger = 1150ms after page load.

The text blur-dissolve completes by approximately 700ms + 1000ms duration = 1700ms.
The app window starts at 1150ms and takes 1400ms, completing at ~2550ms.

### What This Creates

The separation between "text fully visible" (~1700ms) and "app fully visible" (~2550ms) is 850ms. This is the intended two-phase reveal: read the headline, then the product appears. The concept is correct.

**The problems:**

1. **The gap is too long.** At 1150ms, the app window has barely started its rise when the text has already been fully visible for ~450ms. The user has read the headline, read the subtext, read the CTA — and is now looking at a ghost of an app window still emerging. 850ms of visible-headline-plus-invisible-app creates a sense of the page loading slowly, not of sequential reveals. The intended "beat" is more like a film cut — you see the context, then the product appears. The timing should feel like a 500ms beat, not an 850ms wait.

   Recommended adjustment: `hd5` delay from `1100ms` to `800ms`. This tightens the gap to ~500ms. The text sequence ends around 1700ms; the app starts at 850ms and takes 1400ms, completing at 2250ms. The overlap (app starts rising while text is still fading in at its tail) creates a more fluid sense of one continuous scene rather than two phases.

2. **translateY(60px) is correct. scale(0.94) is slightly too subtle.**

   60px travel is appropriate for a large element — it's a physically meaningful distance that reads as "this arrived from below." The scale from 0.94 to 1.0 is a 6% size increase. At the scale of the app window (which spans roughly half the hero width), 6% is approximately 30–40px of perceived size difference. This is perceptible but subtle.

   The concern: with the spring easing (`cubic-bezier(0.16,1,0.3,1)`) and 1.4s duration, the scale change is fastest in the first 400ms and then decelerates sharply. By the time the user registers the app window appearing, it's already near 0.98 scale. The scale component of the animation is essentially invisible in practice — the user sees rise + fade, not rise + scale.

   Options: increase scale start to `0.92` for more perceivable depth, or remove scale entirely and let the rise + blur-clear do the work. The blur-from-4px is the most distinctive element of this entrance — the scale is redundant.

3. **blur(4px) vs text blur(10px) — intentional contrast, correct.**

   The text elements start at `blur(10px)` and the app window starts at `blur(4px)`. This differentiation communicates that the text is more "emergent" (more unfocused → focused) while the app is more "substantial" (arrives already mostly sharp). This is the right call. The app should feel like it was always there, just rising into view — not like it's being conjured from fog.

4. **scroll-anim.js interaction: potential conflict.**

   `js/scroll-anim.js` applies a `perspective(1200px) rotateX()` transform to `.app-win` (the inner element) based on scroll position. The hero entrance applies its `translateY + scale` to `.app-wrap` (the outer element). These are different elements, so there is no direct conflict.

   However: `scroll-anim.js` calls `updateTransform()` immediately on init (line 41). If the user has scrolled before the hero entrance completes (i.e., the page was loaded mid-scroll, or the user scrolled during the 1.1s delay), `updateTransform` will apply a non-zero `rotateX` to `.app-win` while `.app-wrap` is still mid-transition. The result would be the entrance animation and the scroll tilt fighting each other visually. This is an edge case but not a theoretical one.

   Fix: guard `scroll-anim.js`'s initial call. Only call `updateTransform()` after `body.hero-loaded` is set. A simple approach: listen for the `transitionend` event on `.app-wrap` before enabling scroll transform. Or: set a CSS custom property `--scroll-tilt-enabled: 0` that `scroll-anim.js` checks before applying transforms.

5. **Overall verdict on the entrance:**

   The concept is well-executed. The two-phase reveal (text first, then product) is the right structure for a demo-driven hero. The spring easing on the app window entrance (`cubic-bezier(0.16,1,0.3,1)`) is the correct choice — it gives the app a physical sense of mass arriving. The blur-dissolve on text creates a complementary "focus sharpening" metaphor.

   The primary adjustment needed is timing: reduce `hd5` delay from `1100ms` to `800ms` to close the gap between text completion and app arrival. Secondary: consider whether `scale(0.94)` is earning its complexity, or whether removing it would simplify the animation without degrading the quality.

---

## QUICK WINS

**1. Fix the metrics desync (highest impact, simplest fix)**

In `sections/proof.html`, remove `.reveal` from all `.mcard` elements. In `js/animations.js`, modify `countObs` to also add an `.in` class when a counter fires. This unifies the card-fade-in and counter-start events, eliminating the "0 appears then counts" artifact.

Specific change: in `animations.js` around line 64, add `e.target.closest('.mcard').classList.add('in')` after `animateCount(e.target)`. Change `threshold` on `countObs` from `0.5` to `0.45`.

In `animations.css`, add a rule for `.mcard` (without the `html.js` gating — the countObs JS gates it instead):
```css
.mcard { opacity: 0; transform: translateY(16px); transition: opacity 500ms var(--ease), transform 500ms var(--ease); }
.mcard.in { opacity: 1; transform: translateY(0); }
```

**2. Increase translateY from 12px to 20px on all `.reveal` elements**

One-line change in `animations.css` line 4:
```css
transform: translateY(20px);
```

This single change makes every scroll reveal feel intentional rather than a glitch. The 12px value is the most impactful thing currently reducing the page's perceived polish.

**3. Tighten the hero app window delay from 1100ms to 800ms**

In `animations.css` line 56:
```css
.hd5 { transition-delay: 800ms }
```

This closes the gap between headline-fully-visible and app-starts-rising from 850ms to ~450ms. The two-phase reveal reads as a single scene rather than two separately loaded stages.

---

## DEEP DIVES — Items Requiring Further Investigation

**1. How It Works card hover color propagation**

The `.hiw-card:hover .hiw-num` lifts and brightens, but the body text (`t-sm`) does not change. Verify whether `color: var(--t1)` inheritance on `.hiw-card:hover p.t-sm` should be a global improvement or only tested on this section. Requires visual testing at real scroll speed — the hover interaction is subtle enough that it might read as noise rather than responsiveness.

**2. Mobile threshold behavior**

All IntersectionObserver thresholds defined in this audit are calibrated for desktop viewport heights (768px+). On mobile (667px height, iPhone SE), a `threshold: 0.30` on a 56px section heading means only 17px needs to be visible. This may fire too early on mobile, reintroducing the same "snaps in at edge" problem. Recommend testing with an override: add a media query that reduces `rootMargin` to `-20px 0px -20px 0px` on mobile, since the viewport is shorter and less rootMargin is needed to place elements in the reading zone.

**3. Pricing section heading — missing reveal**

The `pricing-head` div (lines 36–39 in `sections/pricing.html`) has no `.reveal` class. The heading appears instantly. This is likely intentional — pricing is high-intent content and users arriving there via anchor link should see it immediately. But for scroll-through users, the instant appearance is jarring relative to every other section. Confirm with user intent: is pricing a "always ready" section or should it reveal?

**4. Card hover state on touch devices**

`.hiw-card:hover`, `.fcard:hover`, `.meth-card:hover`, `.stat-card:hover` all use CSS `:hover` with `transform: translateY(-2px)`. On touch devices, hover states triggered by tap persist until the next tap. A tapped card will remain lifted (translateY -2px) while the user scrolls. Verify whether this creates visual oddities on iOS/Android at slow scroll speeds.

**5. scroll-anim.js entrance conflict**

As described in section 3: the initial `updateTransform()` call on page load may produce a conflicting transform if the page was loaded mid-scroll. This needs browser testing on a slow connection (throttled in DevTools) to reproduce. If reproduced, the fix is straightforward (guard by hero-loaded state), but the severity depends on how common mid-scroll loads are in the target audience (mobile users restoring scroll position after a browser back-navigation).

**6. The "0" stat card irony — unexploited**

The fourth stat card in the methodology section shows the number "0" (zero pieces of motivational fluff). This is the wittiest content on the page and currently rendered identically to "5" and "3". Explore whether a visual treatment — the counter counting down from a higher number to 0, or the number rendering in a crossed-out or struck-through style before settling on 0 — would land the joke more effectively. Requires copy + design alignment before implementation.
