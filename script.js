const chatDisplay = document.getElementById('chat-display');
const micToggleButton = document.getElementById('mic-toggle-btn');
const textInput = document.getElementById('text-input');
const sendButton = document.getElementById('send-button');
const assistantIcon = document.querySelector('.assistant-icon');
const waveform = document.querySelector('.waveform');
const settingsPanel = document.getElementById('settings-panel');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const assistantNameInput = document.getElementById('assistant-name');
const wakeWordInput = document.getElementById('wake-word');
const voicePinInput = document.getElementById('voice-pin');
const notificationArea = document.getElementById('notification-area');

let recognition;
let synth = window.speechSynthesis;

// --- Settings Variables (Load from localStorage or default) ---
let assistantName = localStorage.getItem('assistantName') || 'Jarvis';
let wakeWord = localStorage.getItem('wakeWord') || 'jarvis'; // Lowercase for easier comparison
let voicePin = localStorage.getItem('voicePin') || ''; // Default empty
let listeningForWakeWord = true;
let isSpeaking = false;
let listeningToCommand = false; // To differentiate between wake word listening and command listening

// --- UI Utility Functions ---
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatDisplay.appendChild(messageDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll to bottom
}

function showNotification(message, duration = 3000) {
    notificationArea.textContent = message;
    notificationArea.classList.add('active');
    setTimeout(() => {
        notificationArea.classList.remove('active');
    }, duration);
}

function updateAssistantIcon(isListening) {
    if (isListening) {
        assistantIcon.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        assistantIcon.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.7)';
        waveform.classList.add('active');
    } else {
        assistantIcon.style.background = 'linear-gradient(45deg, #00ffff, #0099ff)';
        assistantIcon.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.7)';
        waveform.classList.remove('active');
    }
}

// --- Speech Synthesis (Text-to-Speech) ---
function speak(text, callback) {
    if (synth.speaking) {
        console.log('Already speaking...');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set preferred language
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1;   // 0.1 to 10
    utterance.pitch = 1;  // 0 to 2

    utterance.onstart = () => {
        isSpeaking = true;
        console.log('Speaking started:', text);
    };

    utterance.onend = () => {
        isSpeaking = false;
        console.log('Speaking ended.');
        if (callback) callback();
    };

    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        isSpeaking = false;
        showNotification('Speech synthesis error. Please try again.', 4000);
    };

    synth.speak(utterance);
}

// --- Speech Recognition (Speech-to-Text) ---
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; // Listen for a single utterance
        recognition.interimResults = false; // Only final results
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            micToggleButton.classList.add('listening');
            updateAssistantIcon(true);
            console.log('Speech recognition started...');
            if (!listeningToCommand) {
                showNotification(`Listening for "${wakeWord}"...`, 2000);
            }
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Recognized:', transcript);
            addMessage(transcript, 'user');

            if (listeningForWakeWord) {
                if (transcript.includes(wakeWord.toLowerCase())) {
                    speak(`Yes ${assistantName}, I'm listening.`, () => {
                        listeningForWakeWord = false;
                        listeningToCommand = true;
                        startListening(); // Start listening for command
                    });
                } else {
                    speak("I didn't hear my name. Please try again.", () => {
                        // Keep listening for wake word
                    });
                }
            } else {
                handleCommand(transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            micToggleButton.classList.remove('listening');
            updateAssistantIcon(false);
            if (event.error === 'no-speech') {
                showNotification('No speech detected. Please try again.', 2000);
            } else if (event.error === 'not-allowed') {
                 showNotification('Microphone access denied. Please allow in browser settings.', 5000);
            } else {
                 showNotification(`Speech recognition error: ${event.error}`, 4000);
            }
            // Reset to wake word listening if an error occurs during command listening
            if (listeningToCommand) {
                listeningForWakeWord = true;
                listeningToCommand = false;
            }
        };

        recognition.onend = () => {
            micToggleButton.classList.remove('listening');
            updateAssistantIcon(false);
            console.log('Speech recognition ended.');
            // Automatically restart listening if we are waiting for a wake word or command
            if (listeningForWakeWord || listeningToCommand) {
                 startListening();
            }
        };

    } else {
        showNotification("Web Speech API is not supported in this browser.", 5000);
        micToggleButton.disabled = true;
        textInput.placeholder = "Speech input not supported.";
    }
}

