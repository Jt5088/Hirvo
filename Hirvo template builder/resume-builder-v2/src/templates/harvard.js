/* Harvard — Ultra-conservative institutional format, Times New Roman, education first */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.harvard = {
        name: 'Harvard',
        description: 'Institutional format with Times New Roman, education first, zero decorative elements',
        fonts: [],
        colors: { primary: '#000000', accent: '#000000', text: '#000000' },
        metadata: {
            name: 'Harvard',
            category: 'Traditional',
            industries: ['Finance', 'Consulting', 'Legal', 'Academia'],
            atsScore: 'Excellent',
            density: 'Standard',
            description: 'Ultra-conservative single-column layout. All-serif, pure black on white, education-first ordering.'
        },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: "Times New Roman", Times, serif; color: #000; line-height: 1.12; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 50px 50px; }\
                .header { text-align: center; margin-bottom: 15pt; }\
                h1 { font-family: "Times New Roman", Times, serif; font-size: 17pt; font-weight: 700; color: #000; margin: 0 0 4px; letter-spacing: normal; line-height: 1.2; }\
                .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 0; font-size: 10pt; color: #000; line-height: 1.4; }\
                .contact span { white-space: nowrap; }\
                .contact .sep { margin: 0 4px; }\
                .section { margin-bottom: 15pt; }\
                .section-title { font-family: "Times New Roman", Times, serif; font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; color: #000; margin-bottom: 8pt; padding-bottom: 2pt; border-bottom: 1px solid #000; line-height: 1.2; }\
                .entry { margin-bottom: 8pt; }\
                .entry:last-child { margin-bottom: 0; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-company { font-family: "Times New Roman", Times, serif; font-size: 11pt; font-weight: 700; color: #000; }\
                .entry-location { font-size: 10.5pt; color: #000; }\
                .entry-role-row { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px; }\
                .entry-role { font-family: "Times New Roman", Times, serif; font-size: 11pt; font-weight: 400; font-style: italic; color: #000; }\
                .entry-date { font-size: 10.5pt; color: #000; }\
                .entry-desc { font-size: 10.5pt; color: #000; line-height: 1.15; margin-top: 2pt; padding-left: 0.25in; overflow-wrap: break-word; word-break: break-word; }\
                .bullet-list { margin: 2pt 0 0 0; padding-left: 0.25in; list-style-type: disc; }\
                .bullet-list li { font-size: 10.5pt; color: #000; line-height: 1.15; margin-bottom: 3pt; }\
                .bullet-list li:last-child { margin-bottom: 0; }\
                .skills-row { font-size: 10.5pt; color: #000; margin-bottom: 4pt; line-height: 1.15; }\
                .skills-row:last-child { margin-bottom: 0; }\
                .skills-cat { font-weight: 700; }\
                .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4pt; }\
                .meta-row { font-size: 10.5pt; display: flex; justify-content: space-between; padding: 2px 0; color: #000; }\
                .summary { font-size: 10.5pt; color: #000; line-height: 1.15; margin-bottom: 15pt; }\
                @page { size: letter; margin: 0.7in; }\
                .resume.a4 { width: 210mm; min-height: 297mm; }\
                @media print { .resume { padding: 0; } .entry { page-break-inside: avoid; break-inside: avoid; } .section-title { page-break-after: avoid; break-after: avoid; } .resume.a4 { width: 210mm; } }\
            ';

            var html = '<div class="resume">';
            html += '<div class="header">';
            html += '<h1>' + esc(p.firstName) + ' ' + esc(p.lastName) + '</h1>';
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

            /* Education FIRST — Harvard convention */
            if (data.education && data.education.length) {
                html += '<div class="section"><div class="section-title">Education</div>';
                for (var i = 0; i < data.education.length; i++) {
                    var ed = data.education[i];
                    html += '<div class="entry">';
                    html += '<div class="entry-top"><span class="entry-company">' + esc(ed.institution) + '</span>';
                    if (ed.location) html += '<span class="entry-location">' + esc(ed.location) + '</span>';
                    html += '</div>';
                    html += '<div class="entry-role-row"><span class="entry-role">' + esc(ed.degree) + '</span>';
                    html += '<span class="entry-date">' + esc(ed.startDate) + ' \u2014 ' + esc(ed.endDate) + '</span></div>';
                    if (ed.description) html += '<div class="entry-desc">' + esc(ed.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            /* Experience */
            if (data.experience && data.experience.length) {
                html += '<div class="section"><div class="section-title">Experience</div>';
                for (var i = 0; i < data.experience.length; i++) {
                    var e = data.experience[i];
                    html += '<div class="entry">';
                    html += '<div class="entry-top"><span class="entry-company">' + esc(e.company) + '</span>';
                    if (e.location) html += '<span class="entry-location">' + esc(e.location) + '</span>';
                    html += '</div>';
                    html += '<div class="entry-role-row"><span class="entry-role">' + esc(e.role) + '</span>';
                    html += '<span class="entry-date">' + esc(e.startDate) + ' \u2014 ' + esc(e.endDate) + '</span></div>';
                    if (e.description) html += '<div class="entry-desc">' + esc(e.description) + '</div>';
                    html += '</div>';
                }
                html += '</div>';
            }

            /* Skills */
            if (data.skills && data.skills.length) {
                html += '<div class="section"><div class="section-title">Skills &amp; Interests</div>';
                for (var i = 0; i < data.skills.length; i++) {
                    var s = data.skills[i];
                    html += '<div class="skills-row"><span class="skills-cat">' + esc(s.category) + ':</span> ' + esc(s.items) + '</div>';
                }
                html += '</div>';
            }

            /* Languages */
            if (data.languages && data.languages.length) {
                html += '<div class="section"><div class="section-title">Languages</div><div class="two-col">';
                for (var i = 0; i < data.languages.length; i++) {
                    var l = data.languages[i];
                    html += '<div class="meta-row"><span>' + esc(l.language) + '</span><span>' + esc(l.proficiency) + '</span></div>';
                }
                html += '</div></div>';
            }

            /* Certifications */
            if (data.certifications && data.certifications.length) {
                html += '<div class="section"><div class="section-title">Certifications</div>';
                for (var i = 0; i < data.certifications.length; i++) {
                    var c = data.certifications[i];
                    html += '<div class="meta-row"><span>' + esc(c.name) + '</span><span>' + esc(c.year) + '</span></div>';
                }
                html += '</div>';
            }

            html += '</div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
