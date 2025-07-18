// DOM Elements
const app = document.getElementById('app');
const splash = document.getElementById('splash');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceToggle = document.getElementById('voiceToggle');
const chatHistory = document.getElementById('chatHistory');
const voiceFeedback = document.getElementById('voiceFeedback');
const languageBtn = document.getElementById('languageBtn');
const languageDropdown = document.getElementById('languageDropdown');
const themeToggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
const clearChat = document.getElementById('clearChat');
const exportPDF = document.getElementById('exportPDF');
const exportTXT = document.getElementById('exportTXT');
const voiceSettings = document.getElementById('voiceSettings');
const voiceSettingsDropdown = document.getElementById('voiceSettingsDropdown');
const loadingIndicator = document.getElementById('loadingIndicator');

// App State
let isListening = false;
let currentLanguage = 'en';
let currentTheme = localStorage.getItem('theme') || 'light';
let voicePreference = localStorage.getItem('voicePreference') || 'neutral';
let chatMessages = [
  {
    sender: 'bot',
    text: 'Hello! I\'m your multilingual assistant. How can I help you today?',
    timestamp: new Date().toISOString(),
    language: 'en'
  }
];

// Initialize the app
function init() {
  // Hide splash screen after 3 seconds
  setTimeout(() => {
    splash.style.display = 'none';
    app.classList.remove('hidden');
  }, 3000);
  
  // Set initial theme
  setTheme(currentTheme);
  
  // Load chat history
  loadChatHistory();
  
  // Initialize event listeners
  setupEventListeners();
  
  // Check for speech recognition support
  checkSpeechRecognitionSupport();
}

// Set theme (light/dark)
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  if (theme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

// Toggle theme
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(currentTheme);
}

// Load chat history from localStorage
function loadChatHistory() {
  const savedChat = localStorage.getItem('chatHistory');
  if (savedChat) {
    chatMessages = JSON.parse(savedChat);
    renderChatHistory();
  }
}

// Save chat history to localStorage
function saveChatHistory() {
  localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
}

