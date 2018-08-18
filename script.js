const express = require('express');
const https = require('https');

var app = express();

var options = {
    "method": "GET",
    "hostname": "api.at.govt.nz",
    "port": null,
    "path": "",
    "headers": {
        "ocp-apim-subscription-key": "b84b7e570f5e4241b55b8a129748e1f0"
    }
  };

app.get('/getTripStatus', function () {
    getRouteId('NEX');
});

function getRouteId(routeShortName) {
    options.path = "/v2/gtfs/routes/routeShortName/" + routeShortName;
    var req = https.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });      
        res.on("end", function () {
            var body = JSON.parse(chunks);
            getTripsByRouteId(body.response[0].route_id);
        });
    });
    req.end();
}

function getTripsByRouteId(routeId) {
    console.log('routeId: ' + routeId);
    options.path = "/v2/gtfs/trips/routeid/" + routeId;
    var req = https.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });      
        res.on("end", function () {
            var body = JSON.parse(chunks);
            let trips = [];
            body.response.forEach(element => {
                trips.push(element.trip_id);
            });
            getTripStatus(trips);
        });
    });
    req.end();
}

function getTripStatus(trips) {
    trips.forEach(element => {
        console.log(element);
    });
}

app.listen(3000);