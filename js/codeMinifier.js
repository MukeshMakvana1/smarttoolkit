class CodeMinifier {
    constructor() {
        this.input = document.getElementById('minifierInput');
        this.output = document.getElementById('minifierOutput');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.copyBtn = document.querySelector('#codeMinifier .copy-btn');
        this.tabButtons = document.querySelectorAll('#codeMinifier .tab-btn');
        this.currentType = 'html';

        this.init();
    }

    init() {
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveTab(btn);
            });
        });

        this.minifyBtn.addEventListener('click', () => this.minifyCode());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
    }

    setActiveTab(btn) {
        this.tabButtons.forEach(tab => tab.classList.remove('active'));
        btn.classList.add('active');
        this.currentType = btn.dataset.type;
        this.minifyCode();
    }

    minifyCode() {
        let code = this.input.value;
        if (!code) return;

        switch (this.currentType) {
            case 'html':
                code = this.minifyHTML(code);
                break;
            case 'css':
                code = this.minifyCSS(code);
                break;
            case 'js':
                code = this.minifyJS(code);
                break;
        }

        this.output.value = code;
    }

    minifyHTML(code) {
        return code
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/<!--.*?-->/g, '')
            .trim();
    }

    minifyCSS(code) {
        return code
            .replace(/\/\*.*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*:\s*/g, ':')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .trim();
    }

    minifyJS(code) {
        return code
            .replace(/\/\*.*?\*\//g, '')
            .replace(/\/\/.*/g, '')
            .replace(/\s+/g, ' ')
            .replace(/{\s+/g, '{')
            .replace(/}\s+/g, '}')
            .replace(/;\s+/g, ';')
            .replace(/,\s+/g, ',')
            .trim();
    }

    copyOutput() {
        if (!this.output.value) return;
        
        navigator.clipboard.writeText(this.output.value)
            .then(() => {
                this.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    this.copyBtn.textContent = 'Copy Minified Code';
                }, 1000);
            });
    }
}

// Initialize Code Minifier
new CodeMinifier(); 