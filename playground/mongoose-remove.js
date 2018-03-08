const {mongoose} = require('./../server/db/mongoose');
const {TodoTemplate} = require('./../server/models/todo');
const {UserTemplate} = require('./../server/models/user')
const {ObjectID} = require('mongodb');

var id = '5aa0f4c3ddb40951614e1b06';

// remove all
// TodoTemplate.remove({}).then((result)=>{
//   console.log(result);
// });


// TodoTemplate.findOneAndRemove({_id:id}).then((result)=>{
//   console.log(result);
// });

TodoTemplate.findByIdAndRemove(id).then((result)=>{
  console.log(result);
});
