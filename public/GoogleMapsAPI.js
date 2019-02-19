/*eslint-env browser*/
var autocomplete;
var geocoder;
var options;

function initialize() {
    geocoder = new google.maps.Geocoder;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        codeLatLng(position.coords.latitude, position.coords.longitude);
      });
  };
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('locationField')),
      {types: ['(cities)']});
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
  limitSearchToCity();
}
            
function limitSearchToCity() {
   // Create the autocomplete object, restricting the search to geographical
  // location types.
  a = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('restaurantField')),
      {types: ['establishment']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  a.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  
}

function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
            var address = results[0].formatted_address;
            var city;
            var state;
        for (var i = 0; i < results[0].address_components.length; i++) {
            for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                if (results[0].address_components[i].types[b] == "locality") {
                    city = results[0].address_components[i].long_name;
                }
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    state = results[0].address_components[i].short_name;
                    break;
                }
            }
        }   
        var l = document.getElementById("displayLocation");
        l.innerHTML += city + ", " + state;
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
}