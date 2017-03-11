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

// app.post('/sitelist/:id', function (req, res) {
//     var id = req.params.id;
    
//     var newObj = {};
//     newObj[req.body.name] = req.body.value;
//     console.log(newObj + ' : add attr');
//     db.sites.findAndModify({
//         query: {_id :mongojs.ObjectId(id)},
//         update: {$set: newObj},
//         new: true
//     },function (err, doc) {
//         res.json(doc);
//     });
// });

app.post('/sitelist', function (req, res) {
    console.log(req.body);
    db.sites.insert(req.body, function (err, doc) {
        res.json(doc);
    });
});

// app.delete('/sitelist/:id/:name', function (req, res) {
//     var id = req.params.id;
//     var name = req.params.name
//     var del = {};
//     del[name] = 1;
//     db.sites.findAndModify({
//         query: {_id :mongojs.ObjectId(id)},
//         update: {$unset: del},
//         new: true
//     },function (err,doc) {
//         res.json(doc);
//     });
// });

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
    var del = {};
    var setUpdate = {};
    for (item in req.body){
        if (item!='_id')
            setUpdate[item] = req.body[item];
    };
    db.sites.findOne({_id: mongojs.ObjectID(id)}, function (err, doc) {
        for (item in doc){
            if (!(item in req.body)){
                var del = {};
                del[item] = 1;
                console.log("删除内容: ",del);
                db.sites.findAndModify({
                    query: {_id :mongojs.ObjectId(id)},
                    update: {$unset: del},
                    new: true
                },function (err,doc) {});
            }
        }
    });
    console.log('更新内容: ',setUpdate);
    db.sites.findAndModify({
        query: {_id: mongojs.ObjectID(id)},
        update: {$set: setUpdate},
        new: true
    }, function (err, doc) {
        res.json(doc);
    });


});


app.listen(3000);
console.log("server listening at 3000");