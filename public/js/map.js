function initMap() {
  const styles = [
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  ];

  // init map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 45.499298, lng: -73.576217 },
    zoom: 15,
    styles: styles,
  });

  // add crash POIs onto map
  markers = setMarkers(locations, map, 'yellow');

  // setup route with map
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // setup autocomplete
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

  // setup fields needed from autocomplete fields
  originAutocomplete.setFields(["place_id", "geometry"]);
  destinationAutocomplete.setFields(["place_id", "geometry"]);

  // filters out data for user entered route
  submit.addEventListener("click", (event) => {
    // error check for user input
    if (originAutocomplete.getPlace() == undefined) originInput.style.borderColor = "red";
    else originInput.style.borderColor = "#dee2e6";
    if (destinationAutocomplete.getPlace() == undefined) destinationInput.style.borderColor = "red";
    else destinationInput.style.borderColor = "#dee2e6";
    // get latitude and longitude
    const fromLatitude = originAutocomplete.getPlace().geometry.location.lat();
    const fromLongitude = originAutocomplete.getPlace().geometry.location.lng();
    const destLatitude = destinationAutocomplete.getPlace().geometry.location.lat();
    const destLongitude = destinationAutocomplete.getPlace().geometry.location.lng();

    calculateAndDisplayRoute(originAutocomplete, destinationAutocomplete, directionsService, directionsRenderer);

    // clears current markers
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    const pointsBetween = calculatePointsBetween(fromLatitude, fromLongitude, destLatitude, destLongitude, 100);
    const newLocations = findPointsWithinDistance(pointsBetween, locations, 0.002);
    markers = setMarkers(newLocations, map, 'red');
  });
}