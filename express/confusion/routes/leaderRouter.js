const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const authenticate = require('../authenticate');
const leaderships =require('../models/leadership');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

//------------- CRUD FOR ALL LEADERS ----------------

leaderRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send all the dishes to you!');
    leaderships.find({})
    //as it is an array thats why we are taking it as dishes
    //we are returning the json application that is why we have returned the json
    
    .then((leaderships)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leaderships);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    //aswe have send all the values to the body in form of json format we will send that only
    leaderships.create(req.body)
    .then((leadership)=>{
        console.log('Dish Created',leadership);
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leadership);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leadership');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting all dishes');
    leaderships.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leadership);
    },(err)=>next(err))
    .catch((err)=>next(err));
});
// ----------- CRUD FOR LEADERS WITH LEADER ID -------------

leaderRouter.route('/:leaderId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
    leaderships.findById(req.params.leaderId)
    .then((leadership)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leadership);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    // res.write('Updating the dish: ' + req.params.dishId + '\n'); // res.write Can be use to add a line to reply message
    // res.end('Will update the dish: ' + req.body.name + 
    //         ' with details: ' + req.body.description);
    leaderships.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leadership)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leadership);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting dish: ' + req.params.dishId);
    //this params stand for the id we want to delete
    leaderships.findByIdAndDelete(req.params.leaderId)
    .then((leadership)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(leadership);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = leaderRouter;