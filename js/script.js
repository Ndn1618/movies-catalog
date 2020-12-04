var API_KEY = 'a22fd5f9';
var SEARCH_QUERY;

// Choosing elements
var elMoviesForm = $_('.movies-form');
var elMoviesNameInput = $_('.movie-name-input', elMoviesForm);
var elMovieSearchBtn = $_('.movie-search-button', elMoviesForm);
var elMoviesList = $_('.movies-list');
var elMoviesPaginationList = $_('.movies-pagination-list');
var elMovieInfoWrapper = $_('.movie-card-wrapper');
var elMovieElementTemplate = $_('#found-movie-template').content;
var elPaginationLinkTemplate = $_('#pagination-link-template').content;
var elCardTemplate = $_('#template-card').content;


// Create movie-card
var createMovieCard = function (movie) {
  elMovieInfoWrapper.innerHTML = '';
  var elNewMovieCard = elCardTemplate.cloneNode(true);

  $_('.movie-card', elNewMovieCard).dataset.imdbId = movie.imdbID;
  $_('.card-title', elNewMovieCard).textContent = `${movie.Title} (${movie.Year})`;
  $_('.movie-card-img', elNewMovieCard).src = movie.Poster;
  $_('.movie-card-img', elNewMovieCard).alt = movie.Title;
  $_('.movie-card-plot', elNewMovieCard).textContent = movie.Plot;

  elMovieInfoWrapper.appendChild(elNewMovieCard);
}

// Create pagination links
var createPaginationLinks = function (totalResults, currentPage = 1) {
  elMoviesPaginationList.innerHTML = '';

  var pages = Math.ceil(Number(totalResults) / 10);

  var elPaginationLinksFragment = document.createDocumentFragment();

  for (var i = 1; i <= pages; i++) {
    var newPaginationLink = elPaginationLinkTemplate.cloneNode(true);

    if (i === currentPage) {
      $_('.movie-pagination-link', newPaginationLink).classList.add('is-current');
    }

    $_('.movie-pagination-link', newPaginationLink).textContent = i;

    elPaginationLinksFragment.appendChild(newPaginationLink);
  }

  elMoviesPaginationList.appendChild(elPaginationLinksFragment);
}

// Create new movie element
var createNewMovieElement = function (movieElement) {
  var newMovieElement = elMovieElementTemplate.cloneNode(true);

  $_('.movie-name-span', newMovieElement).textContent = movieElement.Title;
  $_('.movie-info-button', newMovieElement).dataset.movieId = movieElement.imdbID;

  return newMovieElement;
}

// Render all movies function
var renderMovieElements = function (foundMovies) {
  elMoviesList.innerHTML = '';

  var elNewFragment = document.createDocumentFragment();
  foundMovies.forEach(function (foundMovie) {
    elNewFragment.appendChild(createNewMovieElement(foundMovie));
  });
  elMoviesList.appendChild(elNewFragment);
}

//On movies form submit function
var onMoviesFormSubmit = function (evt) {
  evt.preventDefault();

  elMovieSearchBtn.classList.add('is-loading');

  SEARCH_QUERY = elMoviesNameInput.value.trim();

  if (!SEARCH_QUERY) {
    alert('Enter movie name, please!');
    return;
  }

  var API_SEARCH = `https://omdbapi.com/?apikey=${API_KEY}&s=${SEARCH_QUERY}`;

  fetch(API_SEARCH).then(function (response) {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }).then(function (data) {
    createPaginationLinks(data.totalResults);
    renderMovieElements(data.Search);
    console.log(data.Search[0]);
    elMovieSearchBtn.classList.remove('is-loading');
  });
}

//Listen submit event of form
elMoviesForm.addEventListener('submit', onMoviesFormSubmit);

elMoviesPaginationList.addEventListener('click', function (evt) {
  if (evt.target.matches('.movie-pagination-link')) {
    var pageNumber = Number(evt.target.textContent);
    var API_SEARCH = `https://omdbapi.com/?apikey=${API_KEY}&s=${SEARCH_QUERY}&page=${pageNumber}`;
  };

  fetch(API_SEARCH).then(function (response) {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }).then(function (data) {
    createPaginationLinks(data.totalResults, pageNumber);
    renderMovieElements(data.Search);
  });
});

elMoviesList.addEventListener('click', function (evt) {
  if (evt.target.matches('.movie-info-button')) {
    evt.target.classList.add('is-loading');

    var movieId = evt.target.dataset.movieId;
    var API_SEARCH = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}&plot=full`;

    fetch(API_SEARCH).then(function (response) {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    }).then(function (data) {
      createMovieCard(data);

      evt.target.classList.remove('is-loading');
    });
  };
});
