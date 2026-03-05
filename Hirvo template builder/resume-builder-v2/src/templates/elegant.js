/* Elegant — Refined serif typography with subtle gold accents */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.elegant = {
        name: 'Elegant',
        description: 'Sophisticated design with serif typography and gold accents',
        fonts: ['Playfair Display', 'Lato'],
        colors: { primary: '#2c2c2c', accent: '#b8860b', text: '#3a3a3a' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Lato", sans-serif; color: #3a3a3a; line-height: 1.65; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 780px; margin: 0 auto; padding: 56px 60px; }\
                .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e8e0d0; }\
                h1 { font-family: "Playfair Display", serif; font-size: 32px; font-weight: 700; color: #2c2c2c; letter-spacing: 0.02em; margin: 0 0 4px; }\
                .subtitle { font-size: 14px; color: #b8860b; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px; }\
                .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; font-size: 12px; color: #666; }\
                .summary { font-size: 14px; color: #555; line-height: 1.8; text-align: center; max-width: 620px; margin: 0 auto 32px; font-style: italic; }\
                .section { margin-bottom: 28px; }\
                .section-title { font-family: "Playfair Display", serif; font-size: 16px; font-weight: 700; color: #2c2c2c; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 1px solid #e8e0d0; letter-spacing: 0.04em; }\
                .entry { margin-bottom: 18px; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 15px; font-weight: 700; color: #2c2c2c; }\
                .entry-date { font-size: 12px; color: #96710a; font-weight: 600; letter-spacing: 0.04em; }\
                .entry-company { font-size: 13px; color: #666; margin: 2px 0 6px; font-style: italic; }\
                .entry-desc { font-size: 13px; color: #555; line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }\
                .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }\
                .skill-group { }\
                .skill-cat { font-size: 12px; font-weight: 700; color: #2c2c2c; margin-bottom: 3px; }\
                .skill-items { font-size: 12px; color: #666; line-height: 1.6; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; padding: 2px 0; }\
                @media print { .resume { padding: 36px 44px; } @page { margin: 0.5in 0.6in; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
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
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' — ' + esc(e.endDate) + '</span></div>';
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
                    html += '<span class="entry-date">' + esc(ed.startDate) + ' — ' + esc(ed.endDate) + '</span></div>';
                    html += '<div class="entry-company">' + esc(ed.institution) + '</div>';
                    if (ed.description) html += '<div class="entry-desc">' + esc(ed.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills</div><div class="skills-grid">';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<div class="skill-group"><div class="skill-cat">' + esc(s.category) + '</div>';
                    html += '<div class="skill-items">' + esc(s.items) + '</div></div>';
                }
                html += '</div></div>';
            }

            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div><div class="two-col">';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="meta-row"><span>' + esc(l.language) + '</span><span class="accent-text">' + esc(l.proficiency) + '</span></div>';
                }
                html += '</div></div>';
            }

            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div>';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="meta-row"><span>' + esc(c.name) + '</span><span class="accent-text">' + esc(c.year) + '</span></div>';
                }
                html += '</div>';
            }

            html += '</div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
