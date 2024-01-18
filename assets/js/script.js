// Global variables
const movieApiKey = 'c9b2cb8dde72000677829750b55ceb50';
const movieInfoEl = $('#movie-info .card .card-body');


function fetchMovie(search) {
  let queryURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&primary_release_year=${search}&sort_by=popularity.desc&year=${search}&api_key=${movieApiKey}`
  
  $('#search-input').val('');

  fetch(queryURL)
    .then(function (response) {
      return response.json();
  })
    .then(function (data) {
      console.log(data);
      displayMovieInfo(data);
  });
}

function displayMovieInfo(data) {
  $(movieInfoEl).empty(); // Remove previous film data from page

  const movie = data.results[0];
  console.log(`data.results: ${movie}`);  

  const movieTitle = $('<h3>').text(movie.original_title);
  const movieReleaseDate = $('<p>').text(dayjs(movie.release_date).format('DD/MM/YYYY'));
  const movieOverview = $('<p>').text(movie.overview);
  const moviePoster = $('<img>').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`);

  //Print elements to page
  $(movieInfoEl).append(movieTitle, movieReleaseDate, movieOverview, moviePoster);
}

// Event listener on search button
$('#search-button').on('click', function(e) {
  e.preventDefault();
  const year = $('#search-input').val().trim();

  // Only run fetchWeather() if #search-input is not empty
  if (!year) {
    return
  };
  fetchMovie(year);
});


// JavaScript Todo
// Fetch function for movie data
  // print to page:
    // Movie title
    // release date
    // summary
    // poster

  // May need a 2nd fetch call to the movie API  
    // Rating
    // Genre
    // Running time

// Search form - input validation
  // check for 4 digits
  // check if they are numbers/integers
  // check that year is not greater than 2024
  // check that year isnt earlier than 115 years ago?
  // Use regex


// Save search years to local storage

// !User dayjs to format release date
