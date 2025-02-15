class PDFToWord {
    constructor() {
        this.pdfInput = document.getElementById('pdfFile');
        this.convertBtn = document.getElementById('convertToWordBtn');
        this.progressBar = document.querySelector('#pdfToWord .progress-bar');
        this.progress = document.querySelector('#pdfToWord .progress');
        this.resultArea = document.querySelector('#pdfToWord .result-area');
        
        this.init();
    }

    init() {
        // Initialize PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        this.convertBtn.addEventListener('click', () => this.convertToWord());
        this.pdfInput.addEventListener('change', () => {
            this.convertBtn.disabled = !this.pdfInput.files.length;
        });
    }

    async convertToWord() {
        const file = this.pdfInput.files[0];
        if (!file) return;

        this.showProgress();
        this.resultArea.innerHTML = '<div class="processing">Converting PDF to Word...</div>';

        try {
            // Load PDF
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;

            // Create Word document
            const doc = new docx.Document({
                sections: [{
                    properties: {},
                    children: []
                }]
            });

            // Process each page
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Extract text and maintain some formatting
                const paragraphs = this.processTextContent(textContent);
                
                // Add paragraphs to document
                doc.addSection({
                    properties: {
                        page: {
                            margin: {
                                top: 1440, // 1 inch
                                right: 1440,
                                bottom: 1440,
                                left: 1440
                            }
                        }
                    },
                    children: paragraphs
                });

                this.updateProgress((pageNum / numPages) * 100);
            }

            // Generate Word document
            const buffer = await docx.Packer.toBlob(doc);
            const docxFileName = file.name.replace('.pdf', '.docx');
            
            // Save file using FileSaver.js
            saveAs(buffer, docxFileName);
            
            this.showSuccess('PDF converted to Word successfully!');
        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('Error converting PDF to Word. Please try again.');
        }

        this.hideProgress();
    }

    processTextContent(textContent) {
        const paragraphs = [];
        let currentParagraph = [];
        let lastY = null;
        const items = textContent.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // Check if this is a new paragraph based on vertical position
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 10) {
                if (currentParagraph.length > 0) {
                    paragraphs.push(new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: currentParagraph.join(' '),
                                size: 24, // 12pt
                                font: 'Arial'
                            })
                        ],
                        spacing: {
                            after: 200
                        }
                    }));
                    currentParagraph = [];
                }
            }

            currentParagraph.push(item.str);
            lastY = item.transform[5];
        }

        // Add the last paragraph
        if (currentParagraph.length > 0) {
            paragraphs.push(new docx.Paragraph({
                children: [
                    new docx.TextRun({
                        text: currentParagraph.join(' '),
                        size: 24,
                        font: 'Arial'
                    })
                ]
            }));
        }

        return paragraphs;
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
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

// Initialize PDF to Word Converter
new PDFToWord(); 