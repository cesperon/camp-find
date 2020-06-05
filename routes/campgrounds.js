var express = require('express');
var router = express.Router();
var Camp = require('../models/camp');
var mongoose = require('mongoose');
//dont have to require index.js default name included
var middleware = require('../middleware');

// for google geocoder
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//campgrounds routes

//INDEX-SHOW ALL CAMPGROUNDS
router.get('/',function(req, res){
	
	//for debugging purposes
	// eval(require('locus'));
	if(req.query.search){
		
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		//Get all campgrounds from DB
		Camp.find({name: regex}, function(err, allCampgrounds){
			
			if(err){
				console.log("Error in Camp.find/campGrounds");
			}
			else{
				
				if(allCampgrounds.length < 1){
					req.flash('error', 'No Campgrounds Found Matching Your Query');
					return res.redirect('back');
				}
				res.render('campgrounds/index' , {campgrounds:allCampgrounds, currentUser:req.user});
			}
		});
	}
	else{
		//Get all campgrounds from DB
		Camp.find({}, function(err, allCampgrounds){
			if(err){
				console.log("Error in Camp.find/campGrounds");

			}
			else{
				res.render('campgrounds/index' , {campgrounds:allCampgrounds, currentUser:req.user});
			}
		});
	}
	
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.CampGroundName;
  var image = req.body.CampGroundImg;
  var desc = req.body.CampGroundDesc;
  var price = req.body.campPrice;
  var user = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, price:price, image: image, description: desc, user:user, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Camp.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});

//NEW-DISPLAYS FORM TO ADD NEW CAMPGROUNDS
//must come first before :id because program must catch new
//before :id
router.get('/new',middleware.isLoggedIn, function(req, res){
	
	res.render('campgrounds/new');
});

//SHOW - SHOWS INFO ABOUT ONE DOG
router.get("/:id", function(req,res){
	
	Camp.findById(mongoose.Types.ObjectId(req.params.id)).populate('comments').exec(function(err, newcamp){
		if(err){
			// console.log("Error in get campGrounds/:id");
			console.log(err);
		}
		else{
			res.render('campgrounds/show', {newcamp:newcamp});
		}
	});
	
});

//Edit Campground Route
router.get('/:id/edit',middleware.checkCampgroundOwnership, function(req, res){
	
	//is user loggin logged loggin?
	Camp.findById(req.params.id, function(err, foundCampground){

		res.render("campgrounds/edit", {campground: foundCampground});

	});


	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
	  
  var name = req.body.CampGroundName;
  var image = req.body.CampGroundImg;
  var desc = req.body.CampGroundDesc;
  var price = req.body.campPrice;
  var user = {
      id: req.user._id,
      username: req.user.username
  }
	
  var lat = data[0].latitude;
  var lng = data[0].longitude;
  var location = data[0].formattedAddress;
  var newCampground = {name: name, price:price, image: image, description: desc, user:user, location: location, lat: lat, lng: lng};

    Camp.findByIdAndUpdate(req.params.id, newCampground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campGrounds/" + campground._id);
        }
    });
  });
});

//Delete campground Route
router.delete('/:id',middleware.checkCampgroundOwnership, function(req, res){
	
	Camp.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id), function(err, deletedCamp){
		
		if(err){
			res.redirect('/campGrounds');
		}
		else{
			
			res.redirect('/campGrounds')
		}
	});
});

//function used for regex fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;