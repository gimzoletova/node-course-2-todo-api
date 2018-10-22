const expect = require('expect'); // changed to v21.1.0 but in commented lines it's according to v1.20.2
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
          .set('x-auth', users[0].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(1);
          })
          .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
    }),

    it('should not return todo doc created by other student', (done) => {
        request(app)
          .get(`/todos/${todos[1]._id.toHexString()}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)          
          .end(done);
    }),

    it('sould return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
          .get(`/todos/${id}`)
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 for non-object ids', (done) => {
        request(app)
          .get('/todos/123')
          .set('x-auth', users[0].tokens[0].token)
          .expect(404)
          .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
          .delete(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo._id).toBe(id)
          })
          .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(id).then((res) => {
                // expect(res).toNotExist();
                expect(res).toBeFalsy();
                done();
            }).catch((err) => done(err));
          })
    });

    it('shouldn\'t remove a todo that doesn\'t belong to user', (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
          .delete(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(404)
          .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(id).then((res) => {
                // expect(res).toExist();
                expect(res).toBeTruthy();
                done();
            }).catch((err) => done(err));
          })
    });

    it('sould return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
          .delete(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(404)
          .end(done);
    });
    
    it('should return 404 for non-object ids', (done) => {
        request(app)
          .delete('/todos/123')
          .set('x-auth', users[1].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
          .send(body)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(true);
            // expect(res.body.todo.completedAt).toBeA('number');            
            expect(typeof res.body.todo.completedAt).toBe('number');
          })
          .end(done);
    });

    it('should not update todo created by other user', (done) => {
        var id = todos[1]._id.toHexString();
        var body = {text: "test true update", completed: true};
        request(app)
          .patch(`/todos/${id}`)
          .set('x-auth', users[0].tokens[0].token)
          .send(body)
          .expect(404)          
          .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var body = {text: "test false update", completed: false};
        request(app)
          .patch(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .send(body)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(false);
            // expect(res.body.todo.completedAt).toNotExist();
            expect(res.body.todo.completedAt).toBeFalsy();
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
              expect((res.headers['x-auth'])).toBeTruthy();
              expect(res.body._id).toBeTruthy();
              expect(res.body.email).toBe(email);
          })
          .end((err) => {
              if(err)
                return done(err)

              User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                // expect(user.password).toNotBe(password);
                expect(user.password).not.toBe(password);
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
            // expect(res.headers['x-auth']).toExist()
            expect(res.headers['x-auth']).toBeTruthy()
        })
          .end((err, res) => {
            if(err)
                return done(err);
            
            User.findById(users[1]._id).then((user) => {
                // expect(user.tokens[1]).toInclude({
                expect(user.toObject().tokens[1]).toMatchObject({
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
                  expect(res.headers['x-auth']).toBeFalsy()
              })
              .end((err, res) => {
                if(err)
                    return done(err);
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
              });
    });
    
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
          .delete('/users/me/token')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .end((err, res) => {
            if(err)
                return done(err);
            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((err) => done(err));
          });
    })
});