const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const shetenBaroshId = new ObjectID();
const shakranId = new ObjectID();
const users = [{
    _id : shetenBaroshId,
    email: 'aharon@barak.com',
    password: 'shetenBarosh',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: shetenBaroshId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},
{
    _id: shakranId,
    email: 'uriel@lin.com',
    password: 'shakran',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: shakranId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save();//created a promise
        let user2 = new User(users[1]).save();//created a promise

        return Promise.all([user1, user2]) //waits for all the promises in the array before running "then"
    }).then(() => done());
}

const todos = [{
    _id : new ObjectID(),
    text: '1st test todo', 
    _creator: shetenBaroshId
}, {
    _id : new ObjectID(),
    text: '2nd test todo',
    completed: true,
    completedAt: 1234,
    _creator:shakranId
}];

const populateTodos = ((done) => {
    Todo.remove({}).then(() => Todo.insertMany(todos)).then(() => done());
});

module.exports = {
    users,
    populateUsers,
    todos,
    populateTodos
}