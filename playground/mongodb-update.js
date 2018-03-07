//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err) return console.log("unable to connect to db");
  console.log('connected to mongodb');
  const db = client.db('TodoApp');
  const colTODO = db.collection('Todos');
  const colUSERS = db.collection('Users');

  // db.findOneAndUpdate
  colUSERS.findOneAndUpdate(
    {
      _id: new ObjectID("5a9f88cc4580f1340c0f1ded")
    },{
      $set:{
        name:"Daniel Cathey"
      },
      $inc:{
        age: 1
      }
    },{
      returnOriginal:false
    })
    .then((result)=>{
      console.log(result);
    });

    // colTODO.findOneAndUpdate(
    //   {
    //     _id: new ObjectID("5a9f9983ddb40951614dfdb3")
    //   },{
    //     $set:{
    //       completed:true
    //     }
    //   },{
    //     returnOriginal:false
    //   })
    //   .then((result)=>{
    //     console.log(result);
    //   });

  //client.close();
});
