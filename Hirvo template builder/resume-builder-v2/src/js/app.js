/* ========================================
   App — main entry point
   ======================================== */
var App = (function() {
    'use strict';

    var currentData = null;
    var currentTemplate = 'classic';

    function init() {
        // Load saved data or default
        currentData = ResumeStorage.load() || ResumeStorage.getDefaultData();
        currentTemplate = ResumeStorage.loadTemplate();

        // Init preview
        ResumePreview.init();
        ResumePreview.setTemplate(currentTemplate);

        // Init form
        FormHandler.init(currentData, onFormChange);
        FormHandler.populateStaticInputs();

        // Build template grid
        buildTemplateGrid();

        // Initial render
        ResumePreview.renderImmediate(currentData);

        // Bind header buttons
        bindActions();
    }

    function onFormChange(data) {
        currentData = data;
        ResumeStorage.save(data);
        ResumePreview.render(data);
    }

    function buildTemplateGrid() {
        var grid = document.getElementById('template-grid');
        if (!grid) return;
        grid.innerHTML = '';

        var templates = TemplateEngine.getTemplates();
        for (var i = 0; i < templates.length; i++) {
            var t = templates[i];
            var card = document.createElement('div');
            card.className = 'template-card' + (t.id === currentTemplate ? ' active' : '');
            card.setAttribute('data-template', t.id);

            var swatch = document.createElement('div');
            swatch.className = 'template-card-swatch';
            var colors = t.colors || {};
            swatch.style.background = colors.accent || colors.primary || '#333';

            var name = document.createElement('span');
            name.className = 'template-card-name';
            name.textContent = t.name;

            card.appendChild(swatch);
            card.appendChild(name);

            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('click', function() {
                var id = this.getAttribute('data-template');
                selectTemplate(id);
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });

            grid.appendChild(card);
        }
    }

    function selectTemplate(id) {
        currentTemplate = id;
        ResumeStorage.saveTemplate(id);
        ResumePreview.setTemplate(id);
        ResumePreview.renderImmediate(currentData);

        // Update active state
        var cards = document.querySelectorAll('.template-card');
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.toggle('active', cards[i].getAttribute('data-template') === id);
        }
    }

    function bindActions() {
        // Export PDF
        var btnPdf = document.getElementById('btn-export-pdf');
        if (btnPdf) {
            btnPdf.addEventListener('click', function() {
                ResumeExport.toPDF();
            });
        }

        // Export JSON
        var btnJson = document.getElementById('btn-export-json');
        if (btnJson) {
            btnJson.addEventListener('click', function() {
                ResumeExport.toJSON(currentData);
            });
        }

        // Clear
        var btnClear = document.getElementById('btn-clear');
        if (btnClear) {
            btnClear.addEventListener('click', function() {
                if (confirm('Clear all data and start fresh?')) {
                    // Backup before clearing
                    var backup = ResumeStorage.load();
                    if (backup) {
                        try { localStorage.setItem('hirvo_resume_backup', JSON.stringify(backup)); } catch(e) {}
                    }
                    ResumeStorage.clear();
                    currentData = ResumeStorage.getDefaultData();
                    FormHandler.setData(currentData);
                    FormHandler.populateStaticInputs();
                    ResumePreview.renderImmediate(currentData);
                }
            });
        }

        // Import JSON
        var btnImport = document.getElementById('btn-import');
        var fileInput = document.getElementById('import-file');
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', function() {
                fileInput.click();
            });
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    ResumeExport.fromJSON(this.files[0], function(err, data) {
                        if (err) {
                            alert('Failed to import: ' + err.message);
                            return;
                        }
                        currentData = data;
                        ResumeStorage.save(data);
                        FormHandler.setData(data);
                        FormHandler.populateStaticInputs();
                        ResumePreview.renderImmediate(data);
                    });
                    this.value = '';
                }
            });
        }
    }

    return { init: init };
})();

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
