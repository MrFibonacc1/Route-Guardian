let markers = [];
const submit = document.getElementById('submit');

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
  for (let i = 0; i < locations.length; i++){
    let markerOptions = {
      position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
      icon: {
        url: "./images/flag-red.png",
        scaledSize: new google.maps.Size(32, 32) // sets the size to 50x50 pixels
      }
    }
  
    let marker = new google.maps.Marker(markerOptions);
    markers.push(marker);
    marker.setMap(map);
  }

  // setup route with map
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // setup autocomplete
  const originInput = document.getElementById("from");
  const destinationInput = document.getElementById("dest");
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
  
  // setup fields needed from autocomplete fields
  originAutocomplete.setFields(["place_id", "geometry"]);
  destinationAutocomplete.setFields(["place_id", "geometry"]);

  const form = document.getElementById("directions");

  // filters out data for user entered route
  submit.addEventListener("click", (event) => {
    const fromLatitude = originAutocomplete.getPlace().geometry.location.lat();
    const fromLongitude = originAutocomplete.getPlace().geometry.location.lng();
    const destLatitude = destinationAutocomplete.getPlace().geometry.location.lat();
    const destLongitude = destinationAutocomplete.getPlace().geometry.location.lng();

    const data = {from: {latitude: fromLatitude, longitude: fromLongitude}, dest: {latitude: destLatitude, longitude: destLongitude}};

    calculateAndDisplayRoute(directionsService, directionsRenderer);
    for (let i = 0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    
    const pointsBetween = calculatePointsBetween(fromLatitude, fromLongitude, destLatitude, destLongitude, 100);
    const newLocations = findPointsWithinDistance(pointsBetween, locations, 0.002);
    markers = [];
    for (let i = 0; i < newLocations.length; i++){
      let markerOptions = {
        position: new google.maps.LatLng(newLocations[i].latitude, newLocations[i].longitude),
        icon: {
          url: "./images/flag-red.png",
          scaledSize: new google.maps.Size(32, 32) // sets the size to 50x50 pixels
        }
      }
      let marker = new google.maps.Marker(markerOptions);
      markers.push(marker);
      marker.setMap(map);
    }
  });

  // function for getting route on map
  const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
    const originPlace = originAutocomplete.getPlace();
    const destinationPlace = destinationAutocomplete.getPlace();

    if (!originPlace || !destinationPlace) {
      return;
    }

    directionsService.route(
      {
        origin: { placeId: originPlace.place_id },
        destination: { placeId: destinationPlace.place_id },
        travelMode: "DRIVING",
      },
      function (response, status) {
        directionsRenderer.setDirections(response);
      }
    );
  } 
}

// calculates points between start and end locations
function calculatePointsBetween(startLat, startLon, endLat, endLon, numPoints) {
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      const lat = startLat + f * (endLat - startLat);
      const lon = startLon + f * (endLon - startLon);

      points.push({ latitude: lat, longitude: lon });
  }

  return points;
}

function findPointsWithinDistance(set1, set2, distance) {
  const result = [];

  for (let i = 0; i < set1.length; i++) {
      const point1 = set1[i];

      for (let j = 0; j < set2.length; j++) {
          const point2 = set2[j];

          const latDiff = Math.abs(point1.latitude - point2.latitude);
          const lonDiff = Math.abs(point1.longitude - point2.longitude);

          const actualDistance = Math.sqrt(latDiff ** 2 + lonDiff ** 2);

          if (actualDistance <= distance) {
              result.push(point2);
          }
      }
  }

  return result;
}













// let map;

// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");

//   const styles = [
//     { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
//     { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
//     ];

//   map = new Map(document.getElementById("map"), {
//     center: { lat: 45.499298, lng: -73.576217 },
//     zoom: 15,
//     styles: styles,
//   });

//   for (let i = 0; i < locations.length; i++){
//     let markerOptions = {
//       position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
//       icon: {
//         url: "./images/flag-red.png",
//         scaledSize: new google.maps.Size(32, 32) // sets the size to 50x50 pixels
//       }
//     }
  
//     let marker = new google.maps.Marker(markerOptions);
//     marker.setMap(map);
//   }
  
// }

// initMap();