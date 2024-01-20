let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const styles = [
    { featureType: "all", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
    ];

  map = new Map(document.getElementById("map"), {
    center: { lat: 45.499298, lng: -73.576217 },
    zoom: 15,
    styles: styles,
  });

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
  
}

initMap();
