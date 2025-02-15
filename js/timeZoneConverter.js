class TimeZoneConverter {
    constructor() {
        this.sourceTime = document.getElementById('sourceTime');
        this.sourceTimezone = document.getElementById('sourceTimezone');
        this.targetTimeZones = document.getElementById('targetTimeZones');
        this.addButton = document.querySelector('.add-timezone');
        
        this.timezones = moment.tz.names();
        this.init();
    }

    init() {
        // Load moment-timezone library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            const tzScript = document.createElement('script');
            tzScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.33/moment-timezone-with-data.min.js';
            document.head.appendChild(tzScript);

            tzScript.onload = () => {
                this.setupTimezones();
                this.setupEventListeners();
            };
        };
    }

    setupTimezones() {
        const options = this.timezones.map(tz => 
            `<option value="${tz}">${tz.replace('_', ' ')}</option>`
        ).join('');

        this.sourceTimezone.innerHTML = options;
        
        // Set default timezone
        const userTimezone = moment.tz.guess();
        this.sourceTimezone.value = userTimezone;
        
        // Add first target timezone
        this.addTargetTimezone();
    }

    setupEventListeners() {
        this.sourceTime.value = moment().format('YYYY-MM-DDTHH:mm');
        this.addButton.addEventListener('click', () => this.addTargetTimezone());
        
        this.sourceTime.addEventListener('change', () => this.updateAllTimes());
        this.sourceTimezone.addEventListener('change', () => this.updateAllTimes());
    }

    addTargetTimezone() {
        const targetRow = document.createElement('div');
        targetRow.className = 'target-row';
        
        const userTimezone = moment.tz.guess();
        const options = this.timezones.map(tz => 
            `<option value="${tz}" ${tz === userTimezone ? 'selected' : ''}>${tz.replace('_', ' ')}</option>`
        ).join('');

        targetRow.innerHTML = `
            <select class="timezone-select">${options}</select>
            <input type="text" class="time-display" readonly>
            <button class="remove-btn">×</button>
        `;

        this.targetTimeZones.appendChild(targetRow);
        
        const select = targetRow.querySelector('select');
        const removeBtn = targetRow.querySelector('.remove-btn');
        
        select.addEventListener('change', () => this.updateAllTimes());
        removeBtn.addEventListener('click', () => {
            targetRow.remove();
            this.updateAllTimes();
        });

        this.updateAllTimes();
    }

    updateAllTimes() {
        const sourceDateTime = moment.tz(
            this.sourceTime.value, 
            this.sourceTimezone.value
        );

        const targetRows = this.targetTimeZones.querySelectorAll('.target-row');
        targetRows.forEach(row => {
            const select = row.querySelector('select');
            const display = row.querySelector('.time-display');
            
            const targetTime = sourceDateTime.clone()
                .tz(select.value)
                .format('YYYY-MM-DD HH:mm:ss');
            
            display.value = targetTime;
        });
    }
}

// Initialize Time Zone Converter
new TimeZoneConverter(); 