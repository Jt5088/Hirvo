# Researcher 1 Findings: Classic, Professional, and Executive Resume Templates

Focus areas: CLASSIC, PROFESSIONAL, EXECUTIVE template designs
Research date: 2026-03-04

---

## Template 1: Jake's Resume (LaTeX)

**Source:** GitHub (jakegut/resume), Overleaf
**Style category:** Classic / Technical Professional
**Popularity:** The de facto standard for software engineering resumes. Thousands of forks.

### Layout Structure
- **Single-column**, full-width, no sidebar
- Centered header (name + contact info on one line separated by pipes `|`)
- Sections: Education, Experience, Projects, Technical Skills
- Reverse chronological within each section
- Content width: 97% of text width (via `tabular*{0.97\textwidth}`)

### Typography (Exact from Source Code)
- **Document class:** `letterpaper, 11pt`
- **Font:** Computer Modern (LaTeX default) -- a serif font with high readability
- **Name:** `\Huge \scshape` (approx 24.88pt in LaTeX, small caps)
- **Contact info:** `\small` (approx 9pt)
- **Section headings:** `\large \scshape` (approx 14.4pt, small caps, uppercase)
- **Subheading primary (company/school):** `\textbf` at normal size (11pt bold)
- **Subheading secondary (role/degree):** `\textit{\small}` (approx 9pt italic)
- **Dates:** `\textit{\small}` right-aligned (approx 9pt italic)
- **Bullet items:** `\small` (approx 9pt)

### Spacing Analysis (Exact from Source Code)
- **Page margins:**
  - Left/Right: 0.5in (default 1in minus 0.5in adjustment)
  - Top: ~0.5in (default 1in minus 0.5in adjustment)
  - Bottom: ~0.5in (textheight extended by 1.0in)
- **Section title:** -4pt vspace before, horizontal rule below, -5pt vspace after rule
- **Between subheadings:** -2pt vspace before each `\resumeSubheading`
- **After subheading content:** -7pt vspace (very tight)
- **Between bullet items:** -2pt vspace after each `\resumeItem`
- **After bullet list ends:** -5pt vspace
- **Sub-items:** additional -4pt vspace
- **List left margin:** 0.15in (subheading list), default for bullet items
- **Tab column sep:** 0in (no extra table padding)

### Visual Elements
- **Section dividers:** Full-width horizontal rule (`\titlerule`) below each section heading
- **Bullet style:** Small centered bullet (`\tiny$\bullet$`) for second-level items
- **No icons, no colors, no graphics** -- pure black text on white
- **Links:** Underlined (hyperref package)

### ATS Compatibility
- Excellent: Single column, no tables for layout (uses tabular only for date alignment), `\pdfgentounicode=1` ensures machine readability, standard section headings, no images/graphics

### What Makes It Good
- **Density without clutter:** The aggressive negative vspace values (-2pt, -4pt, -5pt, -7pt) pack enormous content into one page while maintaining scanability
- **Clear hierarchy:** Bold company > italic role > small bullets creates instant visual parsing
- **Right-aligned dates** via `\extracolsep{\fill}` create a clean left-right reading pattern
- **Small caps section headings** with full-width rule are distinctive yet conservative
- **The 0.97 text width** for content creates a subtle inner margin that prevents text from feeling edge-to-edge

---

## Template 2: Deedy Resume (LaTeX)

**Source:** GitHub (deedy/Deedy-Resume), Overleaf
**Style category:** Professional / Modern Technical
**Popularity:** Extremely popular for CS/tech applicants, especially undergrads

### Layout Structure
- **Two asymmetric columns:** 1/3 left + 2/3 right
- Left column: Education, Skills, Links, Coursework
- Right column: Experience, Research, Projects, Awards
- Name at top spanning both columns
- No traditional header block -- name is the header

### Typography
- **Fonts:** Lato (body/sans-serif) + Raleway (headings) -- OpenFonts version
- **Name:** Very large, Raleway bold
- **Section headings:** Uppercase, Lato bold, with colored underline accent
- **Subsection titles:** Bold, slightly larger than body
- **Body text:** Lato regular, approximately 9-10pt
- **Dates/locations:** Right-aligned, italic, smaller weight
- Compiled with XeLaTeX for OpenType font support

