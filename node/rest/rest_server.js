var express = require('express');
var app = express();
var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);

var mongo_db = "local_db";


var data_dir = appDir+"/data"

app.get('/listUsers', function (req, res) {
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
});

app.get('/listFiles', function (req, res) {
    // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //     console.log( data );
    //     res.end( data );
    // });
    console.log(data_dir);
    var numFiles = 0;
    var filesList = "";
    fs.readdir(data_dir, function(err, items) {
        var response = {};
        response["data"] = items;
        response["dir"] = data_dir;
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
        res.end(JSON.stringify(response));
    });

});

app.get('/loadFiles', function (req, res) {
    // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //     console.log( data );
    //     res.end( data );
    // });
    console.log("Load Files Called...");
    console.log(data_dir);
    var numFiles = 0;
    var filesList = "";
    fs.readdir(data_dir, function(err, items) {
        loadImagesToDB(items);
    });
    res.end("data loaded!");

})

app.get('/nextImage', function (req, res) {
    // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //     console.log( data );
    //     res.end( data );
    // });

})

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})/**
 * Created by seanweppner on 8/5/16.
 */


function loadImagesToDB(images){
    var collection_name = "annotation_images";

    // Retrieve
    var MongoClient = require('mongodb').MongoClient;

    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/"+mongo_db, function(err, db) {
        if(err) { return console.dir(err); }

        console.log("Made it!");

        var cursor = db.collection(collection_name).find( );
        console.log(cursor);

        var num = 1;
        // cursor.each(function(err, doc) {
        //     assert.equal(err, null);
        //     if (doc != null) {
        //         console.dir(doc);
        //         num += 1;
        //     } else {
        //         // callback();
        //         // console.log("Error");
        //     }
        // });

        var collection = db.collection(collection_name);
        for(var image_index in images){
            var image_location = images[image_index];
            var image_object = {};
            image_object["location"] = image_location;
            collection.insert(image_object);
        }
    });
}