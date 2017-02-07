var app = require('express').Router(); 
var userController = require('./controllers/users.js');

//bodyparser中间件 
var bodyParser = require('body-parser') 
var jsonParser = bodyParser.json();
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/user/sign', userController.createUser)
app.post('/user/login', userController.login)
app.get('/user/logout', userController.logout)
app.get('/user/autologin', userController.getSelf)

app.post('/user/likesong', userController.addSongTolikes)
app.post('/user/likelist', userController.addSonglistTolikes)
app.get('/user/likelist', userController.getPlaylist)
app.get('/user/likesong', userController.getlikes)
app.post('/songtitles', userController.getsongsOnlyNames)
app.get('/songs/:id', userController.getsongs)
app.post('/songs', userController.addsongs)
app.delete('/songs/:id', userController.delsong)

app.get('/songlist/:id', userController.getSonglist)


app.post('/songlist', userController.createSonglist)
app.delete('/songlist', userController.delSonglist)
app.post('/editsonglist', userController.addsongsToSonglist)
app.delete('/editsonglist', userController.delsongsToSonglist)
app.get('/musiclists', userController.getMusiclist)
app.post('/uploadfile', userController.uploadfile)

module.exports = app;
