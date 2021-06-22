const { BlobServiceClient } = require('@azure/storage-blob');
const txtfile = "./data/data.txt";
const jsonfile = "./data/data.json";
const express = require('express');
const downloadBlob = express.Router();

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here

    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("dummy-iot-output");
    const blockBlobClient = containerClient.getBlockBlobClient("2021/06/14/0_3a536dd58b734df5835c151dd5711977_1.json");

    // List the blob(s) in the container.
    console.log('\nListing blobs...');

    for await (const blob of containerClient.listBlobsFlat()) {
        console.log('\t', blob.name);
    }

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');
    const download = await streamToString(downloadBlockBlobResponse.readableStreamBody);
    // console.log('\t', download);

    await writeToFile(download, txtfile);

    var fs = require('fs');

    fs.readFile(txtfile, function(err, data) {
        if(err) throw err;
        var array = data.toString().split("}}");
        var last = array.pop();
        var len = array.unshift("[\n");
        array[array.length] = "\n]\n";
        var download = "";

        for(let i in array) {
            if( ! ( i == 0 || i == array.length - 1 || i == array.length - 2 ) )
                array[i] += "}},";
            else if( i == array.length - 2 )
            array[i] += "}}";
            
            download += array[i];
        }

        writeToFile(download, jsonfile);

        console.log('\nCreated a json file containing downloaded data...');

});

}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
        // console.log(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }

// A helper function used to write downloades content into data.json file
async function writeToFile(download, filename) {

    const fs = require('fs');
    try {
        const data = fs.writeFileSync(filename, download);
        //file written successfully
    } catch (err) {
        console.error(err);
    }
}

downloadBlob.route('/').all((req, res, next) => {
      res.statusCode = 200;
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
}).get((req, res) => {
      main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));
      res.end("Latest Blob data downloaded");
      console.log("Latest Blob data downloaded");
});

module.exports = downloadBlob;