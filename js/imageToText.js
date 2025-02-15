class ImageToText {
    constructor() {
        this.input = document.getElementById('ocrImage');
        this.language = document.getElementById('ocrLanguage');
        this.extractBtn = document.getElementById('extractTextBtn');
        this.preview = document.querySelector('#imageToText .image-preview');
        this.progressBar = document.querySelector('#imageToText .progress-bar');
        this.progress = document.querySelector('#imageToText .progress');
        this.resultArea = document.querySelector('#imageToText .result-area');
        
        this.init();
    }

    init() {
        this.input.addEventListener('change', (e) => this.loadImage(e));
        this.extractBtn.addEventListener('click', () => this.extractText());
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            this.extractBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    async extractText() {
        const image = this.preview.querySelector('img');
        if (!image) return;

        this.showProgress();
        this.resultArea.innerHTML = '<div class="processing">Processing image...</div>';

        try {
            const worker = Tesseract.createWorker({
                logger: progress => {
                    if (progress.status === 'recognizing text') {
                        this.updateProgress(progress.progress * 100);
                    }
                }
            });

            await worker.load();
            await worker.loadLanguage(this.language.value);
            await worker.initialize(this.language.value);
            
            const result = await worker.recognize(image.src);
            await worker.terminate();

            this.displayResult(result.data.text);
        } catch (error) {
            console.error('OCR error:', error);
            this.showError('Error extracting text. Please try again.');
        }

        this.hideProgress();
    }

    displayResult(text) {
        this.resultArea.innerHTML = `
            <div class="ocr-result">
                <textarea readonly rows="10">${text}</textarea>
                <button class="process-btn" onclick="navigator.clipboard.writeText('${text.replace(/'/g, "\\'")}')">
                    Copy to Clipboard
                </button>
            </div>
        `;
    }

    showProgress() {
        this.progressBar.classList.remove('hidden');
        this.progress.style.width = '0%';
    }

    updateProgress(percent) {
        this.progress.style.width = `${percent}%`;
    }

    hideProgress() {
        this.progressBar.classList.add('hidden');
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize Image to Text
new ImageToText(); 