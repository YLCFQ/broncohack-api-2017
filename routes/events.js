var express = require('express');
var jwt = require('jsonwebtoken');
var Event = require('../models/event.js');
var User = require('../models/user.js');
var config = require('../config.js');
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

router.get('/all', function(req, res, next){
  Event.find({}, function(err, events){
    if(err) throw err;

    if(events){
      res.status(200);
      return res.json(events);
    }
  })
});


router.get('/', function(req, res, next) {
  if(req.query.eventId){
        Event.findOne({
        _id : req.query.eventId
      }, function(err, event){
        if(err) throw err;
        if(event){
            res.status(200);
            return res.json(event);
        }else{
          res.status(400);
          return res.json({
            success: false,
            message: "No event was found with that ID!"
          })
        }
      });
    }else{
      console.log(req.id);
      Event.find({
      userId : req.id
    }, function(err, events){
      if(err) throw err;
      if(events.length > 0){
          res.status(200);
          return res.json(items);
      }else{
        res.status(418);
        return res.json({
          success: true,
          message: "You have no events to display!"
        })
      }
    });
    }
});

/*router.post('/update', function(req, res, next) {
        Event.findOne({
        _id : req.query.itemId,
        userId: req.id
      }, function(err, item){
        if(err) throw err;
        if(item){
            if(req.body.title)  item.title = req.body.title;
            if(req.body.description) item.description = req.body.description;
            if(req.body.price) item.price = req.body.price;
            if(req.body.pictures) item.pictures = req.body.pictures;
            if(req.body.expiration) item.expiration = req.body.expiration;
            item.save(function(err){
              if(err) throw err;
            })
            res.status(200);
            return res.json(item);
        }else{
          res.status(400);
          return res.json({
            success: false,
            message: "The event does not belong to you or it could not be found!"
          })
        }
      });
});*/

router.get('/nearby', function(req, res, next){
  var METERS_PER_MILE = 1609.34;

    Event.find({
        loc: {
        $nearSphere: { 
          $geometry: { 
            type: "Point",
            coordinates: [req.query.y, req.query.x]
            },
            $maxDistance: 5000 * METERS_PER_MILE } }
      }, function(err, event){
        if(err) throw err;
        if(event){
            res.status(200);
            return res.json(event);
        }else{
          res.status(400);
          return res.json({
            success: false,
            message: "No event was found with that ID!"
          })
        }
      });

});



router.post('/new', function(req, res, next){
  var valid = true;

  var pictures = req.body.pictures;

  var expiration = req.body.expiration;

  if(!req.body.title) valid = false;
  if(!req.body.description) valid = false;
  if(!req.body.pictures){
    pictures = config.default_item_picture;
  }
  if(!req.body.expiration){
      expiration = (new Date).getTime() + config.default_expiration; //default at 7 days
  }

  if(!valid){
    res.status(400);
    return res.json({
      success: false,
      message: "Missing arguments to create an item!"
    })
  }


  	var newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      starting_date: req.body.starting_date,
      ending_date: req.body.ending_date,
      total_capacity: req.body.total_capacity,
      current_enrollment: req.body.current_enrollment,
      organ_id: req.body.organ_id,
      pictures: req.body.pictures,
      type: req.body.type,
      loc: {
        type: "Point",  
        coordinates: [req.body.x, req.body.y],
     }
});
  		  newEvent.save(function(err){
        if(err) throw err;
          //Event.collection.createIndex({loc:"2dsphere"});
          res.status(200);
          res.json(newEvent);
    });


});

module.exports = router;
