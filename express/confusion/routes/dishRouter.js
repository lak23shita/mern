// ---> Contains Rest API for /dishes & /dishes/:dishId
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const authenticate = require('../authenticate');

const Dishes =require('../models/dishes');

// ---> Helps in designing differents routers
const dishRouter = express.Router();
// ---> Using middleware bodyParser to parse the JSON Body taht can be accessed by using req.body
dishRouter.use(bodyParser.json());

//------------- CRUD FOR ALL DISHES ----------------

dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send all the dishes to you!');
    Dishes.find({})
    //as it is an array thats why we are taking it as dishes
    //we are returning the json application that is why we have returned the json
    
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//verify the user using the jwt,this is the middleware this is the barrier for the post
.post(authenticate.verifyUser, (req, res, next) => {
    //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    //aswe have send all the values to the body in form of json format we will send that only
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting all dishes');
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// ----------- CRUD FOR DISHES WITH DISH ID -------------

dishRouter.route('/:dishId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
// ---> Does not support push operation on a particular dish since it exists already, rather you you have to update using PUT
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    // res.write('Updating the dish: ' + req.params.dishId + '\n'); // res.write Can be use to add a line to reply message
    // res.end('Will update the dish: ' + req.body.name + 
    //         ' with details: ' + req.body.description);
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete(authenticate.verifyUser,(req, res, next) => {
    //res.end('Deleting dish: ' + req.params.dishId);
    //this params stand for the id we want to delete
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-type','applictaion/json');
        //json will take the values and put that back to the server
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = dishRouter;


dishRouter.route(':dishId/comments')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
.get((req,res,next) => {
    //res.end('Will send all the dishes to you!');
    Dishes.findById(req.params.dishId)
    //as it is an array thats why we are taking it as dishes
    //we are returning the json application that is why we have returned the json
    
    .then((dish)=>{
        if(dish!=null){
            res.statusCode=200;
            res.setHeader('Content-type','applictaion/json');
            //json will take the values and put that back to the server
            res.json(dish.comments);
        }
        //this will envoke the error handler in the app.js file
       else{
           err=new Error('Dish '+req.params.dishId+'not found');
           err.status=404;
           return next(err);
       }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req, res, next) => {
    //res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    //aswe have send all the values to the body in form of json format we will send that only
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            
            //json will take the values and put that back to the server
            //this will push the comments from the body
            //and save the updated dish
            //than passing the updated dish in jason format 
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
            res.statusCode=200;
            res.setHeader('Content-type','applictaion/json');
            res.json(dish);
        },(err)=>next(err));
            
        }
        //this will envoke the error handler in the app.js file
       else{
           err=new Error('Dish '+req.params.dishId+'not found');
           err.status=404;
           return next(err);
       }
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'+req.params.dishId+ '/comments');
})

.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// ----------- CRUD FOR DISHES WITH DISH ID -------------

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //we are sending a specific comment
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports =dishRouter;