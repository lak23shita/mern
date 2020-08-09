const assert =require('assert');


//db is for the databse to connect to the mongodb server
exports.insertDocument = (db,document,collection,callback)=>{
    const coll=db.collection(collection);
    // coll.insert(document,(err,result)=>{
    //     assert.equal(err,null);
    //     result is the property of javascript with n as the no of documents
    //     console.log("Inserted"+result.result.n+
    //     "documnets into the collection" + collection);
    //     callback(result);

    //these are the promises which will reduce the callhell
    return coll.insert(document);
   // });
};

exports.findDocuments = (db,collection,callback)=>{
    const coll=db.collection(collection);
    // coll.find({}).toArray((err,docs)=>{
    //     assert.equal(err,null);
    //     callback(docs);
    // });

    //these are the promises which will reduce the callhell
    return coll.find({}).toArray();
};

exports.removeDocument = (db,document,collection,callback)=>{
    const coll=db.collection(collection);
    // coll.deleteOne(document,(err,result)=>{
    //     //to check that error is not null
    //     assert.equal(err,null);
    //     console.log("Removed the document",document);
    //     callback(result);
    // });
    return coll.deleteOne(document);
};

exports.updateDocument = (db,document,update,collection,callback)=>{
    const coll=db.collection(collection);
    //it takes 3 params first is the document which is updated,second is the feild and third is null and last param is the callback function
    // coll.updateOne(document,{$set:update}, null ,(err,result)=>{
    //     assert.equal(err,null);
    //     console.log("updated the document with",update);
    //     callback(result);
    // });
    return coll.updateOne(document,{ $set: update }, null);
};