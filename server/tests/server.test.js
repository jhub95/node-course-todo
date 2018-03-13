const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const app = require('./../server').app;
const {TodoTemplate} = require('./../models/todo');
const {UserTemplate} = require('./../models/user');

const {pretodos, populateTodos, preUsers, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos',()=>{
  it("should create a new todo",(done)=>{
    var text = 'Text todo testing';
    request(app)
      .post('/todos')
      .set('x-auth', preUsers[0].tokens[0].token)
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
      .set('x-auth', preUsers[0].tokens[0].token)
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

describe('Get users all /todos route',()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('Get by id /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${pretodos[0]._id.toHexString()}`)
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(pretodos[0].text);
      })
      .end(done);
    });

  it('should not return todo created by other user',(done)=>{
    request(app)
      .get(`/todos/${pretodos[1]._id.toHexString()}`)
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

  it('should return 404 if doc not found',(done)=>{
    var tempID = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${tempID}`)
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids',(done)=>{
    request(app)
      .get(`/todos/01010101010`)
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('Delete /todos/delete/:id',()=>{

  it('should remove a todo',(done)=>{
    let tempID = pretodos[1]._id.toHexString();
    request(app)
      .delete(`/todos/delete/${tempID}`)
      .set('x-auth', preUsers[1].tokens[0].token)
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

  it('should not remove someone elses todo',(done)=>{
    let tempID = pretodos[0]._id.toHexString();
    request(app)
      .delete(`/todos/delete/${tempID}`)
      .set('x-auth', preUsers[1].tokens[0].token)
      .expect(404)
      .end((err,res)=>{
        if (err) return done(err);
        TodoTemplate.findById(tempID).then((todos)=>{
          expect(todos).toExist();
          done();
        }).catch((e)=>done(e));
      })
  });

  it('should return 404 if doc not found',(done)=>{
    var tempFakeID = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/delete/${tempFakeID}`)
      .set('x-auth', preUsers[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non object ids',(done)=>{
    request(app)
      .delete(`/todos/delete/01010101010`)
      .set('x-auth', preUsers[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('Patch /todos:id',()=>{

  it('should update the todo',(done)=>{
    const id = pretodos[0]._id.toHexString();
    const texter = 'update from testing';
    request(app)
      .patch(`/todos/update/${id}`)
      .set('x-auth', preUsers[0].tokens[0].token)
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

  it('should not update someone elses todo',(done)=>{
    const id = pretodos[0]._id.toHexString();
    const texter = 'update from testing';
    request(app)
      .patch(`/todos/update/${id}`)
      .set('x-auth', preUsers[1].tokens[0].token)
      .send({'text':texter,'completed':true})
      .expect(404)
      .end(done);
  });

  it('should clear comletedAt when is todo is not completd',(done)=>{
    // grab id of second todo item
    const id = pretodos[1]._id.toHexString();
    const texter = 'update from testing';
    request(app)
      .patch(`/todos/update/${id}`)
      .set('x-auth', preUsers[1].tokens[0].token)
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


describe('Get /users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(200)
      .expect((response)=>{
        expect(response.body._id).toBe(preUsers[0]._id.toHexString());
        expect (response.body.email).toBe(preUsers[0].email);
      })
      .end(done);
  });
  it('should return a 401 if not authenticated', (done)=>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response)=>{
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});


describe('Post /users/add', ()=>{
  it('should create a user',(done)=>{
    const email = 'testingOne@js.com';
    const password = '123dad!';

    request(app)
      .post('/users/add')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err) return done(err);
        UserTemplate.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should return validation erros if add-user request invalid',(done)=>{
    // send invalid email, invalid password expect 401
    const email = 'testingOne@j s.com';
    const password = '123';

    request(app)
      .post('/users/add')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create the user if provided email is already in use',(done)=>{
    // try email that's already in use, expect 401
    request(app)
      .post('/users/add')
      .send(
        {email:preUsers[0].email, password:"preUserspassword"}
      )
      .expect(400)
      .end(done);
  });
});

describe('Post /users/login',()=>{
  it('should login in user and return x-auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:preUsers[1].email, password:preUsers[1].password
      })
      .expect(200)
      .expect((response)=>{
        expect (response.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if (err) return done(err);
        UserTemplate.findById(preUsers[1]._id).then((user)=>{
            expect(user.tokens[1]).toInclude({
              access:'auth',
              token: res.headers['x-auth']
            });
            done();
        }).catch((e)=>done(e));
      });
  });
  it('should reject invalid login',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:preUsers[1].email, password:'erroneous password'
      })
      .expect(400)
      .expect((response)=>{
        expect (response.headers['x-auth']).toNotExist();
      })
      .end((err,res)=>{
        if (err) return done(err);
        UserTemplate.findById(preUsers[1]._id).then((user)=>{
            expect(user.tokens.length).toBe(1);
            done();
        }).catch((e)=>done(e));
      });
  });
});


describe('Delete /users/me/token',()=>{
  it('should remove auth token on logout',(done)=>{
    request(app)
      .delete('/users/me/token')
      .set('x-auth', preUsers[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if (err) return done(err);
        UserTemplate.findById(preUsers[0]._id).then((user)=>{
            expect(user.tokens.length).toBe(0);
            done();
        }).catch((e)=>done(e));
      });
  });
})
