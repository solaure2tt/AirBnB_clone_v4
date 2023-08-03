$(document).ready(function () {
  let Amenities_checks = {};
  $(document).on('change', "input[type='checkbox']", function () {
    if (this.checked) {
      Amenities_checks[$(this).data('id')] = $(this).data('name');
    } else {
      delete Amenities_checks[$(this).data('id')];
    }
    let res = Object.values(Amenities_checks);
    if (res.length > 0) {
      $('div.amenities > h4').text(Object.values(Amenities_checks).join(', '));
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, sta) {
    if (sta === "success") {
      if (data.status === "OK") {
        $('div#api_status').addClass('available');
      } else {
	$('div#api_status').removeClass('available');
	}
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        let pl = data[i];
        $('.places ').append('<article><h2>' + pl.name + '</h2><div class="price_by_night"><p>$' + pl.price_by_night + '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' + pl.max_guest + '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' + pl.number_rooms + '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' + pl.number_bathrooms + '</p></div></div><div class="description"><p>' + pl.description + '</p></div></article>');
      }
    }
  });
  $('.filters > button').click(function () {
    $('.places > article').remove();
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({'amenities': Object.keys(Amenities_checks)}),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          let pl = data[i];
          $('.places ').append('<article><h2>' + pl.name + '</h2><div class="price_by_night"><p>$' + pl.price_by_night + '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' + pl.max_guest + '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' + pl.number_rooms + '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' + pl.number_bathrooms + '</p></div></div><div class="description"><p>' + pl.description + '</p></div></article>');
        }
      }
    });
  });
});
