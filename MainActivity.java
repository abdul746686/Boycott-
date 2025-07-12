const boycottBrands = ["Pepsi", "Cadbury", "5Star", "7Up", "Lays", "Nestlé", "Maggi", "Tropicana", "KitKat", "CocaCola"];

window.onload = () => {
  const brandGrid = document.getElementById("brandGrid");
  const searchInput = document.getElementById("searchInput");

  // Add static first card
  const addCard = document.createElement("div");
  addCard.className = "card";
  addCard.innerHTML = "➕ उत्पाद जोड़ें";
  brandGrid.appendChild(addCard);

  // Load brands
  boycottBrands.forEach(brand => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = brand;
    brandGrid.appendChild(card);
  });

  // Voice detection
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "hi-IN";

    recognition.onresult = function(event) {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("Heard:", transcript);
      boycottBrands.forEach(brand => {
        if (transcript.toLowerCase().includes(brand.toLowerCase())) {
          alert("⚠️ चेतावनी: आपने बहिष्कृत ब्रांड का नाम लिया – कृपया सावधान रहें।");
          const audio = new Audio("assets/alert.mp3"); // optional alert sound
          audio.play();
        }
      });
    };

    recognition.start();
  } else {
    alert("Your browser does not support speech recognition.");
  }

  // Brand search
  searchInput.addEventListener("input", function() {
    const value = this.value.toLowerCase();
    const cards = document.querySelectorAll(".grid .card");
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(value) ? "block" : "none";
    });
  });
};
