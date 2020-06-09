var mongoose = require('mongoose'),
	passportLocalMongoose = require('passport-local-mongoose')

var userSchema = mongoose.Schema({
	
	username: String,
	password: String,
	avatar: String,
	firstName:String,
	lastName: String,
	email: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);