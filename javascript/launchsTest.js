// VARIABLES

// première constante pour récupérer la div qui accueuillera les prochains lancements
const launchsDiv = document.querySelector('.launchs');
// deuxième constante pour récupérer la div qui accueillera les évènements marquants de SpaceX
const historyDiv = document.querySelector('.history');

// FONCTIONS

//Création d'une fonction qui sera utilisée par les deux sections principales pour transformer les dates Unix en dates sous format YYYY/MM/DD, plus accessible et facilement utilisables.
const transformDate = function (date) {
    return new Date(date * 1000).toLocaleDateString();
};

// 1er OBJECTIF : Fetch puis créations en html des prochains lancements de fusée de SpaceX. Ajout des données de localisation des pas de tirs.
// 1. Fetch de l'api SpaceX pour les prochains décollages
// 2. Construction d'un objet JSON pour stocker les données qui nous intéressent.
// 3. Fetch de l'api SpaceX pour les pas de tirs
// 4. Incorporation des données des pas de tirs correspondant à chaque objet du lancement
// 5. Création puis insertion d'un bloc HTML reprenant les informations de chaque objet JSON.

// 1. fonction qui fetch les prochains lancements
const fetchUpcomingLaunchs = function (date) {
    fetch(`https://api.spacexdata.com/v4/launches/upcoming`)
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            buildLaunchObject(json);
        })
        .catch(function (error) {
            console.log(error);
        });
};

// 2. fonction qui crée des objets JSON en fonction du fetch des prochains lancements
const buildLaunchObject = function (data) {
    // pour chaque vol tiré du fetch data
    for (let i = 0; i < data.length; i++) {
        // traitement de la date
        const date = transformDate(data[i].date_unix);

        // on crée une map temporaire contenant les informations utiles sur chaque vol
        currentObject = new Map();
        currentObject
            .set('date', date)
            .set('details', `${data[i].details}`)
            .set('id', `${data[i].launchpad}`);

        console.log(currentObject);
        // on envoie cette Map dans la fonction du fetchLaunchPad
        // fetchLaunchPad(currentObject);
    }
};

// fonction pour fetch l'emplacement d'une station de lancement selon l'id entré en paramètre
const fetchLaunchPad = function (currentObject) {
    const launchPad = fetch(
        `https://api.spacexdata.com/v4/launchpads/${currentObject.id}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            console.log(json);
            // currentMap.set('latitude', `${json.latitude}`);
        })
        .catch(function (error) {
            console.log(error);
        });

    return launchPad;
};

// fonction qui récupère fetch des launchpads pour implémenter dans les datasets des localisations
const addLocation = function (launchpads) {
    // récupère les spans location qui contient les datasets
    const locations = document.querySelectorAll('.location');

    // pour chaque span
    for (const location of locations) {
        console.log(location.dataset.location);
        for (const pad of launchpads) {
            if (pad.id === location.dataset.location) {
                location.innerHTML = `${pad.full_name}, ${pad.region}`;
                location.dataset.latitude = `${pad.latitude}`;
                location.dataset.longitude = `${pad.longitude}`;
            }
        }
    }
};

// 2eme OBJECTIF : Fetch puis ajout dans le HTML des évènements marquants de l'histoire de SpaceX.
// 1. Fetch l'API SpaceX pour récupérer les evènements
// 2. Incorporation des évènements marquants dans le HTML

// fonction qui fetch les events puis lance la fonction pour les afficher
const history = function () {
    fetch(`https://api.spacexdata.com/v4/history`)
        .then(function (response) {
            return response.json();
        })
        .then(json => displayHistory(json))
        .catch(function (error) {
            console.log(error);
        });
};

// fonction qui crée les dates marquantes de SpaceX pour la section history, en fonction des données récupérées du fetch
const displayHistory = function (data) {
    for (const event of data) {
        // traitement de la date unix
        const date = transformDate(event.event_date_unix);
        const html = `
        <p>${date} : ${event.details}</p>
        `;

        // ajoute l'élément HTML à la suite
        historyDiv.insertAdjacentHTML('beforeend', html);
    }
};

// ECOUTEURS

// fetch les prochains décollages au chargement de la fenêtre
window.addEventListener('load', function () {
    fetchUpcomingLaunchs();
});

// fetch les évènements marquants de SpaceX au chargement de la fenêtre
window.addEventListener('load', function () {
    history();
});
