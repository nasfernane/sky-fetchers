// script qui affiche les images des trois derniers jours du site APOD (Astronomy Picture Of the Day)

const lastPictures = document.querySelector('.lastPictures');
// date d'aujourd'hui
const today = new Date();
// On enlève trois jours en millisecondes pour le calcul de la date deux jours avant le jour courant
const startDate = new Date(today.valueOf() - 172800000);

// FONCTIONS

// Factorisation du JS : fonction pour fetch, gérer les erreurs manuellement et retourner un JSON
const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
        console.log(response);
        return response.json();
    });
};

// fonction pour créer le HTML et afficher l'image
const displayPicture = function (data) {
    console.log(data);
    for (const date of data) {
        // Si la source est une image
        if (date.media_type === 'image') {
            const html = `
            <div class="card">
            <img src="${
                // si l'url existe en HD, on l'affiche, sinon url normale
                date.hdurl ? date.hdurl : date.url
            }" class="card-img-top" alt="date.title">
            <div class="card-body">
                <h3>${date.title} (${date.date})</h3>
                <p class="card-text">${date.explanation}</p>
            </div>
            </div>`;

            lastPictures.insertAdjacentHTML('beforeend', html);
        }

        // si la source est une vidéo
        if (date.media_type === 'video') {
            const html = `
            <div class="card">
            <iframe src="${date.url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
            <div class="card-body">
                <h3>${date.title} (${date.date})</h3>
                <p class="card-text">${date.explanation}</p>
            </div>
            </div>`;

            lastPictures.insertAdjacentHTML('beforeend', html);
        }
    }
};

// fonction pour fetch les images/vidéos des trois derniers jours
const displayLastDays = function () {
    getJSON(
        `https://api.nasa.gov/planetary/apod?api_key=CjYKFZ8urXvS40PpfMBsJwlJ8zQYBC05q0MkeDrp&start_date=${startDate.getFullYear()}-${
            startDate.getMonth() + 1
        }-${startDate.getDate()}`
    )
        .then(json => displayPicture(json))
        .catch(function (error) {
            console.log(error);
        });
};

// charge automatiquement les photos des trois derniers jours au chargement de la fenêtre
window.addEventListener('load', function () {
    displayLastDays();
});
