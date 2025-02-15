class TextCaseConverter {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.resultArea = document.querySelector('#textCaseConverter .result-area');
        this.buttons = document.querySelectorAll('#textCaseConverter .process-btn');
        
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const caseType = button.dataset.case;
                this.convertCase(caseType);
            });
        });
    }

    convertCase(type) {
        const text = this.textInput.value;
        let result = '';

        switch(type) {
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'title':
                result = text.toLowerCase().split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                break;
        }

        this.displayResult(result);
    }

    displayResult(text) {
        this.resultArea.innerHTML = `
            <div class="result-text">
                <p>${text}</p>
                <button class="process-btn" onclick="navigator.clipboard.writeText('${text.replace(/'/g, "\\'")}')">
                    Copy to Clipboard
                </button>
            </div>
        `;
    }
}

// Initialize the converter
new TextCaseConverter(); 