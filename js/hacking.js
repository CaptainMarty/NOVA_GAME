document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        console.log("Access Token trouvé dans hacking.html :", accessToken);
        
        // Affiche le token pour vérifier qu'il a été trouvé
        document.body.innerHTML += `<h1>Access Token trouvé !</h1><p>${accessToken}</p>`;
        
        // Attendre la fin de l'animation de la barre de chargement
        setTimeout(() => {
            // Redirige vers nova.html avec l'access_token
            window.location.href = `nova.html#access_token=${accessToken}`;
        }, 5000); // 5 secondes pour le faux hacking
    } else {
        console.log("Aucun access token trouvé dans hacking.html.");
        alert("Aucun token d'accès trouvé.");
    }
});
