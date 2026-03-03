# Scroll Reveal Animation Research
## Premium SaaS Landing Pages: Patterns, Values, and Principles

**Date:** March 2, 2026
**Scope:** Linear.app, Vercel, Raycast, Stripe, Clerk, Resend, Notion, Arc Browser
**Purpose:** Inform animation improvements to Hirvo landing page

---

## Part 1: Linear.app — Deep Analysis

Linear is the most-referenced benchmark for premium dark SaaS UI. Their animation philosophy
is "purposeful restraint" — they animate to reveal hierarchy, not to impress.

### What Linear Does

Linear's scroll reveals have been reverse-engineered and rebuilt by multiple developers
(github.com/frontendfyi/rebuilding-linear.app, codepen.io/akella/pen/XWYrRmb). The
core pattern:

**Hero text reveal:**
- Stagger delays of 300ms, 500ms, 700ms between heading, subtext, and CTA
- Each word/line fades from `opacity: 0` to `opacity: 1` with `translateY(20px)` -> `translateY(0)`
- Character-level stagger uses `staggerChildren: 0.1` (100ms between each letter)
- Duration per item: approximately 0.5s – 0.6s

**Section content reveals:**
- Labels/badges ("eyebrow" text) animate FIRST, before the heading
- Then heading, then body copy, then cards/CTAs
- This left-to-right, top-to-bottom stagger mimics natural reading direction
- Cards within a grid typically animate left-to-right with 80–120ms between each

**Key easing:**
Linear uses what is effectively `ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)`
This starts fast and decelerates heavily — the element shoots into position and
lands with authority rather than drifting in slowly.

**Notable: Linear does NOT re-animate on scroll-up.** `.once: true` is effectively
applied — once something is visible, it stays. Re-animating on every scroll direction
change is an immediate quality signal of a template site.

### Hirvo Token Mapping

Hirvo already uses Linear's exact easing: `--ease: cubic-bezier(0.16,1,0.3,1)`.
This is the `ease-out-expo` curve. Excellent alignment.

---

## Part 2: Vercel

Vercel's Geist design system specifies:
- Interactive elements: `transitionDuration: 200ms`
- Animation principle: "CSS over Web Animations API; GPU-accelerated properties only"
- Their homepage uses Next.js with Framer Motion `whileInView` for section reveals

From their deployments page scroll animations (widely recreated by developers):
- Fade-up with `y: 20` -> `y: 0`
- Duration: ~0.5s
- Easing: ease-out cubic

Vercel explicitly "prefers CSS over Web Animations API and JavaScript libraries" and
"prioritizes GPU-accelerated properties like transform and opacity."

---

## Part 3: Raycast

Raycast.com uses:
- Primary class: `page_fadeInUp` — fade-in with upward movement
- Staggered variant: `page_fadeInUpStagger` — sequential stagger for lists
- Meteor/path animations use delays of 0ms, 400ms, 500ms, 600ms for cascade effects
- IntersectionObserver-gated, with `once: true` behavior

Raycast's grid reveals are notable: feature cards animate left-to-right with a
subtle stagger. The translate distance is short — approximately 16-24px. This is
the modern consensus range and what distinguishes 2024-era premium sites from
2019-era AOS-style reveals that used 50-150px drops.

---

## Part 4: Stripe

From Stripe's published blog post "Connect: behind the front-end experience":

**Explicit values:**
- Easing: `cubic-bezier(0.2, 1, 0.2, 1)` for keyboard slide animation (800ms)
- General rule: "stay under 500 milliseconds in most cases"
- Transform: `translateY(100%)` to `translateY(0%)` for full-panel reveals
  (this is a dramatic exception — for UI panels, not content reveals)

**Philosophy extract:**
> "Animations should never get in the way. The goal is to make a UI feel responsive,
> harmonious, enjoyable and polished."

> "You almost never want to use a built-in timing-function like ease-in, ease-out
> and linear. Instead, a nice time-saver is to globally define a number of custom
> cubic-bezier variables."

Stripe uses the Web Animations API for complex sequenced animations, CSS transitions
for hover states, and `requestAnimationFrame` for canvas-level effects. They
exclusively animate `transform` and `opacity` — never layout properties.

