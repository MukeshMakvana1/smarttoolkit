class PasswordGenerator {
    constructor() {
        this.passwordLength = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.generateBtn = document.getElementById('generatePasswordBtn');
        this.passwordDisplay = document.getElementById('generatedPassword');
        this.copyBtn = document.querySelector('#passwordGenerator .copy-btn');

        this.init();
    }

    init() {
        this.passwordLength.addEventListener('input', () => {
            this.lengthValue.textContent = this.passwordLength.value;
        });

        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
    }

    generatePassword() {
        const length = parseInt(this.passwordLength.value);
        let charset = '';
        let password = '';

        if (this.includeUppercase.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.includeLowercase.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (this.includeNumbers.checked) charset += '0123456789';
        if (this.includeSymbols.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            alert('Please select at least one character type');
            return;
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        this.passwordDisplay.value = password;
    }

    copyPassword() {
        if (!this.passwordDisplay.value) return;
        
        navigator.clipboard.writeText(this.passwordDisplay.value)
            .then(() => {
                this.copyBtn.textContent = '✓';
                setTimeout(() => {
                    this.copyBtn.textContent = '📋';
                }, 1000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
}

// Initialize Password Generator
new PasswordGenerator(); 