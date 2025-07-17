document.addEventListener('DOMContentLoaded', () => {
    // Simulate initialization
    const splash = document.querySelector('.splash');
    const progress = document.querySelector('.progress');
    
    let progressValue = 0;
    const interval = setInterval(() => {
        progressValue += 10;
        progress.style.width = `${progressValue}%`;
        
        if (progressValue >= 100) {
            clearInterval(interval);
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                greetUser();
            }, 1000);
        }
    }, 300);

    // DOM Elements
    const micBtn = document.getElementById('micBtn');
    const status = document.getElementById('status');
    const transcript = document.getElementById('transcript');
    const chatContainer = document.getElementById('chatContainer');
    const clearBtn = document.getElementById('clearBtn');

    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Speech Synthesis
    const synth = window.speechSynthesis;
    let voices = [];
    let assistantVoice = null;

    // Load voices
    function loadVoices() {
        voices = synth.getVoices();
        assistantVoice = voices.find(voice => 
            voice.name.includes('Microsoft Zira') || 
            voice.name.includes('Google US English') ||
            voice.name.includes('Samantha')
        );
        
        if (!assistantVoice) {
            assistantVoice = voices.find(voice => voice.lang.includes('en'));
        }
    }

    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }
    loadVoices();

    // Add message to chat
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div>${text}</div>
            <div class="message-time">${time}</div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Speak text
    function speak(text) {
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (assistantVoice) {
            utterance.voice = assistantVoice;
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
        }
        
        synth.speak(utterance);
    }

    // Greet user
    function greetUser() {
        const greeting = "Hello, I am JarvisR. How can I assist you today?";
        addMessage(greeting);
        speak(greeting);
    }

    // Process user command
    function processCommand(command) {
        command = command.toLowerCase().trim();
        let response = "";
        
        // Check for specific commands
        if (command.includes('time')) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            response = `The current time is ${time}`;
        } 
        else if (command.includes('date')) {
            const date = new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            response = `Today is ${date}`;
        }
        else if (command.includes('weather')) {
            response = "I can't access real-time weather data right now, but you can say 'search for weather in [location]' and I'll find it for you.";
        }
        else if (command.includes('news')) {
            response = "I can fetch the latest news for you. Say 'search for latest news' and I'll find it for you.";
        }
        else if (command.includes('search for') || command.includes('look up')) {
            const query = command.replace('search for', '').replace('look up', '').trim();
            if (query) {
                response = `Searching for ${query}...`;
                setTimeout(() => {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                }, 1000);
            } else {
                response = "What would you like me to search for?";
            }
        }
        else if (command.includes('thank')) {
            response = "You're welcome! Is there anything else I can help you with?";
        }
        else if (command.includes('hello') || command.includes('hi')) {
            response = "Hello there! How can I assist you today?";
        }
        else if (command.includes('who are you')) {
            response = "I am JarvisR, your personal AI assistant. I'm here to help you with information, tasks, and more.";
        }
        else if (command.includes('clear chat')) {
            clearChat();
            return;
        }
        else {
            // Default response for other queries
            const randomResponses = [
                "I'm not sure I understand. Could you rephrase that?",
                "Interesting question. Let me think about that...",
                "I'm still learning. Could you ask me something else?",
                "I don't have that information right now, but I can search for it if you'd like."
            ];
            response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing';
        typingDiv.innerHTML = `
            <div class="typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Simulate AI thinking time
        setTimeout(() => {
            chatContainer.removeChild(typingDiv);
            addMessage(response);
            speak(response);
        }, 1500 + Math.random() * 1000);
    }

    // Clear chat
    function clearChat() {
        chatContainer.innerHTML = '';
        greetUser();
    }

    // Event Listeners
    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('listening')) {
            recognition.stop();
            micBtn.classList.remove('listening');
            status.textContent = 'Ready';
            transcript.classList.remove('show');
        } else {
            recognition.start();
            micBtn.classList.add('listening');
            status.textContent = 'Listening...';
        }
    });

    recognition.onstart = () => {
        transcript.textContent = '';
        transcript.classList.add('show');
    };

    recognition.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        transcript.textContent = transcriptText;
        
        if (event.results[0].isFinal) {
            addMessage(transcriptText, true);
            processCommand(transcriptText);
            transcript.classList.remove('show');
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        status.textContent = `Error: ${event.error}`;
        micBtn.classList.remove('listening');
        transcript.classList.remove('show');
        
        setTimeout(() => {
            status.textContent = 'Ready';
        }, 2000);
    };

    recognition.onend = () => {
        if (micBtn.classList.contains('listening')) {
            micBtn.classList.remove('listening');
            status.textContent = 'Ready';
        }
    };

    clearBtn.addEventListener('click', clearChat);
});
