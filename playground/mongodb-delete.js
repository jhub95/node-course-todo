//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err) return console.log("unable to connect to db");
  console.log('connected to mongodb');
  const db = client.db('TodoApp');

  // db.deleteMany
  // db.collection('Users').deleteMany(
  // {
  //     name: "Elizabeth Cathey"
  // }).then((result)=>{
  //   console.log(result);
  // });

  //db.deleteOne
  db.collection('Users').deleteOne(
  {
      _id: new ObjectID("5a9f8bad6d79b43476403ce4")
  }).then((result)=>{
    console.log(result);
  });


  // db.findOneAndDelete
  // db.collection('Todos').findOneAndDelete(
  //   {completed:false})
  //   .then((result)=>{
  //     console.log(result);
  //   });
  //client.close();
});
