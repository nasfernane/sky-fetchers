// https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=2017-07-08&end_date=2017-07-10

const lastPictures = document.querySelector('.lastPictures');

const displayPicture = function (data) {
    console.log(data);
    for (const date of data) {
        const html = `
        <div class="card" style="width: 18rem;">
        <img src="${date.url}" class="card-img-top" alt="date.title">
        <div class="card-body">
            <p class="card-text">${date.explanation}</p>
        </div>
        </div>`;

        lastPictures.insertAdjacentHTML('beforeend', html);
    }
};

const fetchNasa = function () {
    fetch(
        'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=2017-07-08&end_date=2017-07-10'
    )
        .then(function (response) {
            return response.json();
        })
        .then(json => displayPicture(json))
        .catch(function (error) {
            console.log(error);
        });
};

const today = new Date().getUTCDate();
console.log(today);

fetchNasa();
