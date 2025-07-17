// script.js

// 1. DOM Elements
const subtitleDisplay = document.getElementById('subtitle-display');
const chatHistory = document.getElementById('chat-history');
const micIcon = document.getElementById('mic-icon');
const manualMicToggleBtn = document.getElementById('manual-mic-toggle');
const micButtonText = document.getElementById('mic-button-text');

const settingsToggleBtn = document.getElementById('settings-toggle');
const settingsSidebar = document.getElementById('settings-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const themeToggle = document.getElementById('theme-toggle');
const themeName = document.getElementById('theme-name');
const languageSelect = document.getElementById('language-select');
const assistantNameInput = document.getElementById('assistant-name-input');
const wakeWordInput = document.getElementById('wake-word-input');
const voicePinInput = document.getElementById('voice-pin-input');

// 2. Global State Variables
let isListening = false;
let isCommandMode = false; // True if wake word detected, now listening for commands
let recognition;
let speechSynthesis;
let currentLanguage = 'en-US'; // Default language
let assistantName = 'Jarvis';
let wakeWords = ['jarvis', 'suno', 'bhai'];
let voicePin = '7864';
let currentTheme = 'dark'; // 'dark' or 'light'

// Jokes array (English, Hindi, Urdu)
const jokes = {
    'en-US': [
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call a fish with no eyes? Fsh!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!"
    ],
    'hi-IN': [
        "एक मच्छर ने दूसरे मच्छर से कहा, 'चल शादी कर लेते हैं, नहीं तो जीवन यूं ही काटने में निकल जाएगा!'",
        "टीचर: 'होमवर्क क्यों नहीं किया?' छात्र: 'मैं तो घूमने गया था।' टीचर: 'कहाँ?' छात्र: 'जहां सब जाते हैं!' टीचर: 'कहाँ?' छात्र: 'स्कूल!'",
        "पति: 'तुम हर बात में मायके क्यों जाती हो?' पत्नी: 'तुम्हारे पिताजी ने ही तो कहा था कि, 'बेटी, जब मन करे मायके जाया करो!' पति: 'मेरे पिताजी ने कब कहा?' पत्नी: 'तुम्हारे शादी से पहले!'"
    ],
    'ur-PK': [
        "ایک مچھلی دوسری مچھلی سے بولی، 'چل شادی کر لیتے ہیں، ورنہ زندگی یونہی کاٹنے میں نکل جائے گی!'",
        "ٹیچر: 'ہوم ورک کیوں نہیں کیا؟' شاگرد: 'میں تو گھومنے گیا تھا۔' ٹیچر: 'کہاں؟' شاگرد: 'جہاں سب جاتے ہیں!' ٹیچر: 'کہاں؟' شاگرد: 'سکول!'",
        "شوہر: 'تم ہر بات پر میکے کیوں جاتی ہو؟' بیوی: 'آپ کے والد صاحب نے ہی تو کہا تھا کہ، 'بیٹی، جب دل کرے میکے جایا کرو!' شوہر: 'میرے والد صاحب نے کب کہا؟' بیوی: 'آپ کی شادی سے پہلے!'"
    ]
};

// OpenWeatherMap API details (replace with your actual key)
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Get this from OpenWeatherMap
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 3. Helper Functions

// Add a message to the chat history
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'assistant-message');
    messageDiv.textContent = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
}

// Speak function using SpeechSynthesis API
function speak(text, lang = currentLanguage) {
    if ('speechSynthesis' in window) {
        speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        // Optionally select a voice
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.lang === lang || voice.lang.startsWith(lang.substring(0,2)));
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            console.log('Speech finished');
            // If we just finished speaking a command response,
            // we might want to restart listening for wake word or next command
            if (!isListening) { // Only if not already listening
                startListening();
            }
        };
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            setSubtitle(`Speech error: ${event.error}`);
        };
        speechSynthesis.speak(utterance);
        addMessageToChat('assistant', text);
    } else {
        console.warn("Speech Synthesis not supported in this browser.");
        setSubtitle("Speech Synthesis not supported.");
        addMessageToChat('assistant', `(Text-to-speech not supported): ${text}`);
    }
}

