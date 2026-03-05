/* ========================================
   Storage — localStorage persistence
   Uses window.ResumeStorage to avoid conflict
   with browser's built-in window.Storage
   ======================================== */
window.ResumeStorage = (function() {
    'use strict';

    var STORAGE_KEY = 'hirvo_resume_data';
    var TEMPLATE_KEY = 'hirvo_resume_template';

    function save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage: failed to save', e);
            var banner = document.getElementById('error-banner');
            if (banner) {
                banner.style.display = 'block';
                banner.style.background = '#d97706';
                banner.textContent = 'Warning: Could not save. Storage may be full. Export your data as JSON.';
                setTimeout(function() { banner.style.display = 'none'; }, 8000);
            }
        }
    }

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('Storage: failed to load', e);
            return null;
        }
    }

    function clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TEMPLATE_KEY);
        } catch (e) {
            console.warn('Storage: failed to clear', e);
        }
    }

    function saveTemplate(id) {
        try {
            localStorage.setItem(TEMPLATE_KEY, id);
        } catch (e) {
            console.warn('Storage: failed to save template', e);
        }
    }

    function loadTemplate() {
        try {
            return localStorage.getItem(TEMPLATE_KEY) || 'classic';
        } catch (e) {
            return 'classic';
        }
    }

    function getDefaultData() {
        return JSON.parse(JSON.stringify(SampleData.get()));
    }

    return {
        save: save,
        load: load,
        clear: clear,
        saveTemplate: saveTemplate,
        loadTemplate: loadTemplate,
        getDefaultData: getDefaultData
    };
})();
