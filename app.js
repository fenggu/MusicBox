require('babel-register');
require("babel-polyfill");

var express = require('express');
var app = express();
//bodyparser中间件 
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var MongoClient = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');

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

    //bodyparser中间件 
    var bodyParser = require('body-parser')
    var jsonParser = bodyParser.json();
    var app = express();
    app.use(bodyParser());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cookieParser());

    var MongoStore = require('connect-mongo')(session);
   

    app.use(cookieParser());
    app.use(session({
        secret: 'music',
        name: 'music', 
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({   //创建新的mongodb数据库
            host: '127.0.0.1',
            port: '27017',
            db: 'sessions',
            url: 'mongodb://localhost:27017/music'
        })
    }));
    // app.use(session({ //存储到session
    //     secret: 'mymusic',
    //     name: 'testapp',
    //     cookie: { maxAge: 80000 },
    //     resave: false,
    //     saveUninitialized: true,
    //     store: new MongoStore({ //创建新的mongodb数据库 
    //         host: 'localhost',
    //         port: '27017',
    //         db: 'sessions',
    //         url: 'mongodb://localhost:27017/music'
    //     })
    // }));

    // start http
    console.log('starting http...');
    var webapp = app.listen(8081, function() {
        var host = webapp.address().address;
        var port = webapp.address().port;

        var docRoute = require('./app/routes.js');
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
