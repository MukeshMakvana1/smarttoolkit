class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        // Set initial theme
        document.body.className = `${this.currentTheme}-theme`;
        this.updateIcon();

        // Add event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.className = `${this.currentTheme}-theme`;
        localStorage.setItem('theme', this.currentTheme);
        this.updateIcon();
    }

    updateIcon() {
        this.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Initialize theme toggle
new ThemeToggle(); 