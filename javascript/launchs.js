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
// 3. Fetch de l'api SpaceX pour les pas de tirs et ajout des données correspondantes
// 4. Création puis insertion d'un bloc HTML reprenant les informations de chaque objet JSON.

// 1. fonction qui fetch les prochains lancements puis envoie le json à la fonction qui construit l'objet JSON
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

// 2. fonction qui crée un objet JSON en fonction du fetch des prochains lancements
const buildLaunchObject = function (data) {
    // pour chaque vol tiré du fetch data
    for (const launch of data) {
        // traitement de la date
        const date = transformDate(launch.date_unix);

        // on crée une map temporaire contenant les informations utiles sur chaque vol
        currentObject = new Map();
        currentObject
            .set('date', date)
            .set('details', launch.details)
            .set('id', launch.launchpad)
            .set('flightNumber', launch.flight_number);

        // on envoie cette Map dans la fonction du fetchLaunchPad
        fetchLaunchPad(currentObject);
    }
};

// 3. fonction pour fetch la station de lancement correspondante et ajoute la latitude et la longitude à l'objet
const fetchLaunchPad = function (currentObject) {
    const launchPad = fetch(
        `https://api.spacexdata.com/v4/launchpads/${currentObject.get('id')}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            // envoie à la fonction insertHtml l'objet auquel on ajoute la latitude, la longitude, la location et la region
            insertHtml(
                currentObject
                    .set('latitude', json.latitude)
                    .set('longitude', json.longitude)
                    .set('location', json.full_name)
                    .set('region', json.region)
            );
        })
        .catch(function (error) {
            console.log(error);
        });
};

// 4. fonction qui récupère l'objet pour l'insérer en HTML
const insertHtml = function (currentObject) {
    // crée le HTML en récupérant les infos de l'objet
    const html = `
        <div class="launch">
        <p>Date: ${currentObject.get('date')}</p>
        <p>Flight number : ${currentObject.get('flightNumber')}</p>
        <p>${
            currentObject.get('details')
                ? currentObject.get('details')
                : 'No details yet'
        }</p>
        <p>Location: <span class="location" data-location="${currentObject.get(
            'location'
        )}" data-latitude="${currentObject.get(
        'latitude'
    )}" data-longitude="${currentObject.get('longitude')}">${currentObject.get(
        'location'
    )}, ${currentObject.get('region')}</span></p>
        </div>
        `;

    // insère le HTML
    launchsDiv.insertAdjacentHTML('beforeend', html);
    fetchMeteo(currentObject);
};

// 2eme OBJECTIF : Fetch puis ajout dans le HTML des évènements marquants de l'histoire de SpaceX.
// 1. Fetch l'API SpaceX pour récupérer les evènements
// 2. Incorporation des évènements marquants dans le HTML

// 1. fonction qui fetch les events puis lance la fonction pour les afficher
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

// 2. fonction qui crée les dates marquantes de SpaceX pour la section history, en fonction des données récupérées du fetch
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

// 3eme OBJECTIF : fetch la météo pour les pas de tir

// const fetchMeteo = function (currentObject) {
//     const test = document.querySelector('.location');
//     console.log(test);
//     fetch(
//         `api.openweathermap.org/data/2.5/weather?q=London&appid=67173c519205d685b546a19f56219ebc`
//     )
//         .then(function (response) {
//             console.log(response);
//             return response.json();
//         })
//         .then(json => {
//             console.log(json);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// };

// 4ème OBJECTIF: implémenter une map

// ECOUTEURS

// fetch les prochains décollages au chargement de la fenêtre
window.addEventListener('load', function () {
    fetchUpcomingLaunchs();
});

// fetch les évènements marquants de SpaceX au chargement de la fenêtre
window.addEventListener('load', function () {
    history();
});
