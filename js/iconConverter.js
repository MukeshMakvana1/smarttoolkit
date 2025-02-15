class IconConverter {
    constructor() {
        this.input = document.getElementById('iconImage');
        this.format = document.getElementById('iconFormat');
        this.processBtn = document.querySelector('#iconConverter .process-btn');
        this.progressBar = document.querySelector('#iconConverter .progress-bar');
        this.progress = document.querySelector('#iconConverter .progress');
        this.resultArea = document.querySelector('#iconConverter .result-area');
        
        this.init();
    }

    init() {
        this.processBtn.addEventListener('click', () => this.convertToIcon());
    }

    convertToIcon() {
        const file = this.input.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size for icon (32x32 is standard)
                canvas.width = 32;
                canvas.height = 32;
                
                // Draw and scale image to fit canvas
                ctx.drawImage(img, 0, 0, 32, 32);
                
                // Convert to selected format
                const format = this.format.value;
                const mimeType = format === 'ico' ? 'image/x-icon' : `image/${format}`;
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    this.displayResult(url, format);
                }, mimeType);
            };
        };
    }

    displayResult(url, format) {
        this.resultArea.innerHTML = `
            <div class="icon-result">
                <img src="${url}" alt="Converted icon" style="width: 32px; height: 32px;">
                <button class="process-btn" onclick="window.open('${url}', '_blank')">
                    Download .${format}
                </button>
            </div>
        `;
    }
}

// Initialize Icon Converter
new IconConverter(); 