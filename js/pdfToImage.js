class PDFToImage {
    constructor() {
        this.fileInput = document.getElementById('pdfForImage');
        this.imageFormat = document.getElementById('imageFormat');
        this.imageQuality = document.getElementById('imageQuality');
        this.convertBtn = document.getElementById('convertToImageBtn');
        this.conversionOptions = document.querySelector('#pdfToImage .conversion-options');
        this.progressBar = document.querySelector('#pdfToImage .progress-bar');
        this.progress = document.querySelector('#pdfToImage .progress');
        this.resultArea = document.querySelector('#pdfToImage .result-area');
        
        this.pdfDoc = null;
        this.init();
    }

    init() {
        this.fileInput.addEventListener('change', () => this.loadPDF());
        this.convertBtn.addEventListener('click', () => this.convertToImages());
    }

    async loadPDF() {
        const file = this.fileInput.files[0];
        if (!file) return;

        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            this.pdfDoc = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            this.conversionOptions.classList.remove('hidden');
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError('Error loading PDF. Please try again.');
        }
    }

    async convertToImages() {
        if (!this.pdfDoc) return;

        this.showProgress();
        const totalPages = this.pdfDoc.numPages;
        const format = this.imageFormat.value;
        const quality = this.getQualityValue();

        try {
            for (let i = 1; i <= totalPages; i++) {
                const page = await this.pdfDoc.getPage(i);
                const viewport = page.getViewport({scale: 2.0}); // Higher scale for better quality
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                const imageData = canvas.toDataURL(`image/${format}`, quality);
                this.downloadImage(imageData, `page_${i}.${format}`);
                
                this.updateProgress(i / totalPages * 100);
            }

            this.hideProgress();
            this.showSuccess(`Converted ${totalPages} pages to images`);
        } catch (error) {
            console.error('Conversion error:', error);
            this.hideProgress();
            this.showError('Error converting PDF to images. Please try again.');
        }
    }

    getQualityValue() {
        switch(this.imageQuality.value) {
            case 'high': return 1.0;
            case 'medium': return 0.75;
            case 'low': return 0.5;
            default: return 0.75;
        }
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    downloadImage(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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

    showSuccess(message) {
        this.resultArea.innerHTML = `<div class="success">${message}</div>`;
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize PDF to Image Converter
new PDFToImage(); 