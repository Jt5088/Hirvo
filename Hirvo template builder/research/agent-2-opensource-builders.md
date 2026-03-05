# Open-Source & Developer-Focused Resume Builder Analysis

**Agent:** UIUX Research Agent
**Date:** 2026-03-04
**Scope:** Resumake, JSON Resume, OpenResume, Standard Resume

---

## Table of Contents

1. [Resumake (resumake.io / latexresu.me)](#1-resumake)
2. [JSON Resume (jsonresume.org)](#2-json-resume)
3. [OpenResume (open-resume.com)](#3-openresume)
4. [Standard Resume (standardresume.co)](#4-standard-resume)
5. [Cross-Builder Comparison Matrix](#5-comparison-matrix)
6. [Key Takeaways for Hirvo](#6-key-takeaways)

---

## 1. Resumake

**URL:** https://latexresu.me (live) / https://resumake.io
**GitHub:** https://github.com/saadq/resumake.io
**License:** MIT
**Status:** v2 stable (on `v2-(old)` branch), v3 rewrite in progress on `main`

### 1.1 Overall Layout & Architecture

- **Two-panel SPA:** Form editor on the left, PDF preview on the right.
- **Navigation:** Sidenav with section labels (Profile, Education, Experience, Skills, Projects, Awards). Users click to jump between sections.
- **Progress bar** at bottom tracks completion across sections.
- **Single-page application** built as a React/Redux app.

**Tech Stack (v2):**
- Frontend: React, Redux, redux-form, styled-components, react-pdf
- Backend: Node.js, Koa, Express
- PDF Generation: Server-side PDFLaTeX compilation
- Type safety: Flow
- Language split: 61.3% TeX, 38.6% TypeScript

### 1.2 Form UX

**Section structure:**
- Profile (name, contact info)
- Education (institution, degree, dates, GPA)
- Work Experience (company, title, dates, description)
- Skills (categories with keywords)
- Projects (name, description, technologies, links)
- Awards (title, date, awarder, summary)

**Dynamic lists:** Add/remove buttons for each entry within a section. No drag-and-drop reordering in v2 (requested as GitHub issue #6 but never implemented). Section reordering also not available.

**Experience description:** Plain text input. The LaTeX template handles formatting into bullet points based on line breaks.

**Field grouping:** Fields are grouped logically per entry (e.g., all fields for one job together). Standard vertical form layout with labels above inputs.

**Notable limitation:** No custom sections (requested as issue #97, not implemented).

### 1.3 Live Preview System

- **On-demand generation**, not live-updating. User presses "Make" button to trigger PDF generation.
- **Server-side rendering:** Form data is sent to Koa backend, which runs PDFLaTeX to compile a PDF, then returns the binary.
- **Preview:** react-pdf renders the returned PDF in the right panel.
- **No page break handling** in the UI -- relies entirely on LaTeX's built-in pagination.
- **Multi-page:** Supported natively by LaTeX.
- **No zoom controls** in the preview panel.

### 1.4 Template & Customization

- **9 LaTeX templates** from community contributors (Rensselaer, Byungjin Park, Scott Clark, etc.)
- **Template switching:** Users can swap templates at any time without data loss. Data model is template-agnostic.
- **No color/font customization** -- templates have fixed visual styles defined in TeX.
- **No layout customization** (column count, section order).

### 1.5 Data Model

- Form state managed by redux-form.
- **Export formats:** PDF, raw TeX source code, JSON (JSONResume-compatible).
- **Import:** JSON Resume format can be imported to populate forms.
- **Server sanitization:** Middleware strips null/undefined/empty values, escapes LaTeX special characters.

### 1.6 Technical Implementation

**PDF Generation Pipeline:**
1. Client submits sanitized form data via POST to `/api/generate`
2. Server middleware sanitizes + escapes LaTeX chars
3. Generator selects template, populates TeX document with data
4. `pdflatex` child process compiles TeX to PDF
5. PDF binary returned to client
6. react-pdf renders it in browser

**Key architectural pattern:** Feature-based folder structure (`features/form`, `features/preview`, `features/progress`) rather than layer-based.

### 1.7 Pros & Cons

**Pros:**
- LaTeX output produces exceptionally clean, typographically precise PDFs
- JSONResume import/export for data portability
- Server-side LaTeX = reliable multi-page support and professional typography
- Template-agnostic data model allows easy template switching
- MIT licensed, well-documented architecture

**Cons:**
- Requires LaTeX installation on server (heavy dependency)
- Not live-updating -- must click "Make" each time
- No section reordering or drag-and-drop
- No custom sections
- No color/font/layout customization
- v2 uses redux-form (deprecated library) and Flow (declining ecosystem)
- v3 rewrite has been in progress for years with unclear timeline

---

## 2. JSON Resume

**URL:** https://jsonresume.org
**Registry:** https://registry.jsonresume.org
**GitHub:** https://github.com/jsonresume
**License:** MIT
**Schema Version:** 1.0.0 (stable since 2014)

### 2.1 Overall Architecture

JSON Resume is not a single application but an **ecosystem/standard**:
- **Schema:** A JSON specification for resume data
- **CLI (resumed):** Command-line tool to render and validate
- **Registry:** Hosted platform for publishing resumes from GitHub Gists
- **Themes:** 50+ official + 400+ npm packages that render JSON to HTML
- **Community tools:** Editors, converters, validators, parsers

The Registry provides a basic web editor at `registry.jsonresume.org`, but the primary workflow is **developer-oriented**: edit a `resume.json` file, choose a theme, render via CLI.

### 2.2 The Schema (Data Model) -- Complete

```json
{
  "basics": {
    "name": "string",
    "label": "string (professional title)",
    "image": "string (URL)",
    "email": "string",
    "phone": "string",
    "url": "string",
    "summary": "string",
    "location": {
      "address": "string",
      "postalCode": "string",
      "city": "string",
      "countryCode": "string",
      "region": "string"
    },
    "profiles": [{
      "network": "string",
      "username": "string",
      "url": "string"
    }]
  },
  "work": [{
    "name": "string (company)",
    "position": "string",
    "url": "string",
    "startDate": "string (ISO 8601)",
    "endDate": "string (ISO 8601)",
    "summary": "string",
    "highlights": ["string"]
  }],
  "volunteer": [{
    "organization": "string",
    "position": "string",
    "url": "string",
    "startDate": "string",
    "endDate": "string",
    "summary": "string",
    "highlights": ["string"]
  }],
  "education": [{
    "institution": "string",
    "url": "string",
    "area": "string (field of study)",
    "studyType": "string (degree type)",
    "startDate": "string",
    "endDate": "string",
    "score": "string (GPA)",
    "courses": ["string"]
  }],
  "awards": [{
    "title": "string",
    "date": "string",
    "awarder": "string",
    "summary": "string"
  }],
  "certificates": [{
    "name": "string",
    "date": "string",
    "issuer": "string",
    "url": "string"
  }],
  "publications": [{
    "name": "string",
    "publisher": "string",
    "releaseDate": "string",
    "url": "string",
    "summary": "string"
  }],
  "skills": [{
    "name": "string (category)",
    "level": "string (proficiency)",
    "keywords": ["string"]
  }],
  "languages": [{
    "language": "string",
    "fluency": "string"
  }],
  "interests": [{
    "name": "string",
    "keywords": ["string"]
  }],
  "references": [{
    "name": "string",
    "reference": "string"
  }],
  "projects": [{
    "name": "string",
    "startDate": "string",
    "endDate": "string",
    "description": "string",
    "highlights": ["string"],
    "url": "string"
  }]
}
```

**Key schema notes:**
- All fields are optional (no required fields in the spec)
- Dates use ISO 8601 format (YYYY-MM-DD)
- `highlights` arrays (in work, volunteer, projects) represent bullet point achievements
- Skills use a category + keywords pattern (e.g., name: "Web Development", keywords: ["HTML", "CSS", "JavaScript"])
- 12 top-level sections total

### 2.3 Form UX (Registry Editor)

The Registry editor is primarily a **JSON text editor** with some form-like features:
- GitHub Gist integration (store resume.json in a Gist, edit there)
- AI-powered suggestions for content improvement
- Theme preview via URL query parameter (`?theme=professional`)
- No traditional form-based UI -- it is designed for developers comfortable with JSON

**Third-party GUI editors exist** but are not part of the core ecosystem:
- `resume-editor` (GitHub: erming/resume-editor)
- Various community-built React/Vue form editors
- Reactive Resume has JSON Resume import/export

### 2.4 Theme System (Technical Deep Dive)

**Theme API:**
Each theme is an npm package exporting a `render()` function:
```javascript
// jsonresume-theme-example/index.js
export function render(resume) {
  // resume = parsed JSON Resume object
  return '<html>...</html>'; // Returns complete HTML string
}
```

**Theme naming convention:** `jsonresume-theme-{name}`

**Rendering engines used by themes:**
- Handlebars (most common in older themes)
- Vanilla JS string concatenation
- React/JSX transpiled to HTML
- Nunjucks, EJS, Pug

**Serverless constraint:** Themes must be serverless-compatible for the registry. Cannot use `fs.readFileSync()`, `__dirname`, or runtime file loading. Must use ES6 imports and build-time bundling.

**CSS handling:**
```javascript
import css from './style.css?inline';
export function render(resume) {
  return `<style>${css}</style><div>...</div>`;
}
```

**Print optimization required:**
```css
@media print {
  body { color: #000; background: #fff; }
  .section { page-break-inside: avoid; }
  @page { margin: 1cm; size: A4; }
}
```

**PDF export options:**
Themes can export `pdfRenderOptions` with properties: `format`, `mediaType`, `pdfViewport`, `margin`.

### 2.5 CLI Workflow

```bash
# Install
npm install -g resumed

# Validate schema compliance
resumed validate resume.json

# Render to HTML
resumed render resume.json --theme jsonresume-theme-even --output resume.html

# Render to PDF (requires puppeteer)
npm install puppeteer
resumed render resume.json --theme jsonresume-theme-even --type pdf --output resume.pdf

# Alternative PDF via headless Chrome
resumed render resume.json --theme even | wkhtmltopdf - resume.pdf
```

**Programmatic API:**
```javascript
import { render } from 'resumed';
import * as theme from 'jsonresume-theme-even';
const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));
const html = await render(resume, theme);
```

### 2.6 Pros & Cons

**Pros:**
- Industry-standard schema adopted by many tools and platforms
- Massive theme ecosystem (400+ npm packages)
- Complete separation of data from presentation
- Portable -- resume.json works across all tools in the ecosystem
- Schema is simple, well-documented, and stable
- GitHub Gist integration for developer workflow
- Themes can be React-based with Tailwind -- modern rendering

**Cons:**
- No polished GUI editor in the core ecosystem
- Developer-oriented workflow (editing JSON directly)
- Schema hasn't evolved much since v1.0.0 (2014) -- missing modern fields
- No standardized way to handle custom sections
- PDF generation relies on external tools (puppeteer, wkhtmltopdf)
- Theme quality varies wildly across the 400+ options
- Registry editor is bare-bones compared to commercial builders
- No built-in mechanism for section ordering within the schema

---

## 3. OpenResume

**URL:** https://open-resume.com
**GitHub:** https://github.com/xitanggg/open-resume
**License:** AGPL-3.0
**Stars:** 7k+

### 3.1 Overall Layout & Architecture

- **Two-panel SPA:** Form on the left (50%), live PDF preview on the right (50%).
- **Single-page application** with 4 routes: Home, Resume Import, Resume Builder, Resume Parser.
- **No multi-step wizard** -- all form sections visible in a scrollable left panel.
- **Entirely client-side** -- no backend, no sign-up, no data leaves the browser.

**Tech Stack:**
- Next.js 13 (SSG)
- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- react-pdf (@react-pdf/renderer) for PDF generation
- PDF.js for PDF parsing/import

**Layout implementation:**
```jsx
<main className="relative h-full w-full overflow-hidden bg-gray-50">
  <div className="grid grid-cols-3 md:grid-cols-6">
    {/* Left: ResumeForm (col-span-3) */}
    {/* Right: Resume preview (col-span-3) */}
  </div>
</main>
```

### 3.2 Form UX -- Section by Section

**Profile/Header:**
- Name, Objective, Email, Phone, Website, Location
- Option to hide individual fields

**Work Experience:**
- Each entry: Company, Job Title, Date, Description
- Controls per entry: Move Up, Move Down, Delete
- "Add Job" button for new entries
- Description field supports bullet point toggle

**Education:**
- Each entry: School, Date, Degree & Major, GPA, Additional Info
- Same Move Up/Move Down/Delete controls
- Option to hide bullet points

**Projects:**
- Project Name, Date, Description
- Standard reordering and deletion

**Skills:**
- Skills List (comma-separated or tag-based)
- Featured Skills with proficiency level circles (visual indicator)
- Skills are optional

**Custom Textbox:**
- Free-form section for additional content
- Bullet point toggle

**Section-level controls:**
- Move Up / Move Down entire sections
- Hide Section toggle
- This is how section reordering works (not drag-and-drop, but button-based)

### 3.3 Live Preview System

- **Real-time updating** -- PDF refreshes instantly as user types.
- **Technology:** @react-pdf/renderer creates PDF directly in the browser using React components.
- **Single template** -- the app has one ATS-optimized design.
- **Document size:** Supports both Letter and A4.
- **Known limitation:** Multi-page preview was incomplete at launch. The web editor struggled to display pages 2, 3, etc. Page break handling was basic -- text near page bottoms could split awkwardly.
- **Target audience:** Students and early-career professionals (1-page resumes).

### 3.4 Template & Customization

**Resume Settings panel offers:**
- Theme Color picker (accent color selection)
- Font Family choices (multiple options)
- Font Size: Compact, Standard, Large
- Document Size: Letter or A4

**No template selection** -- intentionally offers only one template design. The philosophy is to provide one ATS-optimized design that follows U.S. best practices rather than offering many templates with varying quality.

**No column layout options.** Single-column only.

### 3.5 Data Model

Redux Toolkit manages the resume state centrally. The data model maps closely to the form sections:

```typescript
interface ResumeState {
  profile: {
    name: string;
    objective: string;
    email: string;
    phone: string;
    website: string;
    location: string;
  };
  workExperiences: Array<{
    company: string;
    jobTitle: string;
    date: string;
    descriptions: string[];
  }>;
  educations: Array<{
    school: string;
    degree: string;
    date: string;
    gpa: string;
    descriptions: string[];
  }>;
  projects: Array<{
    project: string;
    date: string;
    descriptions: string[];
  }>;
  skills: {
    descriptions: string[];
    featuredSkills: Array<{
      skill: string;
      rating: number;
    }>;
  };
  custom: {
    descriptions: string[];
  };
}
```

**Import:** PDF import via PDF.js parsing (extracts text, algorithmically identifies sections). Works inconsistently -- two-column layouts and LinkedIn PDFs cause issues.

**Export:** PDF download only. No JSON or other data export format.

### 3.6 Technical Implementation

**PDF Generation:**
- @react-pdf/renderer creates PDFs entirely client-side
- React components define the PDF layout using a special set of primitives (Document, Page, View, Text, etc.)
- CSS-like styling via JavaScript objects (Flexbox layout)
- Real-time: same React state drives both the form and the PDF renderer
- No server required

**Resume Parser:**
1. PDF.js extracts raw text from uploaded PDF
2. `parseResumeFromPdf` utility uses vertical grouping logic to identify sections
3. Parsed data populates Redux store
4. Limitations: fails on two-column layouts, inconsistent with non-standard formats

### 3.7 Pros & Cons

**Pros:**
- Truly client-side -- zero privacy concerns, no account needed
- Real-time preview is excellent UX
- ATS-optimized design based on U.S. best practices
- Clean React + Redux Toolkit architecture
- Section reordering via Move Up/Move Down buttons
- Resume parser is a unique differentiator
- Docker support for self-hosting
- Font size, color, and document size customization

**Cons:**
- Only one template -- no template variety
- Multi-page support is weak
- No drag-and-drop reordering
- No JSON/data export (only PDF)
- Resume parser struggles with non-standard formats
- No rich text editor for descriptions (basic bullet toggle only)
- AGPL-3.0 license is restrictive for commercial use
- Firefox bullet point input bug reported
- No section for certificates, languages, publications, volunteer work

---

## 4. Standard Resume

**URL:** https://standardresume.co
**License:** Proprietary (not open source)
**Founded by:** Riley Tomasek, Sari Maani, Sinan Maani (ex-Dropbox)

### 4.1 Overall Layout & Architecture

- **Form-based editor** with real-time preview (specifics of panel layout not publicly documented).
- **Multi-step flow:** Import (LinkedIn) -> Select Template -> Edit Content -> Export.
- **Account-based SPA** -- requires sign-up to use the full editor.
- **Not open source** -- analysis based on public pages, reviews, and feature descriptions.

**Tech Stack (inferred):**
- React (buildId references in source)
- Next.js (server rendering)
- Fonts: Inter (variable, 100-900), IBM Plex Mono (300, 500)
- Analytics: Mixpanel, Google Analytics, Hotjar
- Images: Cloudinary CDN

### 4.2 Form UX

**Sections available:**
- Contact information
- Professional summary
- Work experience (with bullet points)
- Education (including GPA, certifications, awards)
- Skills
- Custom sections: Projects, Patents, Publications, References, Hobbies, Internships, Volunteering

**LinkedIn Import:** One-click import that pulls work history and education from LinkedIn profile. Does not require LinkedIn account access (likely uses profile URL scraping or OAuth).

**Experience descriptions:** Bullet point format (not rich text or markdown).

**Key differentiator:** "Automatic formatting" -- the system handles margins, font sizes, and spacing automatically. Users never manually adjust layout.

### 4.3 Live Preview System

- **Real-time updating** -- preview changes as content is edited or template is switched.
- **Automatic formatting engine** handles layout adjustments dynamically.
- **Web resume** -- generates a shareable web URL in addition to PDF.
- **PDF download** requires Pro subscription.

### 4.4 Template & Customization

- **12 templates** designed with hiring managers from Slack, Apple, Capsule, Uber.
- Template categories: Creative, Modern, Professional, Simple.
- **Template switching** preserves data -- users can change templates without re-entering information.
- Supports functional, combination, and chronological (reverse-chronological) formats.
- **No custom CSS or advanced layout controls** -- customization is template-level only.

### 4.5 Data Model

Not publicly documented. Based on features:
- Standard resume sections (basics, work, education, skills)
- Custom sections (projects, publications, patents, references, hobbies, internships, volunteering)
- LinkedIn profile data mapping
- Multiple resume management (create separate versions per job application)

### 4.6 Technical Implementation

- **PDF generation:** Server-side (behind paywall for Pro users).
- **Web resume:** Server-rendered HTML with a unique URL per user.
- **Analytics:** Web resume view tracking tells users who viewed their resume.
- **Design validation:** Templates reviewed by hiring managers from top tech companies.

### 4.7 Pros & Cons

**Pros:**
- Excellent design quality -- 5.0/5 Product Hunt rating, Awwwards recognition
- Hiring-manager-validated templates (not just aesthetically pretty)
- LinkedIn import saves significant time
- Automatic formatting removes layout headaches
- Web resume with view tracking is innovative
- Multiple resume management for different applications
- Custom sections for patents, publications, etc.
- Clean, professional aesthetic

**Cons:**
- Not open source -- cannot self-host or modify
- PDF download requires paid subscription (freemium model)
- Limited customization beyond template selection
- No data export in JSON or other portable formats
- Proprietary data model -- vendor lock-in risk
- Account required -- no privacy-first option
- No resume parsing/import from existing PDFs

---

## 5. Comparison Matrix

| Feature | Resumake | JSON Resume | OpenResume | Standard Resume |
|---|---|---|---|---|
| **Open Source** | MIT | MIT | AGPL-3.0 | No |
| **Tech Stack** | React/Redux/Koa/LaTeX | Node.js CLI + themes | Next.js/React/Redux | React/Next.js |
| **Live Preview** | No (on-demand) | N/A (CLI-based) | Yes (real-time) | Yes (real-time) |
| **PDF Generation** | Server-side LaTeX | Puppeteer/wkhtmltopdf | Client-side react-pdf | Server-side |
| **Templates** | 9 LaTeX | 400+ themes | 1 (ATS-optimized) | 12 |
| **Template Switching** | Yes | Yes (theme swap) | N/A | Yes |
| **Section Reorder** | No | No (schema order) | Yes (buttons) | Unknown |
| **Drag & Drop** | No | No | No | Unknown |
| **Custom Sections** | No | No (schema-fixed) | 1 custom textbox | Yes (7+ types) |
| **Color Customization** | No | Theme-dependent | Yes | Template-level |
| **Font Customization** | No | Theme-dependent | Yes | Template-level |
| **Document Size** | LaTeX default | Theme-dependent | Letter + A4 | Unknown |
| **Data Export** | PDF, TeX, JSON | JSON (native) | PDF only | PDF, Web URL |
| **Data Import** | JSON Resume | JSON (native) | PDF parsing | LinkedIn |
| **Account Required** | No | GitHub (for registry) | No | Yes |
| **Privacy** | Server processes data | Gist is public | 100% client-side | Account-based |
| **Rich Text Editor** | No | No | No (bullet toggle) | No (bullets) |
| **Multi-page** | Yes (LaTeX) | Theme-dependent | Weak | Yes |
| **ATS Optimized** | Template-dependent | Theme-dependent | Yes (intentional) | Yes (HR-validated) |

---

## 6. Key Takeaways for Hirvo

### What to Adopt

1. **Client-side PDF generation (from OpenResume).** react-pdf / @react-pdf/renderer enables real-time preview without a server. This is the gold standard for UX -- users see changes instantly. No server dependency, no LaTeX installation, full privacy.

2. **JSON Resume schema as the data model foundation.** The schema is battle-tested, widely adopted, and covers all standard resume sections. Hirvo should use it as a base and extend it with additional fields (e.g., section ordering, template preferences, custom sections). This gives instant compatibility with 400+ themes and community tools.

3. **Real-time split-panel layout (from OpenResume + Standard Resume).** Two-panel layout with form on the left and live PDF preview on the right is the established pattern. Every successful builder uses this.

4. **Section reordering (OpenResume's approach, improved).** OpenResume uses Move Up/Move Down buttons. Hirvo should implement proper drag-and-drop (which none of these builders have done well). This is a clear gap in the market.

5. **Multiple templates with data-agnostic switching (from Resumake + Standard Resume).** Data model should be completely separate from template rendering. Users should be able to switch templates without re-entering data.

6. **Automatic formatting (from Standard Resume).** The system should handle margins, spacing, and font sizing automatically based on content length. Users should never fight with layout.

7. **Document size options (from OpenResume).** Support both US Letter and A4 from day one.

### What to Avoid

1. **Server-side LaTeX dependency (Resumake).** Too heavy, too fragile, and eliminates client-side privacy benefits.

2. **Single template (OpenResume).** Users want variety. One template is too limiting even if it is ATS-optimized.

3. **JSON-only editing (JSON Resume registry).** Developers might tolerate it, but most users need a form-based UI.

4. **On-demand preview (Resumake).** Real-time preview is now table stakes. "Click to generate" feels dated.

5. **Weak multi-page support (OpenResume).** Must handle page breaks gracefully from day one.

6. **No data export (OpenResume).** Always offer JSON export. Lock-in is a dealbreaker for power users.

7. **Paywall on PDF export (Standard Resume).** If Hirvo is free/open-source, PDF export must be free.

### Gaps in the Market (Opportunities for Hirvo)

1. **No builder has proper drag-and-drop section reordering.** This is the most-requested feature across all open-source builders.

2. **No builder offers a rich text / markdown editor for descriptions.** All use plain text or basic bullet toggles. A lightweight rich text editor (bold, italic, links, bullet points) would be a major differentiator.

3. **No builder combines multiple templates with client-side rendering.** Resumake has templates but uses server-side LaTeX. OpenResume is client-side but has one template. The combination of both is the sweet spot.

4. **No open-source builder has LinkedIn import.** Standard Resume has it but is proprietary. This could be a differentiator.

5. **ATS scoring/analysis integrated into the builder.** OpenResume has a separate parser page. Integrating real-time ATS feedback into the editing experience would be unique.

6. **Dark-mode editor UI.** Every builder uses a light/white editor. A dark-themed editor matching Hirvo's brand would stand out visually and reduce eye strain for extended editing sessions.

### Recommended Architecture for Hirvo

```
Data Layer:    JSON Resume schema (extended) stored in browser localStorage + optional cloud sync
State:         Redux Toolkit or Zustand for reactive state management
Form:          React Hook Form or custom form components (NOT redux-form)
PDF Engine:    @react-pdf/renderer for client-side PDF generation
Preview:       Real-time split panel (form left, PDF right)
Templates:     React components that consume the data model (theme-as-component pattern)
Export:        PDF (client-side), JSON Resume format, optionally HTML
Import:        JSON Resume, PDF parsing (PDF.js), optionally LinkedIn
Hosting:       Static site (Next.js SSG) -- no server needed for core functionality
```

### PDF Generation Approach Decision

| Approach | Pros | Cons | Used By |
|---|---|---|---|
| **@react-pdf/renderer** | Client-side, real-time, React native, no server | Limited CSS support, custom primitives | OpenResume |
| **Puppeteer/headless Chrome** | Full CSS support, accurate rendering | Requires server, slower | JSON Resume |
| **PDFLaTeX** | Best typography, reliable pagination | Heavy dependency, server-only | Resumake |
| **html2canvas + jsPDF** | Client-side, uses actual HTML/CSS | Lower quality, rasterized text | Various |
| **Print-to-PDF (browser)** | Zero dependency, native CSS | User-initiated, no API control | Manual |

**Recommendation:** Start with @react-pdf/renderer for real-time preview + client-side generation. Consider adding a server-side Puppeteer option later for higher-fidelity PDF output from HTML/CSS templates.

---

*Research completed 2026-03-04 by UIUX Research Agent*
