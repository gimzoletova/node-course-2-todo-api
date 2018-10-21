const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const { todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Post /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test text';

        request(app)
          .post('/todos')
          .send({text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text);
          })
          .end((err, res) => {
              if (err) {
                  return done(err);
              }

              Todo.find({text}).then((todos) => {
                  expect(todos.length).toBe(1);
                  expect(todos[0].text).toBe(text);
                  done();
              }).catch((err) => done(err));             
          });
    });

    it('should not create todo with bad data', (done) => {
        request(app)
          .post('/todos')
        //   .send({ggg: "lkj"})
          .send({})
          .expect(400)          
          .end((err, res) => {
              if (err) {
                  return done(err);
              }

              Todo.find().then((todos) => {
                  expect(todos.length).toBe(2);
                  done();
              }).catch((err) => done(err));             
          });
    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2);
          })
          .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
    })

    it('sould return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
          .get(`/todos/${id}`)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 for non-object ids', (done) => {
        request(app)
          .get('/todos/123')
          .expect(404)
          .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
          .delete(`/todos/${id}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(id)
          })
          .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(id).then((res) => {
                expect(res).toNotExist();
                done();
            }).catch((err) => done(err));
          })
    });

    it('sould return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
          .delete(`/todos/${id}`)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 for non-object ids', (done) => {
        request(app)
          .delete('/todos/123')
          .expect(404)
          .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        var id = todos[0]._id.toHexString();
        var body = {text: "test true update", completed: true};
        request(app)
          .patch(`/todos/${id}`)
          .send(body)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
          })
          .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var body = {text: "test false update", completed: false};
        request(app)
          .patch(`/todos/${id}`)
          .send(body)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
          })
          .end(done);
    });
});

describe('GET/users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)//setting a header
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
          })
          .end(done);        
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
          .get('/users/me')
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({})
          })
          .end(done);
    });
});

describe('Post /users', () => {
    it('Should create a user', (done) => {
        let email = 'example@example.com', password = 'example';

        request(app)
          .post('/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
              expect((res.headers['x-auth'])).toExist();
              expect(res.body._id).toExist();
              expect(res.body.email).toBe(email);
          })
          .end((err) => {
              if(err)
                return done(err)

              User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
              }).catch((err) => done(err));
          });
    });

    it('should return err if req invalid', (done) => {
        request(app)
          .post('/users')
          .send({email: 'rty', password: 'dfg'})
          .expect(400)
          .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
          .post('/users')
          .send({email: users[0].email, password: '123456'})
          .expect(400)
          .end(done)
    });
});

describe('Post /users/login', () => {
    it('should login user and return token', (done) => {
        request(app)
          .post('/users/login')
          .send({
            email: users[1].email,
            password: users[1].password
          })
          .expect(200)
          .expect((res) => {
              expect(res.headers['x-auth']).toExist()
          })
          .end((err, res) => {
            if(err)
                return done(err);
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((err) => done(err));
          });
    });

    it('should reject invalid login', (done) => {
            request(app)
              .post('/users/login')
              .send({
                email: users[1].email,
                password: "justWrong"
              })
              .expect(400)
              .expect((res) => {
                  expect(res.headers['x-auth']).toNotExist()
              })
              .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
              });
    });
    
});
