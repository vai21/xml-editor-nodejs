console.log("panorama project started")
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
//const assert = require('assert')

//connection url
const url = 'mongodb://localhost:27017/panorama'

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

var db
MongoClient.connect(url, { useNewUrlParser: true}, function(err, client) {
    if (err) return console.log(err)
    console.log("Connected successfully to server");
   
    db = client.db();
   
    app.listen(3000, function(){
        console.log('localhost:3000')
    })
});

// index
app.get('/', (req, res) => {
    var cursor = db.collection('xml').find().toArray((err, result) => {
        if (err) return console.log(err)

        res.render('index.ejs', {xmls: result})
    })    
})

app.post('/', (req, res) => {
    console.log("post")
    db.collection('xml').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})