### Spacing Analysis
- **Page margins:** Very tight -- approximately 0.4-0.5in all sides
- **Column gap:** Minimal (defined by minipage widths)
- **Left column width:** ~33% of text width
- **Right column width:** ~66% of text width
- **Section gap:** Compact, driven by custom section commands
- **Line spacing:** Tight (approximately 1.0-1.1x)
- **Between entries:** Minimal vertical space

### Visual Elements
- **Section dividers:** Colored partial underlines below section headings (not full-width)
- **Color accent:** Subtle color on section rules and links (default blue/teal options)
- **Bullet points:** Standard small bullets
- **No icons, no images** (except optional photo variant)
- Clean separation between columns via whitespace

### ATS Compatibility
- Moderate: The two-column layout uses minipages which some ATS may struggle to parse linearly. The XeLaTeX compilation and custom fonts could cause issues with some parsers. However, the text content itself is well-structured.

### What Makes It Good
- **Asymmetric columns** create visual interest while keeping content organized
- **Dual-font pairing** (Lato + Raleway) creates sophisticated typographic hierarchy
- **Colored section rules** add just enough personality without being distracting
- **Maximum information density** for a one-page resume
- **Clean separation** of "quick-scan" info (left) from "deep-read" info (right)

---

## Template 3: Harvard Bullet Point Resume

**Source:** Harvard FAS Mignone Center for Career Success
**Style category:** Classic / Traditional Professional
**Popularity:** Standard at Harvard and widely adopted across Ivy League career services

### Layout Structure
- **Single column**, full-width
- Header: Name centered, contact info below (phone, email, LinkedIn)
- Section order: Education first (Ivy League emphasis), then Experience, Activities/Leadership, Skills
- Reverse chronological
- Heavy use of bullet points for all entries

### Typography
- **Font:** Times New Roman or similar serif (traditional academic)
- **Name:** 14-18pt, bold, centered
- **Section headings:** 12pt, bold, ALL CAPS
- **Company/Role line:** 11pt, bold for company, italic for role
- **Dates:** 11pt, right-aligned
- **Body/Bullets:** 10.5-11pt, regular weight
- **Line height:** 1.0-1.15 (tight but readable)

### Spacing Analysis
- **Page margins:** 0.5-0.75in all sides (tighter than standard to fit content)
- **Section gap:** ~12-16pt between sections
- **Between entries within section:** ~6-8pt
- **Bullet point gap:** ~2-4pt between bullets
- **After section heading:** Thin horizontal rule, ~4pt gap before first entry
- **Indent for bullets:** ~0.25in from left margin

### Visual Elements
- **Section dividers:** Full-width thin horizontal lines below section headings
- **No color** -- entirely black and white
- **No icons, no graphics**
- **Minimal formatting:** Bold, italic, and underline only
- Extremely clean, no-nonsense appearance

### ATS Compatibility
- Excellent: Single column, standard fonts, no tables, no graphics, standard section headings (Education, Experience, Skills), simple formatting only

### What Makes It Good
- **Institutional credibility** -- the Harvard brand carries weight and the template reflects that authority
- **Education-first layout** makes sense for early-career professionals
- **Full-width horizontal rules** create clear visual breaks without wasting space
- **Conservative typography** (serif + tight spacing) signals professionalism in traditional industries (finance, consulting, law)
- **Extremely high content density** while remaining readable
- **Zero distractions** -- every pixel serves the content

---

## Template 4: Resume.io "London" Template

**Source:** Resume.io (100,000+ users)
**Style category:** Classic Professional
**Popularity:** One of Resume.io's most popular templates, used across industries

### Layout Structure
- **Single column with structured header**
- Header block: Name (large), job title below, contact details in a row
- Optional profile summary paragraph
- Sections: Employment History, Education, Skills (with visual bars), Languages
- Clean separation between header and body

### Typography
- **Font family:** Clean sans-serif (likely Inter, Roboto, or system sans-serif depending on export)
- **Name:** ~20-24pt, bold, prominent
- **Job title in header:** ~12-14pt, regular or medium weight
- **Section headings:** ~12-14pt, bold, uppercase or sentence case
- **Company/Role:** ~11pt, bold for role, regular for company (or vice versa)
- **Body text:** 10-11pt, regular
- **Contact info:** ~9-10pt, with subtle icons

