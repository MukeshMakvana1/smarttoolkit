class CurrencyConverter {
    constructor() {
        this.fromAmount = document.getElementById('fromAmount');
        this.toAmount = document.getElementById('toAmount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.convertBtn = document.getElementById('convertCurrencyBtn');
        this.rateInfo = document.getElementById('rateInfo');
        this.lastUpdate = document.getElementById('lastUpdate');
        this.swapBtn = document.querySelector('#currencyConverter .swap-btn');
        
        this.apiKey = 'YOUR_API_KEY'; // Get from exchangerate-api.com
        this.rates = {};
        
        this.init();
    }

    async init() {
        await this.loadCurrencies();
        this.convertBtn.addEventListener('click', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        
        // Auto-convert on currency change
        this.fromCurrency.addEventListener('change', () => this.convert());
        this.toCurrency.addEventListener('change', () => this.convert());
    }

    async loadCurrencies() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            this.rates = data.rates;
            
            const currencies = Object.keys(this.rates);
            const options = currencies.map(currency => 
                `<option value="${currency}">${currency}</option>`
            ).join('');

            this.fromCurrency.innerHTML = options;
            this.toCurrency.innerHTML = options;
            
            // Set default values
            this.fromCurrency.value = 'USD';
            this.toCurrency.value = 'EUR';
            
            this.updateLastUpdate(data.time_last_updated);
        } catch (error) {
            console.error('Error loading currencies:', error);
            alert('Failed to load currency data. Please try again later.');
        }
    }

    async convert() {
        if (!this.fromAmount.value) return;

        const amount = parseFloat(this.fromAmount.value);
        const from = this.fromCurrency.value;
        const to = this.toCurrency.value;

        try {
            const rate = this.rates[to] / this.rates[from];
            this.toAmount.value = (amount * rate).toFixed(2);
            this.updateRateInfo(rate, from, to);
        } catch (error) {
            console.error('Conversion error:', error);
            alert('Error converting currencies. Please try again.');
        }
    }

    swapCurrencies() {
        [this.fromCurrency.value, this.toCurrency.value] = 
        [this.toCurrency.value, this.fromCurrency.value];
        this.convert();
    }

    updateRateInfo(rate, from, to) {
        this.rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    }

    updateLastUpdate(timestamp) {
        const date = new Date(timestamp * 1000);
        this.lastUpdate.textContent = `Last updated: ${date.toLocaleString()}`;
    }
}

// Initialize Currency Converter
new CurrencyConverter(); 