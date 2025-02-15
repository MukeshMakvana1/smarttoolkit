class UnitConverter {
    constructor() {
        this.unitType = document.getElementById('unitType');
        this.fromValue = document.getElementById('fromValue');
        this.toValue = document.getElementById('toValue');
        this.fromUnit = document.getElementById('fromUnit');
        this.toUnit = document.getElementById('toUnit');
        this.swapBtn = document.querySelector('.swap-btn');
        
        this.units = {
            length: {
                meter: 1,
                kilometer: 1000,
                centimeter: 0.01,
                millimeter: 0.001,
                inch: 0.0254,
                foot: 0.3048,
                yard: 0.9144,
                mile: 1609.344
            },
            weight: {
                kilogram: 1,
                gram: 0.001,
                milligram: 0.000001,
                pound: 0.45359237,
                ounce: 0.028349523125,
                ton: 1000
            },
            temperature: {
                celsius: 'c',
                fahrenheit: 'f',
                kelvin: 'k'
            },
            area: {
                'square meter': 1,
                'square kilometer': 1000000,
                'square mile': 2589988.11,
                'square foot': 0.092903,
                'square inch': 0.00064516,
                hectare: 10000,
                acre: 4046.86
            },
            volume: {
                liter: 1,
                milliliter: 0.001,
                'cubic meter': 1000,
                gallon: 3.78541,
                quart: 0.946353,
                pint: 0.473176,
                cup: 0.236588
            }
        };

        this.init();
    }

    init() {
        this.unitType.addEventListener('change', () => this.updateUnitOptions());
        this.fromValue.addEventListener('input', () => this.convert());
        this.fromUnit.addEventListener('change', () => this.convert());
        this.toUnit.addEventListener('change', () => this.convert());
        this.swapBtn.addEventListener('click', () => this.swapUnits());

        this.updateUnitOptions();
    }

    updateUnitOptions() {
        const type = this.unitType.value;
        const units = Object.keys(this.units[type]);

        [this.fromUnit, this.toUnit].forEach(select => {
            select.innerHTML = units.map(unit => 
                `<option value="${unit}">${unit}</option>`
            ).join('');
        });

        this.toUnit.selectedIndex = 1;
        this.convert();
    }

    convert() {
        const type = this.unitType.value;
        const fromValue = parseFloat(this.fromValue.value);
        const fromUnit = this.fromUnit.value;
        const toUnit = this.toUnit.value;

        if (isNaN(fromValue)) {
            this.toValue.value = '';
            return;
        }

        if (type === 'temperature') {
            this.toValue.value = this.convertTemperature(fromValue, fromUnit, toUnit);
        } else {
            const baseValue = fromValue * this.units[type][fromUnit];
            this.toValue.value = baseValue / this.units[type][toUnit];
        }
    }

    convertTemperature(value, from, to) {
        let celsius;

        // Convert to Celsius first
        switch(from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }

        // Convert from Celsius to target unit
        switch(to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    swapUnits() {
        [this.fromUnit.value, this.toUnit.value] = 
        [this.toUnit.value, this.fromUnit.value];
        this.convert();
    }
}

// Initialize Unit Converter
new UnitConverter(); 