### Spacing Analysis
- **Page margins:** ~0.6-0.8in (Resume.io recommends no more than 0.25in deviation from their defaults)
- **Header padding:** Generous top/bottom padding (~20-30pt)
- **Section gap:** ~16-20pt between major sections
- **Entry gap:** ~8-12pt between employment entries
- **Bullet gap:** ~3-5pt between bullet points
- **Line height:** ~1.3-1.4 for body text (more generous than LaTeX templates)
- **Skills section:** Visual bar indicators for skill levels

### Visual Elements
- **Section dividers:** Subtle lines or spacing-based separation
- **Small icons** next to contact info (phone, email, location, LinkedIn)
- **Skill level bars:** Horizontal bars showing proficiency
- **Monochrome** by default, with optional accent color
- **Clean header block** visually distinct from body

### ATS Compatibility
- Good: Single column, standard section headings, PDF export. However, skill level bars may not be parsed by ATS. The visual elements are kept minimal enough for reliable parsing.

### What Makes It Good
- **Professional polish without being boring** -- the structured header and clean typography feel premium
- **Generous line height** (1.3-1.4) makes it significantly more readable than LaTeX templates on screens
- **Clear visual hierarchy** from header through sections
- **Flexible structure** works for 3-year professionals and 15-year veterans alike
- **The header design** -- name + title + contacts in a cohesive block -- is the template's signature move

---

## Template 5: FlowCV "McKinsey" / "Corporate" Template

**Source:** FlowCV (free, no watermark)
**Style category:** Executive / Corporate Professional
**Popularity:** Growing rapidly due to free access and consulting-industry targeting

### Layout Structure
- **Single column**, full-width
- Header: Name left-aligned or centered, contact info in row
- Optional professional summary
- Sections: Experience, Education, Skills, Certifications
- Clean, corporate aesthetic

### Typography
- **Font options:** Sans-serif (likely Lato, Inter, or Montserrat) or serif options available
- **Name:** ~22-28pt, bold or semi-bold
- **Section headings:** ~13-15pt, bold, often uppercase with subtle letter-spacing
- **Role/Company:** ~11-12pt, bold for role
- **Body text:** 10-11pt, regular
- **Dates:** ~10pt, right-aligned, lighter weight or color

### Spacing Analysis
- **Page margins:** ~0.7-1.0in (standard, not cramped)
- **Section gap:** ~18-24pt (generous, executive-level breathing room)
- **Entry gap:** ~10-14pt between job entries
- **Bullet gap:** ~4-6pt
- **Line height:** ~1.4-1.5 for body text
- **After section heading:** ~8-10pt before first entry
- **Header bottom margin:** ~24-30pt (substantial separation from content)

### Visual Elements
- **Section dividers:** Thin horizontal lines or generous whitespace
- **Minimal to no color** -- black, dark gray, and white
- **No icons** (or very minimal)
- **No skill bars or visual ratings**
- Clean borders or subtle background on header area in some variants

### ATS Compatibility
- Excellent: Single column, no visual gimmicks, standard fonts and headings, clean PDF output, no tables or complex formatting

