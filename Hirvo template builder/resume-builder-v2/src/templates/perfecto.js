/* Perfecto — Geometric accents, structured grid layout */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.perfecto = {
        name: 'Perfecto',
        description: 'Structured grid with geometric accents and clean sections',
        fonts: ['Space Grotesk', 'Inter'],
        colors: { primary: '#18181b', accent: '#a855f7', text: '#3f3f46' },
        metadata: {
            name: 'Perfecto',
            category: 'Modern',
            industries: ['Tech', 'Product', 'Engineering'],
            atsScore: 'Excellent',
            density: 'Standard',
            description: 'Structured grid with geometric accents, pill-shaped skill tags, and clean sections.'
        },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Inter", sans-serif; color: #3f3f46; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 44px 48px; }\
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #18181b; flex-wrap: wrap; gap: 16px; }\
                .header-left h1 { font-family: "Space Grotesk", sans-serif; font-size: 28px; font-weight: 700; color: #18181b; letter-spacing: -0.03em; margin: 0 0 4px; }\
                .header-left .subtitle { font-size: 14px; color: #a855f7; font-weight: 500; }\
                .header-right { text-align: right; font-size: 12px; color: #71717a; line-height: 1.8; }\
                .summary { font-size: 14px; color: #52525b; line-height: 1.75; margin-bottom: 28px; padding: 16px 20px; background: #fafafa; border-radius: 8px; border-left: 3px solid #a855f7; }\
                .section { margin-bottom: 26px; }\
                .section-title { font-family: "Space Grotesk", sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #18181b; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }\
                .section-title::after { content: ""; flex: 1; height: 1px; background: #e4e4e7; }\
                .entry { margin-bottom: 18px; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 15px; font-weight: 700; color: #18181b; }\
                .entry-date { font-size: 12px; color: #a855f7; font-weight: 500; }\
                .entry-company { font-size: 13px; color: #71717a; margin: 2px 0 6px; }\
                .entry-desc { font-size: 13px; color: #52525b; line-height: 1.65; overflow-wrap: break-word; word-break: break-word; }\
                .skills-flex { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }\
                .skill-pill { display: inline-block; background: #f4f4f5; color: #3f3f46; font-size: 12px; padding: 4px 12px; border-radius: 20px; font-weight: 500; border: 1px solid #e4e4e7; }\
                .skill-cat-label { font-size: 11px; font-weight: 700; color: #18181b; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 12px; margin-bottom: 6px; }\
                .skill-cat-label:first-child { margin-top: 0; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; padding: 3px 0; }\
                .meta-label { color: #3f3f46; }\
                .meta-value { color: #71717a; }\
                @page { size: letter; }\
                .resume.a4 { width: 210mm; min-height: 297mm; }\
                @media print { .resume { padding: 32px 40px; } .summary { background: #fff; } @page { margin: 0.5in 0.6in; } .resume.a4 { width: 210mm; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
            ';

            var html = '<div class="resume">';
            html += '<div class="header"><div class="header-left">';
            html += '<h1>' + esc(p.firstName) + ' ' + esc(p.lastName) + '</h1>';
            if (p.title) html += '<div class="subtitle">' + esc(p.title) + '</div>';
            html += '</div><div class="header-right">';
            if (p.email) html += esc(p.email) + '<br>';
            if (p.phone) html += esc(p.phone) + '<br>';
            if (p.location) html += esc(p.location) + '<br>';
            if (p.website) html += esc(p.website) + '<br>';
            if (p.linkedin) html += esc(p.linkedin);
            html += '</div></div>';

            if (p.summary) html += '<div class="summary">' + esc(p.summary) + '</div>';

            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' — ' + esc(e.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(e.company) + (e.location ? ' · ' + esc(e.location) : '') + '</div>';
                    if (e.description) html += '<div class="entry-desc">' + esc(e.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.education && data.education.length) {
                html += '<div class="section"><div class="section-title">Education</div>';
                for (var i = 0; i < data.education.length; i++) {
                    var ed = data.education[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(ed.degree) + '</span>';
                    html += '<span class="entry-date">' + esc(ed.startDate) + ' — ' + esc(ed.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(ed.institution) + '</div>';
                    if (ed.description) html += '<div class="entry-desc">' + esc(ed.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills</div>';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<div class="skill-cat-label">' + esc(s.category) + '</div>';
                    html += '<div class="skills-flex">';
                    var items = (s.items || '').split(',');
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j].trim();
                        if (item) html += '<span class="skill-pill">' + esc(item) + '</span>';
                    }
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div><div class="two-col">';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="meta-row"><span class="meta-label">' + esc(l.language) + '</span><span class="meta-value">' + esc(l.proficiency) + '</span></div>';
                }
                html += '</div></div>';
            }

            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div>';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="meta-row"><span class="meta-label">' + esc(c.name) + '</span><span class="meta-value">' + esc(c.year) + '</span></div>';
                }
                html += '</div>';
            }

            html += '</div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
