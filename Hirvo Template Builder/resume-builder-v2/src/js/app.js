/* ========================================
   App — main entry point, orchestrates all modules
   ======================================== */
var App = (function() {
    'use strict';

    var currentData = null;
    var currentTemplate = 'classic';
    var toastTimer = null;

    function init() {
        currentData = ResumeStorage.load() || ResumeStorage.getDefaultData();
        currentTemplate = ResumeStorage.loadTemplate();

        ResumePreview.init();
        ResumePreview.setTemplate(currentTemplate);

        FormHandler.init(currentData, onFormChange);
        FormHandler.populateStaticInputs();

        buildTemplateGrid();
        ResumePreview.renderImmediate(currentData);

        bindActions();
        bindKeyboardShortcuts();
        bindPreviewClicks();
        bindTemplateOverlay();

        updateCompletenessBar();
    }

    function onFormChange(data) {
        currentData = data;
        ResumeStorage.save(data);
        ResumePreview.render(data);
        updateCompletenessBar();
    }

    function updateCompletenessBar() {
        var pct = 0;
        try { pct = FormHandler.getCompleteness(); } catch (e) { return; }

        var fill = document.getElementById('completeness-fill');
        var text = document.getElementById('completeness-text');
        if (!fill || !text) return;

        fill.style.width = pct + '%';
        text.textContent = 'Resume: ' + pct + '%';

        var color;
        if (pct >= 70) color = '#34D399';
        else if (pct >= 40) color = '#FBBF24';
        else color = '#F87171';
        fill.style.background = color;
        text.style.color = color;
    }

    /* --- Template Overlay --- */

    function bindTemplateOverlay() {
        var btnOpen = document.getElementById('btn-template-picker');
        var overlay = document.getElementById('template-overlay');
        var backdrop = document.getElementById('template-overlay-backdrop');
        var btnClose = document.getElementById('btn-close-overlay');

        if (btnOpen && overlay) {
            btnOpen.addEventListener('click', function() { overlay.classList.add('open'); });
        }
        if (backdrop) {
            backdrop.addEventListener('click', function() { overlay.classList.remove('open'); });
        }
        if (btnClose) {
            btnClose.addEventListener('click', function() { overlay.classList.remove('open'); });
        }
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
                overlay.classList.remove('open');
            }
        });
    }

    /* --- Template Grid --- */

    var LAYOUT_TYPES = {
        classic: 'single-col', simple: 'single-col', professional: 'single-col',
        creative: 'single-col', perfecto: 'single-col',
        modern: 'header-accent', elegant: 'header-accent', design: 'two-col'
    };

    function getLayoutSVG(type) {
        if (type === 'two-col') {
            return '<svg width="24" height="32" viewBox="0 0 24 32" fill="none">'
                + '<rect x="1" y="1" width="7" height="30" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>'
                + '<line x1="10" y1="4" x2="23" y2="4" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
                + '<line x1="10" y1="8" x2="20" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '<line x1="10" y1="16" x2="23" y2="16" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
                + '<line x1="10" y1="20" x2="19" y2="20" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '<line x1="3" y1="5" x2="6" y2="5" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '<line x1="3" y1="8" x2="6" y2="8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '</svg>';
        }
        if (type === 'header-accent') {
            return '<svg width="24" height="32" viewBox="0 0 24 32" fill="none">'
                + '<rect x="1" y="1" width="22" height="6" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>'
                + '<line x1="3" y1="11" x2="14" y2="11" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
                + '<line x1="3" y1="14" x2="20" y2="14" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '<line x1="3" y1="22" x2="12" y2="22" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
                + '<line x1="3" y1="25" x2="21" y2="25" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
                + '</svg>';
        }
        return '<svg width="24" height="32" viewBox="0 0 24 32" fill="none">'
            + '<line x1="3" y1="4" x2="15" y2="4" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
            + '<line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
            + '<line x1="3" y1="12" x2="10" y2="12" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
            + '<line x1="3" y1="15" x2="20" y2="15" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
            + '<line x1="3" y1="26" x2="12" y2="26" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>'
            + '<line x1="3" y1="29" x2="19" y2="29" stroke="currentColor" stroke-width="0.8" opacity="0.4"/>'
            + '</svg>';
    }

    function truncateDesc(str, max) {
        if (!str) return '';
        return str.length <= max ? str : str.substring(0, max).replace(/\s+\S*$/, '') + '...';
    }

    function buildTemplateGrid() {
        var grid = document.getElementById('template-grid');
        if (!grid) return;
        grid.innerHTML = '';

        var templates = TemplateEngine.getTemplates();
        for (var i = 0; i < templates.length; i++) {
            (function(t) {
                var card = document.createElement('div');
                card.className = 'template-card' + (t.id === currentTemplate ? ' active' : '');
                card.setAttribute('data-template', t.id);
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-pressed', t.id === currentTemplate ? 'true' : 'false');

                var layoutWrap = document.createElement('div');
                layoutWrap.className = 'template-card-layout';
                var accentColor = (t.colors && (t.colors.accent || t.colors.primary)) || '';
                if (accentColor) layoutWrap.style.setProperty('--_accent', accentColor);
                layoutWrap.innerHTML = getLayoutSVG(LAYOUT_TYPES[t.id] || 'single-col');

                var name = document.createElement('span');
                name.className = 'template-card-name';
                name.textContent = t.name;

                var desc = document.createElement('span');
                desc.className = 'template-card-desc';
                desc.textContent = truncateDesc(t.description, 30);
                desc.setAttribute('title', t.description || '');

                card.appendChild(layoutWrap);
                card.appendChild(name);
                card.appendChild(desc);

                card.addEventListener('click', function() { selectTemplate(t.id, card); });
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectTemplate(t.id, card); }
                });

                grid.appendChild(card);
            })(templates[i]);
        }
    }

    function selectTemplate(id, clickedCard) {
        currentTemplate = id;
        ResumeStorage.saveTemplate(id);
        ResumePreview.setTemplate(id);

        var frame = document.getElementById('preview-frame');
        if (frame) {
            frame.classList.add('loading');
            setTimeout(function() {
                ResumePreview.renderImmediate(currentData);
                setTimeout(function() { frame.classList.remove('loading'); }, 50);
            }, 200);
        } else {
            ResumePreview.renderImmediate(currentData);
        }

        if (clickedCard) {
            clickedCard.classList.add('selecting');
            setTimeout(function() { clickedCard.classList.remove('selecting'); }, 150);
        }

        var cards = document.querySelectorAll('.template-card');
        for (var i = 0; i < cards.length; i++) {
            var isActive = cards[i].getAttribute('data-template') === id;
            cards[i].classList.toggle('active', isActive);
            cards[i].setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }

        var overlay = document.getElementById('template-overlay');
        if (overlay) setTimeout(function() { overlay.classList.remove('open'); }, 300);
    }

    /* --- Button Bindings --- */

    function bindActions() {
        var btnPdf = document.getElementById('btn-export-pdf');
        if (btnPdf) btnPdf.addEventListener('click', function() {
            try { ResumeExport.toPDF(); } catch (e) { console.error('PDF export failed:', e); }
        });

        var btnJson = document.getElementById('btn-export-json');
        if (btnJson) btnJson.addEventListener('click', function() {
            try { ResumeExport.toJSON(currentData); } catch (e) { console.error('JSON export failed:', e); }
        });

        var btnClear = document.getElementById('btn-clear');
        if (btnClear) btnClear.addEventListener('click', function() {
            if (confirm('Clear all data and start fresh?')) {
                var backup = ResumeStorage.load();
                if (backup) try { localStorage.setItem('hirvo_resume_backup', JSON.stringify(backup)); } catch (e) {}
                ResumeStorage.clear();
                currentData = ResumeStorage.getDefaultData();
                FormHandler.setData(currentData);
                FormHandler.populateStaticInputs();
                ResumePreview.renderImmediate(currentData);
                updateCompletenessBar();
                showToast('Data cleared. Backup saved.');
            }
        });

        var btnImport = document.getElementById('btn-import');
        var fileInput = document.getElementById('import-file');
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', function() { fileInput.click(); });
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    ResumeExport.fromJSON(this.files[0], function(err, importedData) {
                        if (err) { showToast('Import failed: ' + err.message); return; }
                        currentData = importedData;
                        ResumeStorage.save(importedData);
                        FormHandler.setData(importedData);
                        FormHandler.populateStaticInputs();
                        ResumePreview.renderImmediate(importedData);
                        updateCompletenessBar();
                        showToast('Resume data imported');
                    });
                    this.value = '';
                }
            });
        }
    }

    function bindKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            var mod = e.ctrlKey || e.metaKey;
            if (!mod) return;
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                try { ResumeExport.toPDF(); } catch (err) {}
            }
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                showToast('Data saved automatically');
            }
        });
    }

    function bindPreviewClicks() {
        document.addEventListener('preview:section-click', function(e) {
            var section = e.detail && e.detail.section;
            if (section) try { FormHandler.scrollToSection(section); } catch (err) {}
        });
    }

    function showToast(message) {
        var el = document.getElementById('toast');
        if (!el) return;
        clearTimeout(toastTimer);
        el.textContent = message;
        el.style.display = 'block';
        el.style.opacity = '1';
        toastTimer = setTimeout(function() {
            el.style.opacity = '0';
            setTimeout(function() { el.style.display = 'none'; }, 300);
        }, 2500);
    }

    return { init: init };
})();

document.addEventListener('DOMContentLoaded', function() { App.init(); });
