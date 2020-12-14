// script qui affiche les images des trois derniers jours du site APOD (Astronomy Picture Of the Day)
const today = new Date();

// récupère la div pour implémenter la card
const pictureDiv = document.querySelector('.pictureDiv');
// récupère l'input date
const input = document.querySelector('.dateInput input');

// fonction pour créer et afficher une card selon les données récupérées du fetch
const displayPicture = function (data) {
    // supprime ancien contenu si nouvelle recherche
    pictureDiv.innerHTML = '';

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

            pictureDiv.insertAdjacentHTML('beforeend', html);
        } else if (date.media_type === 'video') {
            const html = `
        <div class="card">
        <iframe src="${date.url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        <div class="card-body">
            <h3>${date.title} (${date.date})</h3>
            <p class="card-text">${date.explanation}</p>
        </div>
        </div>`;

            pictureDiv.insertAdjacentHTML('beforeend', html);
        }
    }
};

const displayChosenPicture = function (data) {
    // supprime ancien contenu si nouvelle recherche
    pictureDiv.innerHTML = '';
    // Si la source est une image
    if (data.media_type === 'image') {
        const html = `
        <div class="card">
        <img src="${
            // si l'url existe en HD, on l'affiche, sinon url normale
            data.hdurl ? data.hdurl : data.url
        }" class="card-img-top" alt="date.title">
        <div class="card-body">
            <h3>${data.title} (${data.date})</h3>
            <p class="card-text">${data.explanation}</p>
        </div>
        </div>`;
        pictureDiv.insertAdjacentHTML('beforeend', html);
    } else if (data.media_type === 'video') {
        const html = `
        <div class="card">
        <iframe src="${data.url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        <div class="card-body">
            <h3>${data.title} (${data.date})</h3>
            <p class="card-text">${data.explanation}</p>
        </div>
        </div>`;

        pictureDiv.insertAdjacentHTML('beforeend', html);
    }
};

// fonction pour afficher une image aléatoire au chargement de la fenêtre
const randomPicture = function () {
    fetch(
        `https://api.nasa.gov/planetary/apod?api_key=CjYKFZ8urXvS40PpfMBsJwlJ8zQYBC05q0MkeDrp&count=1`
    )
        .then(function (response) {
            return response.json();
        })
        .then(json => displayPicture(json))
        .catch(function (error) {
            console.log(error);
        });
};

// fonction pour fetch selon le jour choisi par l'utilisateur
const targetPicture = function (date) {
    fetch(
        `https://api.nasa.gov/planetary/apod?api_key=CjYKFZ8urXvS40PpfMBsJwlJ8zQYBC05q0MkeDrp&date=${date}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(json => displayChosenPicture(json))
        .catch(function (error) {
            console.log(error);
        });
};

// charge automatiquement les photos des trois derniers jours au chargement de la fenêtre
window.addEventListener('load', function () {
    randomPicture();
    // on change le max de l'input date en fonction de la date du jour
    input.max = `${today.getFullYear()}-${
        today.getMonth() + 1
    }-${today.getDate()}`;
});

// on lance le changement d'image quand l'utilisateur entre une nouvelle date
input.addEventListener('input', function () {
    targetPicture(input.value);
});