// Set subtitle text and update mic icon animation
function setSubtitle(text, isSpeaking = false, isListening = false) {
    subtitleDisplay.textContent = text;
    if (isSpeaking) {
        micIcon.style.animation = 'speakPulse 0.8s infinite alternate'; // Custom animation for speaking
    } else if (isListening) {
        micIcon.style.animation = 'listenPulse 1.2s infinite alternate'; // Custom animation for listening
    } else {
        micIcon.style.animation = 'none'; // No animation
    }
}

// Theme toggle logic
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    themeName.textContent = currentTheme === 'light' ? 'Light Mode' : 'Dark Mode';
    saveSettings();
}

// Sidebar open/close logic
function toggleSidebar() {
    settingsSidebar.classList.toggle('open');
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        currentLanguage: languageSelect.value,
        assistantName: assistantNameInput.value.trim(),
        wakeWords: wakeWordInput.value.trim(),
        voicePin: voicePinInput.value.trim(),
        theme: currentTheme
    };
    localStorage.setItem('jarvisAISettings', JSON.stringify(settings));
    console.log("Settings saved:", settings);
    // Update global variables
    currentLanguage = settings.currentLanguage;
    assistantName = settings.assistantName;
    wakeWords = settings.wakeWords.toLowerCase().split(',').map(word => word.trim()).filter(word => word.length > 0);
    voicePin = settings.voicePin;
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('jarvisAISettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        languageSelect.value = settings.currentLanguage || 'en-US';
        assistantNameInput.value = settings.assistantName || 'Jarvis';
        wakeWordInput.value = settings.wakeWords || 'jarvis, suno, bhai';
        voicePinInput.value = settings.voicePin || '7864';

        // Apply theme
        currentTheme = settings.theme || 'dark';
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('light-theme');
            themeToggle.checked = false;
        }
        themeName.textContent = currentTheme === 'light' ? 'Light Mode' : 'Dark Mode';

        // Update global variables
        currentLanguage = languageSelect.value;
        assistantName = assistantNameInput.value.trim();
        wakeWords = wakeWordInput.value.toLowerCase().split(',').map(word => word.trim()).filter(word => word.length > 0);
        voicePin = voicePinInput.value.trim();
    }
}

// 4. Web Speech API (Speech Recognition)

function initializeRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        console.warn("Web Speech API is not supported in this browser. Try Chrome or Edge.");
        setSubtitle("Speech Recognition not supported.");
        manualMicToggleBtn.disabled = true;
        return null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Get interim results
    recognition.lang = currentLanguage; // Set initial language

    recognition.onstart = () => {
        isListening = true;
        micButtonText.textContent = 'Stop Listening';
        setSubtitle(isCommandMode ? 'Listening for command...' : `Say "${wakeWords[0]}" to activate...`, false, true);
        micIcon.classList.add('active-listening'); // Add a class for more advanced animation
    };

    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.toLowerCase().trim();

        if (event.results[last].isFinal) {
            addMessageToChat('user', transcript);
            console.log('Final transcript:', transcript);
            setSubtitle(isCommandMode ? 'Processing command...' : 'Processing wake word...');

            if (!isCommandMode) {
                // Check for wake word
                const detectedWakeWord = wakeWords.find(word => transcript.includes(word));
                if (detectedWakeWord) {
                    recognition.stop(); // Stop current recognition to restart in command mode
                    isCommandMode = true;
                    setSubtitle(`Wake word "${detectedWakeWord}" detected!`);
                    speak(`Yes ${assistantName}, boliye`, currentLanguage).then(() => {
                        // Restart recognition in command mode after speaking
                        startListening();
                    });
                } else {
                    // Continue listening for wake word if not detected
                    setSubtitle(`Say "${wakeWords[0]}" to activate...`);
                }
            } else {
                // In command mode, process the command
                processCommand(transcript);
                isCommandMode = false; // Reset to wake word mode after command
                // The speak function will restart listening after it finishes
                setSubtitle('Processing command...');
                // Consider a small delay before restarting for wake word to avoid immediate re-recognition
            }
        } else {
            // Interim results
            if (!isCommandMode) {
                setSubtitle(`(Wake word) ${transcript}...`);
            } else {
                setSubtitle(`(Command) ${transcript}...`);
            }
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error, event.message);
        setSubtitle(`Error: ${event.error}. Please allow microphone access.`);
        isListening = false;
        isCommandMode = false; // Reset mode
        micButtonText.textContent = 'Start Listening';
        micIcon.classList.remove('active-listening');
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            alert("Microphone access denied. Please allow microphone access in your browser settings to use the voice assistant.");
        }
        // Attempt to restart if not permission related or other fatal error
        if (event.error !== 'no-speech' && event.error !== 'not-allowed') {
             // Avoid immediate restart loop on 'no-speech'
            setTimeout(startListening, 1000);
        }
    };

    recognition.onend = () => {
        isListening = false;
        micIcon.classList.remove('active-listening');
        // Restart listening if in command mode or if we expect to be listening for wake word
        if (isCommandMode) { // If command mode ended unexpectedly, restart for command
            console.log("Recognition ended in command mode, restarting...");
            startListening();
        } else if (manualMicToggleBtn.classList.contains('active')) { // If manual toggle is ON, keep listening
             console.log("Recognition ended, manual toggle active, restarting...");
             startListening();
        } else {
            setSubtitle(`Say "${wakeWords[0]}" to activate...`);
            micButtonText.textContent = 'Start Listening';
        }
        console.log("Speech recognition ended.");
    };
}

