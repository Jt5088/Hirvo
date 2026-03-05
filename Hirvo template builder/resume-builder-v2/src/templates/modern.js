/* Modern — Bold sans-serif with accent sidebar stripe */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.modern = {
        name: 'Modern',
        description: 'Contemporary layout with bold typography and accent color',
        fonts: ['Inter'],
        colors: { primary: '#000000', accent: '#333333', text: '#333333' },
        metadata: {
            name: 'Modern',
            category: 'Modern',
            industries: ['Tech', 'Startups', 'Marketing'],
            atsScore: 'Good',
            density: 'Standard',
            description: 'Contemporary layout with bold typography, dark header, and accent color tags.'
        },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Inter", sans-serif; color: #333333; line-height: 1.6; margin: 0; padding: 0; background: #fff; -webkit-font-smoothing: antialiased; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 0; }\
                .header { background: #fff; color: #000000; padding: 40px 48px 32px; }\
                .header h1 { font-size: 30px; font-weight: 300; letter-spacing: -0.03em; margin: 0 0 4px; color: #000; }\
                .header .subtitle { font-size: 15px; color: #555555; font-weight: 400; margin-bottom: 16px; }\
                .header .contact { display: flex; flex-wrap: wrap; gap: 18px; font-size: 12px; color: #555555; }\
                .header .contact span { white-space: nowrap; }\
                .body { padding: 32px 48px 40px; }\
                .summary { font-size: 14px; color: #333333; line-height: 1.7; margin-bottom: 28px; }\
                .section { margin-bottom: 37px; }\
                .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #000000; margin-bottom: 14px; }\
                .entry { margin-bottom: 18px; padding-bottom: 18px; }\
                .entry:last-child { padding-bottom: 0; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 15px; font-weight: 700; color: #000000; }\
                .entry-date { font-size: 12px; color: #555555; font-weight: 500; white-space: nowrap; }\
                .entry-company { font-size: 13px; color: #555555; margin: 2px 0 6px; }\
                .entry-desc { font-size: 13px; color: #333333; line-height: 1.65; overflow-wrap: break-word; word-break: break-word; }\
                .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }\
                .skill-tag { display: inline-block; background: #f5f5f5; color: #333333; font-size: 12px; padding: 4px 10px; border-radius: 4px; font-weight: 500; }\
                .skill-cat-label { font-size: 11px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 10px; margin-bottom: 6px; }\
                .skill-cat-label:first-child { margin-top: 0; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; padding: 3px 0; }\
                .meta-label { color: #333333; font-weight: 500; }\
                .meta-value { color: #555555; }\
                @page { size: letter; }\
                .resume.a4 { width: 210mm; min-height: 297mm; }\
                @media print { .header { padding: 28px 36px 24px; } .body { padding: 24px 36px 32px; } @page { margin: 0.5in 0.6in; } .resume.a4 { width: 210mm; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
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
                    html += '<div class="skills-wrap">';
                    var items = (s.items || '').split(',');
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j].trim();
                        if (item) html += '<span class="skill-tag">' + esc(item) + '</span>';
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

            html += '</div></div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
