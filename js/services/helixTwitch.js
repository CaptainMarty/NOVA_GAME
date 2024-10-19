import { fetchAPI: fetch } from './fetch.js';
import config from '../config.js';

// Fonction pour récupérer les données de l'utilisateur
export function getUserData(accessToken) {
    const url = `${config.baseApi}/users`;

    console.log("Récupération des données de l'utilisateur...");
    fetch(url, 'GET', accessToken)
        .then(data => {
            console.log("Données de l'utilisateur récupérées :", data);
            if (data.data.length > 0) {
                const userInfo = data.data[0]; // Données de l'utilisateur
                console.log("User ID :", userInfo.id, "Nom de la chaîne :", userInfo.login);

                // Appelle ensuite pour obtenir les données de la chaîne
                getChannelData(userInfo.id, accessToken);
            } else {
                showError("Aucun utilisateur trouvé.");
            }
        })
        .catch(error => showError('Erreur lors de la récupération des données de l’utilisateur:', error));
}

// Fonction pour récupérer les données de la chaîne
export function getChannelData(userId, accessToken) {
    const url = `${config.baseApi}/streams?user_id=${userId}`;

    console.log("Récupération des données de la chaîne pour l'utilisateur ID :", userId);
    fetch(url, 'GET', accessToken)
        .then(data => {
            console.log("Données de la chaîne récupérées :", data);
            if (data.data.length > 0) {
                const channelInfo = data.data[0]; // Données de la chaîne
                console.log("Info de la chaîne :", channelInfo);
                startGame(channelInfo);
            } else {
                showError("Le streamer n'est pas en direct.");
            }
        })
        .catch(error => showError('Erreur lors de la récupération des données de la chaîne:', error));
}

export function updateStreamTitle(accessToken, userId, title) {

  const url = `${config.baseApi}/channels`;
  fetch(url, 'PATCH', accessToken, { broadcaster_id: userId, title: newTitle }) // Inclure le broadcaster_id
        .then(data => {
            console.log('Titre du stream modifi├⌐ avec succ├¿s', data);
            document.getElementById('nova-chat').innerHTML += `<p>Titre du stream mis ├á jour avec succ├¿s.</p>`;
        })
        .catch(error => showError('Erreur lors de la modification du titre du stream:', error));
}

