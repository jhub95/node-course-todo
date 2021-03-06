require('./config/config.js')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose.js');
const {TodoTemplate} = require('./models/todo');
const {UserTemplate} = require('./models/user');
const {authenticate} = require('./middleware/authenticate.js');
const bcrypt = require('bcryptjs');

var app = express();
const _ = require('lodash');
const port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos',authenticate,(req,res)=>{
    var todo = new TodoTemplate({
      text: req.body.text,
      _creator: req.user._id
    });

    todo.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(`Errors dude: ${e}`);
    });

});

app.delete('/todos/delete/:id', authenticate, (req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log(`Problem with id:`, id);
     return res.status(404).send('');
  }
  TodoTemplate.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
    if(todo == null) return res.status(404).send('');
    res.send({todo});
  },(er)=>{
    res.status(400).send('');
  });
});

app.get('/todos', authenticate, (req,res)=>{
  TodoTemplate.find({
    _creator: req.user._id
  }).then((todos)=>{
    res.send({
      todos
    });
  },(er)=>{
    res.status(400).send(er);
  });

});

app.patch('/todos/update/:id', authenticate, (req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);
  if(!ObjectID.isValid(id)){
    console.log(`Problem with id:`, id);
     return res.status(404).send('');
  }
  if(_.isBoolean(body.completed) && body.completed == true){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  TodoTemplate.findOneAndUpdate({
    _id:id,
    _creator: req.user._id
  },{
      $set:body
    },{
      new: true
  }).then((todo)=>{
    if(!todo) return res.status(404).send('');
    res.send({todo});
  },(er)=>{
    res.status(400).send(er);
  });
});


app.get('/todos/:id', authenticate, (req,res)=>{
  //res.send(req.params);
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log(`Problem with id:`, id);
     return res.status(404).send('');
  }
  TodoTemplate.findOne({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
    if(todo == null){
      return res.status(404).send('');
    }
    res.send({todo});
  },(er)=>{
    res.status(400).send('');
  });
});

app.post('/users/add',(req,res)=>{
  var postInfo = _.pick(req.body,['email','password']);
  var newUser = new UserTemplate({
    email: postInfo.email,
    password: postInfo.password
    // instead of manually adding these properties, we could just do
    // UserTemplate(postInfo) since it contains that data anyway
  });

  newUser.save().then(()=>{
    return newUser.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(newUser);
  }).catch((e)=>{
    res.status(400).send('');
  });

});

app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);
});

app.post('/users/login',(req,res)=>{
   const {email,password} = _.pick(req.body,['email','password']);
   UserTemplate.findByCredentials(email,password).then((user)=>{
     return user.generateAuthToken().then((token)=>{
       res.header('x-auth',token).send(user);
     });
   }).catch((err)=>{
     res.status(400).send('');
   });
});

app.delete('/users/me/token', authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send('');
  }).catch((e)=>res.status(400).send(''));
});

app.listen(port,()=>{
  console.log(`started on port ${port}`);
});
module.exports = {app};
