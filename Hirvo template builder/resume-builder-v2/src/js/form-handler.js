/* ========================================
   Form Handler — accordion sections + dynamic lists
   ======================================== */
var FormHandler = (function() {
    'use strict';

    var data = {};
    var onChangeCallback = null;
    var openTimers = {};

    function init(initialData, onChange) {
        data = initialData;
        onChangeCallback = onChange;
        bindSectionHeaders();
        bindStaticInputs();
        buildDynamicLists();
        bindAddButtons();
        openSection('personal');
        updateSectionCounts();
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
        if (onChangeCallback) onChangeCallback(getData());
    }

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
        // Temporarily remove cap to measure true height
        body.style.maxHeight = 'none';
        var h = body.scrollHeight;
        body.style.maxHeight = '0px';
        body.offsetHeight; // force reflow
        body.style.maxHeight = h + 'px';

        openTimers[id] = setTimeout(function() {
            if (section.classList.contains('open')) {
                body.style.maxHeight = 'none';
            }
        }, 450);
    }

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
                container.appendChild(createListItem(listName, i, items[i]));
            }
        }
    }

    function createListItem(listName, index, itemData) {
        var config = listConfigs[listName];
        var div = document.createElement('div');
        div.className = 'list-item';
        div.setAttribute('data-list', listName);
        div.setAttribute('data-index', index);

        var header = document.createElement('div');
        header.className = 'list-item-header';
        var title = document.createElement('span');
        title.className = 'list-item-title';
        title.textContent = (config.fields[0] ? (itemData[config.fields[0].key] || config.fields[0].placeholder) : listName) + ' #' + (index + 1);
        header.appendChild(title);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.type = 'button';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('data-list', listName);
        removeBtn.setAttribute('data-index', index);
        removeBtn.addEventListener('click', function() {
            var ln = this.getAttribute('data-list');
            var idx = parseInt(this.getAttribute('data-index'), 10);
            data[ln].splice(idx, 1);
            buildDynamicLists();
            notifyChange();
        });
        header.appendChild(removeBtn);
        div.appendChild(header);

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

    return {
        init: init,
        getData: getData,
        setData: setData,
        populateStaticInputs: populateStaticInputs
    };
})();
