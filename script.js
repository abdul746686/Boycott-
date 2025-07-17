document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const micBtn = document.getElementById('micBtn');
    const textInput = document.getElementById('textInput');
    const chatMessages = document.getElementById('chatMessages');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const overlay = document.getElementById('overlay');
    const saveSettings = document.getElementById('saveSettings');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const waveform = document.getElementById('waveform');

    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Speech Synthesis
    const synth = window.speechSynthesis;

    // App State
    let isListening = false;
    let waitingForWakeWord = true;
    let waitingForPin = false;
    let currentPinAttempt = '';
    let assistantName = 'Jarvis';
    let userName = 'Sir';
    let wakeWord = 'jarvis';
    let voicePin = '1234';

    // Load settings from localStorage
    loadSettings();

    // Event Listeners
    micBtn.addEventListener('click', toggleListening);
    textInput.addEventListener('keypress', handleTextInput);
    settingsBtn.addEventListener('click', openSettings);
    closeSettings.addEventListener('click', closeSettingsPanel);
    overlay.addEventListener('click', closeSettingsPanel);
    saveSettings.addEventListener('click', saveSettingsHandler);

    // Initialize with welcome message if no messages
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessage('assistant', `${assistantName}`, `Hello ${userName}, I'm ${assistantName}. Say "${wakeWord}" to wake me up or click the mic.`);
            speak(`Hello ${userName}, I'm ${assistantName}. Say "${wakeWord}" to wake me up or click the mic.`);
        }, 1000);
    }

    // Functions
    function toggleListening() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    function startListening() {
        try {
            recognition.start();
            micBtn.classList.add('listening');
            waveform.classList.add('active');
            isListening = true;
            showNotification('Listening...');
        } catch (e) {
            showNotification('Error starting speech recognition');
            console.error('Speech recognition error:', e);
        }
    }

    function stopListening() {
        recognition.stop();
        micBtn.classList.remove('listening');
        waveform.classList.remove('active');
        isListening = false;
        showNotification('Microphone off');
    }

    recognition.onresult = function(event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        // Check for final result
        if (event.results[0].isFinal) {
            if (waitingForWakeWord) {
                if (transcript.toLowerCase().includes(wakeWord.toLowerCase())) {
                    waitingForWakeWord = false;
                    addMessage('user', userName, transcript);
                    const response = `Yes ${userName}, I'm listening.`;
                    addMessage('assistant', assistantName, response);
                    speak(response);
                }
            } else if (waitingForPin) {
                currentPinAttempt = transcript.replace(/\D/g, ''); // Extract numbers only
                addMessage('user', userName, transcript);
                
                if (currentPinAttempt === voicePin) {
                    waitingForPin = false;
                    const response = `PIN accepted. How can I help you, ${userName}?`;
                    addMessage('assistant', assistantName, response);
                    speak(response);
                } else {
                    const response = `Incorrect PIN. Please try again or say "${wakeWord}" to cancel.`;
                    addMessage('assistant', assistantName, response);
                    speak(response);
                }
            } else {
                addMessage('user', userName, transcript);
                processCommand(transcript);
            }
        }
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        stopListening();
        showNotification('Error: ' + event.error);
    };

    recognition.onend = function() {
        if (isListening) {
            // Restart recognition if it ended unexpectedly
            setTimeout(() => {
                if (isListening) recognition.start();
            }, 100);
        }
    };

    function processCommand(command) {
        command = command.toLowerCase();
        let response = '';
        
        // Check for specific commands
        if (command.includes('time')) {
            const time = new Date().toLocaleTimeString();
            response = `The current time is ${time}`;
        } else if (command.includes('search') && command.includes('on google')) {
            const query = command.replace('search', '').replace('on google', '').trim();
            response = `Searching Google for "${query}". Here are the results...`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        } else if (command.includes('open youtube')) {
            response = 'Opening YouTube...';
            window.open('https://www.youtube.com', '_blank');
        } else if (command.includes('tell me a joke')) {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
                "Why don't skeletons fight each other? They don't have the guts.",
                "I'm reading a book about anti-gravity. It's impossible to put down!",
                "Did you hear about the claustrophobic astronaut? He just needed a little space."
            ];
            response = jokes[Math.floor(Math.random() * jokes.length)];
        } else if (command.includes('pin')) {
            waitingForPin = true;
            currentPinAttempt = '';
            response = `Please speak your 4-digit PIN to continue.`;
        } else if (command.includes('thank')) {
            response = `You're welcome, ${userName}. Is there anything else I can do for you?`;
        } else if (command.includes('your name')) {
            response = `My name is ${assistantName}, your personal AI assistant.`;
        } else {
            response = `I'm not sure how to help with that, ${userName}. You can ask me about the time, search Google, open YouTube, or tell you a joke.`;
        }
        
        addMessage('assistant', assistantName, response);
        speak(response);
        
        // Reset wake word detection after a short delay
        setTimeout(() => {
            waitingForWakeWord = true;
        }, 3000);
    }

    function speak(text) {
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synth.getVoices().find(voice => voice.name.includes('English'));
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        synth.speak(utterance);
    }

    function addMessage(sender, senderName, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = senderName;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Add loading dots if it's the assistant and content is empty (for loading state)
        if (sender === 'assistant' && !content) {
            contentDiv.innerHTML = '<div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div>';
        } else {
            contentDiv.textContent = content;
        }
        
        messageDiv.appendChild(senderDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleTextInput(e) {
        if (e.key === 'Enter' && textInput.value.trim()) {
            const command = textInput.value.trim();
            addMessage('user', userName, command);
            textInput.value = '';
            processCommand(command);
        }
    }

    function openSettings() {
        settingsPanel.classList.add('open');
        overlay.classList.add('active');
        document.getElementById('assistantName').value = assistantName;
        document.getElementById('userName').value = userName;
        document.getElementById('wakeWord').value = wakeWord;
        document.getElementById('voicePin').value = voicePin;
    }

    function closeSettingsPanel() {
        settingsPanel.classList.remove('open');
        overlay.classList.remove('active');
    }

    function saveSettingsHandler() {
        assistantName = document.getElementById('assistantName').value || 'Jarvis';
        userName = document.getElementById('userName').value || 'Sir';
        wakeWord = document.getElementById('wakeWord').value.toLowerCase() || 'jarvis';
        voicePin = document.getElementById('voicePin').value || '1234';
        
        saveSettings();
        closeSettingsPanel();
        
        showNotification('Settings saved successfully');
        addMessage('assistant', assistantName, `Settings updated. You can call me ${assistantName} and I'll address you as ${userName}.`);
    }

    function saveSettings() {
        localStorage.setItem('jarvisSettings', JSON.stringify({
            assistantName,
            userName,
            wakeWord,
            voicePin
        }));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('jarvisSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            assistantName = settings.assistantName || assistantName;
            userName = settings.userName || userName;
            wakeWord = settings.wakeWord || wakeWord;
            voicePin = settings.voicePin || voicePin;
        }
    }

    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Initialize speech synthesis voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = function() {
            // Voices loaded
        };
    }
});
