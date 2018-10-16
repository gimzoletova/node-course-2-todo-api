var mongoose = require('mongoose');

mongoose.Promise = global.Promise //אומר למונגוס שנשתמש בספריית פרומיס המובנית בנודג'יאס ולא בספריית פרומיס אחרת
mongoose.connect('mongodb://localhost:27017/todoApp');

module.exports = {
    mongoose
}