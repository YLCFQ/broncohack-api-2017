var db = require('../databases/events.js');

module.exports =  db.model('Event', new require('mongoose').Schema({
	title: String,
	description: String,
	address: String,
	starting_date: Number,
	ending_date: Number,
	total_capacity: Number,
	current_enrollment: Number,
	organ_id: Number,
	pictures: [String],
	type: Number,
	loc: {
		type: {type: String},
		coordinates: [Number],
	}
}
).index({ loc: "2dsphere" }));