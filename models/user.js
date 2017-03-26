const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

let validateEmail = (email) => {
    return (/\S+@\S+\.\S+/).test(email)
}

let userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: 'Password is required',
    },
    favorite_news: [{
        type: Schema.ObjectId
    }]
})

userSchema.pre('save', function(next) {
    let user = this
    if(user.isNew || user.isModified('password')){
        bcrypt.genSalt(10, function(err, salt) {
            if (err) { return next(err) }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) { return next(err) }
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

module.exports = mongoose.model('user', userSchema)