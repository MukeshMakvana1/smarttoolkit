class ImageCompressor {
    constructor() {
        this.input = document.getElementById('compressImage');
        this.qualitySlider = document.getElementById('compressionLevel');
        this.qualityValue = document.getElementById('qualityValue');
        this.compressBtn = document.getElementById('compressBtn');
        this.preview = document.querySelector('#imageCompressor .image-preview');
        this.progressBar = document.querySelector('#imageCompressor .progress-bar');
        this.progress = document.querySelector('#imageCompressor .progress');
        this.resultArea = document.querySelector('#imageCompressor .result-area');
        
        this.originalImage = null;
        this.init();
    }

    init() {
        this.input.addEventListener('change', (e) => this.loadImage(e));
        this.qualitySlider.addEventListener('input', () => {
            this.qualityValue.textContent = `${this.qualitySlider.value}%`;
        });
        this.compressBtn.addEventListener('click', () => this.compressImage());
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.src = e.target.result;
            this.originalImage.onload = () => {
                this.preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                this.compressBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    async compressImage() {
        if (!this.originalImage) return;

        this.showProgress();
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions while maintaining aspect ratio
            let { width, height } = this.calculateDimensions(
                this.originalImage.width,
                this.originalImage.height,
                1920 // Max dimension
            );

            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(this.originalImage, 0, 0, width, height);
            const quality = this.qualitySlider.value / 100;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            
            // Calculate size reduction
            const originalSize = this.getBase64Size(this.originalImage.src);
            const compressedSize = this.getBase64Size(compressedDataUrl);
            const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
            
            this.displayResult(compressedDataUrl, {
                originalSize,
                compressedSize,
                reduction
            });
        } catch (error) {
            console.error('Compression error:', error);
            this.showError('Error compressing image. Please try again.');
        }
        
        this.hideProgress();
    }

    calculateDimensions(width, height, maxDimension) {
        if (width <= maxDimension && height <= maxDimension) {
            return { width, height };
        }

        if (width > height) {
            const newWidth = maxDimension;
            const newHeight = Math.round(height * (maxDimension / width));
            return { width: newWidth, height: newHeight };
        } else {
            const newHeight = maxDimension;
            const newWidth = Math.round(width * (maxDimension / height));
            return { width: newWidth, height: newHeight };
        }
    }

    getBase64Size(base64String) {
        const stringLength = base64String.length - 'data:image/jpeg;base64,'.length;
        return Math.round((stringLength * 3) / 4);
    }

    displayResult(dataUrl, stats) {
        this.resultArea.innerHTML = `
            <div class="result-stats">
                <div class="stat-item">
                    <span class="stat-value">${(stats.originalSize / 1024).toFixed(2)} KB</span>
                    <span class="stat-label">Original Size</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${(stats.compressedSize / 1024).toFixed(2)} KB</span>
                    <span class="stat-label">Compressed Size</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${stats.reduction}%</span>
                    <span class="stat-label">Reduction</span>
                </div>
            </div>
            <button class="process-btn" onclick="window.open('${dataUrl}', '_blank')">
                Download Compressed Image
            </button>
        `;
    }

    showProgress() {
        this.progressBar.classList.remove('hidden');
        this.progress.style.width = '0%';
    }

    hideProgress() {
        this.progressBar.classList.add('hidden');
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize Image Compressor
new ImageCompressor(); 