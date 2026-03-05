/* Finance — Wharton/WSO dense format, Georgia serif, tight spacing, no summary */
(function() {
    window.HirvoTemplates = window.HirvoTemplates || {};
    window.HirvoTemplates.finance = {
        name: 'Finance',
        description: 'Dense IB/PE format with Georgia serif, tight line-height, education first',
        fonts: [],
        colors: { primary: '#000000', accent: '#000000', text: '#000000' },
        metadata: {
            name: 'Finance',
            category: 'Traditional',
            industries: ['Investment Banking', 'Private Equity', 'Consulting', 'Finance'],
            atsScore: 'Excellent',
            density: 'Dense',
            description: 'Wharton/WSO-style dense layout. Georgia serif, tight spacing, maximizes content per page.'
        },
        render: function(data) {
            var p = data.personal || {};
            var style = '\
                body { font-family: Georgia, "Times New Roman", Times, serif; color: #000; line-height: 1.08; margin: 0; padding: 0; background: #fff; }\
                .resume { max-width: 800px; margin: 0 auto; padding: 40px 40px; }\
                .header { text-align: center; margin-bottom: 12pt; }\
                h1 { font-family: Georgia, "Times New Roman", Times, serif; font-size: 15pt; font-weight: 700; color: #000; margin: 0 0 4px; letter-spacing: normal; line-height: 1.2; }\
                .contact { display: flex; flex-wrap: wrap; justify-content: center; gap: 0; font-size: 10pt; color: #000; line-height: 1.4; }\
                .contact span { white-space: nowrap; }\
                .contact .sep { margin: 0 4px; }\
                .section { margin-bottom: 12pt; }\
                .section-title { font-family: Georgia, "Times New Roman", Times, serif; font-size: 11.5pt; font-weight: 700; text-transform: uppercase; color: #000; margin-bottom: 7pt; padding-bottom: 2pt; border-bottom: 0.75pt solid #000; line-height: 1.2; }\
                .entry { margin-bottom: 6pt; }\
                .entry:last-child { margin-bottom: 0; }\
                .entry-top { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 2px; }\
                .entry-company { font-family: Georgia, "Times New Roman", Times, serif; font-size: 10pt; font-weight: 700; color: #000; }\
                .entry-location { font-size: 10pt; color: #000; }\
                .entry-role-row { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 2px; }\
                .entry-role { font-family: Georgia, "Times New Roman", Times, serif; font-size: 10pt; font-weight: 400; font-style: italic; color: #000; }\
                .entry-date { font-size: 10pt; color: #000; }\
                .entry-desc { font-size: 10pt; color: #000; line-height: 1.08; margin-top: 2pt; padding-left: 16pt; overflow-wrap: break-word; word-break: break-word; }\
                .bullet-list { margin: 2pt 0 0 0; padding-left: 16pt; list-style-type: disc; }\
                .bullet-list li { font-size: 10pt; color: #000; line-height: 1.08; margin-bottom: 2pt; }\
                .bullet-list li:last-child { margin-bottom: 0; }\
                .addl-row { font-size: 10pt; color: #000; margin-bottom: 3pt; line-height: 1.08; }\
                .addl-row:last-child { margin-bottom: 0; }\
                .addl-cat { font-weight: 700; }\
                @page { size: letter; margin: 0.55in; }\
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

            /* NO summary section — finance convention */

            /* Education FIRST — finance convention */
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

            /* Additional Information — single catch-all section for skills, languages, certifications, interests */
            var hasAdditional = (data.skills && data.skills.length) || (data.languages && data.languages.length) || (data.certifications && data.certifications.length);
            if (hasAdditional) {
                html += '<div class="section"><div class="section-title">Additional Information</div>';

                if (data.skills && data.skills.length) {
                    for (var i = 0; i < data.skills.length; i++) {
                        var s = data.skills[i];
                        html += '<div class="addl-row"><span class="addl-cat">' + esc(s.category) + ':</span> ' + esc(s.items) + '</div>';
                    }
                }

                if (data.languages && data.languages.length) {
                    var langs = [];
                    for (var i = 0; i < data.languages.length; i++) {
                        var l = data.languages[i];
                        langs.push(esc(l.language) + (l.proficiency ? ' (' + esc(l.proficiency) + ')' : ''));
                    }
                    html += '<div class="addl-row"><span class="addl-cat">Languages:</span> ' + langs.join(', ') + '</div>';
                }

                if (data.certifications && data.certifications.length) {
                    var certs = [];
                    for (var i = 0; i < data.certifications.length; i++) {
                        var c = data.certifications[i];
                        certs.push(esc(c.name) + (c.year ? ' (' + esc(c.year) + ')' : ''));
                    }
                    html += '<div class="addl-row"><span class="addl-cat">Certifications:</span> ' + certs.join(', ') + '</div>';
                }

                html += '</div>';
            }

            html += '</div>';
            return { style: style, html: html };
        }
    };

    function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
})();
