var db = require('../databases/login.js');

module.exports =  db.model('Login', new require('mongoose').Schema({
	user_id: String,
	password: String
}));