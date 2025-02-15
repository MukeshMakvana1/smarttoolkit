class ImageResizer {
    constructor() {
        this.input = document.getElementById('resizeImage');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.aspectRatio = document.getElementById('maintainAspectRatio');
        this.resizeBtn = document.getElementById('resizeBtn');
        this.preview = document.querySelector('#imageResizer .image-preview');
        this.resultArea = document.querySelector('#imageResizer .result-area');
        
        this.originalImage = null;
        this.originalAspectRatio = 1;
        this.init();
    }

    init() {
        this.input.addEventListener('change', (e) => this.loadImage(e));
        this.widthInput.addEventListener('input', () => this.handleDimensionChange('width'));
        this.heightInput.addEventListener('input', () => this.handleDimensionChange('height'));
        this.resizeBtn.addEventListener('click', () => this.resizeImage());
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
                this.originalAspectRatio = this.originalImage.width / this.originalImage.height;
                this.widthInput.value = this.originalImage.width;
                this.heightInput.value = this.originalImage.height;
                this.resizeBtn.disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }

    handleDimensionChange(changedDimension) {
        if (!this.aspectRatio.checked) return;

        if (changedDimension === 'width') {
            const width = parseInt(this.widthInput.value) || 0;
            this.heightInput.value = Math.round(width / this.originalAspectRatio);
        } else {
            const height = parseInt(this.heightInput.value) || 0;
            this.widthInput.value = Math.round(height * this.originalAspectRatio);
        }
    }

    resizeImage() {
        if (!this.originalImage) return;

        const width = parseInt(this.widthInput.value);
        const height = parseInt(this.heightInput.value);

        if (!width || !height) {
            this.showError('Please enter valid dimensions');
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            // Use better quality scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(this.originalImage, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL('image/png');
            
            this.displayResult(resizedDataUrl, width, height);
        } catch (error) {
            console.error('Resize error:', error);
            this.showError('Error resizing image. Please try again.');
        }
    }

    displayResult(dataUrl, width, height) {
        this.resultArea.innerHTML = `
            <div class="result-preview">
                <img src="${dataUrl}" alt="Resized image">
                <div class="dimensions">
                    <span>${width}px × ${height}px</span>
                </div>
            </div>
            <button class="process-btn" onclick="window.open('${dataUrl}', '_blank')">
                Download Resized Image
            </button>
        `;
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize Image Resizer
new ImageResizer(); 