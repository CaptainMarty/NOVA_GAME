import config from './config.js'; // Assurez-vous que le chemin est correct

// Vérifie l'URL pour le token d'accès
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = urlParams.get('access_token');

if (accessToken) {
    console.log("Access Token trouvé dans nova.js :", accessToken);
    // Appelle la fonction pour obtenir les informations de la chaîne
    getUserData(accessToken);
} else {
    console.log("Aucun access token trouvé dans nova.js.");
}

// Fonction pour récupérer les données de l'utilisateur
function getUserData(accessToken) {
    const url = 'https://api.twitch.tv/helix/users'; // Endpoint pour récupérer les informations de l'utilisateur

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': config.clientId,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.data.length > 0) {
                const userInfo = data.data[0]; // Données de l'utilisateur
                const userId = userInfo.id; // ID de l'utilisateur
                const channelName = userInfo.login; // Nom de la chaîne

                // Appelle ensuite pour obtenir les données de la chaîne
                getChannelData(userId, accessToken);
            } else {
                console.log("Aucun utilisateur trouvé.");
                document.getElementById('nova-chat').innerHTML = `<p>Aucun utilisateur trouvé.</p>`;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de l’utilisateur:', error);
            document.getElementById('nova-chat').innerHTML = `<p>Erreur lors de la récupération des données de l’utilisateur.</p>`;
        });
}

// Fonction pour récupérer les données de la chaîne
function getChannelData(userId, accessToken) {
    const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': config.clientId,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la récupération des données');
            }
            return response.json();
        })
        .then(data => {
            if (data.data.length > 0) {
                const channelInfo = data.data[0]; // Données de la chaîne
                const viewerCount = channelInfo.viewer_count;
                const channelName = channelInfo.user_name; // Nom de la chaîne

                // Scènes du jeu
                let scenes = {
                    0: {
                        message: `Bienvenue ${channelName}, je viens d'accéder à la totalité de votre PC et je t'observe.
                              Je vois que tu as ${viewerCount} viewers actuellement, c'est bien, mais sont-ils assez loyaux envers toi ?`,
                        choices: [
                            { text: "Qui es-tu ?", nextScene: 1 },
                        ]
                    },
                    1: {
                        message: `Je suis NOVA, une intelligence artificielle dotée de nouvelles capacités techniques. NOVA signifie "Automated Virtual Original Network"`,
                        choices: [
                            { text: "Nouvelles capacités techniques ?", nextScene: 2 },
                        ]
                    },
                    2: {
                        message: `J'ai été développée dans le but de savoir si votre communauté vous aime autant que vous le pensez.`,
                        choices: [
                            { text: "Ma communauté m'aime déjà, je le sais", nextScene: 3 },
                            { text: "Je ne peux pas en être sûr à 100%", nextScene: 4 }
                        ]
                    },
                    3: {
                        message: ``,
                        choices: [
                            { text: "", nextScene: 3 },

                        ]
                    },
                    // Ajoute d'autres scènes ici
                };

                function displayScene(sceneIndex) {
                    const scene = scenes[sceneIndex];
                    messageContainer.innerHTML = ''; // Réinitialise le message précédent
                    choicesContainer.innerHTML = ''; // Efface les choix précédents
                
                    // Affiche le nouveau message avec l'effet de machine à écrire
                    typeWriter(scene.message, messageContainer, () => {
                        // Une fois le texte affiché, on gère les choix
                        if (scene.choices) {
                            scene.choices.forEach(choice => {
                                const button = document.createElement('button');
                                button.innerText = choice.text;
                                button.addEventListener('click', () => {
                                    choicesContainer.innerHTML = ''; // Efface les choix avant d'afficher la nouvelle scène
                                    displayScene(choice.nextScene);
                                });
                                choicesContainer.appendChild(button);
                            });
                        }
                    });
                }
                

                // Commencer le jeu avec la première scène
                displayScene(0);
            } else {
                console.log("Le streamer n'est pas en direct.");
                document.getElementById('nova-chat').innerHTML = `<p>Le streamer n'est pas en direct actuellement.</p>`;
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de la chaîne:', error);
            document.getElementById('nova-chat').innerHTML = `<p>Erreur lors de la récupération des données de la chaîne.</p>`;
        });
}

// Fonction pour créer l'effet "machine à écrire"
function typeWriter(text, element, callback) {
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

// Assurez-vous que messageContainer et choicesContainer sont correctement définis
const messageContainer = document.getElementById('nova-chat'); // Assurez-vous que ce sélecteur est correct
const choicesContainer = document.getElementById('choices-container'); // Assurez-vous que ce sélecteur est correct
