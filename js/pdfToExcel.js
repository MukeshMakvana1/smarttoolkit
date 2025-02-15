class PDFToExcel {
    constructor() {
        this.pdfInput = document.getElementById('pdfForExcel');
        this.includeHeaders = document.getElementById('includeHeaders');
        this.detectTables = document.getElementById('detectTables');
        this.convertBtn = document.getElementById('convertToExcelBtn');
        this.progressBar = document.querySelector('#pdfToExcel .progress-bar');
        this.progress = document.querySelector('#pdfToExcel .progress');
        this.resultArea = document.querySelector('#pdfToExcel .result-area');
        
        this.init();
    }

    init() {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
        
        this.convertBtn.addEventListener('click', () => this.convertToExcel());
        this.pdfInput.addEventListener('change', () => {
            this.convertBtn.disabled = !this.pdfInput.files.length;
        });
    }

    async convertToExcel() {
        const file = this.pdfInput.files[0];
        if (!file) return;

        this.showProgress();
        this.resultArea.innerHTML = '<div class="processing">Converting PDF to Excel...</div>';

        try {
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            
            let allTables = [];
            
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                if (this.detectTables.checked) {
                    const tables = this.detectTablesInContent(textContent);
                    allTables = allTables.concat(tables);
                } else {
                    const table = this.convertToTable(textContent);
                    allTables.push(table);
                }
                
                this.updateProgress((i / numPages) * 100);
            }

            const workbook = XLSX.utils.book_new();
            
            allTables.forEach((table, index) => {
                const worksheet = XLSX.utils.aoa_to_sheet(table);
                XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet${index + 1}`);
            });

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            const fileName = file.name.replace('.pdf', '.xlsx');
            this.downloadExcel(excelBlob, fileName);
            
            this.showSuccess('PDF converted to Excel successfully!');
        } catch (error) {
            console.error('Conversion error:', error);
            this.showError('Error converting PDF to Excel. Please try again.');
        }

        this.hideProgress();
    }

    detectTablesInContent(textContent) {
        const items = textContent.items;
        const tables = [];
        let currentTable = [];
        let currentRow = [];
        let lastY = null;
        
        items.forEach(item => {
            if (lastY === null) {
                currentRow.push(item.str);
            } else if (Math.abs(item.transform[5] - lastY) < 2) {
                // Same row
                currentRow.push(item.str);
            } else {
                // New row
                if (currentRow.length > 0) {
                    currentTable.push([...currentRow]);
                    currentRow = [];
                }
                
                // Check if this might be a new table
                if (Math.abs(item.transform[5] - lastY) > 20 && currentTable.length > 0) {
                    tables.push([...currentTable]);
                    currentTable = [];
                }
                
                currentRow.push(item.str);
            }
            
            lastY = item.transform[5];
        });
        
        // Add remaining rows
        if (currentRow.length > 0) {
            currentTable.push(currentRow);
        }
        if (currentTable.length > 0) {
            tables.push(currentTable);
        }
        
        return tables;
    }

    convertToTable(textContent) {
        const rows = [];
        let currentRow = [];
        let lastY = null;
        
        textContent.items.forEach(item => {
            if (lastY === null || Math.abs(item.transform[5] - lastY) < 2) {
                currentRow.push(item.str);
            } else {
                rows.push([...currentRow]);
                currentRow = [item.str];
            }
            lastY = item.transform[5];
        });
        
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        
        return rows;
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    downloadExcel(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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

// Initialize PDF to Excel Converter
new PDFToExcel(); 