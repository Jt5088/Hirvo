# Agents Guide
Quick reference for the four Claude subagents in `.claude/agents/`. Each has a narrow, non-overlapping scope.

## Agent Roster
| Agent | Scope | Can Edit Files? | Runs |
|---|---|---|---|
| `uiux-researcher` | UX/animation/accessibility audits + CSS fixes | Yes (CSS only) | Continuously |
| `code-reviewer` | Logic, bugs, architecture compliance | No | Once per session |
| `copywriter` | Marketing copy in `sections/` | No (reports only) | Once, then on request |
| `qa-agent` | Cross-reference integrity (HTML/CSS/JS) | No | Once per session |

---

## `uiux-researcher`
**Tools:** Read, Glob, Grep, WebSearch, WebFetch, Edit, Write, Bash, Skill

Audits interaction smoothness, animation performance, UX flow, visual consistency, accessibility, and perceived speed. Can edit `styles/components/` and `styles/animations.css` only — never sections HTML, `index.html`, or JS.

**Output:** SUMMARY → FINDINGS (critical/moderate/minor + file:line) → QUICK WINS → DEEP DIVES

---

## `code-reviewer`
**Tools:** Read, Glob, Grep — read-only, never writes.

Checks correctness (null crashes, logic errors, memory leaks), maintainability, robustness, and architecture compliance (IIFE pattern, token usage, section structure).

**Output:** EXECUTIVE SUMMARY → FINDINGS (CRITICAL/MAJOR/MINOR/NITPICK + file:line) → COMMENDATIONS → PRIORITY ORDER

---

## `copywriter`
**Tools:** Read, Glob, Grep, WebSearch — read-only, never writes.

Evaluates copy for clarity, specificity, tone, conversion mechanics, and SEO. Produces recommendations only — never edits files.

**Output:** OVERALL ASSESSMENT → SECTION-BY-SECTION FINDINGS (quote + issue + rewrite) → HEADLINE & CTA SCORECARD → TOP 3 CHANGES

---

## `qa-agent`
**Tools:** Read, Glob, Grep — read-only, never writes.

Runs 6 checks: section completeness, CSS cross-reference, JS cross-reference, token compliance, known gaps, HTML integrity.

**Output:** PASS/FAIL SUMMARY TABLE → DETAILED FINDINGS (BLOCKER/MAJOR/MINOR + file:line) → CLEAN FINDINGS → LAUNCH READINESS VERDICT

---

## Shared Workflow
1. Start server: `python3 -m http.server 8080 --directory website/landing-page`
2. All 4 agents can run simultaneously
3. `code-reviewer` and `qa-agent` run once and are done
4. `copywriter` runs once, iterates only on explicit request
5. `uiux-researcher` loops: audit → improve CSS → re-audit
6. Every agent reads `.claude/agents/agents-log.md` before starting — log format: `[AGENT] [TIMESTAMP] [FILE] — note`
7. If any agent needs a layout or structural change: **stop, log in agents-log.md, wait for user approval**

## Constraints All Agents Share
- Never hardcode hex colors or timing values
- Never edit `index.html` directly
- Never add new CSS files without permission
- Never reprint full files — diffs and summaries only
- Never change layout or structure without permission

## Animation Documentation — Required
When creating or modifying any animated component, **document every animated part** so other agents can quickly understand and work with it.

**Format (place at top of relevant CSS/JS file or in agents-log):**
```
ANIMATED COMPONENT: [Section/Component Name]
├── Part 1: [element/class] — [what animates] — [trigger] — [duration/easing token]
├── Part 2: [element/class] — [what animates] — [trigger] — [duration/easing token]
└── Part N: ...
Dependencies: [JS files, observers, or tokens involved]
```

- Every agent that adds or changes an animation must update the breakdown.
- If a breakdown doesn't exist for a component you're editing, create one.
- Keep breakdowns in sync — stale docs are worse than no docs.

## Light Diffusion Quality Gate — Required
Every agent that creates, modifies, or audits any glow, shadow, or light effect **must** check against these rules. Full research: `_reference/light-diffusion-research.md`.

### Physics Rules (Non-Negotiable)
1. **No 2-stop radial gradients for light.** A bare `radial-gradient(color 0%, transparent 100%)` is linear falloff — real light follows inverse-square / Gaussian curves. Use **5+ stops** with scrim-curve alpha distribution (see reference doc §4).
2. **Layered shadows, not single-layer.** A single `box-shadow: 0 0 40px rgba()` is a uniform halo. Use **4–6 layers** with exponentially increasing blur (1px → 2 → 4 → 8 → 16 → 32).
3. **Additive blend mode on light elements.** Any element representing light must use `mix-blend-mode: screen` or `plus-lighter` — never `normal` (which occludes instead of adding).
4. **Glow extends beyond card boundary.** Light scatters into surrounding space. Glow pseudo-elements should use `inset: -40px` to `-80px` to create ambient spill.
5. **Fresnel: edges brighter than faces.** Card top edges should carry more highlight than card centers. Use `inset 0 1px 0 var(--highlight)` or gradient borders that fade from bright-top to dim-bottom.

### Gradient Stop Distribution (Scrim Curve)
When building any radial or linear gradient for light, multiply your peak alpha by these coefficients at these positions:
```
0% → 1.000,  19% → 0.738,  34% → 0.541,  47% → 0.382,
56.5% → 0.278,  65% → 0.194,  73% → 0.126,  80% → 0.075,
86% → 0.042,  91% → 0.021,  95% → 0.008,  100% → 0.000
```
Example: peak alpha `0.14` → `0.14, 0.103, 0.076, 0.053, 0.039, 0.027, 0.018, 0.010, 0.006, 0.003, 0`

### Anti-Patterns to Flag
| Bad | Why | Fix |
|---|---|---|
| `radial-gradient(color 0%, transparent 100%)` | Linear falloff, visible edge ring | Add 4+ intermediate scrim-curve stops |
| Single `box-shadow` with large blur | Uniform halo, no depth | Layer 4–6 shadows with doubling blur |
| `mix-blend-mode: normal` on glow | Occludes instead of adding light | Use `screen` or `plus-lighter` |
| Animating `filter: blur()` | Quadratic paint cost | Animate `opacity` on pre-rendered blur element |
| Animating `width`/`height` of glow | Triggers layout | Animate `transform: scale()` instead |
| `will-change` on 10+ elements | Exhausts GPU memory | Apply only during active animation |
| `backdrop-filter` on scrolling elements | Repaints every frame | Static sections only |
| Equal-interval gradient stops | Banding on dark backgrounds | Use scrim-curve spacing |

### Token Alignment for Glow Colors
| Intent | Token | RGBA |
|---|---|---|
| Neutral warm light | `--t1` | `rgba(237,237,236, 0.04–0.12)` |
| Ambient fill | `--icon-glow` | `rgba(237,237,236, 0.05)` |
| Green status | `--green` | `rgba(52,211,153, 0.08–0.18)` |
| Surface highlight | `--highlight` | `rgba(255,255,255, 0.08)` |
| CTA glow | `--cta-glow` | `rgba(255,255,255, 0.06)` |

Never introduce new glow colors. Never use `--acc` (purple) for glow — it's for focus outlines only.
