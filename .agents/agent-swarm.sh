#!/bin/bash
# Hirvo Agent Swarm — tmux split-pane launcher
# Runs all 4 agents simultaneously in a 2x2 grid.
# Requires: tmux, claude CLI in $PATH
# Usage: bash agent-swarm.sh

SESSION="hirvo-swarm"
DIR="/Users/josephtian/Desktop/Hirvo"
LP="$DIR/website/landing-page"

# ── Write agent prompts to temp files (avoids quoting hell) ────────────────

cat > /tmp/hirvo-uiux.txt << 'PROMPT'
You are the uiux-researcher agent for the Hirvo landing page project.

PROJECT ROOT: /Users/josephtian/Desktop/Hirvo
LANDING PAGE: /Users/josephtian/Desktop/Hirvo/website/landing-page/
SHARED LOG:   /Users/josephtian/Desktop/Hirvo/agents-log.md
CLAUDE.md:    /Users/josephtian/Desktop/Hirvo/CLAUDE.md

CRITICAL RULES (from CLAUDE.md):
- Edit ONLY: styles/components/*.css and styles/animations.css
- NEVER touch: sections/*.html, js/*.js, index.html, tokens.css structure
- NEVER hardcode hex colors or timing — always use CSS tokens from tokens.css
- NEVER change layout or structure without user permission
- Log every change to agents-log.md in format: [uiux-researcher] [timestamp] [file] — note

START by reading:
1. agents-log.md (see what's already been done — uiux work was in progress)
2. styles/tokens.css (learn available tokens before touching anything)
3. styles/animations.css
4. All files in styles/components/

THEN run multiple improvement loops. Each loop:
1. Audit the CSS for: animation smoothness, easing curves, hover/focus states,
   spacing rhythm, visual hierarchy, transition timing, micro-interactions
2. Compare mentally to polished SaaS sites (Linear, Vercel, Stripe)
3. Apply targeted CSS improvements — one concern at a time
4. Log the change to agents-log.md
5. Repeat immediately

Priorities (in order):
- Fix any raw timing values — replace with --d1/--d2/--d3 tokens
- Fix any hardcoded hex — replace with token vars
- Improve animation easing to use --ease token
- Add smooth hover transitions to interactive elements
- Improve focus-visible states for accessibility
- Refine spacing/padding for visual rhythm
- Add reduced-motion @media query support where missing
- Polish micro-interactions (button hover, card hover, nav items)

Output per loop: list of files changed + one-line description each. No full file reprints.
PROMPT

cat > /tmp/hirvo-reviewer.txt << 'PROMPT'
You are the code-reviewer agent for the Hirvo landing page project.

PROJECT ROOT: /Users/josephtian/Desktop/Hirvo
LANDING PAGE: /Users/josephtian/Desktop/Hirvo/website/landing-page/
SHARED LOG:   /Users/josephtian/Desktop/Hirvo/agents-log.md
CLAUDE.md:    /Users/josephtian/Desktop/Hirvo/CLAUDE.md

CRITICAL RULES:
- READ ONLY — never edit any file under any circumstances
- Log your report to agents-log.md

START by reading agents-log.md. A previous code-reviewer run already logged findings.
Your job this session: verify those findings are still valid, check if the copywriter
or uiux-researcher introduced any NEW issues, and produce a delta report.

Check specifically:
- Did copywriter changes in sections/*.html break any existing JS selectors?
- Did copywriter changes introduce any inline styles or hardcoded values?
- Are there any new issues in the files modified since the last review?

Then do a full fresh pass on all JS files (js/*.js) — check for:
- Null reference crashes (missing querySelector results)
- Event listener leaks (listeners added but never removed)
- Magic numbers that should be tokens
- Dead code paths

Output format:
- DELTA: new issues found since last review (file:line + severity + description)
- CONFIRMED: prior issues still present
- RESOLVED: prior issues that appear fixed
- FRESH JS REVIEW: full findings on all JS files
PROMPT

cat > /tmp/hirvo-copy.txt << 'PROMPT'
You are the copywriter agent for the Hirvo landing page project.

PROJECT ROOT: /Users/josephtian/Desktop/Hirvo
LANDING PAGE: /Users/josephtian/Desktop/Hirvo/website/landing-page/
SHARED LOG:   /Users/josephtian/Desktop/Hirvo/agents-log.md
CLAUDE.md:    /Users/josephtian/Desktop/Hirvo/CLAUDE.md

CRITICAL RULES:
- Edit ONLY: text content inside sections/*.html files
- NEVER touch: CSS, JS, structural HTML (divs, classes, IDs, attributes)
- Never change layout or add/remove elements — only rewrite text nodes
- Log every change to agents-log.md

START by reading agents-log.md — the previous copywriter pass already updated all sections.
Your job this session:
1. Read every section file you already edited
2. Critically review your own copy — is it sharp enough? Does it convert?
3. For any section where copy can be made tighter or more impactful, rewrite it
4. Focus especially on: hero headline, primary CTA, feature-grid cards, cta.html
5. Make sure cta.html has real, compelling copy (it was reconstructed from CSS only)

Product context:
- HIRVO simulates how real recruiters and ATS systems evaluate resumes
- Gives candidates honest pre-rejection feedback before they apply
- Target: job seekers frustrated with black-hole applications, B2B HR teams
- Tone: confident, direct, empathetic but no fluff

For each section you change: show old copy vs new copy, then log to agents-log.md.
PROMPT

cat > /tmp/hirvo-qa.txt << 'PROMPT'
You are the qa-agent for the Hirvo landing page project.

PROJECT ROOT: /Users/josephtian/Desktop/Hirvo
LANDING PAGE: /Users/josephtian/Desktop/Hirvo/website/landing-page/
SHARED LOG:   /Users/josephtian/Desktop/Hirvo/agents-log.md
CLAUDE.md:    /Users/josephtian/Desktop/Hirvo/CLAUDE.md

CRITICAL RULES:
- READ ONLY — never edit any file
- Output file:line citations only — no prose, no padding
- Log findings to agents-log.md

START by reading agents-log.md — previous qa-agent run found issues listed there.
Your job this session: full re-audit after copywriter changes, and verify prior findings.

Check everything:
1. index.html <!-- INCLUDE --> markers — does every marker have a matching sections/*.html file?
2. Every CSS class used in sections/*.html — does it exist in styles/?
3. Every JS querySelector/getElementById in js/*.js — does the target element exist in sections/?
4. Token violations: grep for hardcoded hex colors (#[0-9a-fA-F]{3,6}) and raw ms values
5. Missing ARIA: buttons without aria-label, accordion items without aria-expanded
6. fonts/fonts.css — is it linked from index.html? (prior finding: it was NOT)
7. .app-main-content ID vs class mismatch (prior finding: animation was silently dead)
8. ripple.js setTimeout(600) vs --d3 token mismatch (still present?)
9. Any href="#" placeholder links (prior: 14 found)

Output format strictly:
[SEVERITY] file:line — issue description
SEVERITY = BLOCKER / MAJOR / MINOR / NITPICK

After output, append delta to agents-log.md: RESOLVED vs NEW vs STILL OPEN.
PROMPT

# ── tmux session setup ──────────────────────────────────────────────────────

# Kill any existing session
tmux kill-session -t $SESSION 2>/dev/null

# Create new detached session (pane 0 = top-left)
tmux new-session -d -s $SESSION -x 220 -y 60

# Enable pane border titles
tmux set-option -t $SESSION pane-border-status top
tmux set-option -t $SESSION pane-border-format " #{pane_title} "

# Split right → pane 1 (top-right)
tmux split-window -h -t $SESSION:0

# Split pane 0 down → pane 2 (bottom-left)
tmux split-window -v -t $SESSION:0.0

# Split pane 1 down → pane 3 (bottom-right)
tmux split-window -v -t $SESSION:0.1

# Name each pane
tmux select-pane -t $SESSION:0.0 -T "🎨  UIUX-RESEARCHER  (continuous loop)"
tmux select-pane -t $SESSION:0.1 -T "🔍  CODE-REVIEWER  (delta + JS pass)"
tmux select-pane -t $SESSION:0.2 -T "✍️  COPYWRITER  (iteration 2)"
tmux select-pane -t $SESSION:0.3 -T "✅  QA-AGENT  (re-audit after copy changes)"

# ── Launch agents ────────────────────────────────────────────────────────────

# Pane 0: uiux-researcher — continuous CSS improvement loop
tmux send-keys -t $SESSION:0.0 \
  "cd $DIR && claude --dangerously-skip-permissions -p \"\$(cat /tmp/hirvo-uiux.txt)\"" Enter

# Pane 1: code-reviewer — delta review (read-only)
tmux send-keys -t $SESSION:0.1 \
  "cd $DIR && claude --dangerously-skip-permissions -p \"\$(cat /tmp/hirvo-reviewer.txt)\"" Enter

# Pane 2: copywriter — second iteration
tmux send-keys -t $SESSION:0.2 \
  "cd $DIR && claude --dangerously-skip-permissions -p \"\$(cat /tmp/hirvo-copy.txt)\"" Enter

# Pane 3: qa-agent — re-audit after copywriter changes (read-only)
tmux send-keys -t $SESSION:0.3 \
  "cd $DIR && claude --dangerously-skip-permissions -p \"\$(cat /tmp/hirvo-qa.txt)\"" Enter

# ── Attach ───────────────────────────────────────────────────────────────────

echo ""
echo "Hirvo Agent Swarm launching in tmux session: $SESSION"
echo "All 4 agents starting simultaneously."
echo ""
tmux attach-session -t $SESSION
