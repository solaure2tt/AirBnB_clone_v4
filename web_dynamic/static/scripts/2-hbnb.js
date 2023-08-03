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
});
