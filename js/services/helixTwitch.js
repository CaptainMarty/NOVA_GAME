import { fetchAPI } from './fetch.js';
import config from '../config.js';

// Fonction pour récupérer les données de l'utilisateur
export async function getUserData(accessToken) {
    const url = `${config.baseApi}/users`;

    console.log("Récupération des données de l'utilisateur...");
    return fetchAPI(url, 'GET', accessToken)
        .then(data => {
            console.log("Données de l'utilisateur récupérées :", data);
            if (data.data.length > 0) {
                const userInfo = data.data[0]; // Données de l'utilisateur
                console.log("User ID :", userInfo.id, "Nom de la chaîne :", userInfo.login);

                // Appelle ensuite pour obtenir les données de la chaîne
                return data; 
            } else {
                return Promise.reject("Aucun utilisateur trouvé.");
            }
        })
        .catch(error => Promise.reject(`Erreur lors de la récupération des données de l’utilisateur: ${error}`));
}

// Fonction pour récupérer les données de la chaîne
export async function getChannelData(userId, accessToken) {
    const url = `${config.baseApi}/streams?user_id=${userId}`;

    console.log("Récupération des données de la chaîne pour l'utilisateur ID :", userId);
    return fetchAPI(url, 'GET', accessToken)
        .then(data => {
            console.log("Données de la chaîne récupérées :", data);
            if (data.data.length > 0) {
                const channelInfo = data.data[0]; // Données de la chaîne
                console.log("Info de la chaîne :", channelInfo);
                return channelInfo;
            } else {
                return Promise.reject("Le streamer n'est pas en direct.");
            }
        })
        .catch(error => Promise.reject(`Erreur lors de la récupération des données de la chaîne: ${error}`));
}

export async function updateStreamTitle(accessToken, userId, title) {

  const url = `${config.baseApi}/channels`;
  return fetchAPI(url, 'PATCH', accessToken, { broadcaster_id: userId, title: newTitle }) // Inclure le broadcaster_id
        .then(data => {
            console.log('Titre du stream modifi├⌐ avec succ├¿s', data);
            document.getElementById('nova-chat').innerHTML += `<p>Titre du stream mis ├á jour avec succ├¿s.</p>`;
        })
        .catch(error => Promise.reject(`Erreur lors de la modification du titre du stream: ${error}`));
}

