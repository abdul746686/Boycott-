const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a friendly assistant. Respond in the same language as user: Hindi or Urdu." },
      { role: "user", content: userInput }
    ]
  })
});
