var app = require('express').Router(); 
var userController = require('./controllers/users.js');
app.post('/user/sign', userController.createUser)
app.post('/user/login', userController.login)
app.get('/user/autologin', userController.getSelf)

app.post('/user/likesong', userController.addSongTolikes)
app.post('/user/likelist', userController.addSonglistTolikes)
app.get('/user/likelist', userController.getPlaylist)
app.get('/user/likesong', userController.getlikes)

app.get('/songlist/:id', userController.getSonglist)
app.get('/musiclists', userController.getMusiclist)
 
module.exports = app;
