var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {TodoTemplate} = require('./models/todo');
var {UserTemplate} = require('./models/user')
var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new TodoTemplate({
      text: req.body.text
    });

    todo.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(e);
    });

});


app.listen(3000,()=>{
  console.log("started on port 3000")
});
