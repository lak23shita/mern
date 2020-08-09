var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
//this will provide the json we token strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');








//verify function we have used 
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//these two support what we require for sessions in our project.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//user is the json object taht will return the token
exports.getToken = function(user) {
    //this will help to create the token
    //user is the payload and the other parameter is the secret key
    return jwt.sign(user, config.secretKey,
        //how long the json webtoken will remain
        {expiresIn: 3600});
};

var opts = {};
//how thw jwt web token will be extracted 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
//jwt strategy
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    //his is the verify function,done we are passing the information to the passport and that is used to extract information
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                //done will pass the startegy usee desnt exisst thean we will use false
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

    //we are not using sessions thats why we will set sessions to false
exports.verifyUser = passport.authenticate('jwt', {session: false});