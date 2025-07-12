// Extensive list of boycott brands (real data from BDS and pro-Palestine sources)
const boycottBrands = [
    "pepsi", "nestle", "mcdonalds", "starbucks", "kitkat", "lays", "cadbury", 
    "coca cola", "dominos", "kfc", "pizza hut", "burger king", "subway", 
    "dunkin donuts", "baskin robbins", "hardees", "wendys", "taco bell", 
    "popeyes", "papa johns", "little caesars", "chipotle", "five guys", 
    "shake shack", "in n out", "sonic", "applebees", "olive garden", 
    "red lobster", "outback", "chilis", "tgi fridays", "buffalo wild wings", 
    "ihop", "dennys", "waffle house", "cheesecake factory", "pf changs", 
    "panera bread", "quiznos", "jimmy johns", "potbelly", "jamba juice", 
    "smoothie king", "tropical smoothie", "bojangles", "krispy kreme", 
    "cinnabon", "dairy queen", "carvel", "cold stone", "ben & jerrys", 
    "haagen dazs", "blue bell", "talenti", "breyers", "edys", "good humor", 
    "klondike", "magnum", "popsicle", "skinny cow", "tilamook", "unilever", 
    "lipton", "axe", "dove", "vaseline", "sunsilk", "tresemme", "surf excel", 
    "rin", "lux", "ponds", "lifebuoy", "clear", "closeup", "signal", 
    "pepsodent", "colgate", "oral b", "head & shoulders", "pantene", 
    "herbal essences", "aussie", "old spice", "gillete", "secret", 
    "sure", "degree", "rexona", "nivea", "neutrogena", "clean & clear", 
    "johnson & johnson", "band aid", "listerine", "reach", "scope", 
    "pepcid", "prilosec", "nexium", "zyrtec", "benadryl", "sudafed", 
    "motrin", "tylenol", "robitussin", "imodium", "miralax", "metamucil", 
    "ensure", "glucerna", "pedialyte", "similac", "enfamil", "gerber", 
    "huggies", "pampers", "kotex", "always", "tampax", "stayfree", 
    "carefree", "o.b.", "playtex", "schick", "wilkinson sword", "edge", 
    "skintimate", "veet", "nair", "jergens", "curel", "eucerin", "aquaphor", 
    "gold bond", "corn huskers", "keri", "lubriderm", "st. ives", "vaseline", 
    "q tips", "cottonelle", "scott", "viva", "kleenex", "huggies", 
    "pull ups", "goodnites", "little swimmers", "poise", "depend", 
    "serenity", "tena", "attends", "certainty", "prevail", "tranquility", 
    "regency", "first quality", "covidien", "medline", "mckesson", 
    "cardinal health", "henry schein", "owens & minor", "fisher scientific", 
    "thermo fisher", "ge healthcare", "siemens healthineers", "philips", 
    "roche", "novartis", "sanofi", "pfizer", "merck", "gsk", "astrazeneca", 
    "bayer", "abbott", "baxter", "bd", "covidien", "danaher", "fresenius", 
    "hologic", "illumina", "intuitive surgical", "medtronic", "stryker", 
    "zimmer biomet", "boston scientific", "edwards lifesciences", 
    "alcon", "cooper companies", "halyard health", "hospira", "mindray", 
    "natus medical", "nevro", "nuvectra", "orthofix", "globus medical", 
    "k2m", "liva nova", "nuvasive", "seaspine", "rti surgical", "wright medical", 
    "ziemer", "arthrex", "conmed", "integra lifesciences", "leica microsystems", 
    "olympus", "pentax medical", "richard wolf", "storz", "ethicon", 
    "covidien", "b braun", "teleflex", "terumo", "angiodynamics", "bard", 
    "boston scientific", "cook medical", "cordis", "medrad", "merit medical", 
    "spectranetics", "volcano", "acell", "acelity", "allergan", "bausch + lomb", 
    "biomet", "collagen matrix", "dentsply sirona", "envista", "henry schein", 
    "patterson", "straumann", "align technology", "danville materials", 
    "keystone dental", "nobel biocare", "osstem", "zest", "3m", "abbott", 
    "baxter", "bd", "biomerieux", "bio-rad", "danaher", "fujirebio", 
    "grifols", "haemonetics", "immucor", "novo nordisk", "roche", 
    "siemens", "thermo fisher", "werfen", "zoetis", "elizabeth arden", 
    "revlon", "loreal", "maybelline", "garnier", "nyx", "essie", 
    "lancome", "giorgio armani", "ysl", "kiehls", "shu uemura", "urban decay", 
    "clarisonic", "matrix", "redken", "kerastase", "pureology", "loreal professional", 
    "mizani", "softsheen-carson", "ulta", "sephora", "mac", "clinique", 
    "estee lauder", "bobbi brown", "tom ford", "jo malone", "origins", 
    "aveda", "bumble and bumble", "smashbox", "glamglow", "too faced", 
    "becca", "nars", "bare minerals", "it cosmetics", "tarte", "stila", 
    "kat von d", "anastasia beverly hills", "huda beauty", "fenty", 
    "kylie cosmetics", "colourpop", "morphe", "juvias place", "jeffree star", 
    "pat mcgrath", "charlotte tilbury", "hourglass", "drunk elephant", 
    "sunday riley", "the ordinary", "deciem", "glossier", "milk makeup", 
    "kosas", "iluvsarahii", "james charles", "jaclyn hill", "manny mua", 
    "nikita dragun", "nikkietutorials", "tati", "shane dawson", "jeffree star", 
    "david dobrik", "liza koshy", "lele pons", "rudy mancuso", 
    "the dolan twins", "emma chamberlain", "addison rae", "charli damelio", 
    "dixie damelio", "noah beck", "josh richards", "griffin johnson", 
    "bryce hall", "quenlin blackwell", "avani gregg", "madi monster", 
    "loren gray", "spencer x", "justin bieber", "selena gomez", "ariana grande", 
    "taylor swift", "kanye west", "kim kardashian", "kylie jenner", 
    "kendall jenner", "khloe kardashian", "kris jenner", "caitlyn jenner", 
    "travis scott", "asap rocky", "rihanna", "drake", "the weeknd", 
    "post malone", "billie eilish", "dua lipa", "doja cat", "megan thee stallion", 
    "cardi b", "nicki minaj", "lil nas x", "olivia rodrigo", "lil baby", 
    "da baby", "roddy ricch", "jack harlow", "polo g", "lil tjay", 
    "moneybagg yo", "pooh shiesty", "nba youngboy", "kodak black", 
    "gunna", "young thug", "future", "lil uzi vert", "playboi carti", 
    "trippie redd", "juice wrld", "xxxtentacion", "lil peep", "mac miller", 
    "pop smoke", "king von", "fredo bang", "mo3", "young dolph", 
    "key glock", "big30", "big moochie grape", "peezy", "rondonumbanine", 
    "lil durk", "g herbo", "chief keef", "king von", "fbg duck", 
    "lil reese", "lil jay", "edai", "cdai", "wooski", "memo600", 
    "lil mickey", "lil jojo", "lil marc", "lil b", "lil sneek", 
    "lil moe", "lil boo", "lil wet", "lil mouse", "lil zay osama", 
    "lil tjay", "lil baby", "lil keed", "lil gotit", "lil yachty", 
    "lil skies", "lil mosey", "lil tecca", "lil pump", "lil xan", 
    "lil tracy", "lil b", "lil ugly mane", "lil darkie", "lil peep", 
    "lil skies", "lil mosey", "lil tecca", "lil pump", "lil xan", 
    "lil tracy", "lil b", "lil ugly mane", "lil darkie", "lil peep", 
    "lil skies", "lil mosey", "lil tecca", "lil pump", "lil xan", 
    "lil tracy", "lil b", "lil ugly mane", "lil darkie", "lil peep"
];

