var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Login = require('../models/login.js');


var jwt = require('jsonwebtoken');


router.post('/', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(418);
      res.json({ success: false, message: 'Email was not found!' });
    } else if (user) {

      Login.collection.findOne({
          user_id: user._id
      }, function(err, login) {

        if (login.password != req.body.password) {
        res.status(400);
        res.json({ success: false, message: 'Password does not match email!' });
      } else {

        var token = jwt.sign(user._id, req.app.get('api_secret'), {
          expiresIn: req.app.get('token_exire') 
        });

        res.status(200);
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
        }  

      });
       

    }

  });
});

router.post('/login', function(req, res){
  var token = req.body.token;

  if (token) {

    jwt.verify(token, req.app.get('api_secret'), function(err, decoded) {      
      if (err) {
        console.log(err);
        return res.status(403).json({ message: 'Failed to authenticate token.' });    
      } else {

        return res.status(200).send({
          success: true,
          message: 'You have a valid token!'
        });
      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});




module.exports = router;
