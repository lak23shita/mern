var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//instead of cookies we are sending the session
var session =require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

var config = require('./config');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter')

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

//we have established the connection to the server
connect.then((db)=>{
  console.log('Connected correctly to server');
},(err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//secret kye
//app.use(cookieParser('12345-67890-09874-56473'));

// app.use(session({
//   name:'session-id',
//   secret: '12345-67890-09874-56473',
//   saveUninitialized : false,
//   resave : false,
//   store :new FileStore()
// }));

//the request of the username from the login will be send and that will be initialized and than stored into the session
app.use(passport.initialize());
//app.use(passport.session());


app.use('/', indexRouter);
 app.use('/users', usersRouter);

function auth (req, res, next) {
  //console.log(req.headers);
  //console.log(req.signedCookies);
  //console.log(req.session);
  //console.log(req.user);

  //if the user do not have a signed cookie than the user have to authorize 
  //if(!req.signedCookies.user){
  //if(!req.session.user){
    //var authHeader = req.headers.authorization;
      //if (!authHeader) {
  //         var err = new Error('You are not authenticated!');
  //         res.setHeader('WWW-Authenticate', 'Basic');
  //         err.status = 401;
  //         //next will take the message to the error handler
  //         return next(err);
          
  // }
  // else{
  //   if(req.session.user === 'authenticated'){
  //     //moving to the next middleware
  //     next();
  //   }
  //   else{
  //     var err = new Error('You are not authenticated!');
  //     err.status = 403;
  //     return next(err);

  //   }
  //}
  //console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//     //if(req.session.user === 'authenticated'){
//       //     //moving to the next middleware
//       //     next();
//         next();
//   //}
//   }
// }
      //we are splitting the authheader hows index is 1 becoz that is the username and password and its type is base 64
      //we are splitting it twice one with space and other with : and the auth conatins the username and password
      
//       var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

//       var username = auth[0];
//       var password = auth[1];
//       //this is the default password and username and next means that we are sending the request to the next middleware
//       if(username === 'admin' && password === 'password'){
//         //to procced the user further
//         //we hav eset the user cookie to the admin
//         //this means setting the cookie
//         //res.cookie('user','admin',{signed:true})
//         req.session.user = 'admin';
//         next();
//       }
//       else{
//         //error is generated
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         //next will take the message to the error handler
//         return next(err);
//       }
//   }
//   else{
//       //if(req.signedCookies.user ==='admin'){
//         if(req.session.user ==='admin'){
//         next();
//       }
//       else{
//         var err = new Error('You are not authenticated!');
          
//           err.status = 401;
//           //next will take the message to the error handler
//           return next(err);
//       }
//   }
//   //if the user is not authorized than he will get the error message
  

// }
// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
// ---> For leaders and promo
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//passport is stored n form of hash values and values