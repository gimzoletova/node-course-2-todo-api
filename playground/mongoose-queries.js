const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

var id = '5bc5eb1c5604d7840be8335a';

if (!ObjectID.isValid(id))
    console.log('Id not valid');
    

// Todo.find({ //מחזיר מערך של אובייקטים כך שאם אני יודע שיש רק אחד אז עדיף להשתמש בפיינד וואן. אם אין מתאים יחזיר מערך ריק
//     _id: id //בגלל שזה מונגוס אז לא צריך להפוך את האיידי כאן לאובייקט ואז ךהכניס אותו לכאן כי מונגוס הופך אותו לאובייקט בשבילנו
//             //. דוגמה להפיכת האיידי לאובייקט יש בקובץ מונגודיבי-אפדייט בספרייה זו
// }).then((todos) => {
//     console.log('todos: ', todos);    
// });

// Todo.findOne({  //מחזיר אובייקט. אם אין אובייקט מתאים מחזיר נאל
//     _id: id 
// }).then((todo) => {
//     console.log('todo: ', todo);    
// });

// Todo.findById(id).then((todo) => {
//     if(!todo)
//         return console.log('ID not found');

//     console.log('todo by ID: ', todo);    
// }).catch((err) => console.log(err.message));

User.findById(id).then((user) => {
    if(!user)
        return console.log('User not found');

    console.log('User by Id: ', user);        
}).catch((err) => console.log(err.message));
