var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //אומר למונגוס שנשתמש בספריית פרומיס המובנית בנודג'יאס ולא בספריית פרומיס אחרת
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}