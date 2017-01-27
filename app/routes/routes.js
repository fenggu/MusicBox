var app = require('express').Router(); 
var userController = require('../controllers/users.js');
//bodyparser中间件 
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();   
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false })); 
// app.post('/user/login', userController.login)
app.post('/user/sign', userController.createUser)

 
module.exports = app;
