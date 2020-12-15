const historyDiv = document.querySelector('.history');
const launchsDiv = document.querySelector('.launchs');

// fonction pour fetch l'emplacement d'une station de lancement selon l'id entré en paramètre
const fetchLaunchPad = function (padID) {
    const launchPad = fetch(`https://api.spacexdata.com/v4/launchpads/${padID}`)
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            return json;
        })
        .catch(function (error) {
            console.log(error);
        });

    return launchPad;
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
        let infoLaunchPad;
        const launchPadPromise = fetchLaunchPad(launch.launchpad).then(pad => {
            const res = pad;
            infoLaunchPad = res.name;
        });

        console.log(infoLaunchPad);

        // traitement de la date
        const date = transformDate(launch.date_unix);

        html = `
        <div class="launch">
        <p>Date : ${date}</p>
        <p>Flight number : ${launch.flight_number}</p>
        <p>Name : ${launch.name}</p>
        <p>${launch.details ? launch.details : 'No details yet'}</p>
        <p>Location = </p>
        </div>
        `;

        launchsDiv.insertAdjacentHTML('beforeend', html);
    }
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
