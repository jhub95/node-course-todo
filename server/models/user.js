var mongoose = require('mongoose');

var UserTemplate = mongoose.model('User',{
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  }
});

module.exports = {UserTemplate}
