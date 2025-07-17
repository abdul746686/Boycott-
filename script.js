document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const micBtn = document.getElementById('micBtn');
    const textInput = document.getElementById('textInput');
    const chatMessages = document.getElementById('chatMessages');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const helpBtn = document.getElementById('helpBtn');
    const helpPanel = document.getElementById('helpPanel');
    const closeHelp = document.getElementById('closeHelp');
    const overlay = document.getElementById('overlay');
    const saveSettings = document.getElementById('saveSettings');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const waveform = document.getElementById('waveform');
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    const contactLink = document.getElementById('contactLink');
    const legalPanel = document.getElementById('legalPanel');
    const legalTitle = document.getElementById('legalTitle');
    const legalContent = document.getElementById('legalContent');
    const closeLegal = document.getElementById('closeLegal');
    const themeBtns = document.querySelectorAll('.theme-btn');

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
    let currentLanguage = 'en-US';
    let currentTheme = 'dark';

    // Jokes database
    const jokes = {
        'en-US': [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
            "Why don't skeletons fight each other? They don't have the guts.",
            "I'm reading a book about anti-gravity. It's impossible to put down!",
            "Did you hear about the claustrophobic astronaut? He just needed a little space."
        ],
        'hi-IN': [
            "एक बार की बात है, एक आदमी ने अपने कुत्ते को उसका नाम पूछा। कुत्ते ने कहा, 'मैं तो बस भौंकता हूँ, नाम क्या रखूँ?'",
            "दो साल के बच्चे ने अपने पिता से पूछा, 'पापा, आप इतने बड़े कैसे हो गए?' पिता ने जवाब दिया, 'समय के साथ-साथ, बेटा... और थोड़े से पैसे के साथ भी!'",
            "एक शिक्षक ने छात्र से पूछा, 'तुम्हारे पिता क्या करते हैं?' छात्र ने जवाब दिया, 'वो मर चुके हैं।' शिक्षक ने कहा, 'मेरे मतलब था कि जब वो जीवित थे तो क्या करते थे?'",
            "एक आदमी डॉक्टर के पास गया और बोला, 'डॉक्टर साहब, मुझे लगता है मैं अदृश्य हो गया हूँ।' डॉक्टर ने जवाब दिया, 'कौन बोल रहा है?'"
        ],
        'ur-PK': [
            "ایک آدمی نے اپنے دوست سے پوچھا: 'تمہارے گھر میں کتنے کمرے ہیں؟' دوست نے جواب دیا: 'میں نے ابھی تک گنتی نہیں سیکھی!'",
            "استاد نے شاگرد سے پوچھا: 'اگر تمہارے پاس پانچ روپے ہوں اور تم نے اپنے دوست کو تین روپے دے دیے، تو تمہارے پاس کتنے روپے بچے؟' شاگرد نے جواب دیا: 'پانچ روپے، کیونکہ میرا دوست ابھی تک واپس نہیں کیا!'",
            "ایک لڑکا اپنے والد سے پوچھتا ہے: 'ابا، آپ نے میری ماں سے شادی کیوں کی؟' والد جواب دیتے ہیں: 'بیٹا، تمہیں سمجھانے کے لیے ایک مثال دیتا ہوں۔ جب تمہیں زکام ہوتا ہے تو کیا تم ناک سے سانس لیتے ہو یا منہ سے؟'"
        ]
    };

    // Responses database
    const responses = {
        'en-US': {
            welcome: (name) => `Hello ${name}, I'm ${assistantName}. Say "${wakeWord}" to wake me up or click the mic.`,
            wakeResponse: (name) => `Yes ${name}, I'm listening.`,
            timeResponse: (time) => `The current time is ${time}`,
            searchResponse: (query) => `Searching Google for "${query}". Here are the results...`,
            openResponse: (site) => `Opening ${site}...`,
            jokeResponse: "Here's a joke for you: ",
            torchOn: "Torch is now on.",
            torchOff: "Torch is now off.",
            pinPrompt: "Please speak your 4-digit PIN to continue.",
            pinCorrect: (name) => `PIN accepted. How can I help you, ${name}?`,
            pinIncorrect: (wakeWord) => `Incorrect PIN. Please try again or say "${wakeWord}" to cancel.`,
            thanksResponse: (name) => `You're welcome, ${name}. Is there anything else I can do for you?`,
            nameResponse: (name) => `My name is ${name}, your personal AI assistant.`,
            weatherResponse: (city, weather) => `The weather in ${city} is ${weather}.`,
            defaultResponse: (name) => `I'm not sure how to help with that, ${name}. You can ask me about the time, search Google, open YouTube, or tell you a joke.`,
            errorMic: "Error accessing microphone. Please check permissions.",
            errorRecognition: "Speech recognition error. Please try again.",
            errorWeather: "Couldn't fetch weather information. Please try again later."
        },
        'hi-IN': {
            welcome: (name) => `नमस्ते ${name}, मैं ${assistantName} हूँ। मुझे जगाने के लिए "${wakeWord}" कहें या माइक पर क्लिक करें।`,
            wakeResponse: (name) => `हाँ ${name}, मैं सुन रहा हूँ।`,
            timeResponse: (time) => `अभी समय है ${time}`,
            searchResponse: (query) => `Google पर "${query}" के लिए खोज रहा हूँ... यहां परिणाम हैं...`,
            openResponse: (site) => `${site} खोल रहा हूँ...`,
            jokeResponse: "आपके लिए एक मजाक: ",
            torchOn: "टॉर्च अब चालू है।",
            torchOff: "टॉर्च अब बंद है।",
            pinPrompt: "जारी रखने के लिए कृपया अपना 4-अंकीय पिन बोलें।",
            pinCorrect: (name) => `पिन स्वीकृत। मैं आपकी क्या मदद कर सकता हूँ, ${name}?`,
            pinIncorrect: (wakeWord) => `गलत पिन। कृपया पुनः प्रयास करें या "${wakeWord}" कहकर रद्द करें।`,
            thanksResponse: (name) => `आपका स्वागत है, ${name}। क्या मैं आपके लिए और कुछ कर सकता हूँ?`,
            nameResponse: (name) => `मेरा नाम ${name} है, आपका व्यक्तिगत AI सहायक।`,
            weatherResponse: (city, weather) => `${city} में मौसम ${weather} है।`,
            defaultResponse: (name) => `मुझे नहीं पता कि इससे कैसे मदद करूं, ${name}। आप मुझसे समय पूछ सकते हैं, Google पर खोज सकते हैं, YouTube खोल सकते हैं, या मजाक सुन सकते हैं।`,
            errorMic: "माइक्रोफोन तक पहुंच में त्रुटि। कृपया अनुमतियाँ जांचें।",
            errorRecognition: "वाक् पहचान त्रुटि। कृपया पुनः प्रयास करें।",
            errorWeather: "मौसम की जानकारी प्राप्त नहीं कर सका। कृपया बाद में पुनः प्रयास करें।"
        },
        'ur-PK': {
            welcome: (name) => `السلام علیکم ${name}, میں ${assistantName} ہوں۔ مجھے جگانے کے لیے "${wakeWord}" کہیں یا مائیک پر کلک کریں۔`,
            wakeResponse: (name) => `جی ${name}, میں سن رہا ہوں۔`,
            timeResponse: (time) => `اب وقت ہے ${time}`,
            searchResponse: (query) => `Google پر "${query}" کے لیے تلاش کر رہا ہوں... یہاں نتائج ہیں...`,
            openResponse: (site) => `${site} کھول رہا ہوں...`,
            jokeResponse: "آپ کے لیے ایک مذاق: ",
            torchOn: "ٹارچ اب چالو ہے۔",
            torchOff: "ٹارچ اب بند ہے۔",
            pinPrompt: "براہ کرم اپنا 4 ہندسی پن بولیں۔",
            pinCorrect: (name) => `پن قبول ہو گیا۔ ${name}, میں آپ کی کس طرح مدد کر سکتا ہوں؟`,
            pinIncorrect: (wakeWord) => `غلط پن۔ براہ کرم دوبارہ کوشش کریں یا "${wakeWord}" کہہ کر منسوخ کریں۔`,
            thanksResponse: (name) => `آپ کا شکریہ، ${name}۔ کیا میں آپ کے لیے اور کچھ کر سکتا ہوں؟`,
            nameResponse: (name) => `میرا نام ${name} ہے، آپ کا ذاتی AI معاون۔`,
            weatherResponse: (city, weather) => `${city} میں موسم ${weather} ہے۔`,
            defaultResponse: (name) => `مجھے نہیں معلوم کہ اس میں کیسے مدد کروں، ${name}۔ آپ مجھ سے وقت پوچھ سکتے ہیں، Google پر تلاش کر سکتے ہیں، YouTube کھول سکتے ہیں، یا ایک مذاق سن سکتے ہیں۔`,
            errorMic: "مائیکروفون تک رسائی میں خرابی۔ براہ کرم اجازتیں چیک کریں۔",
            errorRecognition: "تقریر کی شناخت میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔",
            errorWeather: "موسم کی معلومات حاصل نہیں کر سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔"
        }
    };

    // Legal content
    const legalContents = {
        'privacy': {
            'en-US': {
                title: 'Privacy Policy',
                content: '<h3>Privacy Policy</h3><p>This AI voice assistant respects your privacy. All voice processing happens locally in your browser. We do not store or transmit your voice data to any servers.</p><p>The app may use browser storage (localStorage) to remember your preferences like wake word and assistant name, but this information never leaves your device.</p>'
            },
            'hi-IN': {
                title: 'गोपनीयता नीति',
                content: '<h3>गोपनीयता नीति</h3><p>यह AI वॉइस असिस्टेंट आपकी गोपनीयता का सम्मान करता है। सभी वॉइस प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से होती है। हम आपके वॉइस डेटा को किसी सर्वर पर स्टोर या ट्रांसमिट नहीं करते हैं।</p><p>ऐप आपकी प्राथमिकताओं जैसे वेक वर्ड और असिस्टेंट नाम को याद रखने के लिए ब्राउज़र स्टोरेज (localStorage) का उपयोग कर सकता है, लेकिन यह जानकारी आपके डिवाइस को कभी नहीं छोड़ती है।</p>'
            },
            'ur-PK': {
                title: 'رازداری کی پالیسی',
                content: '<h3>رازداری کی پالیسی</h3><p>یہ AI وائس اسسٹنٹ آپ کی رازداری کا احترام کرتا ہے۔ تمام وائس پروسیسنگ آپ کے براؤزر میں مقامی طور پر ہوتی ہے۔ ہم آپ کے وائس ڈیٹا کو کسی بھی سرور پر اسٹور یا منتقل نہیں کرتے ہیں۔</p><p>ایپ آپ کی ترجیحات جیسے ویک ورڈ اور اسسٹنٹ کا نام یاد رکھنے کے لیے براؤزر اسٹوریج (localStorage) استعمال کر سکتی ہے، لیکن یہ معلومات آپ کے ڈیوائس کو کبھی نہیں چھوڑتی ہیں۔</p>'
            }
        },
        'terms': {
            'en-US': {
                title: 'Terms & Conditions',
                content: '<h3>Terms & Conditions</h3><p>By using this AI voice assistant, you agree to the following terms:</p><ol><li>The assistant is provided for general informational purposes only.</li><li>We make no guarantees about the accuracy or reliability of the information provided.</li><li>You are responsible for any actions taken based on the assistant\'s responses.</li><li>The assistant may not be available at all times and may be subject to technical limitations.</li></ol>'
            },
            'hi-IN': {
                title: 'नियम और शर्तें',
                content: '<h3>नियम और शर्तें</h3><p>इस AI वॉइस असिस्टेंट का उपयोग करके, आप निम्नलिखित शर्तों से सहमत होते हैं:</p><ol><li>असिस्टेंट केवल सामान्य सूचनात्मक उद्देश्यों के लिए प्रदान किया जाता है।</li><li>हम प्रदान की गई जानकारी की सटीकता या विश्वसनीयता के बारे में कोई गारंटी नहीं देते हैं।</li><li>असिस्टेंट की प्रतिक्रियाओं के आधार पर की गई किसी भी कार्रवाई के लिए आप जिम्मेदार हैं।</li><li>असिस्टेंट हर समय उपलब्ध नहीं हो सकता है और तकनीकी सीमाओं के अधीन हो सकता है।</li></ol>'
            },
            'ur-PK': {
                title: 'شرائط و ضوابط',
                content: '<h3>شرائط و ضوابط</h3><p>اس AI وائس اسسٹنٹ کا استعمال کرتے ہوئے، آپ مندرجہ ذیل شرائط سے متفق ہیں:</p><ol><li>اسسٹنٹ صرف عمومی معلوماتی مقاصد کے لیے فراہم کیا جاتا ہے۔</li><li>ہم فراہم کردہ معلومات کی درستگی یا قابل اعتمادیت کے بارے میں کوئی ضمانت نہیں دیتے ہیں۔</li><li>اسسٹنٹ کے جوابات کی بنیاد پر کیے گئے کسی بھی عمل کے لیے آپ ذمہ دار ہیں۔</li><li>اسسٹنٹ ہر وقت دستیاب نہیں ہو سکتا ہے اور تکنیکی حدود کے تابع ہو سکتا ہے۔</li></ol>'
            }
        },
        'contact': {
            'en-US': {
                title: 'Contact Us',
                content: '<h3>Contact Information</h3><p>For any questions or feedback about the AI voice assistant, please contact us at:</p><p>Email: <a href="mailto:support@jarvisexample.com">support@jarvisexample.com</a></p><p>We appreciate your feedback and will respond as soon as possible.</p>'
            },
            'hi-IN': {
                title: 'संपर्क करें',
                content: '<h3>संपर्क जानकारी</h3><p>AI वॉइस असिस्टेंट के बारे में किसी भी प्रश्न या प्रतिक्रिया के लिए, कृपया हमसे संपर्क करें:</p><p>ईमेल: <a href="mailto:support@jarvisexample.com">support@jarvisexample.com</a></p><p>हम आपकी प्रतिक्रिया की सराहना करते हैं और जितनी जल्दी हो सके जवाब देंगे।</p>'
            },
            'ur-PK': {
                title: 'ہم سے رابطہ کریں',
                content: '<h3>رابطے کی معلومات</h3><p>AI وائس اسسٹنٹ کے بارے میں کسی بھی سوال یا رائے کے لیے، براہ کرم ہم سے رابطہ کریں:</p><p>ای میل: <a href="mailto:support@jarvisexample.com">support@jarvisexample.com</a></p><p>ہم آپ کی رائے کی تعریف کرتے ہیں اور جلد از جلد جواب دیں گے۔</p>'
            }
        }
    };

    // Load settings from localStorage
    loadSettings();

    // Event Listeners
    micBtn.addEventListener('click', toggleListening);
    textInput.addEventListener('keypress', handleTextInput);
    settingsBtn.addEventListener('click', () => openPanel('settings'));
    helpBtn.addEventListener('click', () => openPanel('help'));
    closeSettings.addEventListener('click', closePanels);
    closeHelp.addEventListener('click', closePanels);
    closeLegal.addEventListener('click', closePanels);
    overlay.addEventListener('click', closePanels);
    saveSettings.addEventListener('click', saveSettingsHandler);
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalContent('privacy');
    });
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalContent('terms');
    });
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLegalContent('contact');
    });

    // Theme switcher
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTheme = btn.dataset.theme;
            document.body.classList.toggle('light-theme', currentTheme === 'light');
        });
    });

    // Initialize with welcome message if no messages
    if (chatMessages.children.length === 0) {
        setTimeout(() => {
            const welcomeMsg = getResponse('welcome', userName);
            addMessage('assistant', assistantName, welcomeMsg);
            speak(welcomeMsg);
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
            showNotification(getResponse('wakeResponse', userName));
        } catch (e) {
            showNotification(getResponse('errorMic'));
            console.error('Speech recognition error:', e);
        }
    }

    function stopListening() {
        recognition.stop();
        micBtn.classList.remove('listening');
        waveform.classList.remove('active');
        isListening = false;
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
                    const response = getResponse('wakeResponse', userName);
                    addMessage('assistant', assistantName, response);
                    speak(response);
                }
            } else if (waitingForPin) {
                currentPinAttempt = transcript.replace(/\D/g, ''); // Extract numbers only
                addMessage('user', userName, transcript);
                
                if (currentPinAttempt === voicePin) {
                    waitingForPin = false;
                    const response = getResponse('pinCorrect', userName);
                    addMessage('assistant', assistantName, response);
                    speak(response);
                } else {
                    const response = getResponse('pinIncorrect', wakeWord);
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
        showNotification(getResponse('errorRecognition'));
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
        if (command.includes('time') || command.includes('समय') || command.includes('وقت')) {
            const time = new Date().toLocaleTimeString(currentLanguage);
            response = getResponse('timeResponse', time);
        } else if ((command.includes('search') || command.includes('खोज') || command.includes('تلاش')) && 
                  (command.includes('google') || command.includes('गूगल') || command.includes('گوگل'))) {
            const query = command.replace(/search|खोज|تلاش|google|गूगल|گوگل|on|पर|پر/gi, '').trim();
            response = getResponse('searchResponse', query);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        } else if (command.includes('open youtube') || command.includes('यूट्यूब खोलो') || command.includes('یوٹیوب کھولو')) {
            response = getResponse('openResponse', 'YouTube');
            window.open('https://www.youtube.com', '_blank');
        } else if (command.includes('open whatsapp') || command.includes('व्हाट्सएप खोलो') || command.includes('واٹس ایپ کھولو')) {
            response = getResponse('openResponse', 'WhatsApp');
            window.open('https://web.whatsapp.com', '_blank');
        } else if (command.includes('tell me a joke') || command.includes('मजाक सुनाओ') || command.includes('مذاق سناؤ')) {
            const langJokes = jokes[currentLanguage] || jokes['en-US'];
            const joke = langJokes[Math.floor(Math.random() * langJokes.length)];
            response = getResponse('jokeResponse') + joke;
        } else if (command.includes('torch on') || command.includes('टॉर्च ऑन') || command.includes('ٹارچ آن')) {
            toggleTorch(true);
            response = getResponse('torchOn');
        } else if (command.includes('torch off') || command.includes('टॉर्च ऑफ') || command.includes('ٹارچ آف')) {
            toggleTorch(false);
            response = getResponse('torchOff');
        } else if (command.includes('pin') || command.includes('पिन') || command.includes('پن')) {
            waitingForPin = true;
            currentPinAttempt = '';
            response = getResponse('pinPrompt');
        } else if (command.includes('thank') || command.includes('धन्यवाद') || command.includes('شکریہ')) {
            response = getResponse('thanksResponse', userName);
        } else if (command.includes('your name') || command.includes('तुम्हारा नाम') || command.includes('تمہارا نام')) {
            response = getResponse('nameResponse', assistantName);
        } else if ((command.includes('weather') || command.includes('मौसम') || command.includes('موسم')) && 
                  (command.includes('in') || command.includes('में') || command.includes('میں'))) {
            const city = extractCityFromWeatherCommand(command);
            if (city) {
                getWeather(city).then(weather => {
                    const weatherResponse = getResponse('weatherResponse', city, weather);
                    addMessage('assistant', assistantName, weatherResponse);
                    speak(weatherResponse);
                }).catch(() => {
                    const errorResponse = getResponse('errorWeather');
                    addMessage('assistant', assistantName, errorResponse);
                    speak(errorResponse);
                });
                return;
            }
        } else {
            response = getResponse('defaultResponse', userName);
        }
        
        addMessage('assistant', assistantName, response);
        speak(response);
        
        // Reset wake word detection after a short delay
        setTimeout(() => {
            waitingForWakeWord = true;
        }, 3000);
    }

    function extractCityFromWeatherCommand(command) {
        // English pattern
        let match = command.match(/weather in (.+)/i);
        if (match) return match[1].trim();
        
        // Hindi pattern
        match = command.match(/मौसम (.+) में/i);
        if (match) return match[1].trim();
        
        // Urdu pattern
        match = command.match(/موسم (.+) میں/i);
        if (match) return match[1].trim();
        
        return null;
    }

    async function getWeather(city) {
        // Note: In a real app, you would need to use a weather API with an API key
        // This is a simulation that returns random weather conditions
        const conditions = ['sunny', 'cloudy', 'rainy', 'windy', 'stormy'];
        const temperatures = ['20°C', '25°C', '30°C', '15°C', '10°C'];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
        
        return `${randomCondition} with a temperature of ${randomTemp}`;
    }

    function toggleTorch(on) {
        // Create torch effect div if it doesn't exist
        let torchEffect = document.getElementById('torchEffect');
        if (!torchEffect) {
            torchEffect = document.createElement('div');
            torchEffect.id = 'torchEffect';
            torchEffect.className = 'torch-effect';
            document.body.appendChild(torchEffect);
        }
        
        torchEffect.classList.toggle('active', on);
    }

    function speak(text) {
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        
        // Try to find a voice that matches the current language
        const preferredVoice = voices.find(voice => 
            voice.lang === currentLanguage || 
            voice.lang.startsWith(currentLanguage.split('-')[0])
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
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

    function openPanel(panelName) {
        closePanels(); // Close any open panels first
        
        if (panelName === 'settings') {
            document.getElementById('assistantName').value = assistantName;
            document.getElementById('userName').value = userName;
            document.getElementById('wakeWord').value = wakeWord;
            document.getElementById('voicePin').value = voicePin;
            document.getElementById('languageSelect').value = currentLanguage;
            settingsPanel.classList.add('open');
        } else if (panelName === 'help') {
            helpPanel.classList.add('open');
        }
        
        overlay.classList.add('active');
    }

    function closePanels() {
        settingsPanel.classList.remove('open');
        helpPanel.classList.remove('open');
        legalPanel.classList.remove('open');
        overlay.classList.remove('active');
    }

    function showLegalContent(type) {
        const content = legalContents[type][currentLanguage] || legalContents[type]['en-US'];
        legalTitle.innerHTML = `<i class="fas ${type === 'privacy' ? 'fa-shield-alt' : type === 'terms' ? 'fa-file-contract' : 'fa-envelope'}"></i> ${content.title}`;
        legalContent.innerHTML = content.content;
        closePanels();
        legalPanel.classList.add('open');
        overlay.classList.add('active');
    }

    function saveSettingsHandler() {
        assistantName = document.getElementById('assistantName').value || 'Jarvis';
        userName = document.getElementById('userName').value || 'Sir';
        wakeWord = document.getElementById('wakeWord').value.toLowerCase() || 'jarvis';
        voicePin = document.getElementById('voicePin').value || '1234';
        currentLanguage = document.getElementById('languageSelect').value || 'en-US';
        
        // Update recognition language
        recognition.lang = currentLanguage;
        
        saveSettings();
        closePanels();
        
        showNotification(getResponse('wakeResponse', userName));
        const settingsMsg = getResponse('nameResponse', assistantName) + ' ' + 
                          getResponse('wakeResponse', userName);
        addMessage('assistant', assistantName, settingsMsg);
        speak(settingsMsg);
    }

    function saveSettings() {
        localStorage.setItem('jarvisSettings', JSON.stringify({
            assistantName,
            userName,
            wakeWord,
            voicePin,
            currentLanguage,
            currentTheme
        }));
        
        // Apply theme
        document.body.classList.toggle('light-theme', currentTheme === 'light');
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('jarvisSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            assistantName = settings.assistantName || assistantName;
            userName = settings.userName || userName;
            wakeWord = settings.wakeWord || wakeWord;
            voicePin = settings.voicePin || voicePin;
            currentLanguage = settings.currentLanguage || currentLanguage;
            currentTheme = settings.currentTheme || currentTheme;
            
            // Apply theme
            document.body.classList.toggle('light-theme', currentTheme === 'light');
            // Update theme buttons
            themeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === currentTheme);
            });
            
            // Set recognition language
            recognition.lang = currentLanguage;
        }
    }

    function showNotification(message) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function getResponse(key, ...args) {
        const langResponses = responses[currentLanguage] || responses['en-US'];
        const responseTemplate = langResponses[key] || responses['en-US'][key];
        
        if (typeof responseTemplate === 'function') {
            return responseTemplate(...args);
        }
        return responseTemplate;
    }

    // Initialize speech synthesis voices
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = function() {
            // Voices loaded
        };
    }
});
