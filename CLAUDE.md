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
- **DO NOT touch the HERO section for the website in ANY circumstances** withou permission. the 