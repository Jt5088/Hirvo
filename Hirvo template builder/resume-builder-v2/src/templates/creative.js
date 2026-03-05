/* Creative — Bold colors, asymmetric layout, personality */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.creative = {
        name: 'Creative',
        description: 'Bold and expressive layout with vibrant accents',
        fonts: ['Poppins'],
        colors: { primary: '#1a1a1a', accent: '#f43f5e', text: '#404040' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Poppins", sans-serif; color: #404040; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 0; }\
                .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #fff; padding: 44px 48px 36px; position: relative; overflow: hidden; }\
                .header::after { content: ""; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%); pointer-events: none; }\
                .header h1 { font-size: 32px; font-weight: 700; margin: 0 0 2px; letter-spacing: -0.02em; position: relative; }\
                .header .subtitle { font-size: 14px; color: #f43f5e; font-weight: 500; letter-spacing: 0.04em; margin-bottom: 16px; position: relative; }\
                .header .contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: rgba(255,255,255,0.6); position: relative; }\
                .body { padding: 36px 48px 44px; }\
                .summary { font-size: 14px; color: #555; line-height: 1.75; margin-bottom: 30px; padding: 18px 22px; background: #fafafa; border-radius: 10px; border: 1px solid #f0f0f0; }\
                .section { margin-bottom: 28px; }\
                .section-title { font-size: 14px; font-weight: 700; color: #f43f5e; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }\
                .section-title::before { content: ""; width: 4px; height: 18px; background: #f43f5e; border-radius: 2px; flex-shrink: 0; }\
                .entry { margin-bottom: 20px; padding-left: 18px; border-left: 2px solid #f0f0f0; }\
                .entry-role { font-size: 15px; font-weight: 700; color: #1a1a1a; }\
                .entry-meta { font-size: 12px; color: #666; margin: 3px 0 6px; }\
                .entry-meta .company { color: #666; font-weight: 500; }\
                .entry-desc { font-size: 13px; color: #555; line-height: 1.7; overflow-wrap: break-word; word-break: break-word; }\
                .skills-cloud { display: flex; flex-wrap: wrap; gap: 8px; }\
                .skill-chip { display: inline-block; background: #fff0f3; color: #be123c; font-size: 12px; padding: 5px 14px; border-radius: 20px; font-weight: 500; }\
                .skill-cat-label { font-size: 11px; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 12px; margin-bottom: 8px; }\
                .skill-cat-label:first-child { margin-top: 0; }\
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }\
                .info-item { background: #fafafa; border-radius: 8px; padding: 10px 14px; border: 1px solid #f0f0f0; }\
                .info-label { font-size: 11px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }\
                .info-value { font-size: 13px; color: #1a1a1a; font-weight: 500; }\
                @media print { .header { padding: 28px 36px 24px; background: #1a1a1a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .body { padding: 24px 36px 32px; } .summary, .info-item { background: #fff !important; } @page { margin: 0.5in 0.6in; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
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

            html += '<div class="body">';
            if (p.summary) html += '<div class="summary">' + esc(p.summary) + '</div>';

            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry">';
                    html += '<div class="entry-role">' + esc(e.role) + '</div>';
                    html += '<div class="entry-meta"><span class="company">' + esc(e.company) + '</span>';
                    html += (e.location ? ' · ' + esc(e.location) : '') + ' · ' + esc(e.startDate) + ' — ' + esc(e.endDate) + '</div>';
                    if (e.description) html += '<div class="entry-desc">' + esc(e.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.education && data.education.length) {
                html += '<div class="section"><div class="section-title">Education</div>';
                for (var i = 0; i < data.education.length; i++) {
                    var ed = data.education[i];
                    html += '<div class="entry">';
                    html += '<div class="entry-role">' + esc(ed.degree) + '</div>';
                    html += '<div class="entry-meta"><span class="company">' + esc(ed.institution) + '</span> · ' + esc(ed.startDate) + ' — ' + esc(ed.endDate) + '</div>';
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
                    html += '<div class="skills-cloud">';
                    var items = (s.items || '').split(',');
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j].trim();
                        if (item) html += '<span class="skill-chip">' + esc(item) + '</span>';
                    }
                    html += '</div>';
                }
                html += '</div>';
            }

            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div><div class="info-grid">';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="info-item"><div class="info-label">' + esc(l.language) + '</div><div class="info-value">' + esc(l.proficiency) + '</div></div>';
                }
                html += '</div></div>';
            }

            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div><div class="info-grid">';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="info-item"><div class="info-value">' + esc(c.name) + '</div><div class="info-label">' + esc(c.year) + '</div></div>';
                }
                html += '</div></div>';
            }

            html += '</div></div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
