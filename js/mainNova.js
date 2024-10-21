// Nova Face
// Fonction pour charger le contenu HTML du personnage dans les divs spécifiés par la classe "novaFace-container"
function loadNovaFace() {
    fetch('../NovaFace/indexNova.html') // Chemin vers ton fichier HTML du personnage
      .then(response => response.text())
      .then(data => {
        // Sélectionner tous les éléments avec la classe 'novaFace-container'
        let containers = document.querySelectorAll('.novaFace-container');
        
        // Pour chaque conteneur, insérer le contenu HTML et charger CSS et JS
        containers.forEach(container => {
          container.innerHTML = data;
        });
        
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