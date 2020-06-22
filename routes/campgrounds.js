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

// multer config for image upload
var multer = require('multer');
//storage variable creates filename using current date and orginal file name
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

//only allow for extention names in originalname.match
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('file format is not allowed'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

//cloudinary config for image upload
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'cesperon90', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//campgrounds routes

//INDEX-SHOW ALL CAMPGROUNDS
router.get('/',function(req, res){
	
	var perPage = 9;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	var noMatch = null;
	var searched;
	//for debugging purposes
	// eval(require('locus'));
	if(req.query.search){
		
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		//Get all campgrounds from DB
		Camp.find({name: regex}).skip((perPage*pageNumber)-perPage).limit(perPage).exec(function(err, allCampgrounds){
			Camp.countDocuments({name: regex}).exec(function (err, count) {
				searched = true;
				if(err){
					console.log("Error in Camp.find/campGrounds");
					res.redirect('back');
				}
				else{

					if(allCampgrounds.length < 1){
						req.flash('error', 'No Campgrounds Found Matching Your Query');
						return res.redirect('back');
					}
					res.render('campgrounds/index' , {
						campgrounds:allCampgrounds, 
						currentUser:req.user,
						current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search,
						searched: searched
								   
						});
					}
				});
			});
			
	}
	else{
		//Get all campgrounds from DB
		Camp.find({}, function(err, allCampgrounds){	
			Camp.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
				Camp.countDocuments().exec(function (err, count) {
					searched = false;
					if (err) {
						console.log(err);
					} else {
						res.render("campgrounds/index", {
							campgrounds:allCampgrounds,
							current: pageNumber,
							pages: Math.ceil(count / perPage),
							search: false,
							searched: searched
						});
					}
					
				});
			});
		}); 
	}
	
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
  
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
	 
	// add cloudinary url for the image to the campground object under image property
	cloudinary.uploader.upload(req.file.path, function(result) {
	  	
	  	// Create a new campground and save to DB
		// get data from form and add to campgrounds array
	  	req.body.image = result.secure_url;
	  	var name = req.body.CampGroundName;
	  	var image = req.body.image;
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
		
		Camp.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else {
				//redirect back to campgrounds page
				console.log(newlyCreated);
				///////
				res.redirect("/campGrounds/" + newlyCreated._id);
			}
		});
	  
	});
  });
});

//NEW-DISPLAYS FORM TO ADD NEW CAMPGROUNDS
//must come first before :id because program must catch new
//before :id
router.get('/new',middleware.isLoggedIn, function(req, res){
	
	res.render('campgrounds/new');
});

//SHOW - SHOWS INFO ABOUT ONE Campground
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