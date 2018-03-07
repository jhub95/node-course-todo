//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err) return console.log("unable to connect to db");
  console.log('connected to mongodb');
  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id:new ObjectID('5a9f880165909133eff1d20b')
  // }).toArray().then((docs)=>{
  //   console.log("Todos");
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err)=>{
  //   console.log("unable to fetch todos",err)
  // });

  db.collection('Users').find({
    name:"Elizabeth Cathey"
  }).toArray().then((docs)=>{
    console.log("Todos");
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log("unable to fetch todos",err)
  });

  // db.collection('Todos').find().count().then((counts)=>{
  //   console.log(`Todos count: ${counts}`);
  //
  // },(err)=>{
  //   console.log("unable to fetch todos",err)
  // });

  //client.close();
});
