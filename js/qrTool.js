class QRTool {
    constructor() {
        this.generateTab = document.getElementById('generateQR');
        this.scanTab = document.getElementById('scanQR');
        this.qrInput = document.getElementById('qrInput');
        this.qrSize = document.getElementById('qrSize');
        this.generateBtn = document.getElementById('generateQRBtn');
        this.qrResult = document.querySelector('.qr-result');
        this.scanResult = document.querySelector('.scan-result');
        this.tabButtons = document.querySelectorAll('.tab-btn');
        
        this.scanner = null;
        this.init();
    }

    init() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Generate QR code
        this.generateBtn.addEventListener('click', () => this.generateQR());

        // Initialize scanner
        this.initScanner();
    }

    switchTab(tab) {
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        if (tab === 'generate') {
            this.generateTab.classList.remove('hidden');
            this.scanTab.classList.add('hidden');
            if (this.scanner) {
                this.scanner.stop();
            }
        } else {
            this.generateTab.classList.add('hidden');
            this.scanTab.classList.remove('hidden');
            if (this.scanner) {
                this.scanner.start();
            }
        }
    }

    generateQR() {
        const text = this.qrInput.value;
        if (!text) {
            alert('Please enter text or URL');
            return;
        }

        const size = parseInt(this.qrSize.value);
        
        // Clear previous result
        this.qrResult.innerHTML = '';
        
        // Create QR code
        const qr = new QRCode(this.qrResult, {
            text: text,
            width: size,
            height: size,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add download button after QR code is generated
        setTimeout(() => {
            const qrImage = this.qrResult.querySelector('img');
            if (qrImage) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'process-btn';
                downloadBtn.textContent = 'Download QR Code';
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = 'qrcode.png';
                    link.href = qrImage.src;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                this.qrResult.appendChild(downloadBtn);
            }
        }, 100);
    }

    initScanner() {
        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader", 
            { 
                fps: 10,
                qrbox: { width: 250, height: 250 }
            }
        );

        html5QrcodeScanner.render((decodedText) => {
            this.scanResult.innerHTML = `
                <div class="result-text">
                    <p>Scanned Result:</p>
                    <textarea readonly>${decodedText}</textarea>
                    <button class="process-btn" onclick="navigator.clipboard.writeText('${decodedText}')">
                        Copy to Clipboard
                    </button>
                </div>
            `;
        }, (error) => {
            // Handle errors silently
        });

        this.scanner = html5QrcodeScanner;
    }
}

// Initialize QR Tool
document.addEventListener('DOMContentLoaded', () => {
    new QRTool();
}); 