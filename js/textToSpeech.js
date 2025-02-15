class TextToSpeech {
    constructor() {
        this.speechText = document.getElementById('speechText');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.speechRate = document.getElementById('speechRate');
        this.rateValue = document.getElementById('rateValue');
        this.speakButton = document.getElementById('speakButton');
        this.pauseButton = document.getElementById('pauseButton');
        
        this.synthesis = window.speechSynthesis;
        this.utterance = null;
        this.voices = [];

        this.init();
    }

    init() {
        // Load voices
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }

        // Event listeners
        this.speechRate.addEventListener('input', () => {
            this.rateValue.textContent = `${this.speechRate.value}x`;
        });

        this.speakButton.addEventListener('click', () => this.speak());
        this.pauseButton.addEventListener('click', () => this.pauseResume());
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.voiceSelect.innerHTML = this.voices
            .map((voice, index) => `
                <option value="${index}">
                    ${voice.name} (${voice.lang})
                </option>
            `).join('');
    }

    speak() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        const text = this.speechText.value;
        if (text) {
            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.voice = this.voices[this.voiceSelect.value];
            this.utterance.rate = parseFloat(this.speechRate.value);

            this.utterance.onstart = () => {
                this.speakButton.disabled = true;
                this.pauseButton.disabled = false;
            };

            this.utterance.onend = () => {
                this.speakButton.disabled = false;
                this.pauseButton.disabled = true;
            };

            this.synthesis.speak(this.utterance);
        }
    }

    pauseResume() {
        if (this.synthesis.speaking) {
            if (this.synthesis.paused) {
                this.synthesis.resume();
                this.pauseButton.innerHTML = '<span class="icon">⏸️</span> Pause';
            } else {
                this.synthesis.pause();
                this.pauseButton.innerHTML = '<span class="icon">▶️</span> Resume';
            }
        }
    }
}

// Initialize Text to Speech
new TextToSpeech(); 