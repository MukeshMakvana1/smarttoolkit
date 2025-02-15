class PDFSplitter {
    constructor() {
        this.fileInput = document.getElementById('pdfToSplit');
        this.pageRange = document.getElementById('pageRange');
        this.splitBtn = document.getElementById('splitPdfBtn');
        this.splitOptions = document.querySelector('#pdfSplitter .split-options');
        this.progressBar = document.querySelector('#pdfSplitter .progress-bar');
        this.progress = document.querySelector('#pdfSplitter .progress');
        this.resultArea = document.querySelector('#pdfSplitter .result-area');
        
        this.pdfDoc = null;
        this.init();
    }

    init() {
        this.fileInput.addEventListener('change', () => this.loadPDF());
        this.splitBtn.addEventListener('click', () => this.splitPDF());
    }

    async loadPDF() {
        const file = this.fileInput.files[0];
        if (!file) return;

        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            this.pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pageCount = this.pdfDoc.getPageCount();
            
            this.splitOptions.classList.remove('hidden');
            this.pageRange.placeholder = `Enter page ranges (1-${pageCount})`;
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError('Error loading PDF. Please try again.');
        }
    }

    async splitPDF() {
        if (!this.pdfDoc || !this.pageRange.value) return;

        this.showProgress();
        try {
            const ranges = this.parsePageRanges(this.pageRange.value);
            const totalRanges = ranges.length;
            
            for (let i = 0; i < ranges.length; i++) {
                const [start, end] = ranges[i];
                const newPdf = await PDFLib.PDFDocument.create();
                
                const pages = await newPdf.copyPages(this.pdfDoc, 
                    Array.from({length: end - start + 1}, (_, i) => start + i - 1));
                
                pages.forEach(page => newPdf.addPage(page));
                
                const pdfBytes = await newPdf.save();
                this.downloadSplitPDF(pdfBytes, `split_${start}-${end}.pdf`);
                
                this.updateProgress((i + 1) / totalRanges * 100);
            }
            
            this.hideProgress();
            this.showSuccess(`Split into ${totalRanges} PDF(s)`);
        } catch (error) {
            console.error('Split error:', error);
            this.hideProgress();
            this.showError('Error splitting PDF. Please check page ranges and try again.');
        }
    }

    parsePageRanges(input) {
        const ranges = [];
        const parts = input.split(',').map(part => part.trim());
        
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(num => parseInt(num));
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    ranges.push([start, end]);
                }
            } else {
                const page = parseInt(part);
                if (!isNaN(page)) {
                    ranges.push([page, page]);
                }
            }
        }
        
        return ranges.sort((a, b) => a[0] - b[0]);
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    downloadSplitPDF(bytes, filename) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
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

    showSuccess(message) {
        this.resultArea.innerHTML = `<div class="success">${message}</div>`;
    }

    showError(message) {
        this.resultArea.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize PDF Splitter
new PDFSplitter(); 