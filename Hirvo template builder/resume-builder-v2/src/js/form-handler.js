/* ========================================
   Form Handler — wizard-style single-section view,
   dynamic lists, entry reordering, completeness scoring
   ======================================== */
var FormHandler = (function() {
    'use strict';

    var data = {};
    var onChangeCallback = null;
    var currentStep = 'personal';

    var sectionOrder = ['personal', 'experience', 'education', 'skills', 'languages', 'certifications'];

    function init(initialData, onChange) {
        data = initialData;
        onChangeCallback = onChange;

        bindStepNav();
        bindStaticInputs();
        buildDynamicLists();
        bindAddButtons();
        bindContinueButtons();
        bindBackButtons();
        showSection('personal');
        updateSectionCounts();
        updateSectionCompletionStates();
    }

    function getData() {
        return JSON.parse(JSON.stringify(data));
    }

    function setData(newData) {
        data = newData;
        populateStaticInputs();
        buildDynamicLists();
        notifyChange();
    }

    function notifyChange() {
        updateSectionCounts();
        updateSectionCompletionStates();
        if (onChangeCallback) onChangeCallback(getData());
    }

    /* --- Wizard Navigation --- */

    function bindStepNav() {
        var items = document.querySelectorAll('.step-nav-item');
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function() {
                var target = this.getAttribute('data-step-target');
                if (target) showSection(target);
            });
        }
    }

    function showSection(sectionName) {
        currentStep = sectionName;

        // Hide all sections, show target
        var sections = document.querySelectorAll('.form-section');
        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.remove('active');
        }
        var target = document.querySelector('[data-section="' + sectionName + '"]');
        if (target) target.classList.add('active');

        // Update step nav
        var navItems = document.querySelectorAll('.step-nav-item');
        for (var j = 0; j < navItems.length; j++) {
            navItems[j].classList.remove('active');
            if (navItems[j].getAttribute('data-step-target') === sectionName) {
                navItems[j].classList.add('active');
            }
        }

        // Scroll form panel to top
        var formSections = document.getElementById('form-sections');
        if (formSections) formSections.scrollTop = 0;
    }

    function bindContinueButtons() {
        var buttons = document.querySelectorAll('.btn-continue');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                var next = this.getAttribute('data-next');
                if (next) showSection(next);
            });
        }
    }

    function bindBackButtons() {
        var buttons = document.querySelectorAll('.btn-back');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function() {
                var prev = this.getAttribute('data-prev');
                if (prev) showSection(prev);
            });
        }
    }

    /* --- Section Count Badges --- */

    function updateSectionCounts() {
        var listSections = ['experience', 'education', 'skills', 'languages', 'certifications'];
        for (var i = 0; i < listSections.length; i++) {
            var name = listSections[i];
            var count = (data[name] || []).length;
            var navItem = document.querySelector('.step-nav-item[data-step-target="' + name + '"]');
            if (!navItem) continue;
            var badge = navItem.querySelector('.step-nav-count');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'step-nav-count';
                    badge.style.cssText = 'font-size:9px;font-weight:700;color:var(--t2);margin-left:2px;';
                    var label = navItem.querySelector('.step-nav-label');
                    if (label) label.appendChild(badge);
                }
                badge.textContent = ' (' + count + ')';
            } else if (badge) {
                badge.remove();
            }
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
        for (var i = 0; i < sectionOrder.length; i++) {
            var name = sectionOrder[i];
            var navItem = document.querySelector('.step-nav-item[data-step-target="' + name + '"]');
            if (!navItem) continue;
            if (isSectionComplete(name)) {
                navItem.classList.add('completed');
            } else {
                navItem.classList.remove('completed');
            }
        }
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

    function populateStaticInputs() {
        var inputs = document.querySelectorAll('[data-path]');
        for (var i = 0; i < inputs.length; i++) {
            var path = inputs[i].getAttribute('data-path');
            var val = getNestedValue(data, path);
            inputs[i].value = (val == null) ? '' : val;
        }
    }

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

    function getNestedValue(obj, path) {
        var parts = path.split('.');
        var current = obj;
        for (var i = 0; i < parts.length; i++) {
            if (current == null) return '';
            current = current[parts[i]];
        }
        return (current == null) ? '' : current;
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

    function createListItem(listName, index, itemData, totalCount) {
        var config = listConfigs[listName];
        var div = document.createElement('div');
        div.className = 'list-item';
        div.setAttribute('data-list', listName);
        div.setAttribute('data-index', index);

        var header = document.createElement('div');
        header.className = 'list-item-header';

        var title = document.createElement('span');
        title.className = 'list-item-title';
        var primaryKey = config.fields[0] ? config.fields[0].key : '';
        var primaryVal = primaryKey ? (itemData[primaryKey] || '').trim() : '';
        var secondaryKey = config.fields[1] ? config.fields[1].key : '';
        var secondaryVal = secondaryKey ? (itemData[secondaryKey] || '').trim() : '';
        if (primaryVal && secondaryVal) {
            var sep = (listName === 'skills') ? ': ' : (listName === 'languages') ? ' — ' : ' at ';
            title.textContent = primaryVal + sep + secondaryVal;
        } else if (primaryVal) {
            title.textContent = primaryVal;
        } else {
            title.textContent = (listName.charAt(0).toUpperCase() + listName.slice(1)).replace(/s$/, '') + ' ' + (index + 1);
        }
        header.appendChild(title);

        var actions = document.createElement('span');
        actions.className = 'list-item-actions';

        // Move Up
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
            moveEntry(this.getAttribute('data-list'), parseInt(this.getAttribute('data-index'), 10), -1);
        });
        actions.appendChild(btnUp);

        // Move Down
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
            moveEntry(this.getAttribute('data-list'), parseInt(this.getAttribute('data-index'), 10), 1);
        });
        actions.appendChild(btnDown);

        // Remove
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

        // Fields
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

    /* --- Completeness Scoring --- */

    function getCompleteness() {
        var score = 0;
        var p = data.personal || {};

        if (p.firstName && p.firstName.trim()) score += 10;
        if (p.lastName && p.lastName.trim()) score += 10;
        if (p.title && p.title.trim()) score += 8;
        if (p.email && p.email.trim()) score += 8;
        if (p.summary && p.summary.trim()) score += 14;

        var exp = data.experience || [];
        if (exp.length > 0) {
            for (var i = 0; i < exp.length; i++) {
                if (exp[i].role && exp[i].role.trim() && exp[i].company && exp[i].company.trim()) {
                    score += 20;
                    break;
                }
            }
        }

        var edu = data.education || [];
        if (edu.length > 0) {
            for (var j = 0; j < edu.length; j++) {
                if (edu[j].degree && edu[j].degree.trim() && edu[j].institution && edu[j].institution.trim()) {
                    score += 15;
                    break;
                }
            }
        }

        var sk = data.skills || [];
        if (sk.length > 0) {
            for (var s = 0; s < sk.length; s++) {
                if (sk[s].category && sk[s].category.trim()) { score += 10; break; }
            }
        }

        var lang = data.languages || [];
        if (lang.length > 0) {
            for (var l = 0; l < lang.length; l++) {
                if (lang[l].language && lang[l].language.trim()) { score += 3; break; }
            }
        }

        var cert = data.certifications || [];
        if (cert.length > 0) {
            for (var c = 0; c < cert.length; c++) {
                if (cert[c].name && cert[c].name.trim()) { score += 2; break; }
            }
        }

        return Math.min(score, 100);
    }

    /* --- Public scrollToSection (for preview clicks) --- */

    function scrollToSection(sectionName) {
        showSection(sectionName);
    }

    return {
        init: init,
        getData: getData,
        setData: setData,
        populateStaticInputs: populateStaticInputs,
        getCompleteness: getCompleteness,
        showSection: showSection,
        scrollToSection: scrollToSection
    };
})();
