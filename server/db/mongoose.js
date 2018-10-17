var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //אומר למונגוס שנשתמש בספריית פרומיס המובנית בנודג'יאס ולא בספריית פרומיס אחרת
mongoose.connect(process.env.PORT? 'mongodb://gimzoletova:bgnhrjk1!@ds235053.mlab.com:35053/to_do_app' : 'mongodb://localhost:27017/todoApp');

module.exports = {
    mongoose
}