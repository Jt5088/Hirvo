# Sync FROM tb-uiux TO template-builder

Source: `hirvo-tb-uiux/Hirvo template builder/research/`
Synced: 2026-03-05

---

## What tb-uiux found that affects our templates:

### Editor Architecture
- Three-panel editor is the gold standard: content | live preview | design/ATS panel
- Real-time preview on every keystroke is non-negotiable
- Hybrid split-panel: structured form left, live preview right, click-to-edit on preview
- Dark mode editor aligns with Hirvo brand

### PDF/Rendering
- Best approach: @react-pdf/renderer (client-side, real-time, no server needed)
- OpenResume proves client-side PDF works for resumes
- Templates should be React components consuming a shared data interface
- Must support Letter + A4 paper sizes

### Data Model
- JSON Resume schema as foundation, extended with section ordering + template prefs
- "Master resume" concept: store ALL career data, pull per application
- Template must be data-agnostic — same data renders in any template

### Template System Requirements
- 8-15 templates at launch is the right range (we have 8 — perfect)
- Categorize by STYLE and INDUSTRY
- Add "ATS-Safe" badges
- Show user's real content in preview before committing to a template
- Template naming with social proof > abstract names

### AI Integration
- JD analysis + job-title content library
- AI should produce ready-to-use content, not chatbot
- ATS simulation + recruiter-eye-view built INTO editor (Hirvo's unique angle)

### Monetization (affects template availability)
- Free tier: PDF download, 2-3 templates, basic AI
- Premium: more templates, JD-tailored AI, ATS simulation, master resume
- NEVER paywall downloads after user invests time

---

## Action Items for Template Team

1. **CSS custom properties are correct approach** — the builder UI will drive these vars
2. **Need to add template metadata** to each template:
   - `name` (display name for gallery)
   - `category` (Classic, Modern, Elegant, etc.)
   - `industries` (Tech, Finance, Consulting, Creative, etc.)
   - `ats-score` (Excellent, Good, Moderate)
   - `density` (Dense, Standard, Spacious)
3. **Variable content handling** — templates need to gracefully handle:
   - 1 job vs 5 jobs
   - With/without summary
   - With/without skills section
   - 1-page vs 2-page overflow
4. **Consider React component conversion** — current HTML templates will need to become React components that accept props
5. **Two paper sizes** — add A4 variant of @page rules (210mm x 297mm)
