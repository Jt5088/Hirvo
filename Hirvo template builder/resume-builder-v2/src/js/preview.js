/* ========================================
   Preview — iframe-based resume rendering
   ======================================== */
var ResumePreview = (function() {
    'use strict';

    var iframe = null;
    var currentTemplate = 'classic';
    var debounceTimer = null;

    function init() {
        iframe = document.getElementById('preview-frame');
    }

    function setTemplate(templateId) {
        currentTemplate = templateId;
    }

    function getTemplate() {
        return currentTemplate;
    }

    function render(data) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
            renderNow(data);
        }, 150);
    }

    function renderNow(data) {
        if (!iframe) return;
        try {
            var html = TemplateEngine.render(currentTemplate, data);
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
        } catch (e) {
            console.error('Preview render error:', e);
            try {
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write('<body style="font-family:system-ui;padding:40px;color:#dc2626;font-size:14px;">Render error: ' + (e.message || e) + '</body>');
                doc.close();
            } catch (ignore) {}
        }
    }

    function renderImmediate(data) {
        renderNow(data);
    }

    return {
        init: init,
        setTemplate: setTemplate,
        getTemplate: getTemplate,
        render: render,
        renderImmediate: renderImmediate
    };
})();
