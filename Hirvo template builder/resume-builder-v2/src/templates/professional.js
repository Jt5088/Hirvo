/* Professional — Corporate-friendly, ATS-optimized */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.professional = {
        name: 'Professional',
        description: 'Corporate-friendly, ATS-optimized format',
        fonts: ['Roboto'],
        colors: { primary: '#1f2937', accent: '#059669', text: '#374151' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Roboto", sans-serif; color: #374151; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 44px 52px; }\
                .header { margin-bottom: 24px; }\
                h1 { font-size: 26px; font-weight: 700; color: #1f2937; margin: 0 0 2px; letter-spacing: -0.01em; }\
                .subtitle { font-size: 15px; color: #059669; font-weight: 500; margin-bottom: 10px; }\
                .contact { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12px; color: #6b7280; padding-top: 10px; border-top: 2px solid #059669; }\
                .summary { font-size: 14px; color: #4b5563; line-height: 1.75; margin-bottom: 24px; }\
                .section { margin-bottom: 22px; }\
                .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #1f2937; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #d1d5db; }\
                .entry { margin-bottom: 16px; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 15px; font-weight: 700; color: #1f2937; }\
                .entry-date { font-size: 12px; color: #059669; font-weight: 500; }\
                .entry-company { font-size: 13px; color: #6b7280; margin: 2px 0 6px; }\
                .entry-desc { font-size: 13px; color: #4b5563; line-height: 1.65; overflow-wrap: break-word; word-break: break-word; }\
                .skills-table { width: 100%; border-collapse: collapse; }\
                .skills-table td { font-size: 13px; padding: 6px 0; vertical-align: top; border-bottom: 1px solid #f3f4f6; }\
                .skills-table .cat { font-weight: 600; color: #1f2937; width: 140px; }\
                .skills-table .items { color: #6b7280; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; padding: 3px 0; }\
                .meta-label { color: #374151; font-weight: 500; }\
                .meta-value { color: #6b7280; }\
                @media print { .resume { padding: 32px 40px; } @page { margin: 0.5in 0.6in; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
            ';

            var html = '<div class="resume">';
            html += '<div class="header">';
            html += '<h1>' + esc(p.firstName) + ' ' + esc(p.lastName) + '</h1>';
            if (p.title) html += '<div class="subtitle">' + esc(p.title) + '</div>';
            html += '<div class="contact">';
            if (p.email) html += '<span>' + esc(p.email) + '</span>';
            if (p.phone) html += '<span>' + esc(p.phone) + '</span>';
            if (p.location) html += '<span>' + esc(p.location) + '</span>';
            if (p.website) html += '<span>' + esc(p.website) + '</span>';
            if (p.linkedin) html += '<span>' + esc(p.linkedin) + '</span>';
            html += '</div></div>';

            if (p.summary) html += '<div class="summary">' + esc(p.summary) + '</div>';

            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Professional Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' — ' + esc(e.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(e.company) + (e.location ? ' | ' + esc(e.location) : '') + '</div>';
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
