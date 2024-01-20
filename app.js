const express = require("express");
const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    var url = "https://donnees.montreal.ca/api/3/action/datastore_search";
    var resource_id = "05deae93-d9fc-4acb-9779-e0942b5e962f";
    var limit = 200000;

    // Construct the API request URL
    var apiUrl = `${url}?resource_id=${resource_id}&limit=${limit}`;
    // var apiUrl = `${url}?resource_id=${resource_id}`;

    fetch(apiUrl, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
          .then((response) => response.json())
          .then((data) => {
              if (data.result && data.result.records) {
                  // Create an object to store occurrences
                  var occurrences = {};

                  data.result.records.forEach((record) => {
                      // Access latitude and longitude properties
                      var latitude = record.LOC_LAT;
                      var longitude = record.LOC_LONG;

                      // Round latitude and longitude to the nearest 0.00001
                      var roundedLatitude = Math.round(latitude * 10000) / 10000;
                      var roundedLongitude = Math.round(longitude * 10000) / 10000;

                      // Create a unique key for each location
                      var key = `${roundedLatitude},${roundedLongitude}`;

                      // Increment the occurrence count for the location
                      occurrences[key] = (occurrences[key] || 0) + 1;
                  });

                  // Create an array of locations with more than 5 occurrences
                  var highOccurrenceLocations = [];
                  for (var key in occurrences) {
                      if (occurrences[key] > 5) {
                          var [lat, lon] = key.split(",").map(parseFloat);
                          highOccurrenceLocations.push({
                              latitude: lat,
                              longitude: lon,
                          });
                      }
                  }

                  res.render("index", {locations: highOccurrenceLocations});
              } else {
                  console.error("Error: Unable to retrieve records.");
              }
          })
          .catch((error) => {
              console.error("Error fetching data:", error);
          });

});

app.listen(process.env.PORT || 3000);