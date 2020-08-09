const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const authenticate = require('../authenticate');
const promotions =require('../models/promotions');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//------------- CRUD FOR ALL PROMO ----------------

promoRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send all the dishes to you!');
    promotions.find({})
    //as it is an array thats why we are taking it as dishes
    //we are returning the json application that is why we have returned the json
    
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    //aswe have send all the values to the body in form of json format we will send that only
    promotions.create(req.body)
    .then((promotion)=>{
        console.log('Dish Created',promotion);
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting all dishes');
    promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// ----------- CRUD FOR PROMOS WITH PROMO ID -------------

promoRouter.route('/:promoId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
    promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    // res.write('Updating the dish: ' + req.params.dishId + '\n'); // res.write Can be use to add a line to reply message
    // res.end('Will update the dish: ' + req.body.name + 
    //         ' with details: ' + req.body.description);
    promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting dish: ' + req.params.dishId);
    //this params stand for the id we want to delete
    promotions.findByIdAndDelete(req.params.promoId)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = promoRouter;