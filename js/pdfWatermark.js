class PDFWatermark {
    constructor() {
        this.pdfInput = document.getElementById('pdfFile');
        this.watermarkText = document.getElementById('watermarkText');
        this.watermarkImage = document.getElementById('watermarkImage');
        this.opacity = document.getElementById('opacity');
        this.processBtn = document.querySelector('#pdfWatermark .process-btn');
        this.progressBar = document.querySelector('#pdfWatermark .progress-bar');
        this.progress = document.querySelector('#pdfWatermark .progress');
        this.resultArea = document.querySelector('#pdfWatermark .result-area');
        
        this.init();
    }

    init() {
        // Load PDF.js library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        };

        this.processBtn.addEventListener('click', () => this.addWatermark());
    }

    async addWatermark() {
        const file = this.pdfInput.files[0];
        if (!file) {
            alert('Please select a PDF file first');
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Get first page to determine dimensions
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1 });
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Draw page
            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;
            
            // Add watermark
            ctx.globalAlpha = this.opacity.value / 100;
            ctx.font = '48px Arial';
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const text = this.watermarkText.value || 'WATERMARK';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            
            // Convert to PDF and display
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            this.displayResult(dataUrl);
            
        } catch (error) {
            alert('Error processing PDF: ' + error.message);
        }
    }

    displayResult(dataUrl) {
        this.resultArea.innerHTML = `
            <div class="watermark-result">
                <img src="${dataUrl}" alt="Watermarked PDF preview">
                <button class="process-btn" onclick="window.open('${dataUrl}', '_blank')">
                    Download PDF
                </button>
            </div>
        `;
    }
}

// Initialize PDF Watermark
new PDFWatermark(); 