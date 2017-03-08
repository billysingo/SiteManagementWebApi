var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('sites', ['sites']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/sitelist', function (req, res) {
    console.log('i received a request');
    db.sites.find(function (err, docs) {
        console.log(docs);
        res.json(docs);
    })
});

app.post('/sitelist', function (req, res) {
    console.log(req.body);
    db.sites.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

app.delete('/sitelist/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.sites.remove({_id: mongojs.ObjectID(id)}, function (err, doc) {
        res.json(doc);
    })
});

app.get('/sitelist/:id', function (req, res) {
    var id = req.params.id;
    db.sites.findOne({_id: mongojs.ObjectID(id)}, function (err, doc) {
        res.json(doc);
    })
});

app.put('/sitelist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.sites.findAndModify({
        query: {_id: mongojs.ObjectID(id)},
        update: {$set: {name: req.body.name, latitude: req.body.latitude, longitude: req.body.longitude}},
        new: true
    }, function (err, doc) {
        res.json(doc);
    });
});
app.listen(3000);
console.log("server listening at 3000");