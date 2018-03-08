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
  text:"second item"
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

describe('Get /todos route',()=>{
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

describe('Get /todos/:id',()=>{
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
