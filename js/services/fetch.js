// Fonction générique pour faire des requêtes API
export function fetchAPI(url, method, accessToken, body = null) {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Client-ID': config.clientId,
        'Content-Type': body ? 'application/json' : undefined,
    };
    
    return fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Erreur réseau: ${response.status} ${text}`);
            });
        }
        return response.json();
    });
}

