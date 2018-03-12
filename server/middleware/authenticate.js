const {UserTemplate} = require('./../models/user.js');

var authenticate = (req,res,next)=>{
  var token = req.header('x-auth');

  UserTemplate.findByToken(token).then((user)=>{
    if (!user){
      return Promise.reject();
      // res.status(401).send('');
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((er)=>{
    res.status(401).send('');
  });
};

module.exports = {authenticate};
