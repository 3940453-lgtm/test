let informationBoxVisible = false;
const { origin, pathname } = window.location;
const apiPath =
    mstrAppConfig?.apiPath ??
    pathname.replace(/app\/?$/, 'api');
const REST_API_URL =  `${origin}${apiPath}`;
const projectId = 'E5E190BA11EB33180CBF0080EF354E2F';
const dossierId = 'C4B744D37D456138C6DCEDBB9B18722E';
const chapterKey = 'K36';
const visualizationKey = 'W39830D9FCACE4A2CAC7DBD87EC4094DE';
console.log(REST_API_URL);
async function fetchAndDisplayMessage(informationBox) {
    try {
        const tokenResponse = await fetch(`${REST_API_URL}/auth/token`);
        const authToken = tokenResponse.headers.get('x-mstr-authtoken');
        if (!authToken) throw new Error("No auth token received");

        const dossierInstanceResponse = await fetch(`${REST_API_URL}/dossiers/${dossierId}/instances`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'X-MSTR-AuthToken': authToken,
                'X-MSTR-ProjectID': projectId,
                'Content-Type': 'application/json'
            },
            body: ''
        });

        const { mid: instanceId } = await dossierInstanceResponse.json();

        const vizResponse = await fetch(
            `${REST_API_URL}/dossiers/${dossierId}/instances/${instanceId}/chapters/${chapterKey}/visualizations/${visualizationKey}?offset=0&limit=1000`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'X-MSTR-AuthToken': authToken,
                    'X-MSTR-ProjectID': projectId
                }
            }
        );

        const vizJson = await vizResponse.json();
        const message = vizJson.result?.data?.root?.children?.[0]?.element?.name || "No message found";
        const thresholds = vizJson.result?.definition?.thresholds || [];

        const trimmedMessage = message.trim();

        let fontColor = "black";
        let backgroundColor = "transparent";
        let fontWeight = "normal";

        thresholds.forEach(threshold => {
            const condition = threshold.condition;

            const matchEquals = condition.match(/\(ID\)\s*=\s*"(.+?)"/);
            const matchNotEquals = condition.match(/\(ID\)\s*<>\s*"(.+?)"/);

            if (matchEquals && trimmedMessage === matchEquals[1].trim()) {
                fontColor = threshold.format["font-color"] || fontColor;
                backgroundColor = threshold.format["background-color"] || backgroundColor;
                fontWeight = threshold.format["font-weight"] ? "bold" : fontWeight;
            } else if (matchNotEquals && trimmedMessage !== matchNotEquals[1].trim()) {
                fontColor = threshold.format["font-color"] || fontColor;
                backgroundColor = threshold.format["background-color"] || backgroundColor;
                fontWeight = threshold.format["font-weight"] ? "bold" : fontWeight;
            }
        });

        Object.assign(informationBox.style, {
            color: fontColor,
            backgroundColor,
            fontWeight
        });
        informationBox.innerText = message;
    } catch (err) {
        console.error("Error fetching information message:", err);
        informationBox.innerText = "Error fetching information message.";
    }
}

function initializeObserver() {
    const observer = new MutationObserver((mutations, obs) => {
        const container = document.querySelector('.mstrd-DossiersListContainer');
        if (container && !informationBoxVisible) {
            // Create the information box element
            const informationBox = document.createElement('div');
            informationBox.classList.add('information-box');
            Object.assign(informationBox.style, {
                padding: '10px',
                textAlign: 'center'
            });

            // Insert into the DOM immediately
            container.insertBefore(informationBox, container.firstChild);
            informationBoxVisible = true;
            informationBox.innerText = "Loading info...";

            // Always refresh in the background
            fetchAndDisplayMessage(informationBox).catch(console.error);
        } else if (!container) {
            informationBoxVisible = false;
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

initializeObserver();
