const {ObjectId} = require('mongodb');
const {TodoTemplate} = require('./../../models/todo.js');
const {UserTemplate} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectId();
const userTwoID = new ObjectId();

const pretodos = [{
  _id: new ObjectId(),
  text: "first item",
  _creator: userOneID
},{
  _id: new ObjectId(),
  text:"second item",
  completed:true,
  completedAt: 4444,
  _creator: userTwoID
}];

const populateTodos = (done)=>{
  TodoTemplate.remove({}).then(()=>{
    return TodoTemplate.insertMany(pretodos);
  }).then(()=>done());
};



const preUsers = [{
  _id: userOneID,
  email: "one@js.com",
  password: "userOnePass",
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userOneID,access:'auth'},'abc123').toString()
  }]
},{
  _id: userTwoID,
  email: "two@js.com",
  password: "userTwoPass",
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userTwoID,access:'auth'},'abc123').toString()
  }]
}];

const populateUsers = (done)=>{
  UserTemplate.remove({}).then(()=>{
    const userOne = new UserTemplate(preUsers[0]).save();
    const userTwo = new UserTemplate(preUsers[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(() => done());
};

module.exports = {pretodos, populateTodos, preUsers, populateUsers};