### What Makes It Good
- **Executive-level whitespace** -- the generous spacing signals seniority and confidence (you don't need to cram)
- **Consulting-industry aesthetic** -- clean, structured, authoritative
- **Typography-driven hierarchy** rather than visual elements -- this is how premium templates should work
- **The generous line height** (1.4-1.5) is excellent for readability
- **No visual gimmicks** -- no skill bars, no progress circles, no icons cluttering the layout
- **Works for C-suite** -- the breathing room and clean typography project gravitas

---

## Cross-Template Comparison: Key Measurements

| Property | Jake's Resume | Deedy | Harvard | Resume.io London | FlowCV Corporate |
|---|---|---|---|---|---|
| **Layout** | Single col | 2-col asymmetric | Single col | Single col | Single col |
| **Body font size** | ~9pt | ~9-10pt | 10.5-11pt | 10-11pt | 10-11pt |
| **Name size** | ~25pt | ~28-32pt | 14-18pt | 20-24pt | 22-28pt |
| **Section heading** | ~14.4pt SC | ~12pt UC | 12pt UC Bold | 12-14pt Bold | 13-15pt UC |
| **Margins** | 0.5in | 0.4-0.5in | 0.5-0.75in | 0.6-0.8in | 0.7-1.0in |
| **Line height** | ~1.0 | ~1.0-1.1 | 1.0-1.15 | 1.3-1.4 | 1.4-1.5 |
| **Section gap** | ~8-10pt | ~6-8pt | 12-16pt | 16-20pt | 18-24pt |
| **Bullet gap** | ~2pt | ~2-3pt | 2-4pt | 3-5pt | 4-6pt |
| **Color** | None | Accent | None | Optional | None/minimal |
| **Dividers** | Full rule | Colored partial | Full rule | Subtle line | Thin line/space |
| **ATS score** | Excellent | Moderate | Excellent | Good | Excellent |

### Key Observations

1. **Density spectrum:** Jake's (most dense) -> Deedy -> Harvard -> London -> Corporate (most spacious)
2. **Line height is the biggest differentiator** between "cramped tech" templates (1.0-1.1) and "executive" templates (1.4-1.5)
3. **Margins correlate with seniority** -- entry-level templates use 0.5in, executive templates use 0.7-1.0in
4. **The best templates avoid visual gimmicks** -- no skill bars, no progress circles, no colored sidebars
5. **Section dividers matter** -- full-width horizontal rules (Jake's, Harvard) create the strongest visual hierarchy
6. **Single-column dominates** for ATS reliability. Two-column is a calculated risk.

---

## General Best Practices Observed Across All Templates

### Font Size Standards
- **Name:** 18-28pt (larger = more executive)
- **Section headings:** 12-16pt (bold or caps)
- **Body text:** 10-12pt (11pt is the sweet spot)
- **Minimum readable:** Never below 9pt

### Spacing Standards
- **Margins:** 0.5in minimum, 1.0in maximum. 0.7in is the modern sweet spot.
- **Line spacing:** 1.0-1.15 for dense/tech, 1.3-1.5 for executive/readable
- **Section gaps:** 12-24pt depending on density needs
- **Bullet gaps:** 2-6pt
- **Between entries:** 6-14pt

### Typography Hierarchy (3 Levels Minimum)
1. **Level 1:** Name (largest, boldest)
2. **Level 2:** Section headings (caps, bold, or small caps + rule)
3. **Level 3:** Entry title/company (bold at body size)
4. **Level 4:** Body/bullets (regular weight)
5. **Level 5:** Dates/metadata (italic or lighter, often right-aligned)

### ATS Must-Haves
- Standard section headings (Education, Experience, Skills)
- Single-column preferred (two-column can work if well-structured)
- No images, no headers/footers containing critical info
- PDF or DOCX output
- Machine-readable fonts (no decorative/display fonts for body)
- `pdfgentounicode` or equivalent for LaTeX

---

## Sources

- [Jake's Resume - GitHub](https://github.com/jakegut/resume)
- [Jake's Resume - Overleaf](https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs)
- [Deedy Resume - GitHub](https://github.com/deedy/Deedy-Resume)
- [Harvard Bullet Point Resume Template](https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/)
- [Resume.io Templates](https://resume.io/resume-templates)
- [Resume.io ATS Templates](https://resume.io/resume-templates/ats)
- [FlowCV Templates](https://flowcv.com/resume-templates)
- [FlowCV McKinsey Template](https://flowcv.com/resume-template/professional-classic-sans-serif-template)
- [Novoresume ATS Templates](https://novoresume.com/career-blog/ats-friendly-resume-templates)
- [Zety Resume Design](https://zety.com/blog/resume-design)
- [Enhancv Templates](https://enhancv.com/resume-templates/)
- [Resume Spacing Best Practices - Teal](https://www.tealhq.com/post/resume-line-spacing)
- [Resume Margins - Indeed](https://www.indeed.com/career-advice/resumes-cover-letters/guide-to-resume-margins)
- [Resume Fonts - Microsoft](https://word.cloud.microsoft/create/en/blog/best-resume-fonts/)
- [Resume Margins - Zety](https://zety.com/blog/resume-margins)

---

# Round 2 Findings: Additional Classic & Professional Templates

Research date: 2026-03-04 (Round 2)
Focus: University career center templates, finance-industry standard, widely-accessible classic designs

---

## Template 6: Wharton MBA Resume Template

**Source:** Wharton School of Business, Career Management Office (official template distributed to all MBA students)
**Style category:** Institutional / Business Professional
**Popularity:** Used by every Wharton MBA student (800+ per class); widely imitated across top MBA programs. The Wharton resume book format has become a de facto standard in finance, consulting, and corporate recruiting.

### Layout Structure
- **Single column**, full-width
- Header: Name centered at top, contact info (phone, email, LinkedIn) on one line below
- **Section order:** Education (Wharton first), Experience, Additional Information
- Only 3 main sections -- deliberately minimal section count
- Reverse chronological within each section
- "Additional Information" is a catch-all for skills, languages, interests, certifications

### Typography
- **Font:** Times New Roman or Garamond (both approved; Times New Roman is the safe default)
- **Name:** 14-16pt, bold, centered
- **Section headings:** 11-12pt, BOLD, ALL CAPS (e.g., "EDUCATION", "EXPERIENCE", "ADDITIONAL INFORMATION")
- **Company/School name:** 11pt, bold, left-aligned
- **Role/Degree:** 11pt, italic
- **Dates:** 11pt, right-aligned (same line as company/role)
- **Location:** 11pt, right-aligned (below or next to dates)
- **Bullet text:** 10-11pt, regular weight
- **Line height:** 1.0-1.15 (tight, maximizes content)

### Spacing Analysis
- **Page margins:** 0.5-0.75in all sides (Wharton guidelines specify "reasonable margin" with 1in suggested, but most students use tighter margins to fit content)
- **Section gap:** ~10-14pt between major sections
- **Section heading to first entry:** ~4-6pt (tight)
- **Between entries within a section:** ~6-8pt
- **Bullet point gap:** ~2-3pt between bullets
- **After last bullet before next entry:** ~6-8pt
- **Header to first section:** ~10-12pt
- **Bullet indent:** ~0.25in from left margin
- **Date alignment:** Right-aligned using tabs, creating a clean left-right axis

### Visual Elements
- **Section dividers:** Full-width thin horizontal line below each section heading (consistent with Harvard style)
- **No color whatsoever** -- purely black text on white
- **No icons, no graphics, no skill bars**
- **Formatting limited to:** bold, italic, and horizontal rules
- Extremely austere, authoritative appearance
- Company and date on same line using left-right tab stops

### ATS Compatibility
- Excellent: Single column, standard serif font, no tables for layout, standard section headings, no images/graphics, clean PDF or DOCX output. The "Additional Information" section is the only non-standard heading, but ATS systems widely recognize it.

### What Makes It Good
- **Three-section simplicity:** By collapsing Skills, Activities, Interests, Languages into one "Additional Information" section, the template forces brevity and eliminates section clutter. Recruiters scanning 200+ resumes per day appreciate fewer visual breaks.
- **Institutional uniformity:** When every Wharton MBA uses the same format, recruiters can compare candidates purely on content. The template removes design as a variable.
- **Finance/consulting standard:** This format (or near-identical variants) is what Goldman Sachs, McKinsey, and Bain recruiters expect to see. Deviating from it signals unfamiliarity with industry norms.
- **Date-location right-alignment pattern:** Company (left, bold) + Dates (right, regular) on one line; Role (left, italic) + Location (right, regular) on the next line. This four-corner layout is the most scannable format for employment entries.
- **The "Additional Information" section** is strategically powerful -- it's where personality shows through in an otherwise uniform format (interests, languages, hobbies become conversation starters in interviews).

---

## Template 7: Wall Street Oasis / Mergers & Inquisitions Investment Banking Resume

**Source:** Wall Street Oasis (WSO) official template + Mergers & Inquisitions (M&I) template. These two are the dominant resume templates in finance recruiting, used by thousands of analysts and associates.
**Style category:** Finance Industry Standard
**Popularity:** WSO template is the most downloaded finance resume template globally. M&I template is the go-to for investment banking applicants. Combined, they've been used by 100,000+ candidates.

### Layout Structure
- **Single column**, full-width
- **Header:** Centered name (larger font), contact info on one line below (address, phone, email)
- **Section order:** Education first (for undergrads/MBA), then Work & Leadership Experience, then Skills/Activities/Interests
- Alternatively for experienced hires: Experience first, Education second
- Strictly one page -- this is a hard rule in banking
- No summary/objective section (explicitly forbidden in banking)

### Typography
- **Font:** Times New Roman (most common), Garamond (preferred by some for elegance), or Cambria. Sans-serif fonts are generally avoided in banking resumes.
- **Name:** 14-16pt, bold, centered
- **Section headings:** 11-12pt, BOLD, sometimes ALL CAPS, with full-width rule underneath
- **Company/Bank name:** 10.5-11pt, bold, left-aligned
- **Role title:** 10.5-11pt, italic (same line or line below company)
- **Dates:** 10.5-11pt, right-aligned using tab stops
- **Location:** 10.5-11pt, right-aligned (often on same line as dates or on role line)
- **Bullet text:** 10-10.5pt, regular weight
- **Line height:** 1.0-1.1 (very tight -- banking resumes maximize density)

### Spacing Analysis
- **Page margins:** 0.5-0.75in (M&I recommends minimum 0.5in, preferably 0.75in)
- **Section gap:** ~8-12pt between major sections
- **Section heading to first entry:** ~4-6pt
- **Between entries within a section:** ~6-8pt
- **Bullet point gap:** ~2-3pt (very tight)
- **Bullet indent:** ~0.2-0.25in
- **Header to first section:** ~8-10pt
- **Maximum bullet lines per entry:** 2-4 bullets, each max 2 lines
- **Date-location alignment:** Right-aligned tabs, creating consistent right margin for temporal data

### Visual Elements
- **Section dividers:** Full-width thin horizontal rules below section headings
- **No color** -- entirely black and white (M&I explicitly warns: "Different colors are a bad idea. Finance is still a conservative industry.")
- **No icons, no graphics, no skill bars, no photos**
- **No decorative elements:** "Don't include stars or symbols"
- **Bullet style:** Standard round bullets
- **Emphasis:** Bold for company names, italic for roles/degrees, regular for descriptions

### ATS Compatibility
- Excellent: The template is specifically designed for finance ATS systems (Taleo, Workday, iCIMS). Single column, standard fonts, no tables, no graphics, standard section headings, clean export to PDF/DOCX. The WSO template explicitly accounts for ATS parsing.

### What Makes It Good
- **Industry-mandated format:** In investment banking, using this format (or near-identical) is not optional -- it's expected. Bankers reviewing resumes at 2 AM after a 16-hour day need instant parsability. Any deviation slows them down and counts against the candidate.
- **The summary sentence + bullet pattern:** Each work entry starts with a one-line summary of the role, followed by 2-3 specific deal/project bullets. This is unique to finance and extremely effective: the summary gives context, the bullets give proof.
- **Quantification density:** The template is designed to showcase numbers. Every bullet is structured as "action + specific detail + result with numbers." This is baked into the template's spacing -- tight bullet gaps allow more quantified achievements per page.
- **Right-aligned tab system:** The WSO template uses Word's right-aligned tab stops (not tables) for date/location alignment. This is the most ATS-safe method for creating the left-company/right-date layout.
- **One-page discipline:** The template's tight spacing (10pt body, 1.0 line height, 0.5in margins) is calibrated to fit 2-3 education entries + 3-4 work entries + skills on exactly one page. "Font size reduction is better than margin reduction" is the guiding principle.
- **The "Skills, Activities & Interests" section:** Unique to banking -- this section includes personal interests (marathon running, chess, cooking) which serve as interview icebreakers in a culture where "fit" matters as much as qualifications.

---

## Template 8: Google Docs "Serif" Built-In Template

**Source:** Google Docs built-in template gallery (available to all Google Docs users globally)
**Style category:** Classic Professional / Traditional
**Popularity:** One of the 5 built-in Google Docs resume templates, accessible to billions of users. Widely used by job seekers who want a professional look without installing software or paying for a service.

### Layout Structure
- **Two-column layout** (the only two-column template in Google Docs' built-in collection)
- **Left column (~30%):** Skills, Languages, Awards/Accomplishments
- **Right column (~70%):** Experience, Education, Projects
- **Header:** Full-width, name large at top, contact info below
- 6 pre-built sections (Experience, Education, Projects, Skills, Awards, Languages) -- more than most templates
- Uses Google Docs table structure for columns (which has ATS implications)

### Typography
- **Font:** Merriweather (Google Font, serif) -- both headings and body
- **Name:** ~18-22pt, Merriweather bold
- **Section headings:** ~12-13pt, bold, colored (default: muted blue #4A86C8 or similar)
- **Job title/Company:** ~11pt, bold for title, regular for company
- **Body text:** ~10-11pt, Merriweather regular
- **Dates:** ~10pt, lighter weight or gray
- **Contact info:** ~9-10pt
- **Line height:** ~1.3-1.4 (more generous than LaTeX templates due to Merriweather's taller x-height)

### Spacing Analysis
- **Page margins:** ~0.75-1.0in (Google Docs default margins)
- **Column gap:** ~0.25-0.3in between left and right columns (table cell padding)
- **Left column width:** ~30% of page width
- **Right column width:** ~70% of page width
- **Section gap:** ~12-16pt between major sections
- **Between entries:** ~8-10pt
- **Bullet gap:** ~3-5pt
- **Header bottom margin:** ~16-20pt (generous separation from content)
- **Section heading to first entry:** ~6-8pt

### Visual Elements
- **Section heading color:** Muted blue (default) -- the only color in the template
- **No horizontal rules** -- sections separated by colored headings and whitespace
- **No icons** (unlike Resume.io London which uses contact icons)
- **No skill bars or visual ratings**
- **Clean table-based column structure** with invisible borders
- **Bullet style:** Standard round bullets in the experience section
- **Subtle blue accent** adds warmth without being unprofessional

### ATS Compatibility
- Moderate: The two-column layout uses Google Docs tables, which some ATS systems parse linearly (left column first, then right column). This means Skills/Languages may appear before Experience in ATS parsing. The Merriweather font is a standard Google Font and widely recognized. The colored headings are cosmetic and don't affect parsing. Overall: better ATS compatibility than LaTeX two-column templates (Deedy) because the underlying table structure provides reading order, but worse than single-column templates.

### What Makes It Good
- **Zero barrier to entry:** Available free to anyone with a Google account. No downloads, no signups, no watermarks. This makes it the most accessible professional template in existence.
- **Merriweather is an excellent resume font:** Designed specifically for screen readability, it has a taller x-height than Times New Roman, making 10-11pt text significantly more legible. The serif style signals professionalism without feeling dated.
- **The 30/70 column split** is the ideal ratio for two-column resumes: enough space in the sidebar for supplementary info (skills, languages) without cramping the main experience column. This ratio has been validated across multiple design systems.
- **Six-section flexibility:** The template pre-builds sections that other templates omit (Languages, Awards, Projects). This makes it particularly strong for international candidates, academics, or anyone with diverse qualifications.
- **The single accent color** (muted blue on section headings) adds just enough visual personality to differentiate from all-black templates without introducing ATS risk or looking unprofessional.
- **Appropriate for traditional industries:** Law, education, healthcare, government, and academia -- sectors where serif fonts signal authority and the conservative two-column layout suggests thoroughness.

---

## Updated Cross-Template Comparison (All 8 Templates)

| Property | Jake's | Deedy | Harvard | London | Corporate | Wharton MBA | WSO/M&I Banking | GDocs Serif |
|---|---|---|---|---|---|---|---|---|
| **Layout** | 1-col | 2-col asym | 1-col | 1-col | 1-col | 1-col | 1-col | 2-col (30/70) |
| **Body font** | ~9pt | ~9-10pt | 10.5-11pt | 10-11pt | 10-11pt | 10-11pt | 10-10.5pt | 10-11pt |
| **Font type** | Serif (CM) | Sans (Lato) | Serif (TNR) | Sans | Sans | Serif (TNR/Gar) | Serif (TNR/Gar) | Serif (Merriweather) |
| **Name size** | ~25pt | ~28-32pt | 14-18pt | 20-24pt | 22-28pt | 14-16pt | 14-16pt | 18-22pt |
| **Section hdg** | ~14.4pt SC | ~12pt UC | 12pt UC Bold | 12-14pt Bold | 13-15pt UC | 11-12pt UC Bold | 11-12pt UC Bold | 12-13pt Bold Color |
| **Margins** | 0.5in | 0.4-0.5in | 0.5-0.75in | 0.6-0.8in | 0.7-1.0in | 0.5-0.75in | 0.5-0.75in | 0.75-1.0in |
| **Line height** | ~1.0 | ~1.0-1.1 | 1.0-1.15 | 1.3-1.4 | 1.4-1.5 | 1.0-1.15 | 1.0-1.1 | 1.3-1.4 |
| **Section gap** | ~8-10pt | ~6-8pt | 12-16pt | 16-20pt | 18-24pt | 10-14pt | 8-12pt | 12-16pt |
| **Bullet gap** | ~2pt | ~2-3pt | 2-4pt | 3-5pt | 4-6pt | 2-3pt | 2-3pt | 3-5pt |
| **Color** | None | Accent | None | Optional | None/min | None | None | Blue hdgs |
| **Dividers** | Full rule | Color partial | Full rule | Subtle line | Thin/space | Full rule | Full rule | None (color hdgs) |
| **ATS** | Excellent | Moderate | Excellent | Good | Excellent | Excellent | Excellent | Moderate |
| **Target** | Tech IC | Tech undergrad | Finance/law | General prof | Executive | MBA/business | IB/finance | Traditional/intl |

### Round 2 Key Observations

1. **Finance templates (Wharton, WSO/M&I) share a distinct DNA:** Serif fonts (TNR/Garamond), full-width horizontal rules, BOLD ALL CAPS section headings, 10-11pt body text, 0.5-0.75in margins. This "finance format" is as recognizable and standardized as Jake's Resume is in tech.

2. **Name size divergence:** Tech/creative templates use large names (22-32pt) as a design statement. Finance/institutional templates use modest names (14-16pt) -- the resume's authority comes from the content and institution, not the name size.

3. **The serif vs. sans-serif divide maps to industries:** Finance, law, academia, government tend to use serif (TNR, Garamond, Merriweather). Tech, design, startups tend to use sans-serif (Inter, Lato, system fonts). Hirvo should make font family a first-class template variable.

4. **Two-column templates serve different audiences:** Deedy targets tech undergrads maximizing info density. Google Docs Serif targets traditional professionals with diverse qualifications (languages, awards). The column split ratios differ too: Deedy is 33/67, Serif is 30/70.

5. **The "Additional Information" pattern (Wharton) vs. "Skills, Activities & Interests" (WSO):** Both solve the same problem -- where to put non-work-experience content -- but the naming convention signals different cultures. Hirvo should let users customize section names.

---

## Additional Sources (Round 2)

- [Wharton MBA Career Management - General Resume Guidelines](https://students.mbacareers.wharton.upenn.edu/wp-content/uploads/2014/11/GeneralResumeGuidelines.pdf)
- [Wharton MBA Resume Book 2014](https://hcmg.wharton.upenn.edu/wp-content/uploads/2015/05/Wharton-MBA-Resume-Book-2014.pdf)
- [Wharton MBA Resume Template - Scribd](https://www.scribd.com/document/632672580/wharton-resume-template)
- [Wall Street Oasis - Investment Banking Resume Template](https://www.wallstreetoasis.com/resources/templates/word-templates/investment-banking-resume-template)
- [WSO - Official IB Resume Template Forum](https://www.wallstreetoasis.com/forum/investment-banking/investment-banking-resume-template-official-wso-cv-example)
- [Mergers & Inquisitions - Free IB Resume Template](https://mergersandinquisitions.com/free-investment-banking-resume-template/)
- [M&I - Investment Banking Resume Guide](https://mergersandinquisitions.com/investment-banking/recruitment/resumes/)
- [WSO Investment Banking Resume - Google Docs Version](https://gdoc.io/resume-templates/wso-investment-banking-resume-free-google-docs-template/)
- [Google Docs Resume Templates - TopResume](https://topresume.com/career-advice/the-5-best-google-docs-resume-templates)
- [Google Docs Resume Templates - CV Knowhow](https://cvknowhow.com/career-advice/the-5-best-google-docs-resume-templates)
- [Google Docs Serif Template - Scribd](https://www.scribd.com/document/725680467/Swiss-Google-Docs-Resume-Template)
- [Investment Banking Resume Fonts - Kanception](https://www.kanception.io/best-investment-banking-resume-font/)
- [MIT CAPD - Resume Resources](https://capd.mit.edu/resources/resumes/)
- [Stanford GSB - Resume Resources](https://www.gsb.stanford.edu/alumni/career-resources/job-search/resumes)
