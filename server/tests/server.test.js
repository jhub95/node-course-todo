const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const app = require('./../server').app;
const {TodoTemplate} = require('./../models/todo');

const pretodos = [{
  _id: new ObjectId(),
  text: "first item"
},{
  _id: new ObjectId(),
  text:"second item",
  completed:true,
  completedAt: 4444
}];

beforeEach((done)=>{
  TodoTemplate.remove({}).then(()=>{
    return TodoTemplate.insertMany(pretodos);
  }).then(()=>done());
});

describe('Post /todos',()=>{
  it("should create a new todo",(done)=>{
    var text = 'Text todo testing';

    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,response)=>{
        if(err) return done(err);
        TodoTemplate.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));

      });
  });

  it('should not create todo with bad data',(done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,response)=>{
        if(err) return done(err);
        TodoTemplate.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));

      });
  });
});

describe('Get all /todos route',()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('Get by id /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${pretodos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(pretodos[0].text);
      })
      .end(done);
    });

  it('should return 404 if doc not found',(done)=>{
    var tempID = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${tempID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids',(done)=>{
    request(app)
      .get(`/todos/01010101010`)
      .expect(404)
      .end(done);
  });
});

describe('Delete /todos/delete/:id',()=>{
  var tempID = pretodos[1]._id.toHexString();
  it('should remove a todo',(done)=>{
    request(app)
      .delete(`/todos/delete/${tempID}`)
      .expect(200)
      .expect((response)=>{
        expect(response.body.todo._id).toBe(tempID);
      })
      .end((err,res)=>{
        if (err) return done(err);
        TodoTemplate.findById(tempID).then((todos)=>{
          expect(todos).toBe(null);
          done();
        }).catch((e)=>done(e));
      })
  });
  it('should return 404 if doc not found',(done)=>{
    var tempFakeID = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/delete/${tempFakeID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids',(done)=>{
    request(app)
      .delete(`/todos/delete/01010101010`)
      .expect(404)
      .end(done);
  });
});


describe('Patch /todos:id',()=>{
  it('should update update the todo',(done)=>{
    // get id
    const id = pretodos[0]._id.toHexString();
    const texter = 'update from testing';
    // do the patch, updating text and setting completed true, 200
    // expect text is changed, completed is true, completedAt is a number (.toBeA(number))
    request(app)
      .patch(`/todos/update/${id}`)
      .send({'text':texter,'completed':true})
      .expect(200)
      .expect((response)=>{
        expect(response.body.todo._id).toBe(id);
        expect(response.body.todo.text).toBe(texter);
        expect(response.body.todo.completed).toBe(true);
        expect(response.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear comletedAt when is todo is not completd',(done)=>{
    // grab id of second todo item
    const id = pretodos[1]._id.toHexString();
    const texter = 'update from testing';
    request(app)
      .patch(`/todos/update/${id}`)
      .send({'text':texter,'completed':false})
      .expect(200)
      .expect((response)=>{
        expect(response.body.todo._id).toBe(id);
        expect(response.body.todo.text).toBe(texter);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});
