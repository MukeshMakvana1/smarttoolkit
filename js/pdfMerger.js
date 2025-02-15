class PDFMerger {
    constructor() {
        this.fileInput = document.getElementById('pdfFiles');
        this.addBtn = document.getElementById('addPdfBtn');
        this.mergeBtn = document.getElementById('mergePdfBtn');
        this.pdfList = document.getElementById('pdfList');
        this.progressBar = document.querySelector('#pdfMerger .progress-bar');
        this.progress = document.querySelector('#pdfMerger .progress');
        this.resultArea = document.querySelector('#pdfMerger .result-area');
        
        this.pdfs = [];
        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', () => this.addPDFs());
        this.mergeBtn.addEventListener('click', () => this.mergePDFs());
    }

    async addPDFs() {
        const files = Array.from(this.fileInput.files);
        for (const file of files) {
            if (file.type === 'application/pdf') {
                this.pdfs.push(file);
                this.addPDFToList(file);
            }
        }
        this.mergeBtn.disabled = this.pdfs.length < 2;
        this.fileInput.value = '';
    }

    addPDFToList(file) {
        const item = document.createElement('div');
        item.className = 'pdf-item';
        item.innerHTML = `
            <span>${file.name}</span>
            <button class="remove-btn">×</button>
        `;

        item.querySelector('.remove-btn').addEventListener('click', () => {
            this.pdfs = this.pdfs.filter(f => f !== file);
            item.remove();
            this.mergeBtn.disabled = this.pdfs.length < 2;
        });

        this.pdfList.appendChild(item);
    }

    async mergePDFs() {
        if (this.pdfs.length < 2) return;

        this.showProgress();
        
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            
            for (let i = 0; i < this.pdfs.length; i++) {
                const pdfBytes = await this.readFileAsArrayBuffer(this.pdfs[i]);
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
                
                this.updateProgress((i + 1) / this.pdfs.length * 100);
            }

            const mergedBytes = await mergedPdf.save();
            this.downloadMergedPDF(mergedBytes);
            this.hideProgress();
            this.showSuccess();
        } catch (error) {
            console.error('Merge error:', error);
            this.hideProgress();
            this.showError('Error merging PDFs. Please try again.');
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

    downloadMergedPDF(bytes) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

    showSuccess() {
        this.resultArea.innerHTML = '<div class="success">PDFs merged successfully!</div>';
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize PDF Merger
new PDFMerger(); 