---

## Part 5: Clerk.com

Clerk uses:
- Tailwind utility animation classes
- Cascade/meteor patterns with delays: 0ms, 400ms, 500ms, 600ms
- `WebkitMaskImage` linear-gradient fades (directional content masking)
- Async component loading for animation boundary orchestration
- Heavy use of SVG path animations with sequential timing for staggered effects

Notable: Clerk's meteor/constellation animations are cosmetic — they do NOT block
content. Content has its own simple fade-in system layered underneath.

---

## Part 6: Resend.com

Resend uses:
- Next.js App Router with forced dark theme
- Likely Framer Motion (given React framework)
- `disableTransitionOnChange: true` on theme provider (avoids flash on theme switch)
- Very minimal animation — Resend is a case of "less is more" done well
- Their design communicates quality through typography and spacing, not animation

---

## Part 7: Industry Design Systems — Specific Numeric Values

### Material Design 3 (Google)
| Platform | Duration |
|---|---|
| Desktop | 150ms – 200ms |
| Mobile standard | 300ms |
| Mobile large/complex | 375ms |
| Mobile entrance | 225ms |
| Mobile exit | 195ms |

| Curve Name | CSS Value |
|---|---|
| Standard | `cubic-bezier(0.4, 0.0, 0.2, 1)` |
| Deceleration (entrance) | `cubic-bezier(0.0, 0.0, 0.2, 1)` |
| Acceleration (exit) | `cubic-bezier(0.4, 0.0, 1, 1)` |
| Sharp | `cubic-bezier(0.4, 0.0, 0.6, 1)` |

### Nielsen Norman Group Research
- Simple feedback (checkbox, toggle): ~100ms
- Substantial screen changes (modal entrance): 200–300ms
- Maximum before feeling sluggish: 400ms
- At 500ms: "animations start to feel like a real drag"
- Key asymmetry: entrance slightly longer than exit (300ms in / 200ms out)

### Stripe's Published Rule
- Stay under 500ms in most cases
- Exceptions: large panel reveals, cinematic sequences

### Premium Web Animation Checklist (aggregated from multiple design systems)
- Under 300ms for micro-interactions
- 400–600ms for section reveals (content coming into view)
- 600–800ms for large widget/demo reveals
- Never exceed 800ms for scroll-triggered events

---

## Part 8: The Complete Easing Curve Reference

These are the named easing functions with their exact cubic-bezier values, from
most gentle to most aggressive:

### Ease-Out Family (for ENTRANCES — elements entering view)
| Name | CSS Value | Character |
|---|---|---|
| ease-out-quad | `cubic-bezier(0.5, 1, 0.89, 1)` | Very subtle deceleration |
| ease-out-cubic | `cubic-bezier(0.33, 1, 0.68, 1)` | Moderate — general purpose |
| ease-out-quart | `cubic-bezier(0.25, 1, 0.5, 1)` | Snappier start |
| ease-out-quint | `cubic-bezier(0.22, 1, 0.36, 1)` | Premium scroll reveal |
| ease-out-expo  | `cubic-bezier(0.16, 1, 0.3, 1)` | Linear.app / Hirvo standard |
| ease-out-circ  | `cubic-bezier(0, 0.55, 0.45, 1)` | Aggressive snap |

**For Hirvo:** The existing `--ease: cubic-bezier(0.16,1,0.3,1)` is `ease-out-expo`.
The existing `--ease-out: cubic-bezier(0.33,1,0.68,1)` is `ease-out-cubic`.
Both are excellent choices. `--ease` is the more dramatic/premium option; `--ease-out`
is softer and appropriate for subtler reveals.

### Ease-In-Out Family (for STATE CHANGES — loops, toggles)
| Name | CSS Value |
|---|---|
| ease-in-out-cubic | `cubic-bezier(0.65, 0, 0.35, 1)` |
| ease-in-out-quart | `cubic-bezier(0.76, 0, 0.24, 1)` |
| ease-in-out-expo  | `cubic-bezier(0.87, 0, 0.13, 1)` |

