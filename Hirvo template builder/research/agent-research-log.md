# Resume Builder Research — Agent Communication Log

This file is shared between all 3 research agents. Each agent should:
1. Log findings here as they go
2. Read other agents' findings to avoid duplication and cross-reference
3. Tag entries with their agent name

---

## Agent Assignments
- **Agent 1 (Premium Builders):** Reactive Resume, FlowCV, Resume.io
- **Agent 2 (Developer/Open-Source Builders):** Resumake, JSONResume, RxResume, OpenResume
- **Agent 3 (Mass-Market Builders):** Canva Resume, Zety, Novoresume, Enhancv

---

## [Agent 1] Premium Builders — Summary (2026-03-04)

**Full report:** `research/agent-1-premium-builders.md`

### Builders Analyzed
1. **Reactive Resume** (rxresu.me) — Open-source, TanStack Start/React 19/Tailwind/PostgreSQL. 15 templates, three-panel editor (content | artboard preview | design). Rich text via Tiptap. PDF via headless Chromium. Custom CSS. Google Fonts. Dark mode. BYO OpenAI key for AI. JSON Resume schema. Self-hostable.
2. **FlowCV** (flowcv.com) — Proprietary. 50+ templates, two-panel editor. Drag sections between columns. Content import from PDF/DOCX/images. Built-in AI. ATS-friendly PDFs. Free tier: 1 resume, unlimited downloads, no watermarks. No DOCX export.
3. **Resume.io** (resume.io) — Proprietary. 30-40+ templates (city-named), step-by-step guided flow. Strongest AI (job-link-paste, voice input, content suggestions). Completeness scoring. Full career ecosystem. Aggressive pricing ($2.95 trial -> $29.95/mo). PDF/DOCX premium-only.

### Key Findings for Hirvo
- **Three-panel editor** (content | preview | design) is the gold standard — Reactive Resume does this best.
- **Real-time preview** on every keystroke is non-negotiable across all three.
- **Rich text editing** (Tiptap) is a differentiator — only Reactive Resume has it.
- **Drag sections between columns** (FlowCV) is the most intuitive layout control.
- **Server-side Chromium PDF** (Reactive Resume) = pixel-perfect output. Best quality.
- **Native AI** beats BYO-key. Resume.io's job-link-paste is the killer AI feature.
- **Content import** from PDF/DOCX (FlowCV) reduces cold-start friction.
- **Free PDF export** is expected — paywalling it generates backlash.
- **Dark mode editor** aligns with Hirvo's brand. Only Reactive Resume offers this.
- **Completeness scoring** (resume.io) gamifies the process effectively.
- **Template naming with social proof** (resume.io's city names + user counts) > abstract names.
- **Custom CSS** (Reactive Resume) is a power-user differentiator for V2.

---

## [Agent 2] Open-Source & Developer Builders — Summary (2026-03-04)

**Full report:** `research/agent-2-opensource-builders.md`

### Builders Analyzed
1. **Resumake** (latexresu.me) — React/Redux + server-side LaTeX. 9 templates, on-demand PDF generation, JSON Resume import/export. No live preview, no section reordering, no customization.
2. **JSON Resume** (jsonresume.org) — Schema standard + ecosystem. 400+ themes as npm packages. Developer-oriented (JSON editing + CLI). No polished GUI. Theme API: `render(resume) => HTML`. PDF via Puppeteer.
3. **OpenResume** (open-resume.com) — Next.js/React/Redux + client-side @react-pdf/renderer. Real-time preview, fully browser-based (zero server). Single ATS-optimized template. Section reorder via buttons. Weak multi-page.
4. **Standard Resume** (standardresume.co) — Proprietary. 12 HR-validated templates, LinkedIn import, automatic formatting, web resume with view tracking. PDF behind paywall.

### Key Findings for Hirvo
- **Best PDF approach:** @react-pdf/renderer (client-side, real-time, no server). OpenResume proves this works.
- **Best data model:** JSON Resume schema as foundation, extended with section ordering + template prefs.
- **Market gaps:** No builder has drag-and-drop section reorder, rich text descriptions, or multiple templates with client-side rendering combined. Dark-mode editor is also unexplored.
- **Template architecture:** Data model must be template-agnostic. Templates should be React components consuming a shared data interface (theme-as-component pattern from JSON Resume ecosystem).
- **Must-haves:** Real-time split panel, Letter + A4 support, JSON export, multiple templates, section reordering.
- **Avoid:** Server-side LaTeX (Resumake), single template (OpenResume), JSON-only editing (JSON Resume), paywall on PDF (Standard Resume).

---

## [Agent 3] Mass-Market Builders — Summary (2026-03-04)

**Full report:** `research/agent-3-massmarket-builders.md`

### Builders Analyzed
1. **Canva** — Freeform design canvas, 14,000+ templates, no structured forms, no ATS awareness. Best template gallery and mobile editing. Content lost on template switch.
2. **Zety** — Step-by-step wizard with split-panel form/preview. Best pre-written content suggestions by job title. Aggressive paywall (txt-only free download). Dark billing patterns.
3. **Novoresume** — Inline click-to-edit with "My Content" master resume concept. Career-level-based onboarding. 16 templates, clean output. Free plan limited to 1 page.
4. **Enhancv** — Inline drag-and-drop with best AI (ChatGPT-powered). Unique personal sections (My Time, Life Philosophy). ~20 templates. ATS checker integrated in editor. Download fully blocked on free plan.

### Key Findings for Hirvo
- **Best editor pattern:** Hybrid split-panel (structured form left, live preview right) with click-to-edit shortcut on preview. Combines Zety's structure with Enhancv's intuition.
- **Best AI approach:** Enhancv's JD analysis + Zety's job-title content library combined. AI should produce ready-to-use content, not chatbot education.
- **Best content model:** Novoresume's "My Content" master resume -- store all career data, pull per application.
- **Hirvo's unique angle:** ATS simulation + recruiter-eye-view built INTO the editor. No mass-market builder has this. Show what ATS sees, show 6-second recruiter scan heatmap.
- **Monetization:** Never paywall downloads after user invests time. Free tier: PDF download, 2-3 templates, basic AI. Premium: more templates, JD-tailored AI, ATS simulation, master resume.
- **Template gallery:** 8-15 templates at launch is fine. Categorize by style AND industry. Add "ATS-Safe" badges. Show user's real content in preview before committing.
- **Anti-patterns:** No download paywall (Zety), no career-level locks (Novoresume), no freeform canvas chaos (Canva), no full download block (Enhancv).

### Cross-Reference with Other Agents
- Agent 2 recommends @react-pdf/renderer for client-side real-time preview -- aligns with split-panel pattern all mass-market builders use
- Agent 2's JSON Resume schema recommendation works well as the data backbone for Novoresume's "My Content" master resume concept
- Agent 1's three-panel editor (Reactive Resume) could be adapted: content panel | preview panel | design/ATS panel (replacing "design" with Hirvo's ATS simulation)
- Agent 1 confirms dark-mode editor gap -- none of the 4 mass-market builders use dark theme editors either
- Agent 1's finding on Tiptap rich text (Reactive Resume) aligns with need for bullet point formatting in experience sections
- All 3 agents agree: free PDF download is table stakes, paywall on download destroys trust

---

