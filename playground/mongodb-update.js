//הקוד כאן מתאים לגירסה 2 של מונגו. על השינויים הנצרכים לגירסה 3 יש להסתכל על קובץ "מונגודיבי-קונקט" בספרייה זו
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongoDb');        
    }
    console.log('Connected to mongoDb');

    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5bc5bf32fb11e1cf91986bc6")}, {$set: {completed: true}}, {returnOriginal: false})
    //   .then((res) => console.log(res));      
    db.collection('Users').findOneAndUpdate({_id: new ObjectID("5bc5a4f18265cb0d5cef9298")}, {$set: {name: "Tzuri"}, $inc: {age: 1}}, {returnOriginal: false})
      .then((res) => console.log(res));      

    // db.close();
});