function startListening() {
    if (recognition && !isSpeaking) {
        recognition.start();
    } else if (isSpeaking) {
        // Wait for speaking to finish before starting recognition
        const checkSpeechInterval = setInterval(() => {
            if (!isSpeaking) {
                clearInterval(checkSpeechInterval);
                if (recognition) recognition.start();
            }
        }, 100);
    }
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }
}

// --- Command Handling ---
function handleCommand(command) {
    let reply = "I'm not sure how to respond to that.";

    if (command.includes("what is the time")) {
        const now = new Date();
        reply = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (command.includes("search") && command.includes("on google")) {
        const query = command.replace("search", "").replace("on google", "").trim();
        if (query) {
            reply = `Searching Google for ${query}.`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        } else {
            reply = "What would you like me to search for on Google?";
        }
    } else if (command.includes("open youtube")) {
        reply = "Opening YouTube.";
        window.open('https://www.youtube.com', '_blank');
    } else if (command.includes("tell me a joke")) {
        // Simple joke array, could be replaced with an API call
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Did you hear about the restaurant on the moon? Great food, no atmosphere.",
            "Why did the scarecrow win an award? Because he was outstanding in his field!"
        ];
        reply = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (command.includes("set my name to")) {
        const newName = command.replace("set my name to", "").trim();
        if (newName) {
            assistantName = newName.charAt(0).toUpperCase() + newName.slice(1);
            localStorage.setItem('assistantName', assistantName);
            assistantNameInput.value = assistantName; // Update settings input
            reply = `Understood. I will now call you ${assistantName}.`;
        } else {
            reply = "Please tell me what you'd like your name to be.";
        }
    } else if (command.includes("what is my name")) {
        reply = `Your name is ${assistantName}.`;
    }
    // Add more commands here

    speak(reply, () => {
        addMessage(reply, 'assistant');
        // After command, go back to listening for wake word
        listeningForWakeWord = true;
        listeningToCommand = false;
        startListening();
    });
}

// --- Event Listeners ---
micToggleButton.addEventListener('click', () => {
    if (recognition && recognition.state === 'listening') {
        stopListening();
    } else {
        listeningForWakeWord = true; // Always start by listening for wake word via button
        listeningToCommand = false;
        startListening();
    }
});

sendButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        handleCommand(text.toLowerCase()); // Process typed command
        textInput.value = '';
    }
});

textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

openSettingsBtn.addEventListener('click', () => {
    // Populate settings inputs with current values
    assistantNameInput.value = assistantName;
    wakeWordInput.value = wakeWord;
    voicePinInput.value = voicePin;
    settingsPanel.classList.add('active');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
});

saveSettingsBtn.addEventListener('click', () => {
    assistantName = assistantNameInput.value.trim() || 'Jarvis';
    wakeWord = wakeWordInput.value.trim().toLowerCase() || 'jarvis';
    voicePin = voicePinInput.value.trim();

    localStorage.setItem('assistantName', assistantName);
    localStorage.setItem('wakeWord', wakeWord);
    localStorage.setItem('voicePin', voicePin);

    showNotification('Settings saved successfully!', 2000);
    settingsPanel.classList.remove('active');
});

// --- Initial Setup ---
initializeSpeechRecognition();
addMessage(`Hello ${assistantName}! I'm ${localStorage.getItem('assistantName') || 'Jarvis'}. Say "${wakeWord}" to wake me up.`, 'assistant');
updateAssistantIcon(false); // Initial state: not listening

// Start continuous wake word listening on page load
// This approach requires 'recognition.continuous = true;' but that makes it harder to manage commands.
// A simpler way for wake word is to keep restarting the listener.
startListening(); // Start listening for wake word immediately

                                 