// Render chat history
function renderChatHistory() {
  chatHistory.innerHTML = '';
  
  chatMessages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${message.sender} fade-in`;
    
    messageElement.innerHTML = `
      <div class="flex items-start space-x-2 ${message.sender === 'user' ? 'justify-end' : ''}">
        ${message.sender === 'bot' ? `
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <i class="fas fa-robot text-purple-600 dark:text-purple-300"></i>
          </div>
        ` : ''}
        
        <div class="${message.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800'} p-3 rounded-lg shadow-sm max-w-xs md:max-w-md lg:max-w-lg">
          <p class="${message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}">${message.text}</p>
          <p class="text-xs ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'} mt-1">
            ${formatTimestamp(message.timestamp)}
          </p>
        </div>
        
        ${message.sender === 'user' ? `
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <i class="fas fa-user text-gray-600 dark:text-gray-300"></i>
          </div>
        ` : ''}
      </div>
    `;
    
    chatHistory.appendChild(messageElement);
  });
  
  // Scroll to bottom
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Format timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message to chat
function addMessage(sender, text) {
  const message = {
    sender,
    text,
    timestamp: new Date().toISOString(),
    language: currentLanguage
  };
  
  chatMessages.push(message);
  saveChatHistory();
  renderChatHistory();
  
  // If it's a user message, get bot response
  if (sender === 'user') {
    getBotResponse(text);
  }
}

// Get bot response (simulated)
function getBotResponse(userInput) {
  showLoading(true);
  
  // Simulate API call delay
  setTimeout(() => {
    let response = '';
    
    // Simple responses based on input
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      response = currentLanguage === 'hi' ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?' : 
                currentLanguage === 'ur' ? 'ہیلو! میں آپ کی کس طرح مدد کر سکتا ہوں؟' :
                'Hello there! How can I assist you today?';
    } else if (userInput.toLowerCase().includes('help')) {
      response = currentLanguage === 'hi' ? 'मैं आपकी किस प्रकार सहायता कर सकता हूँ?' :
                currentLanguage === 'ur' ? 'میں آپ کی کس طرح مدد کر سکتا ہوں؟' :
                'What kind of help do you need?';
    } else {
      response = currentLanguage === 'hi' ? 'मैं आपके संदेश को समझ गया। क्या आप कुछ और जानना चाहेंगे?' :
                currentLanguage === 'ur' ? 'میں آپ کا پیغام سمجھ گیا ہوں۔ کیا آپ کچھ اور جاننا چاہیں گے؟' :
                'I understand your message. Would you like to know anything else?';
    }
    
    addMessage('bot', response);
    speakResponse(response);
    showLoading(false);
  }, 1500);
}

// Text-to-speech function
function speakResponse(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on preference
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices[0];
    
    if (voicePreference === 'female') {
      selectedVoice = voices.find(v => v.name.includes('Female')) || voices[0];
    } else if (voicePreference === 'male') {
      selectedVoice = voices.find(v => v.name.includes('Male')) || voices[0];
    }
    
    utterance.voice = selectedVoice;
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 
                     currentLanguage === 'ur' ? 'ur-PK' : 'en-US';
    
    window.speechSynthesis.speak(utterance);
  }
}

// Voice recognition functions
function checkSpeechRecognitionSupport() {
  if (!('webkitSpeechRecognition' in window)) {
    voiceToggle.disabled = true;
    voiceToggle.title = "Voice input not supported in your browser";
  }
}

function startVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) return;
  
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  
  // Set language based on current selection
  recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 
                   currentLanguage === 'ur' ? 'ur-PK' : 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    voiceToggle.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceToggle.classList.add('bg-red-500', 'text-white');
    voiceToggle.classList.remove('bg-purple-100', 'text-purple-600');
    voiceFeedback.classList.remove('hidden');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    stopVoiceRecognition();
    addMessage('bot', 'Sorry, there was an error with voice recognition.');
  };
  
  recognition.onend = () => {
    stopVoiceRecognition();
    if (chatInput.value.trim()) {
      sendMessage();
    }
  };
  
  recognition.start();
}

function stopVoiceRecognition() {
  isListening = false;
  voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
  voiceToggle.classList.remove('bg-red-500', 'text-white');
  voiceToggle.classList.add('bg-purple-100', 'text-purple-600');
  voiceFeedback.classList.add('hidden');
}

// Send message function
function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addMessage('user', message);
    chatInput.value = '';
  }
}

// Show/hide loading indicator
function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

// Export chat functions
function exportChatAsPDF() {
  showLoading(true);
  // In a real app, this would call a PDF generation API
  setTimeout(() => {
    alert('PDF export would be generated here in a real implementation');
    showLoading(false);
  }, 1000);
}

function exportChatAsTXT() {
  let textContent = 'Chat History with The Assist\n\n';
  chatMessages.forEach(msg => {
    textContent += `${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.text}\n`;
    textContent += `${formatTimestamp(msg.timestamp)}\n\n`;
  });
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'the-assist-chat.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// Set up event listeners
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Language switcher
  languageBtn.addEventListener('click', () => {
    languageDropdown.classList.toggle('hidden');
    menuDropdown.classList.add('hidden');
    voiceSettingsDropdown.classList.add('hidden');
  });
  
  document.querySelectorAll('#languageDropdown button').forEach(button => {
    button.addEventListener('click', () => {
      currentLanguage = button.dataset.lang;
      languageBtn.querySelector('span').textContent = button.textContent;
      languageDropdown.classList.add('hidden');
    });
  });
  
  // Menu button
  menuBtn.addEventListener('click', () => {
    menuDropdown.classList.toggle('hidden');
    languageDropdown.classList.add('hidden');
    voiceSettingsDropdown.classList.add('hidden');
  });
  
  // Voice settings
  voiceSettings.addEventListener('click', () => {
    voiceSettingsDropdown.classList.toggle('hidden');
    menuDropdown.classList.add('hidden');
    languageDropdown.classList.add('hidden');
  });
  
  document.querySelectorAll('#voiceSettingsDropdown button').forEach(button => {
    button.addEventListener('click', () => {
      voicePreference = button.dataset.voice;
      localStorage.setItem('voicePreference', voicePreference);
      voiceSettingsDropdown.classList.add('hidden');
    });
  });
  
  // Voice toggle
  voiceToggle.addEventListener('click', () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  });
  
  // Send message on button click
  sendBtn.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Clear chat
  clearChat.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      chatMessages = [];
      saveChatHistory();
      renderChatHistory();
    }
  });
  
  // Export buttons
  exportPDF.addEventListener('click', exportChatAsPDF);
  exportTXT.addEventListener('click', exportChatAsTXT);
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
      languageDropdown.classList.add('hidden');
    }
    
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.add('hidden');
    }
    
    if (!voiceSettings.contains(e.target) && !voiceSettingsDropdown.contains(e.target)) {
      voiceSettingsDropdown.classList.add('hidden');
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+N - New chat
  if (e.ctrlKey && e.shiftKey && e.key === 'N') {
    if (confirm('Start a new chat? Current chat will be cleared.')) {
      chatMessages = [];
      saveChatHistory();
      renderChatHistory();
    }
  }
  
  // Ctrl+L - Language switch
  if (e.ctrlKey && e.key === 'L') {
    languageDropdown.classList.toggle('hidden');
  }
});

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
  }
