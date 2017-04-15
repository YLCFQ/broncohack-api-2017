var db = require('../databases/organizations.js');

module.exports =  db.model('Organization', new require('mongoose').Schema({
	title: String,
	name: String,
	address: String,
	phone: Number,
	email: String,
	mailbox_id: String
}));