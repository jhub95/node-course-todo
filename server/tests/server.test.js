const expect = require('expect');
const request = require('supertest');

const app = require('./../server').app;
const {TodoTemplate} = require('./../models/todo');

beforeEach((done)=>{
  TodoTemplate.remove({}).then(()=>done());
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
        TodoTemplate.find().then((todos)=>{
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e)=>done(e));

      });
  });
});
