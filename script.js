document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");
    const modelSelector = document.getElementById("model-selector");
    const sendBtn = document.getElementById("send-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const apiKeysSection = document.getElementById("api-keys-section");
    const welcomeMessage = document.querySelector(".welcome-message");

    // API Key Inputs
    const openaiKeyInput = document.getElementById("openai-key");
    const geminiKeyInput = document.getElementById("gemini-key");
    const mistralKeyInput = document.getElementById("mistral-key");

    let chatHistory = [];

    // --- Core Functions ---

    /**
     * Toggles the visibility of the API keys settings section.
     */
    const toggleSettings = () => {
        apiKeysSection.classList.toggle("hidden");
    };

    /**
     * Creates and appends a message element to the chat window.
     * @param {string} message - The message content.
     * @param {string} role - The role of the sender ('user' or 'assistant').
     */
    const displayMessage = (message, role) => {
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${role}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    };

    /**
     * Displays a loading indicator in the chat.
     */
    const showLoadingIndicator = () => {
        const loadingElement = document.createElement("div");
        loadingElement.classList.add("message", "assistant-message", "loading-indicator");
        loadingElement.innerHTML = `<span></span><span></span><span></span>`;
        chatMessages.appendChild(loadingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    /**
     * Removes the loading indicator from the chat.
     */
    const hideLoadingIndicator = () => {
        const loadingElement = document.querySelector(".loading-indicator");
        if (loadingElement) {
            loadingElement.remove();
        }
    };

    /**
     * Saves the entire chat history and API keys to localStorage.
     */
    const saveToLocalStorage = () => {
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        if (openaiKeyInput.value) localStorage.setItem("openai_key", openaiKeyInput.value);
        if (geminiKeyInput.value) localStorage.setItem("gemini_key", geminiKeyInput.value);
        if (mistralKeyInput.value) localStorage.setItem("mistral_key", mistralKeyInput.value);
    };

    /**
     * Loads chat history and API keys from localStorage on page load.
     */
    const loadFromLocalStorage = () => {
        const savedHistory = localStorage.getItem("chatHistory");
        const savedOpenAIKey = localStorage.getItem("openai_key");
        const savedGeminiKey = localStorage.getItem("gemini_key");
        const savedMistralKey = localStorage.getItem("mistral_key");

        if (savedOpenAIKey) openaiKeyInput.value = savedOpenAIKey;
        if (savedGeminiKey) geminiKeyInput.value = savedGeminiKey;
        if (savedMistralKey) mistralKeyInput.value = savedMistralKey;

        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            chatHistory.forEach(item => displayMessage(item.content, item.role));
        }
    };

    /**
     * Handles the form submission to send a message.
     * @param {Event} e - The form submission event.
     */
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Add user message to UI and history
        displayMessage(userMessage, "user");
        chatHistory.push({ role: "user", content: userMessage });
        saveToLocalStorage();

        userInput.value = "";
        sendBtn.disabled = true;
        showLoadingIndicator();

        try {
            const selectedModel = modelSelector.value;
            const apiKey = getApiKey(selectedModel);

            if (!apiKey) {
                throw new Error(`API key for ${selectedModel} not found. Please add it in the settings.`);
            }

            const response = await callApi(selectedModel, apiKey, userMessage);
            const assistantMessage = parseApiResponse(selectedModel, response);
            
            // Add assistant message to UI and history
            displayMessage(assistantMessage, "assistant");
            chatHistory.push({ role: "assistant", content: assistantMessage });
            saveToLocalStorage();

        } catch (error) {
            console.error("API Error:", error);
            displayMessage(`Oops! Something went wrong. ${error.message}`, "assistant");
        } finally {
            hideLoadingIndicator();
            sendBtn.disabled = false;
            userInput.focus();
        }
    };

    /**
     * Gets the appropriate API key based on the selected model.
     * @param {string} model - The selected model ('openai', 'gemini', 'mistral').
     * @returns {string} The corresponding API key.
     */
    const getApiKey = (model) => {
        switch (model) {
            case "openai": return openaiKeyInput.value;
            case "gemini": return geminiKeyInput.value;
            case "mistral": return mistralKeyInput.value;
            default: return null;
        }
    };

    /**
     * Calls the appropriate AI API based on the selected model.
     * @param {string} model - The selected model.
     * @param {string} apiKey - The API key for the selected model.
     * @param {string} userMessage - The user's message.
     * @returns {Promise<Object>} The JSON response from the API.
     */
    const callApi = async (model, apiKey, userMessage) => {
        let url, options;
        const conversationHistory = chatHistory.slice(0, -1); // Exclude the current user message for some APIs

        switch (model) {
            case "openai":
                url = "https://api.openai.com/v1/chat/completions";
                options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [...conversationHistory, { role: "user", content: userMessage }]
                    })
                };
                break;
            
            case "gemini":
                url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
                 // Gemini API works better with a simplified history format
                const geminiHistory = conversationHistory.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));
                options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [...geminiHistory, { parts: [{ text: userMessage }] }]
                    })
                };
                break;

            case "mistral":
                url = "https://api.mistral.ai/v1/chat/completions";
                options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "mistral-tiny",
                        messages: [...conversationHistory, { role: "user", content: userMessage }]
                    })
                };
                break;
        }
        
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
        }
        return response.json();
    };

    /**
     * Parses the response from different APIs to extract the message content.
     * @param {string} model - The model that was called.
     * @param {Object} data - The JSON data from the API response.
     * @returns {string} The extracted assistant message.
     */
    const parseApiResponse = (model, data) => {
        try {
            switch (model) {
                case "openai":
                case "mistral":
                    return data.choices[0].message.content;
                case "gemini":
                    return data.candidates[0].content.parts[0].text;
                default:
                    return "Sorry, I could not parse the response.";
            }
        } catch (error) {
            console.error("Error parsing response:", data);
            throw new Error("Failed to parse the API response.");
        }
    };


    // --- Event Listeners ---
    chatForm.addEventListener("submit", handleSendMessage);
    settingsBtn.addEventListener("click", toggleSettings);
    openaiKeyInput.addEventListener("change", saveToLocalStorage);
    geminiKeyInput.addEventListener("change", saveToLocalStorage);
    mistralKeyInput.addEventListener("change", saveToLocalStorage);

    // --- Initial Load ---
    loadFromLocalStorage();
});
