//הקוד כאן מתאים לגירסה 2 של מונגו. על השינויים הנצרכים לגירסה 3 יש להסתכל על קובץ "מונגודיבי-קונקט" בספרייה זו
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongoDb');        
    }
    console.log('Connected to mongoDb');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bc5a27c3a49d710d81c06ff')
    // }).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2));
        
    // }, (err)=> {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos count: ' + count);
    // }, (err)=> {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name: 'Tzuri'}).toArray().then((docs) => {
        console.log('Users:');
        // console.log(JSON.stringify(docs, undefined, 2));
        console.log(docs);
    }, (err) => {
        console.log('Unable to fetch users', err);
    })

    db.close();
});


