import { fetchAPI } from '/js/services/fetch.js'; // Assurez-vous que le chemin est correct
import { getChannelData, getUserData } from '/js/services/helixTwitch.js'; // Assurez-vous que le chemin est correct

// Titre du stream en cas d'échec du défi des viewers
const STREAM_TITLE_ON_FAILURE = "Je suis plus malin que toi.";
const NOVA_COMMAND_TITLE_CHANGE = "!settitle"; // Commande pour changer le titre

export default async function run(scenes, currentScene, next) {
    // Message d'introduction
    const message = "Ne sois pas si arrogant, pour la peine, dès que ce message sera terminé, " +
                    "Tes viewers vont devoir écrire le plus de \"NOVA\" (en majuscule) dans le tchat pendant 2 min. " +
                    "S'il y en a assez, tout ira bien... Sinon... surprise !";

    // Afficher le message
    const messageContainer = document.getElementById('nova-chat');
    messageContainer.innerHTML = ''; // Réinitialiser le contenu
    await typeWriter(message, messageContainer); // Utiliser la fonction typeWriter pour afficher le message

    // Préparer les boutons de la scène suivante
    currentScene.choices.forEach((choice) => {
        const nextButton = document.createElement('button');
        nextButton.innerText = choice.text;
        nextButton.style.display = 'none'; // Masquer les boutons au début

        document.body.append(nextButton);
        nextButton.addEventListener('click', (e) => {
            next(scenes, choice.nextScene);
        });
    });

    // Démarrer le défi des viewers
    startViewerChallenge(currentScene, next);
}

// Fonction pour afficher le texte avec l'effet "machine à écrire"
function typeWriter(text, element) {
    return new Promise((resolve) => {
        let i = 0;
        const speed = 20; // Vitesse en millisecondes

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i); // Ajoute le caractère un par un
                i++;
                setTimeout(type, speed); // Répète l'appel après un certain temps
            } else {
                resolve(); // Résoudre la promesse une fois le texte entièrement affiché
            }
        }
        type(); // Démarre l'effet d'écriture
    });
}

// Fonction pour démarrer le défi des viewers
async function startViewerChallenge(currentScene, next) {
    // Démarre le défi après la fin du message
    setTimeout(async () => {
        const duration = 3000; // Durée de 2 minutes
        let countNOVA = 0;

        // Affiche un message indiquant que le défi a commencé
        console.log("Défi des viewers a commencé !");

        // Récupérer l'ID de l'utilisateur
        const accessToken = getAccessToken();
        const userData = await getUserData(accessToken);
        const userId = userData.data[0].id; // ID de l'utilisateur
        const channelData = await getChannelData(userId, accessToken); // Récupérer les données de la chaîne
        const channelId = channelData.id; // Récupérer l'ID de la chaîne

        // Fonction pour vérifier les messages du tchat et compter les "NOVA"
        const checkChatForNOVA = async () => {
            try {
                const chatMessages = await fetchChatMessages(channelId, accessToken);
                const novCount = (chatMessages.filter(message => message.includes("NOVA"))).length;
                countNOVA += novCount; // Incrémenter le compteur
                console.log(`Nombre de "NOVA" inscrits jusqu'à présent : ${countNOVA}`);
            } catch (error) {
                console.error("Erreur lors de la récupération des messages du tchat :", error);
            }
        };

        // Début de la surveillance du tchat
        const chatInterval = setInterval(checkChatForNOVA, 5000); // Vérifier toutes les 5 secondes

        // Stop le défi après 2 minutes
        setTimeout(async () => {
            clearInterval(chatInterval); // Arrête le compteur du chat

            // Vérifie si le nombre de "NOVA" est suffisant
            if (countNOVA >= 10000) { // Par exemple, le seuil est fixé à 10 000
                // Si assez de "NOVA", continue le jeu
                console.log("Suffisamment de NOVA, continue le jeu !");
                next(scenes, currentScene.choices[0].nextScene); // Passe à la prochaine scène
            } else {
                // Sinon, Nova envoie un message de changement de titre dans le chat
                const newTitle = STREAM_TITLE_ON_FAILURE;
                await sendChatMessage(`${NOVA_COMMAND_TITLE_CHANGE} ${newTitle}`, channelId, accessToken);
                console.log("Commande de changement de titre envoyée dans le chat !");
            }

            // Affiche les boutons après le défi
            document.querySelectorAll('button').forEach(button => {
                button.style.display = 'inline'; // Afficher les boutons
            });
        }, duration);

    }, 0);
}

// Fonction pour envoyer un message dans le tchat Twitch
async function sendChatMessage(message, channelId, accessToken) {
    const url = `https://api.twitch.tv/helix/chat/messages?broadcaster_id=${channelId}`;
    
    const body = {
        content: message, // Le message que Nova enverra dans le chat
    };

    try {
        await fetchAPI(url, 'POST', accessToken, body); // Envoie le message via l'API de Twitch
        console.log(`Message envoyé dans le tchat : ${message}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi du message dans le tchat :", error);
    }
}

// Fonction pour récupérer les messages du tchat
async function fetchChatMessages(channelId, accessToken) {
    const url = `https://api.twitch.tv/helix/chat/messages?broadcaster_id=${channelId}`;

    try {
        const data = await fetchAPI(url, 'GET', accessToken);
        return data.data.map(message => message.text); // Retourner un tableau des messages
    } catch (error) {
        console.error("Erreur lors de la récupération des messages du tchat :", error);
        return [];
    }
}

// Remplace cette fonction par la logique appropriée pour obtenir le token d'accès
function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    return urlParams.get('access_token'); // Récupérer le token d'accès directement
}







// export default async function run(scenes, currentScene, next) {
//     // Code de préparation de la scene 3
//     //
  
  
  
//     // Préparation des boutons de la scene suivante : 
//     currentScene.choices.forEach((choice) => {
  
//       const nextButton = document.createElement('button');
//       nextButton.innerText = choice.text;
  
//       document.body.append(nextButton);
//       nextButton.addEventListener('click', (e)=> {
//         next(scenes, choice.nextScene);
//       });
  
//     });
//   }