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

  form.addEventListener("submit", (event) => {
    const fromLatitude = originAutocomplete.getPlace().geometry.location.lat();
    const fromLongitude = originAutocomplete.getPlace().geometry.location.lng();
    const destLatitude = destinationAutocomplete.getPlace().geometry.location.lat();
    const destLongitude = destinationAutocomplete.getPlace().geometry.location.lng();

    const data = {from: {latitude: fromLatitude, longitude: fromLongitude}, dest: {latitude: destLatitude, longitude: destLongitude}};

    calculateAndDisplayRoute(directionsService, directionsRenderer);

    fetch('/directions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success, if needed
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error, if needed
    });
    
    
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
