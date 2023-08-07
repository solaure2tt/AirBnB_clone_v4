$(document).ready(function () {
  const archiveStates = {};
  const archiveCities = {};

  $(".popover .states h2 input[type='checkbox']").on('change', function () {
    if ($(this).prop('checked')) {
      archiveStates[$(this).data('id')] = $(this).data('name');
    } else {
      delete archiveStates[$(this).data('id')];
    }

    updateH4Tag();
  });

  $(".popover .cities input[type='checkbox']").on('change', function () {
    if ($(this).prop('checked')) {
      archiveCities[$(this).data('id')] = $(this).data('name');
    } else {
      delete archiveCities[$(this).data('id')];
    }
    updateH4Tag();
  });

  function updateH4Tag () {
    const allStatesAndCities = { ...archiveStates, ...archiveCities };
    const names = Object.values(allStatesAndCities);
    $('.locations h4').text(names.join(', '));
  }
  const archive = {};

  $(".amenities .popover input[type='checkbox']").on('change', function () {
    if ($(this).prop('checked')) {
      archive[$(this).data('id')] = $(this).data('name');
    } else {
      delete archive[$(this).data('id')];
    }
    const names = Object.values(archive);
    $('.filters .amenities h4').text(names.join(', '));
  });
  $.get('http://127.0.0.1:5001/api/v1/status/', function (data, status) {
    if (status === 'success') {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });
  // API endpoint URL
  const apiUrl = 'http://127.0.0.1:5001/api/v1/places_search/';

  // Function to create the article element for each place
  function createPlaceArticle (place) {
    const article = $('<article>');
    const title = $('<h2>').text(place.name);
    const priceByNight = $('<div>').addClass('price_by_night').html(`<p>$${place.price_by_night}</p>`);
    const information = $('<div>').addClass('information');
    const maxGuest = $('<div>').addClass('max_guest').html(`<div class="guest_image"></div><p>${place.max_guest} Guests</p>`);
    const numberRooms = $('<div>').addClass('number_rooms').html(`<div class="bed_image"></div><p>${place.number_rooms} Bedroom</p>`);
    const numberBathrooms = $('<div>').addClass('number_bathrooms').html(`<div class="bath_image"></div><p>${place.number_bathrooms} Bathroom</p>`);
    const description = $('<div>').addClass('description').html(`<p>${place.description}</p>`);

    // Append elements to the article
    information.append(maxGuest, numberRooms, numberBathrooms);
    article.append(title, priceByNight, information, description);

    return article;
  }

  // Fetch places data from the API endpoint
  $.ajax({
    url: apiUrl,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      const places = data;
      const placesSection = $('.places');

      // Loop through the places and create articles for each place
      places.forEach(function (place) {
        const article = createPlaceArticle(place);
        placesSection.append(article);
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error('Error fetching places data:', errorThrown);
    }
  });
  $('.filters > button').click(function () {
    const statesArr = Object.keys(archiveStates);
    const citiesArr = Object.keys(archiveCities);
    const amenitiesArr = Object.keys(archive);

    const dataToSend = JSON.stringify({ amenities: amenitiesArr, states: statesArr, cities: citiesArr });
    console.log(dataToSend);
    $.ajax({
      url: apiUrl,
      type: 'POST',
      contentType: 'application/json',
      data: dataToSend,
      success: function (data) {
        const places = data;
        const placesSection = $('.places');

        placesSection.empty();
        // Loop through the places and create articles for each place
        places.forEach(function (place) {
          const article = createPlaceArticle(place);
          placesSection.append(article);
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        // console.error("Error fetching places data:", xhr);
      }
    });
  });
});
