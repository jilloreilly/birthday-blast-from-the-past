// Global variables
const movieApiKey = 'c9b2cb8dde72000677829750b55ceb50';
const movieInfoEl = $('#movie-info');
let year;

// Function to fetch movie data from TheMovieDB API based on year searched
function fetchMovie(search) {
  let queryURL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&primary_release_year=${search}&sort_by=popularity.desc&year=${search}&api_key=${movieApiKey}`;

  $('#search-input').val('');
  $('.error').addClass('hide');

  $('.p-tag').addClass('hide')

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
  const movieOverview = $('<p>').text(movie.overview).addClass('overview');
  const movieTitle = $('<h2>').text(movie.original_title);
  const movieReleaseDate = $('<p>').text(`Release date: ${dayjs(movie.release_date).format('DD/MM/YYYY')}`);
  const addRowEl = $('<div>').addClass('row');
  const moviePoster = $('<img>').attr('src', `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`).addClass('rounded movie-poster col-lg-6 col-md-6 col-sm-12');
  const movieDataEl = $('<div>').attr('id', 'movie-data').addClass('col-lg-6 col-md-6 col-sm-12');

  //Print elements to page
  $(movieInfoEl).append(movieTitle, addRowEl);

  $(addRowEl).append(moviePoster, movieDataEl, movieOverview);

  $(movieDataEl).append(movieReleaseDate);

  getVideo(movie.original_title)

}

// Function to display additional movie data (Runtime, genre, tagline)
function extraMovieData(movieData) {
  const movieRuntime = $('<p>').text(`Runtime: ${movieData.runtime} minutes `);
  const genreArr = movieData.genres;
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

  // Only display movie quote if it exists
  if (movieData.tagline) {
    $(movieInfoEl).append(movieQuoteEl);
  }

}

// Event listener on search button
$('#search-button').on('click', function (e) {
  e.preventDefault();
  year = $('#search-input').val().trim();
  let name = $('#name-input').val().trim();
  let numbers = /^[0-9]+$/;


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
  } else if ((year > 2024) || (year < 1900)) {
    console.log('Too early or too late');
    const errorYears = $('<p>').addClass('error').text('Please enter a year between 1900 and 2024');
    $(errorYears).insertAfter('#search-input');
    return
  }
  // If name is empty, show message asking to enter
  if (!name) {
    console.log('Empty');
    const errorEmptyName = $('<p>').addClass('error').text('Please enter your name');
    $(errorEmptyName).insertAfter('#name-input');
    return
  }

  fetchMovie(year);
  addToSearchHistory({ year, name });
  // Removes year banner 
  $('.banner').remove();
  const yearEl = $('<p>').text(`Cinematic Time Capsule: ${year}`).addClass('banner');
  $(yearEl).insertAfter('h1');

  $('#name-input').val('');

});


// Function to fetch video from YouTube
function getVideo(movie) {
  $('#youtube-trailer').empty();
  // Youtube API Key
  const keys = [
    'AIzaSyDKQ8D4nJnvPR-NZX_Qdad6fsdDSctqU9A',
    'AIzaSyBDCEP_5ju0W-BGYgqukMuce47hbiEv46c',
    'AIzaSyDQRIbQCOL42K3X9Tcnlv5zqBEVp1Ih04A',
    'AIzaSyCRu71YxTn39sybXSy7cLQfoe9oaOvmG5Y'
  ]
  let movieTitle = `${movie} official trailer`
  let keyIndex = 0;

  function fetchVideo() {
    const key = keys[keyIndex]
  // Youtube query url
  let queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle}&key=${key}`
  // console.log(queryURL)

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  })
  .then(function (data) {
      // console log to ensure correct item selected
      console.log(data)
      // variable to hold the first videos specific video ID
      let videoId = data.items[0].id.videoId
      // const  = $('#card-title').text(`Location: ${data[0].name} (${dayjs().format('MMMM D, YYYY')})`)
      createFrame(videoId)
    })
    .catch(function (error) {
      console.error(`Error fetching video: ${error.message}`);
      // Try next API key if available
      keyIndex++;
      if (keyIndex < keys.length) {
        console.log(`Trying next API key: ${keys[keyIndex]}`);
        fetchVideo();
      } else {
        console.error('All API keys failed. Unable to fetch video.');
      }
    });
}

