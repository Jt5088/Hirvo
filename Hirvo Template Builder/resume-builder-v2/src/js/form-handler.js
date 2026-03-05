/* ========================================
   Form Handler — accordion sections, dynamic lists,
   section reordering, entry reordering, completeness scoring
   ======================================== */
var FormHandler = (function() {
    'use strict';

    var data = {};
    var onChangeCallback = null;
    var openTimers = {};

    /* Default section order for reorderable sections */
    var defaultSectionOrder = ['experience', 'education', 'skills', 'languages', 'certifications'];

    /* --- Init --- */
    function init(initialData, onChange) {
        data = initialData;
        onChangeCallback = onChange;

        // Restore or set default section order
        if (!data._sectionOrder || !Array.isArray(data._sectionOrder)) {
            data._sectionOrder = defaultSectionOrder.slice();
        }

        applySectionOrder();
        bindSectionHeaders();
        bindStaticInputs();
        buildDynamicLists();
        bindAddButtons();
        bindContinueButtons();
        openSection('personal');
        updateSectionCounts();
        updateSectionCompletionStates();
        bindPreviewClicks();
    }

    /* Return deep copy of data */
    function getData() {
        return JSON.parse(JSON.stringify(data));
    }

    /* Replace data and rebuild UI */
    function setData(newData) {
        data = newData;
        if (!data._sectionOrder || !Array.isArray(data._sectionOrder)) {
            data._sectionOrder = defaultSectionOrder.slice();
        }
        applySectionOrder();
        populateStaticInputs();
        buildDynamicLists();
        notifyChange();
    }

    /* Fire change callback */
    function notifyChange() {
        updateSectionCounts();
        updateSectionCompletionStates();
        if (onChangeCallback) onChangeCallback(getData());
    }

    /* --- Section Count Badges --- */
    function updateSectionCounts() {
        var sections = ['experience', 'education', 'skills', 'languages', 'certifications'];
        for (var i = 0; i < sections.length; i++) {
            var name = sections[i];
            var count = (data[name] || []).length;
            var header = document.querySelector('[data-section="' + name + '"] .section-title');
            if (!header) continue;
            var badge = header.querySelector('.section-count');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'section-count';
                    header.appendChild(badge);
                }
                badge.textContent = count;
            } else if (badge) {
                badge.remove();
            }
        }
    }

    /* --- Accordion --- */
    function bindSectionHeaders() {
        var headers = document.querySelectorAll('.section-header');
        for (var i = 0; i < headers.length; i++) {
            headers[i].addEventListener('click', function() {
                var section = this.closest('.form-section');
                if (section.classList.contains('open')) {
                    closeSection(section);
                } else {
                    openSection(section);
                }
            });
        }
    }

    /* Open an accordion section with smooth transition */
    function openSection(sectionOrName) {
        var section = sectionOrName;
        if (typeof sectionOrName === 'string') {
            section = document.querySelector('[data-section="' + sectionOrName + '"]');
        }
        if (!section) return;
        var body = section.querySelector('.section-body');
        if (!body) return;

        var id = section.getAttribute('data-section');
        clearTimeout(openTimers[id]);

        section.classList.add('open');
        body.style.maxHeight = 'none';
        var h = body.scrollHeight;
        body.style.maxHeight = '0px';
        body.offsetHeight; // force reflow
        body.style.maxHeight = h + 'px';

        // After transition, uncap height so dynamic content can grow
        openTimers[id] = setTimeout(function() {
            if (section.classList.contains('open')) {
                body.style.maxHeight = 'none';
            }
        }, 450);
    }

    /* Close an accordion section */
    function closeSection(section) {
        if (!section) return;
        var body = section.querySelector('.section-body');
        if (!body) return;

        var id = section.getAttribute('data-section');
        clearTimeout(openTimers[id]);

        body.style.maxHeight = body.scrollHeight + 'px';
        body.offsetHeight; // force reflow
        section.classList.remove('open');
        body.style.maxHeight = '0px';
    }

    /* --- Static Inputs --- */
    function bindStaticInputs() {
        var inputs = document.querySelectorAll('[data-path]');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', function() {
                var path = this.getAttribute('data-path');
                setNestedValue(data, path, this.value);
                notifyChange();
            });
        }
    }

    /* Fill static inputs from current data */
    function populateStaticInputs() {
        var inputs = document.querySelectorAll('[data-path]');
        for (var i = 0; i < inputs.length; i++) {
            var path = inputs[i].getAttribute('data-path');
            var val = getNestedValue(data, path);
            inputs[i].value = (val == null) ? '' : val;
        }
    }

    /* Set a deeply nested value by dot-path */
    function setNestedValue(obj, path, value) {
        if (!obj || typeof obj !== 'object') return;
        var parts = path.split('.');
        var current = obj;
        for (var i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] == null || typeof current[parts[i]] !== 'object') {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }

    /* Get a deeply nested value by dot-path */
    function getNestedValue(obj, path) {
        var parts = path.split('.');
        var current = obj;
        for (var i = 0; i < parts.length; i++) {
            if (current == null) return '';
            current = current[parts[i]];
        }
        return (current == null) ? '' : current;
    }

    /* --- Section Reordering --- */

    /* Apply stored section order to the DOM */
    function applySectionOrder() {
        var container = document.getElementById('form-sections');
        if (!container) return;
        var order = data._sectionOrder || defaultSectionOrder;
        for (var i = 0; i < order.length; i++) {
            var el = container.querySelector('[data-section="' + order[i] + '"]');
            if (el) container.appendChild(el);
        }
    }

    /* Move a section up or down in the order */
    function moveSectionInOrder(sectionName, direction) {
        var order = data._sectionOrder;
        if (!order) return;
        var idx = order.indexOf(sectionName);
        if (idx === -1) return;
        var target = idx + direction;
        if (target < 0 || target >= order.length) return;

        // Swap
        var tmp = order[idx];
        order[idx] = order[target];
        order[target] = tmp;

        applySectionOrder();
        notifyChange();
    }

    /* --- Dynamic Lists --- */
    var listConfigs = {
        experience: {
            fields: [
                { key: 'role', label: 'Job Title', type: 'text', placeholder: 'Software Engineer' },
                { key: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
                { key: 'startDate', label: 'Start Date', type: 'text', placeholder: 'Jan 2020', half: true },
                { key: 'endDate', label: 'End Date', type: 'text', placeholder: 'Present', half: true },
                { key: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your responsibilities...' }
            ],
            empty: { role: '', company: '', startDate: '', endDate: '', location: '', description: '' }
        },
        education: {
            fields: [
                { key: 'degree', label: 'Degree', type: 'text', placeholder: 'B.S. Computer Science' },
                { key: 'institution', label: 'Institution', type: 'text', placeholder: 'MIT' },
                { key: 'startDate', label: 'Start Date', type: 'text', placeholder: '2016', half: true },
                { key: 'endDate', label: 'End Date', type: 'text', placeholder: '2020', half: true },
                { key: 'description', label: 'Details', type: 'textarea', placeholder: 'Relevant coursework, honors...' }
            ],
            empty: { degree: '', institution: '', startDate: '', endDate: '', description: '' }
        },
        skills: {
            fields: [
                { key: 'category', label: 'Category', type: 'text', placeholder: 'Programming Languages' },
                { key: 'items', label: 'Skills', type: 'text', placeholder: 'JavaScript, Python, Go' }
            ],
            empty: { category: '', items: '' }
        },
        languages: {
            fields: [
                { key: 'language', label: 'Language', type: 'text', placeholder: 'English', half: true },
                { key: 'proficiency', label: 'Level', type: 'text', placeholder: 'Native', half: true }
            ],
            empty: { language: '', proficiency: '' }
        },
        certifications: {
            fields: [
                { key: 'name', label: 'Certification', type: 'text', placeholder: 'AWS Certified Solutions Architect' },
                { key: 'year', label: 'Year', type: 'text', placeholder: '2023' }
            ],
            empty: { name: '', year: '' }
        }
    };

    /* Rebuild all dynamic list UIs from data */
    function buildDynamicLists() {
        var keys = Object.keys(listConfigs);
        for (var k = 0; k < keys.length; k++) {
            var listName = keys[k];
            var container = document.getElementById(listName + '-list');
            if (!container) continue;
            container.innerHTML = '';
            var items = data[listName] || [];
            for (var i = 0; i < items.length; i++) {
                container.appendChild(createListItem(listName, i, items[i], items.length));
            }
        }
    }

    /* Create a single list entry with fields and action buttons */
    function createListItem(listName, index, itemData, totalCount) {
        var config = listConfigs[listName];
        var div = document.createElement('div');
        div.className = 'list-item';
        div.setAttribute('data-list', listName);
        div.setAttribute('data-index', index);

        // Header row with title, move buttons, remove button
        var header = document.createElement('div');
        header.className = 'list-item-header';

        var title = document.createElement('span');
        title.className = 'list-item-title';
        var primaryVal = config.fields[0] ? (itemData[config.fields[0].key] || config.fields[0].placeholder) : listName;
        title.textContent = primaryVal + ' #' + (index + 1);
        header.appendChild(title);

        var actions = document.createElement('span');
        actions.className = 'list-item-actions';

        // Move Up button (disabled if first)
        var btnUp = document.createElement('button');
        btnUp.className = 'btn-move';
        btnUp.type = 'button';
        btnUp.innerHTML = '&#9650;';
        btnUp.title = 'Move up';
        btnUp.disabled = (index === 0);
        btnUp.setAttribute('data-list', listName);
        btnUp.setAttribute('data-index', index);
        btnUp.addEventListener('click', function(e) {
            e.stopPropagation();
            var ln = this.getAttribute('data-list');
            var idx = parseInt(this.getAttribute('data-index'), 10);
            moveEntry(ln, idx, -1);
        });
        actions.appendChild(btnUp);

        // Move Down button (disabled if last)
        var btnDown = document.createElement('button');
        btnDown.className = 'btn-move';
        btnDown.type = 'button';
        btnDown.innerHTML = '&#9660;';
        btnDown.title = 'Move down';
        btnDown.disabled = (index === totalCount - 1);
        btnDown.setAttribute('data-list', listName);
        btnDown.setAttribute('data-index', index);
        btnDown.addEventListener('click', function(e) {
            e.stopPropagation();
            var ln = this.getAttribute('data-list');
            var idx = parseInt(this.getAttribute('data-index'), 10);
            moveEntry(ln, idx, 1);
        });
        actions.appendChild(btnDown);

        // Remove button
        var removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.type = 'button';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove entry';
        removeBtn.setAttribute('data-list', listName);
        removeBtn.setAttribute('data-index', index);
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var ln = this.getAttribute('data-list');
            var idx = parseInt(this.getAttribute('data-index'), 10);
            if (data[ln]) {
                data[ln].splice(idx, 1);
                buildDynamicLists();
                notifyChange();
            }
        });
        actions.appendChild(removeBtn);

        header.appendChild(actions);
        div.appendChild(header);

        // Build field inputs
        var inHalf = false;
        var halfRow = null;

        for (var f = 0; f < config.fields.length; f++) {
            var field = config.fields[f];
            var fieldDiv = document.createElement('div');
            fieldDiv.className = 'field';

            var label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = field.label;
            fieldDiv.appendChild(label);

            var input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'form-input form-textarea';
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = field.type || 'text';
                input.className = 'form-input';
            }
            input.placeholder = field.placeholder || '';
            input.value = itemData[field.key] || '';
            input.setAttribute('data-list', listName);
            input.setAttribute('data-index', index);
            input.setAttribute('data-field', field.key);
            input.addEventListener('input', function() {
                var ln = this.getAttribute('data-list');
                var idx = parseInt(this.getAttribute('data-index'), 10);
                var fld = this.getAttribute('data-field');
                if (data[ln] && data[ln][idx]) {
                    data[ln][idx][fld] = this.value;
                    notifyChange();
                }
            });
            fieldDiv.appendChild(input);

            if (field.half) {
                if (!inHalf) {
                    halfRow = document.createElement('div');
                    halfRow.className = 'field-row';
                    inHalf = true;
                    halfRow.appendChild(fieldDiv);
                } else {
                    halfRow.appendChild(fieldDiv);
                    div.appendChild(halfRow);
                    inHalf = false;
                    halfRow = null;
                }
            } else {
                if (inHalf && halfRow) {
                    div.appendChild(halfRow);
                    inHalf = false;
                    halfRow = null;
                }
                div.appendChild(fieldDiv);
            }
        }
        if (inHalf && halfRow) {
            div.appendChild(halfRow);
        }

        return div;
    }

    /* Move an entry within its list array */
    function moveEntry(listName, index, direction) {
        var arr = data[listName];
        if (!arr) return;
        var target = index + direction;
        if (target < 0 || target >= arr.length) return;

        var tmp = arr[index];
        arr[index] = arr[target];
        arr[target] = tmp;

        buildDynamicLists();
        notifyChange();
    }

    /* Bind add-entry buttons */
    function bindAddButtons() {
        var buttons = document.querySelectorAll('[data-list].btn-add');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                var listName = this.getAttribute('data-list');
                var config = listConfigs[listName];
                if (!config) return;
                if (!data[listName]) data[listName] = [];
                data[listName].push(JSON.parse(JSON.stringify(config.empty)));
                buildDynamicLists();
                notifyChange();
            });
        }
    }

    /* --- Preview Click Coordination --- */

    /* Listen for clicks from preview iframe to scroll to that section */
    function bindPreviewClicks() {
        document.addEventListener('preview:section-click', function(e) {
            var sectionName = e.detail && e.detail.section;
            if (!sectionName) return;
            scrollToSection(sectionName);
        });
    }

    /* Open and scroll to a form section */
    function scrollToSection(sectionName) {
        var section = document.querySelector('[data-section="' + sectionName + '"]');
        if (!section) return;

        // Open it if closed
        if (!section.classList.contains('open')) {
            openSection(section);
        }

        // Scroll into view
        try {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {
            section.scrollIntoView(true);
        }
    }

    /* --- Continue Buttons (guided flow) --- */

    function bindContinueButtons() {
        var buttons = document.querySelectorAll('.btn-continue');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                var nextSection = this.getAttribute('data-next');
                if (!nextSection) return;

                // Close current section
                var current = this.closest('.form-section');
                if (current) closeSection(current);

                // Open next section after brief delay for smooth transition
                setTimeout(function() {
                    openSection(nextSection);
                    var nextEl = document.querySelector('[data-section="' + nextSection + '"]');
                    if (nextEl) {
                        try {
                            nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } catch (e) {
                            nextEl.scrollIntoView(true);
                        }
                    }
                }, 200);
            });
        }
    }

    /* --- Section Completion States --- */

    function isSectionComplete(sectionName) {
        var p = data.personal || {};
        switch (sectionName) {
            case 'personal':
                return !!(p.firstName && p.firstName.trim() && p.lastName && p.lastName.trim() && p.email && p.email.trim());
            case 'experience':
                var exp = data.experience || [];
                return exp.length > 0 && exp.some(function(e) { return e.role && e.role.trim() && e.company && e.company.trim(); });
            case 'education':
                var edu = data.education || [];
                return edu.length > 0 && edu.some(function(e) { return e.degree && e.degree.trim() && e.institution && e.institution.trim(); });
            case 'skills':
                var sk = data.skills || [];
                return sk.length > 0 && sk.some(function(s) { return s.category && s.category.trim() && s.items && s.items.trim(); });
            case 'languages':
                var lang = data.languages || [];
                return lang.length > 0 && lang.some(function(l) { return l.language && l.language.trim(); });
            case 'certifications':
                var cert = data.certifications || [];
                return cert.length > 0 && cert.some(function(c) { return c.name && c.name.trim(); });
            default:
                return false;
        }
    }

    function updateSectionCompletionStates() {
        var sections = ['personal', 'experience', 'education', 'skills', 'languages', 'certifications'];
        for (var i = 0; i < sections.length; i++) {
            var el = document.querySelector('[data-section="' + sections[i] + '"]');
            if (!el) continue;
            if (isSectionComplete(sections[i])) {
                el.classList.add('completed');
            } else {
                el.classList.remove('completed');
            }
        }
    }

    /* --- Completeness Scoring --- */

    /* Calculate resume completeness as 0-100 */
    function getCompleteness() {
        var score = 0;
        var p = data.personal || {};

        // Personal fields (50% total)
        if (p.firstName && p.firstName.trim()) score += 10;
        if (p.lastName && p.lastName.trim()) score += 10;
        if (p.title && p.title.trim()) score += 8;
        if (p.email && p.email.trim()) score += 8;
        if (p.summary && p.summary.trim()) score += 14;

        // Experience: at least 1 entry with role+company (20%)
        var exp = data.experience || [];
        if (exp.length > 0) {
            var hasValid = false;
            for (var i = 0; i < exp.length; i++) {
                if (exp[i].role && exp[i].role.trim() && exp[i].company && exp[i].company.trim()) {
                    hasValid = true;
                    break;
                }
            }
            if (hasValid) score += 20;
        }

        // Education: at least 1 entry with degree+institution (15%)
        var edu = data.education || [];
        if (edu.length > 0) {
            var hasValidEdu = false;
            for (var j = 0; j < edu.length; j++) {
                if (edu[j].degree && edu[j].degree.trim() && edu[j].institution && edu[j].institution.trim()) {
                    hasValidEdu = true;
                    break;
                }
            }
            if (hasValidEdu) score += 15;
        }

        // Skills: at least 1 category (10%)
        var sk = data.skills || [];
        if (sk.length > 0) {
            for (var s = 0; s < sk.length; s++) {
                if (sk[s].category && sk[s].category.trim()) {
                    score += 10;
                    break;
                }
            }
        }

        // Optional: languages (3%)
        var lang = data.languages || [];
        if (lang.length > 0) {
            for (var l = 0; l < lang.length; l++) {
                if (lang[l].language && lang[l].language.trim()) {
                    score += 3;
                    break;
                }
            }
        }

        // Optional: certifications (2%)
        var cert = data.certifications || [];
        if (cert.length > 0) {
            for (var c = 0; c < cert.length; c++) {
                if (cert[c].name && cert[c].name.trim()) {
                    score += 2;
                    break;
                }
            }
        }

        return Math.min(score, 100);
    }

    return {
        init: init,
        getData: getData,
        setData: setData,
        populateStaticInputs: populateStaticInputs,
        getCompleteness: getCompleteness,
        openSection: openSection,
        scrollToSection: scrollToSection,
        moveSectionInOrder: moveSectionInOrder
    };
})();
