const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

let studentSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: 'Student ID is required',
    },
    name: {
        type: String,
        required: 'Require Name'
    },
    surname: {
        type: String,
        required: 'Require Surname'
    },
    email: {
        type: String,
        required: 'Require Email'
    },
    faculty: {
        type: String
    },
    tel: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: String
    },
    assets: {
        picture: {
            type: String,
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

module.exports = mongoose.model('student', studentSchema)