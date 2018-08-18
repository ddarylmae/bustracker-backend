const express = require('express');
const https = require('https');

var app = express();

app.get('/getTripStatus', function () {
    console.log('HAHAY LORD TABANG');
});

app.listen(3000);