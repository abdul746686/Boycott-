// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const testBtn = document.getElementById('testBtn');
const statusText = document.getElementById('status');
const permissionText = document.getElementById('permission');
const alertBox = document.getElementById('alertBox');
const detectedBrand = document.getElementById('detectedBrand');
const closeAlert = document.getElementById('closeAlert');

// Audio element for alarm
const alarmAudio = new Audio('alarm.mp3');

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

// Initialize the app
function init() {
    if (!SpeechRecognition) {
        statusText.textContent = 'Status: Speech Recognition not supported in this browser';
        startBtn.disabled = true;
        testBtn.disabled = true;
        return;
    }
    
    setupRecognition();
    setupEventListeners();
    checkMicrophonePermission();
}

function setupRecognition() {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        statusText.textContent = 'Status: Listening...';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };
    
    recognition.onend = () => {
        if (!stopBtn.disabled) {
            // Only restart if not manually stopped
            recognition.start();
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        statusText.textContent = `Status: Error - ${event.error}`;
        stopListening();
    };
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
            .toLowerCase();
        
        checkForBoycottBrands(transcript);
    };
}

function setupEventListeners() {
    startBtn.addEventListener('click', startListening);
    stopBtn.addEventListener('click', stopListening);
    testBtn.addEventListener('click', triggerTestAlert);
    closeAlert.addEventListener('click', () => {
        alertBox.classList.add('hidden');
    });
    
    // Check permission when clicking start (in case it changed)
    startBtn.addEventListener('click', checkMicrophonePermission);
}

function startListening() {
    try {
        recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        statusText.textContent = 'Status: Error starting microphone';
    }
}

function stopListening() {
    recognition.stop();
    statusText.textContent = 'Status: Stopped';
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function checkMicrophonePermission() {
    navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
        updatePermissionStatus(permissionStatus.state);
        
        permissionStatus.onchange = () => {
            updatePermissionStatus(permissionStatus.state);
        };
    }).catch(error => {
        console.error('Permission query failed:', error);
        permissionText.textContent = 'Microphone Permission: Unknown (check manually)';
    });
}

function updatePermissionStatus(state) {
    permissionText.textContent = `Microphone Permission: ${state.charAt(0).toUpperCase() + state.slice(1)}`;
    
    if (state === 'denied') {
        statusText.textContent = 'Status: Microphone access denied';
        startBtn.disabled = true;
    }
}

function checkForBoycottBrands(transcript) {
    for (const brand of boycottBrands) {
        const brandLower = brand.toLowerCase();
        
        // Check if the brand name appears as a whole word in the transcript
        if (transcript.includes(brandLower)) {
            triggerAlert(brand);
            break;
        }
    }
}

function triggerAlert(brandName) {
    // Flash the screen
    document.body.classList.add('flash');
    setTimeout(() => {
        document.body.classList.remove('flash');
    }, 1000);
    
    // Play alarm sound
    alarmAudio.currentTime = 0;
    alarmAudio.play().catch(error => {
        console.error('Error playing alarm:', error);
    });
    
    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]);
    }
    
    // Show alert box
    detectedBrand.textContent = `Detected: ${brandName}`;
    alertBox.classList.remove('hidden');
}

function triggerTestAlert() {
    triggerAlert("TEST BRAND (This is a test)");
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
