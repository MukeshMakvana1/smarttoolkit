class IPLookup {
    constructor() {
        this.ipInput = document.getElementById('ipAddress');
        this.lookupBtn = document.getElementById('lookupBtn');
        this.resultGrid = document.querySelector('.result-grid');
        this.mapContainer = document.getElementById('ipMap');
        
        this.init();
    }

    init() {
        this.lookupBtn.addEventListener('click', () => this.lookupIP());
        // Load user's IP on start
        this.lookupIP();
    }

    async lookupIP() {
        const ip = this.ipInput.value.trim();
        const apiUrl = ip ? 
            `https://ipapi.co/${ip}/json/` : 
            'https://ipapi.co/json/';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Invalid IP address');
            }

            this.displayResult(data);
            this.displayMap(data.latitude, data.longitude);
        } catch (error) {
            console.error('IP lookup error:', error);
            this.resultGrid.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    displayResult(data) {
        const fields = {
            'IP Address': data.ip,
            'Location': `${data.city}, ${data.region}, ${data.country_name}`,
            'ISP': data.org,
            'Timezone': data.timezone,
            'Coordinates': `${data.latitude}, ${data.longitude}`,
            'Postal Code': data.postal,
            'Currency': data.currency,
            'Country Code': data.country_code
        };

        this.resultGrid.innerHTML = Object.entries(fields)
            .map(([key, value]) => `
                <div class="result-item">
                    <div class="label">${key}:</div>
                    <div class="value">${value || 'N/A'}</div>
                </div>
            `).join('');
    }

    displayMap(lat, lon) {
        // Using OpenStreetMap
        this.mapContainer.innerHTML = `
            <iframe
                width="100%"
                height="300"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-1},${lat-1},${lon+1},${lat+1}&layer=mapnik&marker=${lat},${lon}"
            ></iframe>
        `;
    }
}

// Initialize IP Lookup
new IPLookup(); 