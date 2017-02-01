var app = require('express').Router(); 
var userController = require('./controllers/users.js');
app.post('/user/sign', userController.createUser)
app.post('/user/login', userController.login)
app.get('/user/autologin', userController.getSelf)

app.post('/user/likesong', userController.addSongTolikes)
app.post('/user/likelist', userController.addSongTolikes)
app.get('/user/playlist', userController.getPlaylist)

app.get('/songlist/:id', userController.getSonglist)
app.get('/musiclists', userController.getMusiclist)
 
module.exports = app;
