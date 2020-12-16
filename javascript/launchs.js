const historyDiv = document.querySelector('.history');
const launchsDiv = document.querySelector('.launchs');

// fonction pour fetch l'emplacement d'une station de lancement selon l'id entré en paramètre
const fetchLaunchPad = function () {
    const launchPad = fetch(`https://api.spacexdata.com/v4/launchpads/`)
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            addLocation(json);
        })
        .catch(function (error) {
            console.log(error);
        });

    return launchPad;
};

const addLocation = function (launchpads) {
    // récupère les spans location qui contient les datasets
    const locations = document.querySelectorAll('.location');

    console.log(launchpads);
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

// fonction qui fetch les prochains décollages
const fetchUpcomingLaunchs = function (date) {
    fetch(`https://api.spacexdata.com/v4/launches/upcoming`)
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            console.log(json);
            displayLaunchs(json);
        })
        .catch(function (error) {
            console.log(error);
        });
};

const displayLaunchs = function (data) {
    // pour chaque vol
    for (const launch of data) {
        // traitement de la date
        const date = transformDate(launch.date_unix);

        html = `
        <div class="launch">
        <p>Date : ${date}</p>
        <p>Flight number : ${launch.flight_number}</p>
        <p>Name : ${launch.name}</p>
        <p>${launch.details ? launch.details : 'No details yet'}</p>
        <p>Location = <span class="location" data-location="${
            launch.launchpad
        }" data-latitude="coucou" data-longitude=""></span></p>
        </div>
        `;

        launchsDiv.insertAdjacentHTML('beforeend', html);
    }

    // on ajoute la localisation de la station de lancement
    fetchLaunchPad();
};

// fonction qui fetch les évènements marquants de l'histoire de SpaceX
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

// fonction pour transformer les dates unix en dates human friendly
const transformDate = function (date) {
    return new Date(date * 1000).toLocaleDateString();
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