### Spring/Bounce (for MICRO-INTERACTIONS — buttons, tooltips)
| Name | CSS Value |
|---|---|
| ease-out-back | `cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot |
| ease-in-out-back | `cubic-bezier(0.68, -0.6, 0.32, 1.6)` — dramatic spring |

---

## Part 9: Transform Distance — The Sweet Spot

This is one of the most contested values in animation design. Here is the research consensus:

### translateY Distance by Use Case

| Use Case | Translate Distance | Notes |
|---|---|---|
| Subtle body text reveal | 8px – 12px | Almost imperceptible motion, very refined |
| Standard content reveal | 16px – 24px | The 2024 premium consensus range |
| Card/feature grid reveal | 20px – 32px | Slightly more drama for chunky UI |
| Full widget/demo reveal | 40px – 60px | Only for hero-adjacent large components |
| Dramatic hero reveal | 80px – 120px | Use sparingly, only for above-fold |
| AOS-style (outdated) | 50px – 200px | This reads as "template" — avoid |

**Key insight:** The smaller the translate distance, the more premium it feels.
Sites like Linear use ~16-20px. Template sites use 50-150px. The difference is
whether the animation communicates "content gracefully arrives" vs "content
dramatically crashes in."

**Hirvo current value:** `translateY(20px)` — this is EXACTLY in the premium sweet spot.
The hero uses `translateY(12px)` which is even more refined. Both are correct.

### Scale Distance (for card reveals)

Some premium sites add a very subtle scale to card entrances:
- Scale from `0.97` or `0.98` to `1.0` — imperceptible but adds "weight"
- Scale from `0.95` to `1.0` — slightly more noticeable, appropriate for large cards
- Scale from `0.80` to `1.0` — this is template territory, avoid

---

## Part 10: Stagger Patterns

### How Premium Sites Stage Multi-Element Reveals

**Pattern 1: Reading-order stagger (most common for SaaS)**
Badge/label -> Heading -> Subtext -> Cards/CTA
Delay increment: 80ms – 150ms between each group

```
Label:   0ms delay (fires first when section enters viewport)
H2:      80ms
Body:    180ms
Cards:   280ms, 360ms, 440ms (80ms each)
CTA:     480ms
```

**Pattern 2: All-at-once with micro-stagger (for grids)**
All cards fire at approximately the same time, but with a 60–100ms offset
between adjacent items. This prevents "all at once" rigidity while keeping
the reveal snappy.

```
Card 1:  0ms
Card 2:  80ms
Card 3:  160ms
Card 4:  240ms
```

**Pattern 3: Dramatic cascade (for feature sections)**
Heading animates, then cards fall in sequence with longer delays.
```
H2:      0ms
Card 1:  200ms
Card 2:  350ms
Card 3:  500ms
```
This is more theatrical — use for important "showcase" sections only.

### Stagger by Framework/Library

| Source | Stagger Value |
|---|---|
| Framer Motion staggerChildren | 0.1s (100ms) for text, 0.08s for cards |
| GSAP stagger.each | 0.1s for cards, 0.05s for list items |
| GSAP stagger.amount | 0.5s–0.7s total across all children |
| Frontend.fyi (Linear rebuild) | 100ms per letter for character stagger |
| Webflow guide | 100–150ms between cards, 200–300ms for larger components |
| Clerk meteor animations | 400ms, 500ms, 600ms for ambient background effects |

**Hirvo current values:**
- `.d1` through `.d5`: 120ms, 240ms, 360ms, 480ms, 600ms
- These are 120ms increments — well within premium range
- Gap could tighten to 80–100ms increments for a snappier feel

---

## Part 11: IntersectionObserver Configuration

### Threshold Values

| Value | Meaning | Use Case |
|---|---|---|
| `0` | First pixel visible | Aggressive — fires too early, content not yet contextually visible |
| `0.1` | 10% visible | Standard default — good for tall elements |
| `0.15` | 15% visible | Hirvo current — slightly conservative, correct |
| `0.2` | 20% visible | More deliberate — used by sites that want full text to be visible first |
| `0.5` | 50% visible | Very conservative — good for short card elements |

### rootMargin Configuration

Negative rootMargin shrinks the viewport trigger zone, effectively requiring
the element to scroll further before triggering:

| Value | Effect |
|---|---|
| `0px` | Fires when element hits viewport edge |
| `-60px 0px -60px 0px` | Hirvo current — 60px inset top and bottom |
| `-100px 0px -100px 0px` | More deliberate — fires only when element is well inside view |
| `0px 0px -10% 0px` | Percentage-based bottom offset — scales with viewport size |

**Hirvo current config:** `{threshold: 0.15, rootMargin: '-60px 0px -60px 0px'}`
This is a well-calibrated setup. The -60px rootMargin prevents premature fires
while not requiring the element to scroll too far before animating.

**One consideration:** The rootMargin applies equally to top and bottom. The bottom
negative value means elements at the very bottom of the page may never trigger
if the page content ends close to the bottom. A value like `-40px 0px 0px 0px`
would apply the inset only at the top, which is more semantically correct for
"element has scrolled meaningfully into view."

---

## Part 12: What Makes Scroll Animations Feel Premium vs Cheap

### Premium Signals

1. **Short translate distance (8–24px).** The element barely moves — it's more of
   a "materialization" than a "flight." Large translate distances (50px+) scream template.

2. **Fast duration (400–600ms for reveals).** Under 500ms in most cases. The animation
   is a detail, not a feature.

3. **Aggressive ease-out.** `ease-out-expo` or `ease-out-quint` — the element snaps
   into position immediately and has already "landed" before the user fully processes
   the transition. This is the opposite of `ease` (which lingers) or `linear` (which
   has no personality).

4. **Hierarchy-aware stagger.** Badge before heading before body before cards.
   This is "choreography." Random reveal order or all-at-once reveals are sloppy.

5. **Once only.** Animate in, stay in. Never re-animate on scroll-up.

6. **Asymmetric entrance/exit.** If elements DO exit on scroll-up, exit should be
   faster than entrance (200ms out vs 400ms in).

7. **Subtle translate only — no scale, no rotation (usually).** Scale and rotate
   reads as Webflow. The most refined sites use only opacity + translateY.

8. **prefers-reduced-motion respected.** Failing this is an accessibility issue,
   not just a polish issue. Premium sites implement this correctly.

### Cheap Signals

1. **Large translate distances (>40px for body content).** AOS library default is
   often 50–100px — this is why AOS-built sites feel like templates.

2. **Slow durations (>700ms for content reveals).** Content that takes 800ms to
   arrive makes the page feel slow. The NN Group study is clear: >500ms feels laggy.

3. **`ease` or `ease-in-out` instead of `ease-out`.** These curves linger at the end
   and have a "drifting" quality. Ease-out snaps. The difference is subtle but real.

4. **Every single element has a reveal animation.** This dilutes the effect.
   Premium sites animate section headers and first-impression cards — not every
   paragraph, divider, and label.

5. **Re-animation on scroll-up.** Every scroll direction change retriggers all
   the animations. This immediately signals a library (ScrollReveal defaults)
   rather than intentional choreography.

6. **Uniform stagger increments across all section types.** Using the same 4 stagger
   classes for everything makes the site feel mechanical. Different sections should
   have different orchestration rhythms.

7. **Long stagger tails (>600ms total stagger).** If a 3-card grid has the third
   card arriving 900ms after the section entered view, users are waiting for content.

8. **CSS `all` as transition property.** Animates every property change, including
   color, border, padding — anything that gets updated by hover states creates
   unexpected transitions. Always name specific properties.

---

## Part 13: Specific Patterns by Content Type

### Section Headings (H2 + Label + Body)

The pattern used by Raycast, Linear, Clerk, and Vercel:

```
1. Section label/badge — translateY(12px) opacity:0 -> 1, 0ms delay, 450ms duration
2. H2 headline — translateY(16px) opacity:0 -> 1, 80ms delay, 500ms duration
3. Body paragraph — translateY(12px) opacity:0 -> 1, 180ms delay, 450ms duration
4. CTA if present — translateY(8px) opacity:0 -> 1, 280ms delay, 400ms duration
```

The translate distance DECREASES for lower-hierarchy elements. The heading has the
most dramatic arrival; supporting text barely moves.

### Feature Card Grids (3-column or 4-column)

Two approaches used by premium sites:

**Approach A (all at once with micro-stagger):**
```
All cards start their animation within 240ms of each other.
Card 1: 0ms, Card 2: 80ms, Card 3: 160ms, Card 4: 240ms
translateY: 24px -> 0, duration: 500ms, ease-out-expo
```

**Approach B (grouped entrance):**
```
All cards animate in simultaneously, as a group.
The GROUP itself is the .reveal element.
No individual card stagger — the grid block arrives as a unit.
```

Approach B is actually more common at the highest-quality sites. It treats the
feature section as a single compositional unit rather than a cascade of items.
This prevents the "loading spinner" feeling of watching cards drip in one by one.

### Pricing Cards

Pricing is high-stakes content — users are comparing. The standard approach:

```
Pricing heading: standard reveal
Cards animate in simultaneously or with minimal (40ms) stagger
The "highlighted" tier (usually center) has no special animation treatment
```

Never use dramatic stagger for pricing — users need to see all options together
to make comparisons. Sequential reveals for pricing cards actively harm conversion.

### Testimonial Carousels / Logo Grids

These typically do NOT use scroll reveals. They use:
- CSS marquee/scroll (`animation: scroll linear infinite`) — always running
- Or simple fade-in of the entire row as a unit

Individual testimonial stagger is a pattern used by mid-tier sites, not premium.

### Product Demos / UI Frames

Large product screenshots or widgets warrant the most dramatic reveal:
```
translateY(40px) scale(0.97) opacity:0 -> translateY(0) scale(1) opacity:1
Duration: 700ms – 800ms
Easing: ease-out-expo (cubic-bezier(0.16, 1, 0.3, 1))
Delay: 100ms after heading completes
```

The scale addition is justified here because the widget IS the feature — it
deserves more visual weight upon arrival.

---

## Part 14: Scroll-Linked vs. Viewport-Triggered

### Two Distinct Approaches

**Viewport-triggered (IntersectionObserver / Framer whileInView):**
- Animation fires ONCE when element enters viewport
- CSS transition handles the actual animation
- Fire-and-forget — no ongoing scroll tracking
- Used by: Linear, Vercel, Clerk, Resend, most React SaaS sites
- This is what Hirvo uses (correct for a static site)

**Scroll-linked (CSS scroll-driven, GSAP scrub):**
- Animation progress is tied directly to scroll position
- Element is "mid-animation" at a specific scroll depth
- Cinematic, requires careful design to not feel gimmicky
- Used by: Apple, Stripe product demos, Awwwards-level portfolio sites
- As of late 2024, Chrome 115+ supports CSS `animation-timeline: view()`
- NOT appropriate for content text reveals — only for hero showcase widgets

**Recommendation for Hirvo:** The viewport-triggered approach (current) is correct.
Scroll-linked animations are higher risk for a conversion page — they can make
content feel inaccessible if users scroll past quickly.

---

## Part 15: Performance Considerations

### Compositor-Only Properties (Always Safe)
- `transform: translateY()` — GPU composited
- `transform: translateX()` — GPU composited
- `transform: scale()` — GPU composited
- `opacity` — GPU composited
- `filter: blur()` — GPU composited (expensive but safe for hero only)

### Properties That Cause Layout (Never Animate)
- `width`, `height` — layout recalculation
- `top`, `left`, `bottom`, `right` — layout recalculation
- `margin`, `padding` — layout recalculation
- `font-size` — layout + paint
- `border-width` — layout + paint

### Performance Signals from Research
- Use `will-change: transform, opacity` only on elements that WILL animate
  (not globally — this wastes GPU memory)
- Never apply `will-change` to more than a handful of elements at once
- IntersectionObserver is inherently more performant than scroll event listeners
  because it's off the main thread
- CSS transitions are preferable to JS-driven animations for performance
- `requestAnimationFrame` is appropriate for complex counter/sequence animations

### Hirvo-Specific Notes
The existing `js/animations.js` uses:
- `IntersectionObserver` — correct
- `requestAnimationFrame` for counter animation — correct
- `performance.now()` for precise timing — correct
- No `will-change` declarations — this is acceptable given the simple translateY/opacity
  reveals; `will-change` would only add value if frames were actually dropping

---

## Part 16: Directives for Hirvo

Based on all research above, here are the specific recommendations mapped to
Hirvo's current implementation in `/Users/josephtian/Desktop/Hirvo/website/landing-page/`:

### What Hirvo Is Already Doing Correctly

1. **Easing tokens are correct.** `--ease: cubic-bezier(0.16,1,0.3,1)` is the
   industry-standard `ease-out-expo` used by Linear. `--ease-out: cubic-bezier(0.33,1,0.68,1)`
   is `ease-out-cubic`. Both are premium-caliber.

2. **Translate distance is correct.** `translateY(20px)` for `.reveal` is exactly
   in the 16–24px premium sweet spot. Hero entrance at `translateY(12px)` is
   even more refined.

3. **Stagger system exists.** `.d1` through `.d5` at 120ms increments is well-structured.

4. **IntersectionObserver with once-only behavior.** `io.unobserve(e.target)` after
   fire means it never re-animates. Correct.

5. **prefers-reduced-motion is handled.** The `@media(prefers-reduced-motion:reduce)`
   block in `animations.css` correctly zeroes all durations and sets `.reveal` to
   immediately visible.

6. **Compositor-only animation.** `transform` + `opacity` only. No layout properties.

### What Could Be Improved

1. **Stagger hierarchy is not content-aware.**
   Currently all `.reveal` elements use the same generic stagger classes. A badge
   (`.section-label`) should always animate before the H2 above it. The H2 should
   animate before body text. This requires a small restructure of how `.d1`–`.d5`
   classes are assigned in sections.

   Recommended: Add a semantic naming layer. Example:
   ```css
   .reveal-label  { transition-delay: 0ms }
   .reveal-h2     { transition-delay: 80ms }
   .reveal-body   { transition-delay: 180ms }
   .reveal-cards  { transition-delay: 280ms }
   .reveal-cta    { transition-delay: 360ms }
   ```
   These communicate intent rather than sequence number.

2. **Stagger increment could be tightened from 120ms to 80ms.**
   120ms increments mean the 5th element fires 600ms after the first. For a
   3-column card grid, 240ms total stagger (80ms increments) is snappier and
   more premium than 360ms total.

3. **Duration `--d3: 450ms` is appropriate but could use a split.**
   The same duration is used for both the text reveal (where 400ms would feel
   snappier) and for UI widget animations (where 600ms–700ms feels weightier).
   Consider adding a `--d3a: 400ms` and `--d3b: 600ms` or using `--d2: 280ms`
   for paragraph text and `--d3: 450ms` for cards/headings.

4. **rootMargin should be asymmetric.**
   Current: `'-60px 0px -60px 0px'` (top and bottom both -60px)
   Recommended: `'-40px 0px 0px 0px'` or `'0px 0px -40px 0px'`
   The bottom negative margin means elements near the bottom of the page may
   never reach threshold. The useful direction is top — we want elements to
   have scrolled INTO view, not be about to scroll OUT.

5. **Product widget reveals should have scale in addition to translateY.**
   For `.ui-frame` showcase widgets (recruiter, ATS, interview sections),
   adding `scale(0.97)` to the initial state creates a sense of the widget
   "materializing" with weight. This is a minor but noticeable upgrade.

   ```css
   .reveal.reveal-widget {
     transform: translateY(32px) scale(0.97);
   }
   .reveal.reveal-widget.in {
     transform: translateY(0) scale(1);
   }
   ```

6. **Consider treating feature card grids as single units rather than individual cards.**
   If a feature card grid has 6 cards each with individual `.reveal` classes,
   they will fire at different times as the user scrolls. Instead, wrap the
   entire grid in a single `.reveal` — the grid arrives as a compositional unit.
   This is more professional for pricing and feature grids.

7. **Hero entrance delay timings are slightly long.**
   `.hd4: 900ms` and `.hw2: 550ms` mean content is still arriving nearly a full
   second after page load. This is borderline. The premium threshold is 700ms
   total for the last element. Consider tightening:
   - `.hd0`: 100ms (was 150ms)
   - `.hw0`: 280ms (was 350ms)
   - `.hw1`: 380ms (was 450ms)
   - `.hw2`: 460ms (was 550ms)
   - `.hd3`: 560ms (was 700ms)
   - `.hd4`: 700ms (was 900ms)

---

## Part 17: Pattern Reference — Quick Lookup Table

| Scenario | translateY | Duration | Easing | Stagger |
|---|---|---|---|---|
| Section label/badge | 8–12px | 400ms | ease-out-expo | 0ms (first) |
| Section H2 heading | 16–20px | 500ms | ease-out-expo | 80ms |
| Body paragraph | 12–16px | 400ms | ease-out-cubic | 180ms |
| Feature card (in grid) | 20–24px | 500ms | ease-out-expo | 80ms each |
| Pricing card | 20px | 500ms | ease-out-expo | 40ms (minimal) |
| Product widget/demo | 32–40px + scale(0.97) | 700ms | ease-out-expo | 100ms after heading |
| CTA button | 8px | 350ms | ease-out-cubic | 300ms after body |
| Testimonial row | none (fade only) | 450ms | ease-out | 0ms (unit) |
| Logo/marquee row | none | instantaneous | n/a | CSS marquee |
| Hero heading (blur-dissolve) | 8–12% | 1200ms | cubic-bezier(0.25,0.1,0.25,1) | 150ms–700ms |

---

## Sources Consulted

- [Rebuilding Linear.app (GitHub)](https://github.com/frontendfyi/rebuilding-linear.app)
- [Frontend.fyi Staggered Text Animation Tutorial](https://www.frontend.fyi/tutorials/staggered-text-animations-with-framer-motion)
- [Stripe Connect Front-End Experience Blog](https://stripe.com/blog/connect-front-end-experience)
- [Josh Comeau: An Interactive Guide to CSS Transitions](https://www.joshwcomeau.com/animation/css-transitions/)
- [Builder.io: Build a Buttery Scroll Reveal with GSAP](https://www.builder.io/blog/gsap-reveal)
- [Material Design 3: Easing and Duration Tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [NN Group: Executing UX Animations — Duration and Motion Characteristics](https://www.nngroup.com/articles/animation-duration/)
- [shadcn/ui Easing Functions Reference](https://www.shadcn.io/easings)
- [Easing CSS Variables Gist (bendc)](https://gist.github.com/bendc/ac03faac0bf2aee25b49e5fd260a727d)
- [Web Animation Best Practices Gist (uxderrick)](https://gist.github.com/uxderrick/07b81ca63932865ef1a7dc94fbe07838)
- [Motion.page: Stagger Scroll Reveal Animation](https://motion.page/learn/stagger-scroll-reveal-animation/)
- [Webflow: How to Create Scroll Animations](https://www.thecssagency.com/blog/webflow-scroll-animation)
- [GSAP ScrollTrigger.batch() Staggering Cards](https://gsap.com/community/forums/topic/26539-scrolltriggerbatch-staggering-the-animation-of-cards/)
- [Scroll Animations Techniques 2025 (mroy.club)](https://mroy.club/articles/scroll-animations-techniques-and-considerations-for-2025)
- [Magic UI: CSS Animation on Scroll Guide](https://magicui.design/blog/css-animation-on-scroll)
- [Alvarotrigo.com: CSS Animations on Scroll with Examples](https://alvarotrigo.com/blog/css-animations-scroll/)
- [ScrollReveal User Experience Guide](https://scrollrevealjs.org/guide/user-experience.html)
- [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/)
- [Smashing Magazine: Respecting Users' Motion Preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/)
- [Framer Motion: inView Documentation](https://motion.dev/docs/inview)
- [Framer Motion: Scroll Animations](https://www.framer.com/motion/scroll-animations/)
