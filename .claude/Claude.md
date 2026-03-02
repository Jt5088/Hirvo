# CLAUDE.md

HIRVO is a static marketing landing page — no framework, no build tool, no package manager. Simulates how recruiters and ATS systems evaluate candidates and offers pre-rejection feedback.

## Reference Files
| Topic | File |
|---|---|
| File structure, CSS/JS load order, JS responsibilities | `.claude/rules/technical.md` |
| Design tokens, card depth, visual philosophy | `.claude/rules/design-rules.md` |
| Agent roster, workflow, shared log | `.claude/rules/workflow.md` |
| Full token values | `.claude/tokens.md` |
| Known remaining issues | `.claude/known-issues.md` |

---

## ⛔ Hard Restrictions — All Agents Must Follow
- **DO NOT change layout** without explicit user permission — stop and ask.
- **DO NOT change structural files** (`index.html`, file architecture, JS/CSS load order) without explicit user permission.
- **DO NOT hardcode** hex colors or timing values — always use tokens from `tokens.css`.
- **DO NOT edit `index.html` directly** — edit files in `sections/`, `styles/`, or `js/` only.
- **DO NOT add new CSS files** without permission — use existing component files.
- **DO NOT reprint full files** in output — show diffs and summaries only.
