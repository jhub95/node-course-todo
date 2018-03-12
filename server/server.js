require('./config/config.js')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose.js');
const {TodoTemplate} = require('./models/todo');
const {UserTemplate} = require('./models/user');
const {authenticate} = require('./middleware/authenticate.js');

var app = express();
const _ = require('lodash');
const port = process.env.PORT;


app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new TodoTemplate({
      text: req.body.text
    });

    todo.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(`Errors dude: ${e}`);
    });

});

app.delete('/todos/delete/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log(`Problem with id:`, id);
     return res.status(404).send('');
  }
  TodoTemplate.findByIdAndRemove(id).then((todo)=>{
    if(todo == null){
      return res.status(404).send('');
    }
    res.send({todo});
  },(er)=>{
    res.status(400).send('');
  });
});

app.get('/todos', (req,res)=>{
  TodoTemplate.find().then((todos)=>{
    res.send({
      todos
    });
  },(er)=>{
    res.status(400).send(er);
  });

});

app.patch('/todos/update/:id',(req,res)=>{
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

  TodoTemplate.findByIdAndUpdate(id,{
      $set:body
    },{
      new: true
  }).then((todo)=>{
    if(!todo) return res.status(404).send('');
    res.send({
      todo
    });
  },(er)=>{
    res.status(400).send(er);
  });

});


app.get('/todos/:id', (req,res)=>{
  //res.send(req.params);
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log(`Problem with id:`, id);
     return res.status(404).send('');
  }
  TodoTemplate.findById(id).then((todo)=>{
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


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user);
});

app.listen(port,()=>{
  console.log(`started on port ${port}`);
});
module.exports = {app};
