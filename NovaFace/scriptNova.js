// Variables
var bubble = document.getElementById("bubble"); // Référence à la bulle
var jokes = [
    'Eh Oh, me touche pas comme ça !',
    'Reste concentré !',
    'Tu crois que tu va me battre ?',
    'Désolé, je ne vais pas t\'aider.',
    'Je ne pense pas que ton tchat Twitch va t\'aider...',
    'Tu as réfléchi à ce que tu va faire si je gagne contre toi ?',
];

// Fonction pour afficher une blague
function tellJoke() {
    var index = Math.floor(Math.random() * jokes.length);
    var joke = jokes[index];

    // Afficher la blague dans la bulle
    bubble.innerText = joke;
    showBubble();
}

// Fonction pour afficher la bulle
function showBubble() {
    bubble.classList.add("show"); // Montrer la bulle
    setTimeout(hideBubble, 3000); // Masquer après 3 secondes
}

// Fonction pour masquer la bulle
function hideBubble() {
    bubble.classList.remove("show"); // Cacher la bulle
}
