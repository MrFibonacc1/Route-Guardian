// calculates points between start and end locations
const calculatePointsBetween = (startLat, startLon, endLat, endLon, numPoints) => {
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const lat = startLat + f * (endLat - startLat);
    const lon = startLon + f * (endLon - startLon);

    points.push({ latitude: lat, longitude: lon });
  }

  return points;
};

// gets relevant locations
const findPointsWithinDistance = (set1, set2, distance) => {
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
};

const convertTime = (time24) => {
  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time12 = `${hours}:${minutes} ${period}`;

  return time12;
};

const setMarkers = (locations, map, isRoute) => {
  const markers = [];
  for (let i = 0; i < locations.length; i++) {
    let flag = (locations[i].count > 90) ? 'red' : 'yellow';
    flag = isRoute ? 'blue' : flag;
    let markerOptions = {
      position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
      icon: {
        url: "./images/flag-" + flag + ".png",
        scaledSize: new google.maps.Size(32, 32),
        label: "test",
      },
    };
    const numberOfAccidents = locations[i].count;
    const time = locations[i].time == "Non précisé" ? "N/A" : convertTime(locations[i].time);
    const weather = locations[i].weather.charAt(0).toUpperCase() + locations[i].weather.slice(1);
    let aiMessage = locations[i].aiReply;
    if (aiMessage != '') aiMessage = '<p>AI Advice: ' + aiMessage + '</p>';

    const contentString = '<div id="content">' + '<div id="siteNotice">' + "</div>" + '<div id="bodyContent" style="text-align: center;">' + "<p>Time of Accident: " + time + "</p>" + "<p>Number of Accidents: " + numberOfAccidents + "</p>" + "<p>Weather during Accident: " + weather + "</p>" + aiMessage + "</div>" + "</div>";

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    let marker = new google.maps.Marker(markerOptions);
    marker.addListener("click", function () {
      infowindow.open(map, marker);
    });
    markers.push(marker);
    marker.setMap(map);
  }

  return markers;
};

// function for getting route on map
const calculateAndDisplayRoute = (originAutocomplete, destinationAutocomplete, directionsService, directionsRenderer) => {
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
  };
