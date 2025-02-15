class ImageCropper {
    constructor() {
        this.input = document.getElementById('cropImage');
        this.cropBtn = document.getElementById('cropBtn');
        this.resetBtn = document.getElementById('resetCropBtn');
        this.cropArea = document.querySelector('.crop-area');
        this.resultArea = document.querySelector('#imageCropper .result-area');
        
        this.cropper = null;
        this.init();
    }

    init() {
        this.input.addEventListener('change', (e) => this.loadImage(e));
        this.cropBtn.addEventListener('click', () => this.cropImage());
        this.resetBtn.addEventListener('click', () => this.resetCrop());
    }

    loadImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.cropArea.innerHTML = `<img src="${e.target.result}" alt="Image to crop">`;
            const image = this.cropArea.querySelector('img');
            
            // Initialize cropper
            this.cropper = new Cropper(image, {
                aspectRatio: NaN,
                viewMode: 2,
                guides: true,
                center: true,
                background: true,
                autoCrop: true,
                movable: true,
                zoomable: true,
                zoomOnTouch: true,
                zoomOnWheel: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: true,
            });

            this.cropBtn.disabled = false;
            this.resetBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    cropImage() {
        if (!this.cropper) return;

        try {
            const canvas = this.cropper.getCroppedCanvas();
            const croppedDataUrl = canvas.toDataURL('image/png');
            
            this.displayResult(croppedDataUrl, canvas.width, canvas.height);
        } catch (error) {
            console.error('Crop error:', error);
            this.showError('Error cropping image. Please try again.');
        }
    }

    resetCrop() {
        if (this.cropper) {
            this.cropper.reset();
        }
    }

    displayResult(dataUrl, width, height) {
        this.resultArea.innerHTML = `
            <div class="result-preview">
                <img src="${dataUrl}" alt="Cropped image">
                <div class="dimensions">
                    <span>${width}px × ${height}px</span>
                </div>
            </div>
            <button class="process-btn" onclick="window.open('${dataUrl}', '_blank')">
                Download Cropped Image
            </button>
        `;
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize Image Cropper
new ImageCropper(); 