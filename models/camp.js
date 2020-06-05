//Author:Christian Esperon
//Description: Camp Schema used in app.js
var mongoose = require('mongoose');


var campSchema = new mongoose.Schema({
	name:String,
	price:String,
	image:String,
	description:String,
	location: String,
	lat: Number,
	lng: Number,
	user: {
		
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"	
		},
		
		username: String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:'Comment'
		}
	]
});

module.exports = mongoose.model("Camp", campSchema);

