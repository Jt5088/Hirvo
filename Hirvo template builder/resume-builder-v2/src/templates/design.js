/* Design — Two-column with colored sidebar */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.design = {
        name: 'Design',
        description: 'Two-column layout with a tinted sidebar',
        fonts: ['DM Sans'],
        colors: { primary: '#1e293b', accent: '#0ea5e9', text: '#334155' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "DM Sans", sans-serif; color: #334155; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }\
                .sidebar { background: #0f172a; color: #e2e8f0; padding: 40px 28px; }\
                .sidebar h1 { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0 0 4px; line-height: 1.2; }\
                .sidebar .subtitle { font-size: 13px; color: #94a3b8; margin-bottom: 20px; }\
                .sidebar .section { margin-bottom: 22px; }\
                .sidebar .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #0ea5e9; margin-bottom: 10px; }\
                .sidebar .contact-item { font-size: 12px; color: #cbd5e1; margin-bottom: 6px; overflow-wrap: break-word; word-break: break-word; }\
                .sidebar .skill-cat { font-size: 11px; font-weight: 600; color: #e2e8f0; margin-top: 8px; margin-bottom: 4px; }\
                .sidebar .skill-cat:first-child { margin-top: 0; }\
                .sidebar .skill-items { font-size: 12px; color: #94a3b8; line-height: 1.6; }\
                .sidebar .lang-item { font-size: 12px; margin-bottom: 4px; }\
                .sidebar .lang-name { color: #e2e8f0; }\
                .sidebar .lang-level { color: #7c8da0; font-size: 11px; }\
                .main { padding: 40px 36px; }\
                .summary { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 28px; }\
                .section { margin-bottom: 24px; }\
                .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }\
                .entry { margin-bottom: 16px; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 14px; font-weight: 700; color: #1e293b; }\
                .entry-date { font-size: 12px; color: #94a3b8; }\
                .entry-company { font-size: 13px; color: #7c8da0; margin: 1px 0 5px; }\
                .entry-desc { font-size: 13px; color: #475569; line-height: 1.65; overflow-wrap: break-word; word-break: break-word; }\
                .cert-item { font-size: 12px; margin-bottom: 4px; color: #cbd5e1; }\
                .cert-year { color: #7c8da0; font-size: 11px; }\
                @media print { .resume { grid-template-columns: 220px 1fr; min-height: auto; } .sidebar { padding: 28px 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .main { padding: 28px 28px; } @page { margin: 0.4in 0.5in; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
            ';

            var html = '<div class="resume">';

            // Sidebar
            html += '<div class="sidebar">';
            html += '<h1>' + esc(p.firstName) + '<br>' + esc(p.lastName) + '</h1>';
            if (p.title) html += '<div class="subtitle">' + esc(p.title) + '</div>';

            html += '<div class="section"><div class="section-title">Contact</div>';
            if (p.email) html += '<div class="contact-item">' + esc(p.email) + '</div>';
            if (p.phone) html += '<div class="contact-item">' + esc(p.phone) + '</div>';
            if (p.location) html += '<div class="contact-item">' + esc(p.location) + '</div>';
            if (p.website) html += '<div class="contact-item">' + esc(p.website) + '</div>';
            if (p.linkedin) html += '<div class="contact-item">' + esc(p.linkedin) + '</div>';
            html += '</div>';

            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills</div>';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<div class="skill-cat">' + esc(s.category) + '</div>';
                    html += '<div class="skill-items">' + esc(s.items) + '</div>';
                }
                html += '</div>';
            }

            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div>';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="lang-item"><span class="lang-name">' + esc(l.language) + '</span> <span class="lang-level">' + esc(l.proficiency) + '</span></div>';
                }
                html += '</div>';
            }

            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div>';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="cert-item">' + esc(c.name) + ' <span class="cert-year">' + esc(c.year) + '</span></div>';
                }
                html += '</div>';
            }

            html += '</div>';

            // Main
            html += '<div class="main">';
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

            html += '</div></div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
