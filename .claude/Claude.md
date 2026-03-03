# CLAUDE.md

HIRVO is a static marketing landing page — no framework, no build tool, no package manager. Simulates how recruiters and ATS systems evaluate candidates and offers pre-rejection feedback.

## Reference Files
| Topic | File |
|---|---|
| File structure, CSS/JS load order, JS responsibilities | `.claude/rules.md/architecture.md` |
| Technical rules & conventions | `.claude/rules.md/technical.md` |
| Design tokens, card depth, visual philosophy | `.claude/rules.md/design-rules.md` |
| Agent roster, workflow, shared log | `.claude/rules.md/agents-guide.md` |
| Full token values | `.claude/rules.md/tokens.md` |
| Style guide | `.claude/rules.md/style.md` |
| Workflow & process | `.claude/rules.md/workflow.md` |
| Known remaining issues | `.claude/known-issues.md` |

---

## ⛔ Hard Restrictions — All Agents Must Follow
- **DO NOT change layout** without explicit user permission — stop and ask.
- **DO NOT change structural files** (`index.html`, file architecture, JS/CSS load order) without explicit user permission.
- **DO NOT hardcode** hex colors or timing values — always use tokens from `tokens.css`.
- **DO NOT edit `index.html` directly** — edit files in `sections/`, `styles/`, or `js/` only.
- **DO NOT add new CSS files** without permission — use existing component files.
- **DO NOT reprint full files** in output — show diffs and summaries only.
- **DO NOT touch the HERO section for the website in ANY circumstances** without permission.

---

## Animation Documentation — All Agents Must Follow
When creating or modifying any animated component, **document every animated part** in a structured breakdown so other agents can quickly understand and work with it. Write the breakdown as a comment block at the top of the relevant CSS or JS file, or in the agents log.

**Required format:**
```
ANIMATED COMPONENT: [Section/Component Name]
├── Part 1: [element/class] — [what animates] — [trigger] — [duration/easing token]
├── Part 2: [element/class] — [what animates] — [trigger] — [duration/easing token]
└── Part N: ...
Dependencies: [any JS files, observers, or tokens involved]
```

**Example:**
```
ANIMATED COMPONENT: Orbital Timeline
├── Part 1: .orb-node — opacity + scale entrance — IntersectionObserver — 0.6s var(--ease-out)
├── Part 2: .circuit-orb — offset-path loop — always-on — 3s linear infinite
├── Part 3: .connector-line — stroke-dashoffset draw — .active class toggle — 0.4s var(--ease-out)
└── Part 4: .orb-ring — rotation — rAF loop — continuous 0.15°/frame
Dependencies: orbital-timeline.js (IIFE, rAF + IntersectionObserver), tokens.css (--ease-out)
```

**Rules:**
- Every agent that adds or changes an animation must update the breakdown.
- If an animation breakdown doesn't exist for a component you're editing, create one.
- Keep breakdowns in sync — stale docs are worse than no docs.