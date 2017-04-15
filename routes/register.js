var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var User = require('../models/user.js');
var Upload = require('../models/upload.js');
var Login = require('../models/login.js');
var router = express.Router();


router.post('/', function(req, res, next) {

	User.findOne({
		email: req.body.email

	}, function(err, user){
		if(err) throw err;
		if(user)  {
			res.status(400);
			return res.json({
				success: false,
				message: "This email has already been registered!"
			});
		}else{
			
			if(req.body.password.length < 3){

					res.status(400);
					return res.json({
					success: false,
					message: "Password is too short in length"
				});
				}else{

					var picture = config.default_picture;
					if(req.body.profile_picture)
						picture = req.body.picture;
					
					var n = new User({
						email: req.body.email,
						password: req.body.password,
						display_name: req.body.display_name,
						city: req.body.city,
						state: req.body.state,
						points: req.body.points,
						phone_number: req.body.phone,
						picture: picture,
						loc: {
							type: "Point",
							coordinates: [req.body.x, req.body.y]
						}

					});

					n.save(function(err){
						if (err) throw err;
						n.collection.createIndex({loc:"2dsphere"});
						Login.collection.insertOne({
							user_id: n._id,
							password: req.body.password 
						});
						var u = new Upload({
						user_id: n._id,
						url: picture
						});
							var token = jwt.sign(n._id, req.app.get('api_secret'), {
        					  expiresIn: req.app.get('token_exire') 
        					});
							res.status(200);
							return res.json({
							success: true,
							message: "token Registration successful!",
							token: token,
							id: n._id
							});
					
						

					});
					
				}
			
		}
	});
});

router.get('/check/email', function(req, res, next){
	console.log(req.query.email);
	if (!req.query.email){
		res.status(418);
		res.json({
			success: false,
			message: "No email to check!"
		})
	}
	User.findOne({
		email: req.query.email
	}, function(err, user){
		if(err) throw err;

		if (user){
			res.status(200);
			res.json({
				success: true,
				message: "Email was found!"
			});
		}else{
			res.status(418);
			res.json({
				success: false,
				message: "No email was found!"
			});
		}
	});
});



module.exports = router;
