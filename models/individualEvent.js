var db = require('../databases/individualEvents.js');

module.exports =  db.model('individualEvent', new require('mongoose').Schema({
	userId: String,
	eventId: String,
	VolunteerChecker: Number,
}));

