/* ========================================
   Template Engine — manages template registry
   ======================================== */
var TemplateEngine = (function() {
    'use strict';

    window.HirvoTemplates = window.HirvoTemplates || {};

    function esc(s) {
        return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function getTemplates() {
        var templates = [];
        var ids = Object.keys(window.HirvoTemplates);
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var t = window.HirvoTemplates[id];
            templates.push({
                id: id,
                name: t.name || id,
                description: t.description || '',
                colors: t.colors || {},
                fonts: t.fonts || []
            });
        }
        return templates;
    }

    function render(templateId, data) {
        var t = window.HirvoTemplates[templateId];
        if (!t) {
            throw new Error('Unknown template: ' + templateId);
        }

        var result = t.render(data);
        var fontLinks = '';
        if (t.fonts && t.fonts.length) {
            for (var i = 0; i < t.fonts.length; i++) {
                fontLinks += '<link href="https://fonts.googleapis.com/css2?family=' +
                    encodeURIComponent(t.fonts[i]) + ':wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';
            }
        }

        var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            fontLinks +
            '<style>' +
            '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }' +
            'body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }' +
            'html { overflow-y: auto; }' +
            result.style +
            '</style></head><body>' +
            result.html +
            '</body></html>';

        return html;
    }

    return {
        getTemplates: getTemplates,
        render: render,
        esc: esc
    };
})();
