var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//post operation of route call signup
//in this we are checking the username which is already feeded in form of json and we are finding that 

router.post('/signup', (req, res, next) => {
  //this third parameter is the callback function
  User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
    // if(user != null) {
    //   var err = new Error('User ' + req.body.username + ' already exists!');
    //   err.status = 403;
    //   next(err);
    // }
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
    }
    else {
      // return User.create({
      //   username: req.body.username,
      //   password: req.body.password});
      //local is the type of authentication
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //we are returning the user as a property in json
        res.json({success:true , status: 'Registration Successful!'});
      });
    }
  });
  //.then((user) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json');
    //we are returning the user as a property in json
  //   res.json({status: 'Registration Successful!', user: user});
  // }, (err) => next(err))
  //.catch((err) => next(err));
});

//we will authenticate the user using username and passport if that is verfied than we can say that we can provide them with the token
router.post('/login', passport.authenticate('local'),(req, res, next) => {

//   if(!req.session.user) {
//     var authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
  
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];
  
//     User.findOne({username: username})
//     .then((user) => {
//       if (user === null) {
//         var err = new Error('User ' + username + ' does not exist!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.password !== password) {
//         var err = new Error('Your password is incorrect!');
//         err.status = 403;
//         return next(err);
//       }
//       else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated!')
//       }
//     })
//     .catch((err) => next(err));
//   }
//   else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
// })
//theid is used to serach the user in the mongodb
  var token = authenticate.getToken({_id:req.user._id})
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //we are returning the user as a property in json
        res.json({success:true ,token: token,status: 'Registration Successful login!'});
})
//we are not submitting anything
router.get('/logout', (req, res) => {
  //session must exist
  if (req.session) {
    //the sessions destroyed and sestory all he cookies
    req.session.destroy();
    //all cokkies are removed
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
