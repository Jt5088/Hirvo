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
