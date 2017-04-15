var db = require('../databases/users.js');

module.exports = db.model('User', new require('mongoose').Schema({
	email: String, //email
	display_name: String, // user name
	city: String, // user city
	state: String, // user state
	phone_number: String, // user phone number
	points: Number, //user points earned
	picture: String, // image url
	loc: {
		type: { type: String},
		coordinates: [Number],
	}//user last known location
	
}).index({ loc: "2dsphere" }));
