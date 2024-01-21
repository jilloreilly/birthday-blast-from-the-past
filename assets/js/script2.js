



$('#search-button').on('click', function (e) {
    e.preventDefault();
    const year = $('#search-input').val().trim();
    const name = $('#name-input').val().trim();
    let numbers = /^[0-9]+$/;
  
    // Only run fetchMovie() if #search-input isn't empty, user enters a 4-digit year between 1900 and 2024
    if (!year) {
      console.log('Empty');
      const errorEmptyYear = $('<p>').addClass('error').text('Please enter YYYY');
      $('#search-form').append(errorEmptyYear);
      return
    } else if (!(year.match(numbers))) {
        console.log('Not a number!');
        const errorNan = $('<p>').addClass('error').text('Please enter numbers only');
        $('#search-form').append(errorNan);
        return
    } else if ((year > 2024) || (year < 1900 )) {
      console.log('Too early or too late');
      const errorYears = $('<p>').addClass('error').text('Please enter a year between 1900 and 2024');
        $('#search-form').append(errorYears);
      return
    }     
  
    fetchMovie(year);
    addToSearchHistory({year, name});
  });