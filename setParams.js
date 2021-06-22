const express = require('express');
const writeParams = express.Router();
const paramsFile = "./data/params.json";

async function writeToFile(data, filename) {

    const fs = require('fs');
    const path = require('path');

    let rawdata = fs.readFileSync(path.resolve(__dirname, filename));
    let paramsArr = JSON.parse(rawdata);
    console.log(paramsArr);

    let flag = 0;
    for(let i in paramsArr)
        if( paramsArr[i] == data )
            flag = 1

    if( flag == 0 )
    {
        paramsArr.push(data);
    }
    console.log(paramsArr);

    fs.writeFileSync(path.resolve(__dirname, filename), JSON.stringify(paramsArr));

}

writeParams.route('/:paramID').all((req, res, next) => {
    res.statusCode = 200;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
}).get((req, res) => {
    res.end("Received the parameter " + req.params.paramID);
    console.log(req.params.paramID);

    writeToFile(req.params.paramID, paramsFile);
});

module.exports = writeParams;