// Start/Stop listening function
function startListening() {
    if (isListening) {
        recognition.stop();
        isListening = false;
        micButtonText.textContent = 'Start Listening';
        setSubtitle('Stopped listening.');
    } else {
        try {
            recognition.lang = currentLanguage; // Ensure correct language is set
            recognition.start();
        } catch (e) {
            console.error("Error starting recognition:", e);
            setSubtitle(`Error starting mic: ${e.message}`);
            // If already started, it throws an error. So we reset the state
            isListening = false;
            micButtonText.textContent = 'Start Listening';
            micIcon.classList.remove('active-listening');
        }
    }
}

// 5. Command Processing
async function processCommand(command) {
    let response = "I didn't understand that command.";
    let spokenResponse = true; // Flag to control if speak() should be called

    if (command.includes('time') || command.includes('what time is it') || command.includes('samay kya hua hai') || command.includes('waqt kya hua hai')) {
        const now = new Date();
        const time = now.toLocaleTimeString(currentLanguage, { hour: '2-digit', minute: '2-digit' });
        response = `The current time is ${time}.`;
        if (currentLanguage === 'hi-IN') response = `अभी ${time} बजे हैं।`;
        if (currentLanguage === 'ur-PK') response = `ابھی ${time} بجے ہیں۔`;
    } else if (command.includes('search') && command.includes('on google')) {
        const query = command.replace(/(search|on google)/g, '').trim();
        if (query) {
            response = `Searching for ${query} on Google.`;
            if (currentLanguage === 'hi-IN') response = `गूगल पर ${query} खोज रहा हूँ।`;
            if (currentLanguage === 'ur-PK') response = `گوگل پر ${query} تلاش کر رہا ہوں۔`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        } else {
            response = "What would you like me to search for?";
            if (currentLanguage === 'hi-IN') response = "आप क्या खोजना चाहेंगे?";
            if (currentLanguage === 'ur-PK') response = "آپ کیا تلاش کرنا چاہیں گے؟";
        }
    } else if (command.includes('open youtube')) {
        response = "Opening YouTube.";
        if (currentLanguage === 'hi-IN') response = "यूट्यूब खोल रहा हूँ।";
        if (currentLanguage === 'ur-PK') response = "یوٹیوب کھول رہا ہوں۔";
        window.open('https://www.youtube.com', '_blank');
    } else if (command.includes('open whatsapp')) {
        response = "Opening WhatsApp. Please note this will open WhatsApp Web.";
        if (currentLanguage === 'hi-IN') response = "व्हाट्सएप खोल रहा हूँ। कृपया ध्यान दें, यह व्हाट्सएप वेब खोलेगा।";
        if (currentLanguage === 'ur-PK') response = "واٹس ایپ کھول رہا ہوں۔ براہ کرم نوٹ کریں، یہ واٹس ایپ ویب کھولے گا۔";
        window.open('https://web.whatsapp.com', '_blank');
    } else if (command.includes('tell me a joke') || command.includes('ek chutkula sunao')) {
        const jokeList = jokes[currentLanguage] || jokes['en-US'];
        response = jokeList[Math.floor(Math.random() * jokeList.length)];
    } else if (command.includes('torch on karo') || command.includes('turn on the torch')) {
        // Simulate torch action
        document.body.style.backgroundColor = 'var(--secondary-accent)'; // Visual cue
        response = "Torch is on. (Simulated)";
        if (currentLanguage === 'hi-IN') response = "टॉर्च चालू है। (सिम्युलेटेड)";
        if (currentLanguage === 'ur-PK') response = "ٹارچ آن ہے۔ (نقلی)";
        spokenResponse = true;
        setTimeout(() => {
            document.body.style.backgroundColor = 'var(--background-color)'; // Revert
        }, 3000);
    } else if (command.includes('torch off karo') || command.includes('turn off the torch')) {
        document.body.style.backgroundColor = 'var(--background-color)';
        response = "Torch is off. (Simulated)";
        if (currentLanguage === 'hi-IN') response = "टॉर्च बंद है। (सिम्युलेटेड)";
        if (currentLanguage === 'ur-PK') response = "ٹارچ آف ہے۔ (نقلی)";
    } else if (command.includes('weather in')) {
        const cityMatch = command.match(/weather in (.+)/);
        let city = '';
        if (cityMatch && cityMatch[1]) {
            city = cityMatch[1].trim();
        } else {
            // Try to parse city for Hindi/Urdu
            const hiUrduCityMatch = command.match(/(.+)\s*में\s*मौसम|(.+)\s*میں\s*موسم/); // "in"
            if (hiUrduCityMatch && (hiUrduCityMatch[1] || hiUrduCityMatch[2])) {
                city = (hiUrduCityMatch[1] || hiUrduCityMatch[2]).trim();
            }
        }

        if (city) {
            try {
                const weatherData = await fetchWeather(city);
                if (weatherData) {
                    const tempCelsius = (weatherData.main.temp - 273.15).toFixed(1);
                    const description = weatherData.weather[0].description;
                    response = `The weather in ${city} is ${description} with a temperature of ${tempCelsius} degrees Celsius.`;
                    if (currentLanguage === 'hi-IN') response = `${city} में मौसम ${description} है और तापमान ${tempCelsius} डिग्री सेल्सियस है।`;
                    if (currentLanguage === 'ur-PK') response = `${city} میں موسم ${description} ہے اور درجہ حرارت ${tempCelsius} ڈگری سیلسیس ہے۔`;
                } else {
                    response = `Could not get weather for ${city}. Please try again.`;
                    if (currentLanguage === 'hi-IN') response = `${city} का मौसम नहीं मिल सका। कृपया पुनः प्रयास करें।`;
                    if (currentLanguage === 'ur-PK') response = `${city} کا موسم نہیں مل سکا۔ براہ کرم دوبارہ کوشش کریں۔`;
                }
            } catch (error) {
                console.error("Weather API error:", error);
                response = "Sorry, I couldn't fetch the weather data right now.";
                if (currentLanguage === 'hi-IN') response = "क्षमा करें, मैं अभी मौसम का डेटा प्राप्त नहीं कर सका।";
                if (currentLanguage === 'ur-PK') response = "معذرت، میں فی الحال موسم کا ڈیٹا حاصل نہیں کر سکا۔";
            }
        } else {
            response = "Which city's weather would you like to know?";
            if (currentLanguage === 'hi-IN') response = "आप किस शहर का मौसम जानना चाहेंगे?";
            if (currentLanguage === 'ur-PK') response = "آپ کس شہر کا موسم جاننا چاہیں گے؟";
        }
    } else if (command.includes('what is my pin')) { // Example sensitive command
        spokenResponse = false; // Don't speak response until PIN is verified
        await verifyVoicePin(command, () => {
            speak(`Your voice PIN is ${voicePin}.`, currentLanguage);
        }, () => {
            speak("Voice PIN incorrect. Access denied.", currentLanguage);
        });
        return; // Exit to prevent default speak
    }

    setSubtitle('Responding...');
    speak(response, currentLanguage);
}

// Fetch weather data from OpenWeatherMap
async function fetchWeather(city) {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
        alert("Please set your OpenWeatherMap API key in script.js!");
        console.error("OpenWeatherMap API key is not set.");
        return null;
    }
    const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`City not found: ${city}`);
                setSubtitle(`City "${city}" not found.`);
                speak(`Sorry, I couldn't find weather data for ${city}. Please check the spelling.`, currentLanguage);
            } els
