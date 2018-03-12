const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema(
  {
    email:{
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
        validator: (value)=>{
          return validator.isEmail(value);
        },
        message:'{VALUE} is not a valid email'
      }
    },
    password:{
      type: String,
      required: true,
      minlength: 6
    },
    tokens:[
      {
        access:{
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    ]
  }
);

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access:access},'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(()=>{
    return token;
  });
};

UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id','email'])
};

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e){
    // return new Promise((resolve, reject)=>{
    //   reject();
    // });
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'
  })

};

UserSchema.pre('save',function(next){ // a mongoose middleware for UserSchema that runs 'pre' save
  const user = this;
  if(user.isModified('password')){
    //bcrypt user.password = hash VALUE
    bcrypt.genSalt(10,(error,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        console.log(`Hash: ${hash}`);
        user.password = hash;
        console.log("user properties: ",user);
        next();
      });
    });
  } else {
    next();
  }
});

var UserTemplate = mongoose.model('User',UserSchema);

module.exports = {UserTemplate}
