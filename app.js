require('babel-register');
require("babel-polyfill");

var express = require('express');
var app = express();
//bodyparser中间件 
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var MongoClient = require('mongodb').MongoClient;
global.ObjectID = require('mongodb').ObjectID;


global._ = require('lodash');

global.app = express();
console.log('connecting database...');

global.db = null;
var dbn = 'music';
MongoClient.connect('mongodb://localhost:27017/' + dbn, function(err, instance) {
    if (err != null) {
        return console.log('database error!');
    }

    global.db = instance;
    console.log('database connected:', dbn);

    app.use(session({
        secret: 'eyegrader preview',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db: instance })
    }));

    // start http
    console.log('starting http...');
    var webapp = app.listen(8081, function() {
        var host = webapp.address().address;
        var port = webapp.address().port;

        var docRoute = require('./app/routes/routes.js');
        app.use('/v1/', docRoute);
        app.use(express.static('build'));
        app.use('*', (req, res) => {
                res.sendFile(__dirname + '/build/index.html')
            })
            // crontab.buildHospital()
            // crontab.buildGradedAt()
            // crontab.buildFollowUpAt()
            // crontab.sendFollowUpVisitTask.start()

    });
});
