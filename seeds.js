//Author:Christian Esperon
//Description:File used to seed data into the program to 
//help check if particular elements in the program that require
//data are correct. 

var mongoose = require('mongoose');
var Camp = require('./models/camp');
var Comment = require('./models/comments');


//starter data
var data = [
	{
		name:"Howlers Cove",
		image:"https://images5.alphacoders.com/885/885447.jpg",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi ac tellus ornare, a tincidunt odio semper. Sed et elit sodales, luctus est vitae, iaculis sapien. Fusce ultrices sapien ante, et maximus ante laoreet a. Maecenas urna quam, suscipit quis libero non, euismod condimentum risus. Morbi sit amet ligula et sem eleifend convallis venenatis vitae nibh. Donec imperdiet consequat lacus eu pellentesque. Praesent massa nisl, maximus id velit vitae, maximus dapibus elit. Phasellus ut nulla orci. Curabitur quam nulla, euismod sit amet nisl sit amet, fermentum fermentum nulla. Proin lacinia quis quam et convallis. Etiam quam tellus, convallis eu arcu ac, elementum bibendum lorem."
	},
	{
		name:"Sunset Landing",
		image:"https://images6.alphacoders.com/990/990554.jpg",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi ac tellus ornare, a tincidunt odio semper. Sed et elit sodales, luctus est vitae, iaculis sapien. Fusce ultrices sapien ante, et maximus ante laoreet a. Maecenas urna quam, suscipit quis libero non, euismod condimentum risus. Morbi sit amet ligula et sem eleifend convallis venenatis vitae nibh. Donec imperdiet consequat lacus eu pellentesque. Praesent massa nisl, maximus id velit vitae, maximus dapibus elit. Phasellus ut nulla orci. Curabitur quam nulla, euismod sit amet nisl sit amet, fermentum fermentum nulla. Proin lacinia quis quam et convallis. Etiam quam tellus, convallis eu arcu ac, elementum bibendum lorem."
	},
	{
		name:"Landcaster Coast",
		image:"https://images2.alphacoders.com/915/915220.jpg",
		description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lobortis mi ac tellus ornare, a tincidunt odio semper. Sed et elit sodales, luctus est vitae, iaculis sapien. Fusce ultrices sapien ante, et maximus ante laoreet a. Maecenas urna quam, suscipit quis libero non, euismod condimentum risus. Morbi sit amet ligula et sem eleifend convallis venenatis vitae nibh. Donec imperdiet consequat lacus eu pellentesque. Praesent massa nisl, maximus id velit vitae, maximus dapibus elit. Phasellus ut nulla orci. Curabitur quam nulla, euismod sit amet nisl sit amet, fermentum fermentum nulla. Proin lacinia quis quam et convallis. Etiam quam tellus, convallis eu arcu ac, elementum bibendum lorem."
	}
	
]

function seedDB(){
	
	//replaced remove with deleteMany
	Camp.deleteMany({}, function(err, res){
	
		// if(err){
		// 	console.log(err);
		// }
		// else{

		// 	for(var i = 0; i< data.length; i++){

		// 		Camp.create(data[i], function(err, res){
		// 			if(err){
		// 				console.log(err);
		// 			}
		// 			else{
		// 				console.log("added campground!");
		// 				Comment.create(
		// 						{
		// 							text:"This place is amazing as can be",
		// 							author:"Avery"
		// 						},function(err, comment){
		// 							if(err){
		// 								console.log(err);
		// 							}
		// 							else{
		// 								Camp.comments.push(comment);
		// 								Camp.save();
		// 								console.log("Create a new comment!");
		// 							}
		// 						}
		// 					)
		// 			}
		// 		});
		// 	}
		// }
	});
	/////////////////////
	// Comment.deleteMany({}, function(err){
		// if(err){
		// 	console.log(err);
		// }
		// console.log('removed comments');
		// //Remove all campgrounds
		// Camp.deleteMany({}, function(err){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// 	console.log('removed campgrounds!');
			
		// 	data.forEach(function(seed){
		// 		Camp.create(seed, function(err, campground){
		// 			if(err){
		// 				console.log(err)
		// 			}
		// 			else{
		// 				console.log('added a campground');
		// 				Comment.create(
		// 				{
		// 					text:'this place is great, but I wish there was internet',
		// 					author:'Homer'
		// 				},function(err,comment){
		// 					if(err){
		// 						console.log(err);
		// 					}
		// 					else{
		// 						campground.comments.push(comment);
		// 						campground.save();
		// 						console.log('created a new comment');
		// 					}
		// 				});
		// 			}
		// 		});
		// 	});
		// });
	// });
	
}

//exports seedDB function to app.js
module.exports = seedDB;



