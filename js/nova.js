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
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données de l’utilisateur:', error);
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
    .then(response => response.json())
    .then(data => {
        if (data.data.length > 0) {
            const channelInfo = data.data[0]; // Données de la chaîne
            const viewerCount = channelInfo.viewer_count;
            const channelName = channelInfo.user_name; // Nom de la chaîne

            // Afficher un message basé sur le nombre de viewers
            const welcomeMessage = viewerCount > 20 ? 
                `Bienvenue ${channelName}, je t'observe et je vois que tu as ${viewerCount} viewers actuellement !` : 
                `Bienvenue ${channelName}, je vois que tu as ${viewerCount} viewers. Fais du bruit pour attirer plus de monde !`;

            document.getElementById('nova-chat').innerHTML = `<p>${welcomeMessage}</p>`;
        } else {
            console.log("Le streamer n'est pas en direct.");
            document.getElementById('nova-chat').innerHTML = `<p>Le streamer n'est pas en direct actuellement.</p>`;
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données de la chaîne:', error);
    });
}
