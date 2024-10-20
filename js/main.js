import config from './config.js'; // Assurez-vous que le chemin est correct

document.getElementById('authorize-twitch').addEventListener('click', function () {
  const checkbox = document.getElementById('twitch-authorization');

  if (checkbox.checked) {
    const scopes = 'user:edit chat:edit chat:read user:read:email channel:manage:broadcast channel:read:vips channel:manage:vips channel:read:guest_star';

    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes)}`;

    console.log("Redirection vers:", authUrl);

    // Redirige vers l'URL d'autorisation
    window.location.href = authUrl;
  } else {
    alert("Vous devez autoriser l'accès pour continuer.");
  }
});

// Vérifie l'URL pour le token d'accès après la redirection
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = urlParams.get('access_token');

if (accessToken) {
  console.log("Access Token:", accessToken);
  // Redirige vers la page de hacking avec le token
  window.location.href = `hacking.html#access_token=${accessToken}`; // Assurez-vous que le token est dans l'URL
}

// Nova Face
// Fonction pour charger le contenu HTML du personnage dans le div spécifié
function loadNovaFace() {
  fetch('../NovaFace/indexNova.html') // Chemin vers ton fichier HTML du personnage
    .then(response => response.text())
    .then(data => {
      document.getElementById('novaFace-container').innerHTML = data;
      // Charger les fichiers CSS et JS du personnage après l'insertion HTML
      loadNovaFaceCSS();
      loadNovaFaceJS();
    });
}

// Fonction pour charger dynamiquement le CSS du personnage
function loadNovaFaceCSS() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../NovaFace/styleNova.css'; // Chemin vers ton fichier CSS
  document.head.appendChild(link);
}

// Fonction pour charger dynamiquement le JS du personnage
function loadNovaFaceJS() {
  var script = document.createElement('script');
  script.src = '../NovaFace/scriptNova.js'; // Chemin vers ton fichier JS
  document.body.appendChild(script);
}

// Appeler la fonction de chargement au chargement de la page
window.onload = function () {
  loadNovaFace();
};

