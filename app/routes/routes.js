var app = require('express').Router(); 
var userController = require('../controllers/users.js');
// app.post('/user/login', userController.login)
app.post('/user/sign', userController.createUser)
app.post('/user/login', userController.login)
app.get('/user/autologin', userController.getSelf)
 
app.get('/user/awesome', function(req, res){
    console.log(req.session)
    if(req.session.lastPage) {
        console.log('Last page was: ' + req.session.lastPage + ".");    
    }    
    req.session.lastPage = '/awesome';
    res.send("You're Awesome. And the session expired time is: " + req.session.cookie.maxAge);
});

module.exports = app;
