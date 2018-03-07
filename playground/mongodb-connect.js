//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err) return console.log("unable to connect to db");
  console.log('connected to mongodb');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text:'Something to do first',
  //   completed: false
  // },(err, result)=>{
  //   if(err) return console.log("unable to insert todo");
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  // db.collection('Users').insertOne({
  //   name:'Justin Cathey',
  //   age: 41,
  //   location: 'Florida'
  // },(err, result)=>{
  //   if(err) return console.log("unable to insert user");
  //   console.log(JSON.stringify(result.ops,undefined,2));
  //   const timestamp = result.ops[0]._id.getTimestamp();
  //   console.log(`time: ${timestamp}`)
  //
  // });

  client.close();
});
