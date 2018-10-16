//הקוד כאן מתאים לגירסה 2 של מונגו. על השינויים הנצרכים לגירסה 3 יש להסתכל על קובץ "מונגודיבי-קונקט" בספרייה זו
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongoDb');        
    }
    console.log('Connected to mongoDb');

    // db.collection('Todos').deleteMany({text: 'eat'}).then((result)=>console.log(result.result));
    // db.collection('Todos').deleteOne({text: 'eat'}).then((result)=>console.log(result.result));
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>console.log(result));

    db.collection('Users').deleteMany({name: 'Tzuri'}).then((res) => console.log(res.result));
    db.collection('Users').findOneAndDelete({_id: new ObjectID("5bc5abafdb44671120365bbd")}).then((res) => console.log(res));
    
    


    // db.close();
});


