class JSONFormatter {
    constructor() {
        this.jsonInput = document.getElementById('jsonInput');
        this.formatBtn = document.getElementById('formatJSON');
        this.minifyBtn = document.getElementById('minifyJSON');
        this.validateBtn = document.getElementById('validateJSON');
        this.statusDiv = document.querySelector('.json-status');
        
        this.init();
    }

    init() {
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.minifyBtn.addEventListener('click', () => this.minifyJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
    }

    formatJSON() {
        try {
            const json = JSON.parse(this.jsonInput.value);
            this.jsonInput.value = JSON.stringify(json, null, 4);
            this.showStatus('JSON formatted successfully', 'success');
        } catch (e) {
            this.showStatus('Invalid JSON: ' + e.message, 'error');
        }
    }

    minifyJSON() {
        try {
            const json = JSON.parse(this.jsonInput.value);
            this.jsonInput.value = JSON.stringify(json);
            this.showStatus('JSON minified successfully', 'success');
        } catch (e) {
            this.showStatus('Invalid JSON: ' + e.message, 'error');
        }
    }

    validateJSON() {
        try {
            JSON.parse(this.jsonInput.value);
            this.showStatus('Valid JSON!', 'success');
        } catch (e) {
            this.showStatus('Invalid JSON: ' + e.message, 'error');
        }
    }

    showStatus(message, type) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = 'json-status ' + type;
        setTimeout(() => {
            this.statusDiv.className = 'json-status';
            this.statusDiv.textContent = '';
        }, 3000);
    }
}

// Initialize JSON Formatter
new JSONFormatter(); 