const express = require('express');
const https = require('https');
const cron = require('node-cron');
const fs = require('fs');
const axios = require('axios');

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
    getRouteId('879');
});

app.get('/getByRouteName', function () {
    getTripsByRouteName();
});

// cron.schedule('1 * * * *', function() {
//     console.log('displayed every 30sec');
// });

function getTripsByRouteName(){
    let tripArray = [];
    // axios(options);
    axios.get('https://api.at.govt.nz/v2/gtfs/trips/routeid/71202-20180725154052_v68.11',
        {
            'headers': {"ocp-apim-subscription-key": "b84b7e570f5e4241b55b8a129748e1f0"}
        })
      .then(function (response) {
        // handle success
        // console.log(response.data);
        response.data.response.forEach(elem => {
            tripArray.push(elem.trip_id);
            // console.log(elem.trip_id);
        });
        // Call getStatus
        retTripStatus(tripArray);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
}


function getRouteId(routeShortName) {
    options.path = "/v2/gtfs/routes/routeShortName/" + routeShortName;
    var req = https.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });      
        res.on("end", function () {
            let routeIds = [];
            var body = JSON.parse(chunks);
            body.response.forEach(element => {
                routeIds.push(element.route_id);
                // console.log(element.route_id);
            });
            // getTripsByRouteId(body.response[0].route_id);
            getTripsByRouteId(routeIds);

        });
    });
    req.end();
}

// function getTripsByRouteId(routeId) {
//     console.log('routeId: ' + routeId);
//     options.path = "/v2/gtfs/trips/routeid/" + routeId;
//     var req = https.request(options, function (res) {
//         var chunks = [];
//         res.on("data", function (chunk) {
//           chunks.push(chunk);
//         });      
//         res.on("end", function () {
//             var body = JSON.parse(chunks);
//             let trips = [];
//             body.response.forEach(element => {
//                 trips.push(element.trip_id);
//             });
//             getTripStatus(trips);
//         });
//     });
//     req.end();
// }

function getTripsByRouteId(routeIds) {
    // console.log('routeId: ' + routeId);
    let trips = [];
    // var dictstring = JSON.stringify(dict);
    fs.writeFile("trips.json", "");

    routeIds.forEach(rId => {
        options.path = '/v2/gtfs/trips/routeid/' + rId;
        console.log('Each route: ' + options.path);
        let req = https.request(options, function (res) {
            let chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });      
            // console.log(res.data);
            res.on("end", function () { 
                let body = JSON.parse(chunks);
                // console.log(body)
                body.response.forEach(element => {
                    // console.log(element);
                    trips.push(element.trip_id);
                    // console.log(element.trip_id);
                });
            });
        });
        req.end();
        // console.log("ended")
    });
    console.log("executed")
   // testFunc(trips);
}

function testFunc(trips) {
    console.log('in test');
    trips.forEach(element => {
        console.log(element);
    });
}

function getTripStatus(trips) {
    trips.forEach(element => {
        // console.log(element);
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
    });
}

function retTripStatus(tripArray) {
    let status = [];
    // axios(options);
    console.log('len: ' + tripArray.length);
    tripArray.forEach(element => {
        axios.get('https://api.at.govt.nz/v2/public/realtime?tripid=' + element,
        {
            'headers': {"ocp-apim-subscription-key": "b84b7e570f5e4241b55b8a129748e1f0"}
        })
        .then(function (response) {
        // handle success
            console.log(response.data);
            // response.data.response.forEach(elem => {

            // });
        })
        .catch(function (error) {
        // handle error
        console.log(error);
        })
        .then(function () {
        // always executed
        });
    });
}

function calling() {
    console.log('calling...');

    setTimeout(calling, 30*1000);
}

app.listen(3000);
calling();