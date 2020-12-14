const historyDiv = document.querySelector('.history');

// fonction pour fetch l'emplacement d'une station de lancement selon l'id entré en paramètre
const fetchLaunchpad = function (launchpad) {
    fetch(`https://api.spacexdata.com/v4/${launchpad}`)
        .then(function (response) {
            return response.json();
        })
        .then(json => console.log(json))
        .catch(function (error) {
            console.log(error);
        });
};

// fonction qui fetch les prochains décollages
const fetchUpcomingLaunchs = function (date) {
    fetch(`https://api.spacexdata.com/v4/launches/upcoming`)
        .then(function (response) {
            return response.json();
        })
        .then(json => console.log(json))
        .catch(function (error) {
            console.log(error);
        });
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

const displayHistory = function (data) {
    console.log(data);
    for (const event of data) {
        // transforme la date unix en date human friendly
        const date = new Date(
            event.event_date_unix * 1000
        ).toLocaleDateString();
        console.log(date);
        const html = `
        <p>${date} : ${event.details}</p>
        `;

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
