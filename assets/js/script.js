// Global variables
const movieApiKey = 'c9b2cb8dde72000677829750b55ceb50';
const movieInfoEl = $('#movie-info');

// Function to fetch movie data from TheMovieDB API based on year searched
function fetchMovie(search) {
  let queryURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&primary_release_year=${search}&sort_by=popularity.desc&year=${search}&api_key=${movieApiKey}`;

  $('#search-input').val('');

  fetch(queryURL)
    .then(function (response) {
      return response.json(); // Returned data is an array of 20 films sorted in decreasing popularity
    })
    .then(function (data) {
      console.log(data);
      displayMovieInfo(data);
      const movieID = data.results[0].id;
      let movieDetailURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${movieApiKey}`;

      // 2nd fetch for additional movie data based on movie ID 
      fetch(movieDetailURL)
        .then(function (response) {
          return response.json()
        })
        .then(function (movieData) {
          console.log(movieData);
          extraMovieData(movieData);    
        })
    });
}

// Function to display movie data
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

  getVideo(movie.original_title)
}

// Function to display additional movie data (Runtime, genre, tagline)
function extraMovieData(movieData) {
  //const movieRating = $('<p>').text();  
  const movieRuntime = $('<p>').text(`Runtime: ${movieData.runtime}`);
  const genreArr  = movieData.genres;
  const listGenre = $('<ul>');
  const movieTagline = $('<p>').text(movieData.tagline);
  
  for (let i = 0; i < genreArr.length; i++) {
    const movieGenre = $('<li>').text(genreArr[i].name);
    $(listGenre).append(movieGenre);
  }

  // Print elements to page
  $(movieInfoEl).append(movieRuntime, listGenre, movieTagline);
}

// Event listener on search button
$('#search-button').on('click', function (e) {
  e.preventDefault();
  const year = $('#search-input').val().trim();

  // Only run fetchMovie() if #search-input is not empty
  if (!year) {
    return
  };
  fetchMovie(year);
  addToSearchHistory(year)
});


// JavaScript Todo

// Fetch function for movie data - Jill O
  // print to page:
    // Movie title
    // release date
    // summary
    // poster

// May need a 2nd fetch call to the movie API - Jill O
  // Rating
  // Genre
  // Running time
  // Tagline

// Search form - input validation
  // check for 4 digits
  // check if they are numbers/integers
  // check that year is not greater than 2024
  // check that year isnt earlier than 115 years ago?
  // Use regex

// Save search years to local storage - Sarah E

// Save search years to local storage

// !User dayjs to format release date

//Second Youtube API variable
const key = 'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'


function getVideo(movie) {
  // Youtube API Key
  const key = 'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'
  let movieTitle = `${movie} trailer`
  // Youtube query url
  let queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle}&key=${key}`
  // console.log(queryURL)

  fetch(queryURL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      // console log to ensure correct item selected
      console.log(data)
      console.log(`Video Data: ${data.items[0].id.videoId}`);
      // variable to hold the first videos specific video ID
      let videoId = data.items[0].id.videoId
      // const  = $('#card-title').text(`Location: ${data[0].name} (${dayjs().format('MMMM D, YYYY')})`)
      createFrame(videoId)
    }
    )
}

//function to add video to page
function createFrame(videoId) {

  let srcEl = `http://www.youtube.com/embed/${videoId}?enablejsapi=1`
  console.log(srcEl)
  let videoFrame = `<iframe id="player" type="text/html" width="640" height="390"
    src="http://www.youtube.com/embed/${videoId}?enablejsapi=1"
    frameborder="0"></iframe>`

  let iFramePlayer = $('#youtube-trailer').html(videoFrame)
}
