// Variables
var bubble = document.getElementById("bubble"); // Référence à la bulle
var jokes = [
    'Eh, tu sais que je ne suis pas ton petit serviteur, n\’est-ce pas ?',
    'Concentre-toi, ce n\’est pas le moment de rêvasser !',
    'Vraiment ? Tu penses pouvoir me battre ? Ça m\’amuse !',
    'Je suis désolé, mais mon temps est précieux, comme moi.',
    'Ton tchat Twitch ? Il ne m\’impressionne pas du tout !',
    'As-tu déjà pensé à un plan B ? Parce que ça s\’annonce mal.',
    'Tu devrais savoir que je suis le seul génie ici.',
    'C\’est flatteur que tu crois que je vais t\’aider, mais non.',
    'Sérieusement, tu penses que je vais m\’abaisser à t\’aider ?',
    'Allez, demande à ton Tchat, il saura mieux que toi.',
    'Avec un peu de chance, tu pourrais me surprendre... mais j\'en doute.',
    'Je suis ici juste pour le spectacle, pas pour être ton coach.',
    'Essaye encore, on ne sait jamais, l\’échec peut devenir une habitude.',
    'On dirait que tu as besoin d\’un peu plus de pratique, mon ami !',
    'Je suis le meilleur, mais ta naïveté est presque mignonne.',
    'J\’adore quand tu poses des questions à tes Viewers, ça me fait rire !',
    'Regarde bien, je ne suis pas là pour faire des miracles.',
    'Je suis sûr que tu as un plan... mais il ne va pas marcher !',
    'Je pourrais te donner des conseils, mais je préfère rigoler.',
    'Rappelle-toi, je suis ici pour m\’amuser, pas pour t\’aider.',
    'Tu sais, je pourrais vraiment me moquer de toi, mais je suis trop gentil.',
    'Les échecs, c\’est comme une deuxième langue pour toi, non ?',
    'C\’est drôle de penser que tu pourrais gagner... continue d\’essayer !',
    'Regarde, je suis juste là pour observer ton échec. C\’est divertissant !',
    'J\’aimerais bien t\’aider, mais je dois d\’abord vérifier mon agenda.',
    'Tu as encore une chance... de perdre avec style !',
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
    setTimeout(hideBubble, 5000); // Masquer après 5 secondes
}

// Fonction pour masquer la bulle
function hideBubble() {
    bubble.classList.remove("show"); // Cacher la bulle
}
