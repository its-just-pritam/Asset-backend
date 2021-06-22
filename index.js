const express = require('express');
const app = express();
const fs = require('fs');
const jsonData = './data/data.json';
const downloadBlob = require('./downloadBlob.js');
const SetParams = require('./setParams.js');
const RemParams = require('./remParams.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.statusCode = 404;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.end(`Error : ${res.statusCode}\nNot correct path for API request`);
});

app.use('/downloadBlob', downloadBlob);

app.get('/getData/charts', function(req, res) {
    fs.readFile(__dirname + "/" + jsonData, 'utf8', function(err, data) {
        if(err){
            res.statusCode = 200;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.end("No latest data available!");
        }
        else{
            res.statusCode = 200;
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.end(data);
        }
    });
});

app.use('/setParams', SetParams);

app.use('/remParams', RemParams);

const server = app.listen(5000, function(){
    const host = 'localhost';
    const port = server.address().port;
    console.log("Server listening at http://" + host + ":" + port );
    console.log("API request at http://" + host + ":" + port + "/getData/charts");
    console.log("Download Blob data at http://" + host + ":" + port + "/downloadBlob");
});