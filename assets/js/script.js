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

  getVideo(movie.original_title)
}

// Event listener on search button
$('#search-button').on('click', function(e) {
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




// !User dayjs to format release date

// Save search years to local storage -----------------------------------------------------------------------

// Adds search term to local storage
function addToSearchHistory(searchTerm) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(searchTerm);
  if (searchHistory.length > 10){
      searchHistory.shift()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  // updateSearchHistoryDisplay(); 
  // console.log(searchHistory)
}

// updates search history on page
function updateSearchHistoryDisplay() {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  let searchHistoryEl = $('#history');
  
  searchHistoryEl.empty();
  //looping through the search history
  for (let i = 0; i < searchHistory.length; i++) {
      const pastSearch = searchHistory[i];
      let searchHistoryBtn = $('<button>').text(pastSearch);
      searchHistoryBtn.addClass('search-history-btn btn btn-light mt-2');
      searchHistoryEl.append(searchHistoryBtn);
  }
}

// Call to updateSearchHistoryDisplay on document ready
$(document).ready(function () {
  updateSearchHistoryDisplay();
});


//Second Youtube API----------------------------------------------------------------------------------------------
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



// Movie Carousel link------------------------------------------------------------------------------------

// function getCarouselLink(movieName) {
//   let movie = movieName

//   const key = 'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'
//   let movieTitle = `${movie} trailer`
//   // Youtube query url
//   let queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle}&key=${key}`
//   // console.log(queryURL)

//   fetch(queryURL)
//       .then(function (response) {
//           return response.json()
//       })
//       .then(function (data) {
//           // console log to ensure correct item selected
//           console.log(data)
//           console.log(`Video Data: ${data.items[0].id.videoId}`);
//           // variable to hold the first videos specific video ID
//           let videoId = data.items[0].id.videoId
//           let videoLink = `http://www.youtube.com/embed/${videoId}?enablejsapi=1`
//           $('<img>').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`);

//       })
//     }



