const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';
const connect = mongoose.connect(url);

connect.then((db) => {

    console.log('Connected correctly to server');

    // var newDish = Dishes({
    //     name: 'Uthappizza',
    //     description: 'test'
    // });
    Dishes.create({                           //cretaed a dish
        name: 'Uthappizza',
        description: 'test'
    })
    //create method will take a document and will store that in the database 
//newdish value will be saved
    //newDish.save()
        .then((dish) => {                                 //updated the dish
            console.log(dish);
            //finding all the dishes
            //we are inserting by id the dish we will insert that will generate an id
            return Dishes.findByIdAndUpdate(dish._id,{
                $set: { description: 'Updated test'}
            },{
                //this will save the updated dishes
                new: true 
           
            }).exec();//this means that the program is executed properly
        })
        //we are pushing the comments of the dish schema in the database
        .then((dish) => {                                                 //pushed a comment to the dish
            console.log(dish);
    
            dish.comments.push({
                rating: 5,
                comment: 'I\'m getting a sinking feeling!',
                author: 'Leonardo di Carpaccio'
            });
    
            return dish.save();
        })
        .then((dish) => {                                         //removed the dish from  the schema
            console.log(dish);

            return Dishes.remove({});
        })
        //this will close the connection to the databse
        //close will losse the connection
        .then(() => {
            return mongoose.connection.close();
        })
        .catch((err) => {
            console.log(err);
        });

});