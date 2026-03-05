/* Classic — Traditional resume layout, ATS-friendly, clean serif headings */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.classic = {
        name: 'Classic',
        description: 'Traditional, ATS-friendly layout with clean typography',
        fonts: ['Source Serif 4', 'Inter'],
        colors: { primary: '#1a1a1a', accent: '#1a1a1a', text: '#333' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Inter", sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 48px 52px; }\
                .header { text-align: center; margin-bottom: 24px; padding-bottom: 18px; border-bottom: 2px solid #1a1a1a; }\
                h1 { font-family: "Source Serif 4", Georgia, serif; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.01em; margin: 0 0 4px; }\
                .subtitle { font-size: 15px; color: #555; margin-bottom: 10px; }\
                .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 18px; font-size: 12px; color: #666; }\
                .contact span { white-space: nowrap; }\
                .contact .sep { color: #ccc; }\
                .summary { font-size: 14px; color: #444; line-height: 1.75; margin-bottom: 24px; }\
                .section { margin-bottom: 22px; }\
                .section-title { font-family: "Source Serif 4", Georgia, serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #1a1a1a; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #ddd; }\
                .entry { margin-bottom: 16px; }\
                .entry:last-child { margin-bottom: 0; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 14px; font-weight: 700; color: #1a1a1a; }\
                .entry-date { font-size: 12px; color: #707070; }\
                .entry-company { font-size: 13px; color: #666; margin: 2px 0 5px; }\
                .entry-desc { font-size: 13px; color: #444; line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }\
                .skills-table { width: 100%; }\
                .skills-table tr td { font-size: 13px; padding: 3px 0; vertical-align: top; }\
                .skills-table .cat { font-weight: 600; color: #1a1a1a; width: 140px; padding-right: 12px; }\
                .skills-table .items { color: #555; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; padding: 2px 0; }\
                .meta-label { color: #333; font-weight: 500; }\
                .meta-value { color: #707070; }\
                @media print { .resume { padding: 36px 44px; } @page { margin: 0.5in 0.6in; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
            ';

            var html = '<div class="resume">';
            html += '<div class="header">';
            html += '<h1>' + esc(p.firstName) + ' ' + esc(p.lastName) + '</h1>';
            if (p.title) html += '<div class="subtitle">' + esc(p.title) + '</div>';
            html += '<div class="contact">';
            var contactParts = [];
            if (p.email) contactParts.push(esc(p.email));
            if (p.phone) contactParts.push(esc(p.phone));
            if (p.location) contactParts.push(esc(p.location));
            if (p.website) contactParts.push(esc(p.website));
            if (p.linkedin) contactParts.push(esc(p.linkedin));
            html += contactParts.map(function(c) { return '<span>' + c + '</span>'; }).join('<span class="sep">|</span>');
            html += '</div></div>';

            if (p.summary) html += '<div class="summary">' + esc(p.summary) + '</div>';

            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' \u2014 ' + esc(e.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(e.company) + (e.location ? ', ' + esc(e.location) : '') + '</div>';
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
                    html += '<span class="entry-date">' + esc(ed.startDate) + ' \u2014 ' + esc(ed.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(ed.institution) + '</div>';
                    if (ed.description) html += '<div class="entry-desc">' + esc(ed.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills</div>';
                html += '<table class="skills-table">';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<tr><td class="cat">' + esc(s.category) + '</td><td class="items">' + esc(s.items) + '</td></tr>';
                }
                html += '</table></div>';
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
