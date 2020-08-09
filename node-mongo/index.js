//this will allow us to interact with the mongodb server
const MongoClient = require('mongodb').MongoClient;
//helps to provide a check to the values
const assert =require('assert');
const dboper=require('./operations');

//url from where the mongodb server can be accessed
const url = 'mongodb://localhost:27017/';
//database which we have created earlier
const dbname='confusion';

//connect help us to connect to the mongodb server
//first is the url with which we can connect with the mongodb server
//second one is the callback function
MongoClient.connect(url).then((client)=>{
    //this assert checks wheather the error is null or not
    //assert.equal(err,null);
    console.log('Connected properly proper');

    //db helps us to connect us with the server

    const db=client.db(dbname);
    //const collection =db.collection('dishes');
    //collection.insertOne({"name":"lakshita","description":"what's up"},(err,result)=>{
        //assert.equal(err,null);

        //console.log('after insert');
        //ops means that the insertion is proper and operation is carried out successfully
        //console.log(result.ops);

        //this will return all the collections which are present in the database in the form of docs
        //collection.find({}).toArray((err,docs)=>{
            //assert.equal(err,null);

            //console.log('Found:\n');
            //console.log(docs);

            //drop will drop all the values of the database
            //db.dropCollection('dishes',(err,result)=>{
                //assert.equal(err,null);

                //we will close the database at this point
                //client.close();
            //});
        //});

    //});

    //we have implemented the promises in this which has reduced the call back hell and we use then for that the then catch helps us to find out the error 

    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "dishes")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            return dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");

        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            return dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
                            
            return db.dropCollection("dishes");
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            return client.close();
        })
        .catch((err) => console.log(err));

})
.catch((err) => console.log(err));