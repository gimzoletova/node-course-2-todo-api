const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((res) => { //מוחק מהדיבי לפי הפרמטר, אם שלחת ריק ימחק את הכל. מחזיר אובייקט של המחיקה אבל אין בו את פרטי מה שמחק
//     console.log(res);    
// });

Todo.findOneAndRemove({}).then((res) => console.log('res :', res)); //מוצא את הראשון שמתאים, מוחק אותו ומחזיר את האובייקט הנמחק שתוכל לשחק איתו
// Todo.findByIdAndRemove('5bc7162c584f3f2f20ae9203').then((todo) => { //כנ"ל, רק עם איידי
//     console.log(todo);    
// }) 