fetchVideo();
}

//function to embed video to page
function createFrame(videoId) {

  let srcEl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
  console.log(srcEl)
  let videoFrame = `<iframe id="player" type="text/html" width="640" height="390" class='video-frame'
    src="https://www.youtube.com/embed/${videoId}?enablejsapi=1"
    frameborder="0"></iframe>`

  let iFramePlayer = $('#youtube-trailer').html(videoFrame)

  console.log(srcEl);
}



// Save search years to local storage -----------------------------------------------------------------------

// Adds search term to local storage
function addToSearchHistory(searchTermObj) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.push(searchTermObj);
  if (searchHistory.length > 10) {
    searchHistory.shift()
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  updateSearchHistoryDisplay();

}

// updates search history on page
function updateSearchHistoryDisplay() {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  let searchHistoryEl = $('#history');
  let searchHistoryEl2 = $('#history2');

  // Clear existing search history buttons
  searchHistoryEl.empty();
  searchHistoryEl2.empty();

  // Loop through the search history and add buttons to the search button area
  for (let i = 0; i < searchHistory.length; i++) {
    const pastSearch = searchHistory[i];

    // Create separate button elements for searchHistoryEl and searchHistoryEl2
    let searchHistoryBtn1 = $('<button>').text(`${pastSearch.name || 'N/A'}, ${pastSearch.year}`);
    let searchHistoryBtn2 = searchHistoryBtn1.clone();

    // Add classes to both buttons
    searchHistoryBtn1.addClass('search-history-btn btn btn-light mt-2 py-2');
    searchHistoryBtn2.addClass('search-history-btn btn btn-light mt-2 py-2');

    // Add click event handler to both buttons
    searchHistoryBtn1.on('click', function () {
      fetchMovie(pastSearch.year);
      $('.banner').remove();
      const yearEl = $('<p>').text(`Cinematic Time Capsule: ${pastSearch.year}`).addClass('banner');
      $(yearEl).insertAfter('h1');
    });

    searchHistoryBtn2.on('click', function () {
      fetchMovie(pastSearch.year);
      $('.banner').remove();
      const yearEl = $('<p>').text(`Cinematic Time Capsule: ${pastSearch.year}`).addClass('banner');
      $(yearEl).insertAfter('h1');
    });

    // Append the buttons to searchHistoryEl and searchHistoryEl2
    searchHistoryEl.append(searchHistoryBtn1);
    searchHistoryEl2.append(searchHistoryBtn2);
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
  // Removes hide class - which makes these sections appear
  $('#other-films').removeClass('hide');
  $('#carousel-header').removeClass('hide');
  $('#youtube-header').removeClass('hide');

  // Loop through data obtained by movie api to create carousel with next 3 movies
  for (let i = 1; i <= 3; i++) {
    const movieName = data.results[i].original_title;
    const movieYear = data.results[i].release_date.split('-')[0]; // Extracting the year from the release date
    const moviePoster = data.results[i].poster_path;
    const movieURL = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${moviePoster}`;
    // Creates carousel div
    const carouselItem = $('<div>').addClass('carousel-item');
    if (i === 1) {
      carouselItem.addClass('active'); // Set the first item as active
    }
    // Gets carousel poster from API data
    const img = $('<img>').attr('src', `${movieURL}`).addClass('d-block carousel-poster');

    // Create a container div for the caption with the specified color block
    const captionContainer = $('<div>').addClass('carousel-caption d-none d-md-block')
      .css({
        'background-color': '#ea2e49',
        'width': '50%',          // Set width to 50%
        'margin': '0 auto',       // Center the container
        'padding': '2px',
      });

    // Create a div for the text content (including movie name)
    const captionText = $('<div>').text(`Movie: ${movieName}`);

    captionContainer.append(captionText);

    // Append the created carousel item to the .carousel-inner
    carouselItem.append(img, captionContainer);

    // Append the created carousel item to the .carousel-inner
    $('.carousel-inner').append(carouselItem);

    
  }
}


