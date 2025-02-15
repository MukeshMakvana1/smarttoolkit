class DragDropHandler {
    constructor() {
        this.fileInputs = document.querySelectorAll('input[type="file"]');
        this.init();
    }

    init() {
        this.fileInputs.forEach(input => {
            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.className = 'file-upload-label';
            
            label.innerHTML = `
                <div class="file-upload-content">
                    <span class="file-upload-icon">📁</span>
                    <p>Drag & drop files here or click to browse</p>
                </div>
            `;

            input.parentNode.insertBefore(label, input);

            this.setupDragAndDrop(label, input);
        });
    }

    setupDragAndDrop(label, input) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            label.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            label.addEventListener(eventName, () => {
                label.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            label.addEventListener(eventName, () => {
                label.classList.remove('drag-over');
            });
        });

        label.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) {
                input.files = files;
                input.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Initialize Drag & Drop
new DragDropHandler(); 