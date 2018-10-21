const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        unique: true,
        // validate: (value) => {
        //     return validator.isEmail(value);
        // }, 
        // message: '{VALUE} is not a valid email'
        // }
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {    
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'qazwsx').toString();

    user.tokens = [...user.tokens, {access, token}];
    // user.tokens = user.tokens.concat([{access, token}]); //instead of < user.tokens.push({access, token}); > that could make problems with mongodb
    // user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {    
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'qazwsx');
    } catch(err) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); instead of this we can just write:
        return Promise.reject();
    }

    return User.findOne({
       '_id': decoded._id,
       'tokens.token' : token,
       'tokens.access' : 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if(!user)
            return Promise.reject();

        return new Promise((resolve, reject) => {
            return bcrypt.compare(password, user.password, (err, res) => {                
                if (res) {
                    resolve(user);
                }
                reject();
            });                
        });
    })
};

UserSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;   
                next();
            });
        });
    }
    else {next();}  
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}