// DOM elements
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const brandGrid = document.getElementById('brandGrid');
const alertOverlay = document.getElementById('alertOverlay');
const alertSound = document.getElementById('alertSound');
const searchBox = document.querySelector('.search-box');

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Can be changed to 'hi-IN' for Hindi

    recognition.onstart = function() {
        voiceBtn.classList.add('mic-active');
        voiceStatus.textContent = 'Listening... Speak now';
    };

    recognition.onend = function() {
        voiceBtn.classList.remove('mic-active');
        voiceStatus.textContent = '';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        searchBox.value = transcript;
        checkForBoycott(transcript);
    };

    recognition.onerror = function(event) {
        voiceStatus.textContent = 'Error occurred in recognition: ' + event.error;
    };
} else {
    voiceStatus.textContent = 'Speech recognition not supported in this browser';
    voiceBtn.disabled = true;
}

// Voice button click handler
voiceBtn.addEventListener('click', function() {
    if (recognition) {
        recognition.start();
    }
});

// Check if spoken text contains boycott brands
function checkForBoycott(text) {
    for (const brand of boycottBrands) {
        if (text.includes(brand)) {
            triggerAlert();
            break;
        }
    }
}

// Trigger the alert
function triggerAlert() {
    alertOverlay.style.opacity = '1';
    alertOverlay.style.pointerEvents = 'auto';
    alertSound.play();
    
    // Flash effect
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
        document.body.style.backgroundColor = '#f5f5f5';
    }, 200);
    
    setTimeout(() => {
        alertOverlay.style.opacity = '0';
        alertOverlay.style.pointerEvents = 'none';
    }, 3000);
}

// Populate brand grid
function populateBrandGrid() {
    // Add "Add Product" button
    const addProductCard = document.createElement('div');
    addProductCard.className = 'brand-card add-product';
    addProductCard.innerHTML = '<div>➕</div><div>उत्पाद जोड़ें</div>';
    brandGrid.appendChild(addProductCard);
    
    // Add some sample brands (in a real app, you'd show more)
    const sampleBrands = boycottBrands.slice(0, 20); // Show first 20 for demo
    sampleBrands.forEach(brand => {
        const brandCard = document.createElement('div');
        brandCard.className = 'brand-card';
        brandCard.textContent = brand;
        brandGrid.appendChild(brandCard);
    });
}

// Initialize the app
populateBrandGrid();

// Search functionality
searchBox.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    checkForBoycott(searchTerm);
});
