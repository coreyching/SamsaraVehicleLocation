const API_ENDPOINT = 'https://api.samsara.com/v1';
const fetch = require('node-fetch');

var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express();
const { URL, URLSearchParams } = require('url');


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://corey:adminadmin@samsara-ohg1t.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const assert = require('assert');

const insertDocuments = function(db, data, callback) {
  // Get the documents collection
  const collection = db.collection('vehicles');
  // Insert some documents
  collection.insertMany(data.vehicles, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted vehicle documents into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('vehicles');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

function getData(endpoint) {
  var url = new URL(API_ENDPOINT + endpoint),
    params = {access_token:'YpLFyq7zWXrL91vMbbsknpw9uZUagf', groupId: '26012'};

  url.search = new URLSearchParams(params);

  return fetch(url)
  .then(function(response) {
    console.log("Status: " + response.status + " Retrieved Data from Samsara Cloud\n");
    return response.json();
  })
}

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, function () {
  client.connect(err => {
    console.log("Connected successfully to mongod server\n");
    const db = client.db("samsara");
    getData('/fleet/locations').then((result) => {
      insertDocuments(db, result, function() {
        findDocuments(db, function() {
          client.close();
        })
      })
    })
  });
})
