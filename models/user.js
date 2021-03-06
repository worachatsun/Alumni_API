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
        required: 'Require Email',
        index: true
    },
    username: {
        type: String,
        unique: true,
        required: 'Require Username',
        index: true
    },
    password: {
        type: String,
        required: 'Require Password'
    },
    faculty: {
        type: String
    },
    name: {
        type: String,
        required: 'Require Name'
    },
    surname: {
        type: String,
        required: 'Require Surname'
    },
    tel: {
        type: String,
    },
    role: {
        type: String
    },
    address: {
        type: String,
    },
    assets: {
        picture: {
            type: Object,
        }
    },
    graduate_histories: [{
        position: {
            type: String
        },
        place: {
            type: String
        }
    }],
    career_histories: [{
        position: {
            type: String
        },
        place: {
            type: String
        }
    }],
    award_histories: [{
        position: {
            type: String
        },
        place: {
            type: String
        }
    }],
    favorite_news: [{
        type: Schema.ObjectId
    }],
    join_events: [{
        type: Schema.ObjectId
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
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

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err) }
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('user', userSchema)