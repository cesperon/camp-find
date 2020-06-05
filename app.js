//Author:Christian Esperon
//Description: Updated version 6 uses modular schemas to lighten
//apply association between user comments and campgrounds

//dotenv used for environment variable to be used by api key, hides api key from entire world
require('dotenv').config();

var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
	Camp = require('./models/camp'),
	flash = require('connect-flash'),
	Comment = require('./models/comments'),
	User = require('./models/user'),
    app = express(),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	PassportLocalMongooge = require('passport-local-mongoose'),
	seedDB = require('./seeds')

var commentRoutes = require('./routes/comments'),
	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes =require('./routes/index')

//useed for findbyidandupdate to remove deprecating warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
//use mothodOverride to trick into put request
app.use(methodOverride('_method'));
app.use(flash());
//seed the data base
// seedDB();

//passport configuration
app.use(require('express-session')({
	
	secret: "Avery is the greatest son in the world!",
	resave: false,
	saveUninitialized: false
	
}));

//intialize passport
app.use(passport.initialize());
app.use(passport.session());
//User.authenticate/serializeUser/deserializeUser is a method that comes with passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use(indexRoutes);
app.use('/campGrounds/:id/comments', commentRoutes);
app.use('/campGrounds', campgroundRoutes);


app.listen(process.env.PORT, function(req, res){
	
	console.log("Yelp Camp Server Has Started");
});

