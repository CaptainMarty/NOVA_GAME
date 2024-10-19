import confighacking from './confighacking.js';

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');

    
    if (accessToken) {
        setTimeout(() => {
            window.location.href = `nova.html#access_token=${ accessToken }`;
        }, 15000);
    console.log("Access Token trouvé dans hacking.html :", accessToken);

    const consoleElement = document.getElementById("consoleElement");

    var txt = [
        "================================================",
        "Priority 0 // global / deep scan initiated...",
        "scanning firewall...",
        "WEAKNESS DETECTED (34.78.21.14.00011001)",
        "WEAKNESS DETECTED (11.22.33.44.00100100)",
        "WEAKNESS DETECTED (56.89.12.43.01000001)",
        "...",
        "...",
        "FIREWALL.EXE -force -break",
        "...locating hidden ports...",
        "...vulnerabilities detected...",
        "GHOST/> DEPLOY HACKER",
        "SCAN: __ 0101.0001.0445.0090",
        "SCAN: __ 0021.0001.0446.0040",
        "SCAN: __ 0002.0000.0544.0660",
        "SCAN: __ 0013.0001.0556.0022",
        "...",
        "PROTOCOL OVERRIDE INITIATED",
        "ENCRYPTION BYPASS SUCCESSFUL (56.78.33.12.00101110)",
        "BRUTE.EXE -s -v -deep",
        "...",
        "...",
        "MCP/> EXECUTE DAEMON",
        "PRIORITY OVERRIDE // ROOT ACCESS GRANTED",
        "LOG: [ERROR] Unable to authenticate admin...",
        "LOG: [INFO] SYS_TRACE COMPLETE",
        "LOG: [WARNING] INTRUSION DETECTED",
        "LOG: [INFO] COUNTERMEASURES INITIATED",
        "TRACE SCAN COMPLETE: __ 0014.0000.0667.0070",
        "SCAN: __ 0111.0001.0001.0044",
        "SCAN: __ 0025.0001.0666.0008",
        "SCAN: __ 0030.0002.0555.0089",
        "...",
        "..."
    ];

    var docfrag = document.createDocumentFragment();
    var intervalID = window.setInterval(updateScreen, 220);

    async function getStreamerInfo() {
        try {
            const userId = await getUserId(accessToken);
            const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
            const response = await fetchAPI(url, 'GET', accessToken);
            if (response.data.length > 0) {
                const streamData = response.data[0];
                // Ajouter les informations du streamer à txt
                txt.unshift(`CHANNEL NAME: ${streamData.user_name}`);
                txt.unshift(`STREAM TITLE: ${streamData.title}`);
                txt.unshift(`VIEWERS: ${streamData.viewer_count}`);
            } else {
                txt.unshift("No live stream detected");
            }
        } catch (error) {
            console.error("Error fetching streamer info:", error);
        }
    }

    function fetchAPI(url, method, accessToken, body = null) {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': confighacking.clientId,
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

    async function getUserId(accessToken) {
        const url = 'https://api.twitch.tv/helix/users';
        const data = await fetchAPI(url, 'GET', accessToken);
        return data.data.length > 0 ? data.data[0].id : null;
    }

    function updateScreen() {
        txt.push(txt.shift());
        txt.forEach(function (e) {
            var p = document.createElement("p");
            p.textContent = e;
            docfrag.appendChild(p);
        });
        while (consoleElement.firstChild) {
            consoleElement.removeChild(consoleElement.firstChild);
        }
        consoleElement.appendChild(docfrag);
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }
    getStreamerInfo();

} else {
    console.log("Aucun access token trouvé dans hacking.html.");
    alert("Aucun token d'accès trouvé.");
}
});
