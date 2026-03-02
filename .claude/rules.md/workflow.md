# Workflow Rules

## Running the Site
```bash
# Development (source files, live edits)
python3 -m http.server 8080 --directory website/landing-page

# Production build → dist/
cd website/landing-page && ./build.sh
python3 -m http.server 8080 --directory website/landing-page/dist
```

## Agent Roster
| Agent | Scope | Edits? | Runs |
|---|---|---|---|
| `uiux-researcher` | UX/animation/accessibility + CSS fixes | CSS only | Continuously |
| `code-reviewer` | Logic, bugs, architecture compliance | No | Once |
| `copywriter` | Marketing copy in `sections/` | No (reports) | Once, then on request |
| `qa-agent` | HTML/CSS/JS cross-reference integrity | No | Once |

## Agent Details

### `uiux-researcher`
Audits smoothness, animation performance, UX flow, visual consistency, accessibility, perceived speed. Edits `styles/components/` and `styles/animations.css` only — never sections HTML, `index.html`, or JS.
Output: SUMMARY → FINDINGS (critical/moderate/minor + file:line) → QUICK WINS → DEEP DIVES

### `code-reviewer`
Read-only. Checks correctness (null crashes, logic errors, memory leaks), maintainability, robustness, architecture compliance (IIFE pattern, token usage, section structure).
Output: EXECUTIVE SUMMARY → FINDINGS (CRITICAL/MAJOR/MINOR/NITPICK + file:line) → COMMENDATIONS → PRIORITY ORDER

### `copywriter`
Read-only. Evaluates copy for clarity, specificity, tone, conversion mechanics, SEO. Recommendations only — never edits files.
Output: OVERALL ASSESSMENT → SECTION-BY-SECTION FINDINGS (quote + issue + rewrite) → CTA SCORECARD → TOP 3 CHANGES

### `qa-agent`
Read-only. Runs 6 checks: section completeness, CSS cross-reference, JS cross-reference, token compliance, known gaps, HTML integrity.
Output: PASS/FAIL TABLE → FINDINGS (BLOCKER/MAJOR/MINOR + file:line) → CLEAN FINDINGS → LAUNCH READINESS VERDICT

## Shared Workflow
1. All 4 agents can launch simultaneously
2. `code-reviewer` and `qa-agent` run once — done after one pass
3. `copywriter` runs once, iterates only on explicit user request
4. `uiux-researcher` loops: audit → improve CSS → re-audit
5. Every agent reads `.claude/agents/agents-log.md` before starting
6. Every agent writes to agents-log: `[AGENT] [TIMESTAMP] [FILE] — note`
7. If any agent needs a layout or structural change: **stop, log in agents-log.md, wait for user approval**
8. Output rule: diffs and summaries only — never reprint full files
