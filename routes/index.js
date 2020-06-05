var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//Route Route
router.get('/', function(req, res){
	
	res.render('campgrounds/home');
});
//Authentication Routes

//Show register form
router.get('/register', function(req, res){
	
	res.render('register');
});

//Handle User sign up
router.post('/register', function(req, res){
	
	var newUser = new User({username: req.body.username});
	//add username to user and password is hashed but not added to user right away instead added as second param
	User.register(newUser, req.body.password, function(err, user){
		
		if(err){
			req.flash('error', err.message);
			//short circuits back to register if err occurs
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'Welcome to YelpCamp ' + user.username);
			res.redirect('/campGrounds');
		});
		
		
	});
});

//Render Login form
router.get('/login', function(req, res){
	
	res.render('login');
});

//render login form
//login logic compares login credentials with stored credentials
//middleware which comes after login and before callback is used to compare input with database hash function
//passport.authenticate is middleware
router.post('/login', passport.authenticate('local', {
	
	successRedirect: '/campGrounds',
	failureRedirect: '/login'
	
}), function(req, res) {
	
});

//logout routes
router.get('/logout', function(req, res){
	//logs user out, no longer keeps track of session variables
	req.logout();
	req.flash('success', 'Logged you out');
	res.redirect('/campGrounds');
});

//middleware
function isLoggedIn(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	}
	
	res.redirect('/login');
}

module.exports = router;
