var express = require('express');
var jwt = require('jsonwebtoken');
var Event = require('../models/event.js');
var User = require('../models/user.js');
var config = require('../config.js');
var IndividualEvents = require('../models/individualEvent.js');
var router = express.Router();

router.use(function(req, res, next){
var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, req.app.get('api_secret'), function(err, decoded) {      
      if (err) {
      	console.log(err);
        return res.status(403).json({ message: 'Failed to authenticate token.' });    
      } else {
        req.id = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});



router.post('/', function(req, res, next){

    var n = new IndividualEvents({
      userId: req.body.userId,
      eventId: req.body.eventId,
      VolunteerChecker: req.body.VolunteerChecker
    });
    n.save(function(err){
        if(err) throw err;
          res.status(200);
          res.json(n);
    });
});


router.get('/getbyid', function(req, res, next) {
    IndividualEvents.find({
        userId: req.query.userId
    }, function(err, events) {
      if(err) throw err;
      if(events) {
        res.status(200);
        return res.json(events);
      }else {
        res.status(400);
        return res.json({
          success: false,
          message: "not events find"
        })
      }
    });

});

router.get('/getbyevent', function(req, res, next) {
    IndividualEvents.find({
        eventId: req.query.eventId
    }, function(err, events) {
      if(err) throw err;
      if(events) {
        res.status(200);
        return res.json(events);
      }else {
        res.status(400);
        return res.json({
          success: false,
          message: "not events find"
        })
      }
    });

});


module.exports = router;


