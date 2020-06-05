var express = require('express');
var router = express.Router({mergeParams:true});
var Camp = require('../models/camp');
var Comment = require('../models/comments');
var middleware = require('../middleware')
var mongoose = require('mongoose');
//==================================================
//Nested routes for comments

//NEW	    campGrounds/:id/comments/new   GET
router.get("/new", middleware.isLoggedIn,  function(req, res){
	
	Camp.findById(mongoose.Types.ObjectId(req.params.id), function(err, foundCamp){
		if(err){
			console.log(err);
		}
		else{
			res.render('comments/new', {foundCamp:foundCamp});
		}
	});
});

//CREATE    campGrounds/:id/comments	   POST
router.post("/",middleware.isLoggedIn, function(req,res){
	
	Camp.findById(mongoose.Types.ObjectId(req.params.id), function(err, foundCamp){
		
		if(err){
			console.log(err);
		}
		else{
			
			Comment.create(req.body.comment, function(err, comment){
					
					if(err){
						req.flash('error', 'Something went wrong');
						console.log(err);
					}
					else{
						//add username and id to comment
						comment.author.username = req.user.username;
						comment.author.id = req.user._id;
						//save the comment
						comment.save();
						//save comment
						foundCamp.comments.push(comment);
						foundCamp.save();
						req.flash('success', 'Successfully added comment');
						res.redirect('/campGrounds/'+ foundCamp._id);
					}
				}
			)	
		}
	});
	
});

//edit route campGrounds/:id/comments/:comment_id/edit
router.get('/:comment_id/edit',middleware.checkCommentOwnership, function(req, res){
	
	Comment.findById(req.params.comment_id, function(err, foundComment){
		
		if(err){
			res.redirect('back');
		}
		else{
			res.render('comments/edit', {campground_id:req.params.id, comment:foundComment});
		}
	});
	
		
});

//update route campGrounds/:id/comments/:comment_id/edit
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		
		if(err){
			res.redirect('back');
		}
		else{
			res.redirect('/campGrounds/' + req.params.id);
		}
	});
});

//delete route comments
router.delete('/:comment_id',middleware.checkCommentOwnership, function(req, res){
	
	Comment.findByIdAndDelete(mongoose.Types.ObjectId(req.params.comment_id), function(err, deletedComment){
		if(err){
			res.redirect('back');
		}
		else{
			req.flash('success', 'Comment deleted');
			res.redirect('/campGrounds/' + req.params.id);
		}
	});
});

//middleware
// function isLoggedIn(req, res, next){
	
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
	
// 	res.redirect('/login');
// }

// function checkCommentOwnership(req, res, next){
	
// 		if(req.isAuthenticated()){
			
// 			Comment.findById(req.params.comment_id, function(err, foundComment){
// 					if(err){
						
// 						res.redirect('back');
// 					}
// 					else{
// 						//does user own the comment?
// 						if(foundComment.author.id.equals(req.user._id)){
// 							next();
// 						}else{
// 							res.redirect('back');
// 						}
// 					}
// 			});

// 		}else{
// 			//redirect to page recently viewed by user
// 			res.redirect('back');
// 		}
// }


module.exports = router;