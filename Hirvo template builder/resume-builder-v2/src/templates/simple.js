/* Simple — Minimalist, lots of whitespace */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.simple = {
        name: 'Simple',
        description: 'Minimal and clean with generous whitespace',
        fonts: ['Inter'],
        colors: { primary: '#111827', accent: '#6b7280', text: '#374151' },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Inter", sans-serif; color: #374151; line-height: 1.6; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 760px; margin: 0 auto; padding: 52px 56px; }\
                h1 { font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.02em; margin: 0 0 2px; }\
                .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 8px; }\
                .contact { font-size: 12px; color: #6b7280; display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }\
                .divider { height: 1px; border-top: 1px solid #e5e7eb; background: none; margin: 24px 0; }\
                .summary { font-size: 14px; color: #4b5563; line-height: 1.75; margin-bottom: 0; }\
                .section { margin-bottom: 0; }\
                .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-bottom: 12px; }\
                .entry { margin-bottom: 16px; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-size: 14px; font-weight: 600; color: #111827; }\
                .entry-date { font-size: 12px; color: #6b7280; }\
                .entry-meta { font-size: 13px; color: #6b7280; margin: 2px 0 4px; }\
                .entry-desc { font-size: 13px; color: #4b5563; line-height: 1.65; overflow-wrap: break-word; word-break: break-word; }\
                .skill-line { font-size: 13px; margin-bottom: 4px; }\
                .skill-cat { font-weight: 600; color: #111827; }\
                .skill-items { color: #6b7280; }\
                .meta-row { font-size: 13px; display: flex; justify-content: space-between; margin-bottom: 3px; }\
                .meta-value { color: #6b7280; }\
                @media print { .resume { padding: 36px 40px; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } }\
            ';

            var html = '<div class="resume">';
            html += '<h1>' + esc(p.firstName) + ' ' + esc(p.lastName) + '</h1>';
            if (p.title) html += '<div class="subtitle">' + esc(p.title) + '</div>';
            html += '<div class="contact">';
            if (p.email) html += '<span>' + esc(p.email) + '</span>';
            if (p.phone) html += '<span>' + esc(p.phone) + '</span>';
            if (p.location) html += '<span>' + esc(p.location) + '</span>';
            if (p.website) html += '<span>' + esc(p.website) + '</span>';
            if (p.linkedin) html += '<span>' + esc(p.linkedin) + '</span>';
            html += '</div>';

            if (p.summary) {
                html += '<div class="summary">' + esc(p.summary) + '</div>';
                html += '<div class="divider"></div>';
            }

            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' — ' + esc(e.endDate) + '</span></div>';
                    html += '<div class="entry-meta">' + esc(e.company) + (e.location ? ' — ' + esc(e.location) : '') + '</div>';
                    if (e.description) html += '<div class="entry-desc">' + esc(e.description) + '</div>';
                    html += '</div>';
                }
                html += '</div><div class="divider"></div>';
            }

            if (data.education && data.education.length) {
                html += '<div class="section"><div class="section-title">Education</div>';
                for (var i = 0; i < data.education.length; i++) {
                    var ed = data.education[i];
                    html += '<div class="entry"><div class="entry-top"><span class="entry-role">' + esc(ed.degree) + '</span>';
                    html += '<span class="entry-date">' + esc(ed.startDate) + ' — ' + esc(ed.endDate) + '</span></div>';
                    html += '<div class="entry-meta">' + esc(ed.institution) + '</div>';
                    if (ed.description) html += '<div class="entry-desc">' + esc(ed.description) + '</div>';
                    html += '</div>';
                }
                html += '</div><div class="divider"></div>';
            }

            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills</div>';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<div class="skill-line"><span class="skill-cat">' + esc(s.category) + ': </span><span class="skill-items">' + esc(s.items) + '</span></div>';
                }
                html += '</div><div class="divider"></div>';
            }

            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div>';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="meta-row"><span>' + esc(l.language) + '</span><span class="meta-value">' + esc(l.proficiency) + '</span></div>';
                }
                html += '</div><div class="divider"></div>';
            }

            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div>';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="meta-row"><span>' + esc(c.name) + '</span><span class="meta-value">' + esc(c.year) + '</span></div>';
                }
                html += '</div>';
            }

            html += '</div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
