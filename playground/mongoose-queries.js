const {mongoose} = require('./../server/db/mongoose');
const {TodoTemplate} = require('./../server/models/todo');
const {UserTemplate} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

var id = '5a9fa9b4b560ad393c32de9c';

// if(!ObjectID.isValid(id)){
//   console.log(`Problem with id: ${id}`)
// }

// TodoTemplate.find({
//   _id:id
// }).then((todos)=>{
//   console.log("Todos", todos);
// });
//
// TodoTemplate.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log("Todo findOne", todo);
// });

// TodoTemplate.findById(id).then((todoByID)=>{
//   if(!todoByID)return console.log("ID not found")
//   console.log("Todo byId", todoByID);
// }).catch((e)=>{
//   console.log(`Problem with id: ${e}`)
// });

UserTemplate.findById(id).then((user)=>{
  if(!user)return console.log("User not found")
  console.log("User: ", user);
}).catch((e)=>{
  console.log(`Problem with id: ${e}`)
});
