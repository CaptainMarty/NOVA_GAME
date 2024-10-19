import config from './config.js'; // Assurez-vous que le chemin est correct

import helix from 'helixTwitch.js';
import { fetchApi } from './services/fetch.js';

// Vérifie l'URL pour le token d'accès
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = urlParams.get('access_token');

if (accessToken) {
    console.log("Access Token trouvé dans nova.js :", accessToken);
    helix.getUserData(accessToken);
} else {
    console.log("Aucun access token trouvé dans nova.js.");
}

// Démarre le jeu
function startGame(channelInfo) {
    const viewerCount = channelInfo.viewer_count;
    const channelName = channelInfo.user_name;

    const scenes = createScenes(channelName, viewerCount);
    displayScene(0, scenes);
}

// Crée les scènes du jeu
function createScenes(channelName, viewerCount) {
    return {
        0: {
            message: `Bienvenue ${channelName}, je viens d'accéder à la totalité de votre PC et je t'observe.
                Je vois que tu as ${viewerCount} viewers actuellement, c'est bien, mais sont-ils assez loyaux envers toi ?`,
            choices: [{ text: "Qui es-tu ?", nextScene: 1 }],
        },
        1: {
            message: `Je suis NOVA, une intelligence artificielle dotée de nouvelles capacités techniques. NOVA signifie "Automated Virtual Original Network"`,
            choices: [{ text: "Nouvelles capacités techniques ?", nextScene: 2 }],
        },
        2: {
            message: `J'ai été développée dans le but de savoir si votre communauté vous aime autant que vous le pensez.`,
            choices: [
                { text: "Ma communauté m'aime déjà, je le sais", nextScene: 3 },
                { text: "Je ne peux pas en être sûr à 100%", nextScene: 4 }
            ],
        },
        3: {
            message: ``,
            choices: [{ text: "Commencer le test", nextScene: 5 }], // Commencer le test
        },
        5: { // Scène pour le test
            message: `Le test commence maintenant ! Vous avez 2 minutes pour écrire "NOVA" dans le chat.`,
            choices: [],
        }
    };
}

// Affiche la scène
function displayScene(sceneIndex, scenes) {
    const scene = scenes[sceneIndex];
    console.log("Affichage de la scène :", sceneIndex);
    messageContainer.innerHTML = ''; // Réinitialise le message précédent
    choicesContainer.innerHTML = ''; // Efface les choix précédents

    // Affiche le nouveau message avec l'effet de machine à écrire
    typeWriter(scene.message, messageContainer, () => {
        if (scene.choices) {
            scene.choices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice.text;
                button.addEventListener('click', () => {
                    console.log("Choix sélectionné :", choice.text);
                    choicesContainer.innerHTML = ''; // Efface les choix avant d'afficher la nouvelle scène
                    if (sceneIndex === 3 && choice.text === "Commencer le test") {
                        startViewerTest(channelName, accessToken); // Appel de la fonction de test
                    } else {
                        displayScene(choice.nextScene, scenes);
                    }
                });
                choicesContainer.appendChild(button);
            });
        }
    });
}

// Fonction pour créer l'effet "machine à écrire"
function typeWriter(text, element, callback) {
    console.log("Démarrage de l'effet machine à écrire pour le texte :", text);
    let i = 0;
    element.innerHTML = ''; // Réinitialise le contenu avant de commencer
    const speed = 20; // Vitesse en millisecondes

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i); // Ajoute le caractère un par un
            i++;
            setTimeout(type, speed); // Répète l'appel après un certain temps
        } else {
            callback(); // Appelle le callback une fois le texte entièrement affiché
        }
    }
    type(); // Démarre l'effet d'écriture
}

// Fonction pour gérer les erreurs et afficher les messages d'erreur
function showError(message, error = '') {
    console.error(message, error);
    document.getElementById('nova-chat').innerHTML += `<p>${message}</p>`;
}

// Fonction pour gérer le test des viewers
function startViewerTest(channelName, accessToken) {
    messageContainer.innerHTML = "Le test commence maintenant ! Vous avez 2 minutes pour écrire 'NOVA' dans le chat.";
    console.log("Démarrage du test des viewers pour le canal :", channelName);
    
    let timer = 10;
    let count = 0; // Compteur pour les messages "NOVA"

    // Écoute des messages du chat
    const chatSocket = new WebSocket(`wss://irc-ws.chat.twitch.tv:443`); // Connexion WebSocket

    chatSocket.onopen = () => {
        console.log("Connexion au chat ouverte");
        // S'authentifier dans le chat
        chatSocket.send(`PASS oauth:${accessToken}`);
        chatSocket.send(`NICK ${channelName}`);
        chatSocket.send(`JOIN #${channelName}`);
        console.log(`Connecté au canal #${channelName}`);
    };

    chatSocket.onmessage = (event) => {
        const message = event.data;
        // Vérifie si le message contient "PRIVMSG"
        if (message.includes("PRIVMSG")) {
            const userMessage = message.split(':')[2]?.trim(); // Récupère le message de l'utilisateur
            if (userMessage?.includes("NOVA")) {
                count++;
                console.log("Message contenant 'NOVA' détecté, compteur :", count);
            }
        }
    };

    const interval = setInterval(() => {
        timer--;
        console.log("Temps restant :", timer);
        if (timer <= 0) {
            clearInterval(interval);
            chatSocket.close(); // Ferme la connexion du chat
            document.getElementById('nova-chat').innerHTML += `<p>Temps écoulé ! Vous avez utilisé "NOVA" ${count} fois.</p>`;
            console.log("Test terminé. Compteur final :", count);
            modifyStreamTitle(count, channelName, accessToken); // Modifie le titre du stream
        }
    }, 1000); // Diminuer le timer chaque seconde
}

// Fonction pour modifier le titre du stream
function modifyStreamTitle(count, userId, accessToken) {
    console.log("Vérification de l'ID de l'utilisateur :", userId);
    
    // Assurez-vous que userId est un nombre valide
    if (isNaN(userId)) {
        console.error("L'ID de l'utilisateur fourni n'est pas valide :", userId);
        showError("Erreur : l'ID de l'utilisateur n'est pas valide.");
        return; // Ne continuez pas si l'ID est invalide
    }

    const newTitle = `NOVA a été mentionné ${count} fois !`;

    console.log("Modification du titre du stream avec le titre :", newTitle);

    helix.updateStreamTitle(accessToken, userId, newTitle);
}

const messageContainer = document.getElementById('nova-chat');  
const choicesContainer = document.getElementById('choices-container');  
