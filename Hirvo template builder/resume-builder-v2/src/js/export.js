/* ========================================
   Export — PDF and JSON export with validation
   ======================================== */
var ResumeExport = (function() {
    'use strict';

    function toPDF() {
        var iframe = document.getElementById('preview-frame');
        if (!iframe || !iframe.contentWindow) {
            alert('Preview not ready. Please wait and try again.');
            return;
        }
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (e) {
            // Fallback: open in new window (Safari iframe print workaround)
            var win = window.open('', '_blank');
            if (win) {
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                win.document.write(doc.documentElement.outerHTML);
                win.document.close();
                win.print();
            } else {
                alert('Could not open print dialog. Try right-clicking the preview and selecting Print.');
            }
        }
    }

    function toJSON(data) {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'resume-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function validateResumeData(data) {
        if (!data || typeof data !== 'object') return false;
        if (data.personal && typeof data.personal !== 'object') return false;
        var arrays = ['experience', 'education', 'skills', 'languages', 'certifications'];
        for (var i = 0; i < arrays.length; i++) {
            if (data[arrays[i]] && !Array.isArray(data[arrays[i]])) return false;
        }
        return true;
    }

    function fromJSON(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            try {
                var data = JSON.parse(e.target.result);
                if (!validateResumeData(data)) {
                    callback(new Error('Invalid resume data structure'));
                    return;
                }
                callback(null, data);
            } catch (err) {
                callback(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = function() {
            callback(new Error('Failed to read file'));
        };
        reader.readAsText(file);
    }

    return {
        toPDF: toPDF,
        toJSON: toJSON,
        fromJSON: fromJSON
    };
})();
