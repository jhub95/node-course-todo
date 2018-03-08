var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose.js');
var {TodoTemplate} = require('./models/todo');
var {UserTemplate} = require('./models/user')
var app = express();
const port = process.env.PORT || 3000;


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

app.listen(port,()=>{
  console.log(`started on port ${port}`);
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

module.exports = {app};
