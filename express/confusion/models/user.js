var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
});

//this will add a plugin that is the username and the passport and also the hash values to them
User.plugin(passportLocalMongoose);

module.exports =mongoose.model('User',User);