// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongoDb');        
    }
    console.log('Connected to mongoDb');

    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);            
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));        
    // })

    // db.collection('Users').insertOne({
    //     name: 'Tzuri',
    //     age: 44,
    //     location: 'Gimzo'
    // }, (err, res) => {
    //     if (err) {
    //        return console.log('Unable to insert user', err);            
    //     }
    //     // console.log(JSON.stringify(res.ops, undefined, 2));     
    //     console.log(res.ops[0]._id.getTimestamp());     
    // })

    db.close();
});


// הקוד למעלה מתאים למונגו גירסה 2, ואילו כאן למטה קוד לגירסה 3. ההבדל הוא באטריביוט קליינט שנוסף כאן ומשפיע בכמה מקומות

// MongoClient.connect('mongodb://localhost:27017/todoApp', (err, client) => { //שינוי
//     if(err) {
//         return console.log('Unable to connect to mongoDb');        
//     }
//     console.log('Connected to mongoDb');
//     const db = client.db('todoApp'); //שינוי

//     db.collection('Todos').insertOne({
//         text: 'something to do',
//         completed: false
//     }, (err, res) => {
//         if (err) {
//             return console.log('Unable to insert todo', err);            
//         }
//         console.log(JSON.stringify(result.ops, undefined, 2));        
//     })
//     client.close(); //שינוי
// });