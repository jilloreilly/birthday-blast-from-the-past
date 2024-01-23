// Global variables
const movieApiKey = 'c9b2cb8dde72000677829750b55ceb50';
const movieInfoEl = $('#movie-info');

// Function to fetch movie data from TheMovieDB API based on year searched
function fetchMovie(search) {
  let queryURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&primary_release_year=${search}&sort_by=popularity.desc&year=${search}&api_key=${movieApiKey}`;

  $('#search-input').val('');
  $('.error').addClass('hide');

  fetch(queryURL)
    .then(function (response) {
      return response.json(); // Returned data is an array of 20 films sorted by decreasing popularity
    })
    .then(function (data) {
      displayMovieInfo(data);
      getCarouselMovies(data);
      const movieID = data.results[0].id;
      let movieDetailURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${movieApiKey}`;

      // 2nd fetch for additional movie data based on movie ID 
      fetch(movieDetailURL)
        .then(function (response) {
          return response.json()
        })
        .then(function (movieData) {
          extraMovieData(movieData);    
        })
    });
}

// Function to display movie data
function displayMovieInfo(data) {
  $(movieInfoEl).empty(); // Remove previous film data from page

  const movie = data.results[0];
  const movieTitle = $('<h2>').text(movie.original_title);
  const movieReleaseDate = $('<p>').text(`Release date: ${dayjs(movie.release_date).format('DD/MM/YYYY')}`);
  const movieOverview = $('<p>').text(movie.overview).addClass('overview');
  const addRowEl = $('<div>').addClass('row');
  const moviePoster = $('<img>').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`).addClass('rounded movie-poster col-lg-6');
  const movieDataEl = $('<div>').attr('id', 'movie-data').addClass('col-lg-6');
  
  //Print elements to page
  $(movieInfoEl).append(movieTitle, addRowEl, movieOverview);

  $(addRowEl).append(moviePoster, movieDataEl);

  $(movieDataEl).append(movieReleaseDate);

  getVideo(movie.original_title)

}

// Function to display additional movie data (Runtime, genre, tagline)
function extraMovieData(movieData) {
  const movieRuntime = $('<p>').text(`Runtime: ${movieData.runtime} minutes `);
  const genreArr  = movieData.genres;
  const listGenre = $('<ul>');
  const movieQuoteEl = $('<div>').attr('id', 'movie-quote');
  const movieTagline = $('<p>').text(movieData.tagline).addClass('text-right');
  
  for (let i = 0; i < genreArr.length; i++) {
    const movieGenre = $('<li>').text(genreArr[i].name);
    $(listGenre).append(movieGenre);
  }

  // Print elements to page
  /*$(movieInfoEl).append(movieRuntime, listGenre);*/
  $(movieQuoteEl).append(movieTagline);
  $('#movie-data').append(movieRuntime, listGenre);
  $(movieInfoEl).append(movieQuoteEl);
}

// Event listener on search button
$('#search-button').on('click', function (e) {
  e.preventDefault();
  const year = $('#search-input').val().trim();
  const name = $('#name-input').val().trim();
  let numbers = /^[0-9]+$/;

  $('.p-tag').addClass('hide')

  // Only run fetchMovie() if #search-input isn't empty, user enters a 4-digit year between 1900 and 2024
  if (!year) {
    console.log('Empty');
    const errorEmptyYear = $('<p>').addClass('error').text('Please enter YYYY');
    $(errorEmptyYear).insertAfter('#search-input');
    return
  } else if (!(year.match(numbers))) {
      console.log('Not a number!');
      const errorNan = $('<p>').addClass('error').text('Please enter numbers only');
      $(errorNan).insertAfter('#search-input');
      return
  } else if ((year > 2024) || (year < 1900 )) {
    console.log('Too early or too late');
    const errorYears = $('<p>').addClass('error').text('Please enter a year between 1900 and 2024');
      $(errorYears).insertAfter('#search-input');
    return
  }     

  if (!name) {
    console.log('Empty');
    const errorEmptyName = $('<p>').addClass('error').text('Please enter your name');
    $(errorEmptyName).insertAfter('#name-input');
    return
  }   

  fetchMovie(year);
  addToSearchHistory({year, name});

  $('.banner').remove();
  const yearEl = $('<p>').text(year).addClass('banner');  
  $(yearEl).insertAfter('h1');

});

// Function to fetch video from YouTube
function getVideo(movie) {
  $('#youtube-trailer').empty();
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

  let srcEl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
  console.log(srcEl)
  let videoFrame = `<iframe id="player" type="text/html" width="640" height="390" class='video-frame'
    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
    frameborder="0"></iframe>`

  let iFramePlayer = $('#youtube-trailer').html(videoFrame)
}



// Save search years to local storage -----------------------------------------------------------------------

// Adds search term to local storage
function addToSearchHistory(searchTermObj) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(searchTermObj);
  if (searchHistory.length > 10){
      searchHistory.shift()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  updateSearchHistoryDisplay(); 

}

// updates search history on page
function updateSearchHistoryDisplay() {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  let searchHistoryEl = $('#history');
  
  searchHistoryEl.empty();
  //looping through the search history
  for (let i = 0; i < searchHistory.length; i++) {
      const pastSearch = searchHistory[i];
      let searchHistoryBtn = $('<button>').text(`${pastSearch.name || 'N/A'}, ${pastSearch.year}`);
      searchHistoryBtn.addClass('search-history-btn btn btn-light mt-2');
      searchHistoryBtn.on('click', function () {
        fetchMovie(pastSearch.year);
        $('.banner').remove();
        const yearEl = $('<p>').text(pastSearch.year).addClass('banner');
        $(yearEl).insertAfter('h1');
      });
      searchHistoryEl.append(searchHistoryBtn);
  }
}


// Call to updateSearchHistoryDisplay on document ready
$(document).ready(function () {
  updateSearchHistoryDisplay();
  $('#other-films').addClass('hide')

});

function getCarouselMovies(data) {
  // Clear previous carousel items
  $('.carousel-inner').empty();
  $('#other-films').removeClass('hide');
  $('#carousel-header').removeClass('hide');
  $('#youtube-header').removeClass('hide');


  for (let i = 1; i <= 3; i++) {
    const movieName = data.results[i].original_title;
    const moviePoster = data.results[i].poster_path;
    const movieURL = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${data.results[i].poster_path}`;

    const carouselItem = $('<div>').addClass('carousel-item');
    if (i === 1) {
      carouselItem.addClass('active'); // Set the first item as active
    }

    const img = $('<img>').attr('src', `${movieURL}`).addClass('d-block carousel-poster');

    // Create a container div for the caption with the specified color block
    const captionContainer = $('<div>').addClass('carousel-caption d-none d-md-block')
      .css({
        'background-color': '#ea2e49',
        'width': '40%',          // Set width to 50%
        'margin': '0 auto',       // Center the container
        'padding': '2px'
      });

    // Create a div for the text content (including movie name)
    const captionText = $('<div>').text(`Movie: ${movieName}`);

    // Append the text div to the caption container
    captionContainer.append(captionText);

    carouselItem.append(img, captionContainer);

    // Append the created carousel item to the .carousel-inner
    $('.carousel-inner').append(carouselItem);
  }
}

