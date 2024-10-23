import * as helix from './services/helixTwitch.js';

// Vérifie l'URL pour le token d'accès
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = urlParams.get('access_token');

if (accessToken) {
    console.log("Access Token trouvé dans nova.js :", accessToken);
    console.log(helix);
    helix.getUserData(accessToken).then(async (userData) => {
      const channelData = await helix.getChannelData(userData.id, accessToken).catch(showError);
      startGame(channelData);
    }).catch(showError);
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
                { text: "Je ne peux pas en être sûr à 100%", nextScene: 8 }
            ],
        },
        3: {
          file: '/js/scenes/scene1.js',
          choices: [{ text: "", nextScene: 4}],
        },
        4: {
            message: `PERDU, il n'y à pas assez de "NOVA"` + `Regarde ton titre de stream maintenant`,
            choices: [
                { text: "Je ne peux pas en être sûr à 100%", nextScene: 8 }
            ],
        },

    };
}

// Affiche la scène
function displayScene(sceneIndex, scenes) {
    const scene = scenes[sceneIndex];
    messageContainer.innerHTML = ''; // Réinitialise le message précédent
    choicesContainer.innerHTML = ''; // Efface les choix précédents

    if(scene.message) {
    // Affiche le nouveau message avec l'effet de machine à écrire
    typeWriter(scene.message, messageContainer, () => {
        if (scene.choices) {
            scene.choices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice.text;
                button.addEventListener('click', () => {
                    choicesContainer.innerHTML = ''; // Efface les choix avant d'afficher la nouvelle scène
                    if (sceneIndex === 4 && choice.text === "BLA BLA BLA") {
                        startViewerTest(channelName, accessToken); // Appel de la fonction de test
                    } else {
                        displayScene(choice.nextScene, scenes);
                    }
                });
                choicesContainer.appendChild(button);
            });
        }
    });
    } else if(scene.file) {
      import(scene.file).then((newScene) => {
        newScene.default(scenes, scene, nextScene).then(result => {
        });
      }).catch(showError);
    }
}

function nextScene(scenes, newScene) {
  displayScene(newScene, scenes);
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

// Fonction pour gérer les erreurs et afficher les messages d'erreur
function showError(message, error = '') {
    console.error(message, error);
    document.getElementById('nova-chat').innerHTML += `<p>${message}</p>`;
}

const messageContainer = document.getElementById('nova-chat');  
const choicesContainer = document.getElementById('choices-container');  
