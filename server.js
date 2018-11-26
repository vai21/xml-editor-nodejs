console.log("panorama project started")
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const auth = require('basic-auth')
const fs = require('fs')
const uuidv1 = require('uuid/v1');
const app = express()
//const assert = require('assert')

//connection url
const dbUrl = 'mongodb://faisal:040693mfr@ds259079.mlab.com:59079/panorama'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())
app.set('view engine', 'ejs')

var db
MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    if (err) return console.log(err)
    console.log("Connected successfully to server");

    db = client.db();

    app.listen(3000, function () {
        console.log('localhost:3000')
    })
});

// basic auth before middleware
app.use((req, res, next) => {
    let user = auth(req)
  
    if (user === undefined || user['name'] !== 'adam' || user['pass'] !== 'nurdin') {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="Node"')
      res.end('Unauthorized')
    } else {
      next()
    }
})

// index
app.get('/', (req, res) => {
    var cursor = db.collection('xml').find().toArray((err, result) => {
        if (err) return console.log(err)
        
        res.render('index.ejs', { xmls: result })    
    })
})

app.post('/', (req, res) => {
    console.log("post")
    var uuid = uuidv1()
    var filename = 'public/' + uuid + '.xml'
    req.body.filename = uuid + '.xml'

    fs.writeFile(filename, req.body.xml, function (err) {
        if (err) throw err;
        console.log("It's saved");
    })
    
    db.collection('xml').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/', (req, res) => {
    var ObjectID = require('mongodb').ObjectID;
    console.log("update")
    
    console.log(req.body.filename)
    var filename = 'public/' + String(req.body.filename)
    
    fs.writeFile(filename, req.body.xml, function (err) {
        if (err) throw err;
        console.log("It's saved");
    })

    db.collection('xml')
        .findOneAndUpdate({ _id: new ObjectID(req.body.id) }, {
            $set: {
                xml: req.body.xml
            }
        }, {
                sort: { _id: -1 },
                upsert: true
            }, (err, result) => {
                if (err) return res.send(err)
                res.send(result)
            })
})

app.delete('/', (req, res) => {
    var ObjectID = require('mongodb').ObjectID;
    console.log("delete")
    db.collection('xml')
        .findOneAndDelete({ _id: new ObjectID(req.body.id) }, 
        (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
})