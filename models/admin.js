const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

let adminSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'username is required',
    },
    password: {
        type: String,
        required: 'password is required'
    },
    email: {
        type: String,
        unique: true,
        required: 'email is required'
    },
    picture: {
        type: String,
    },
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    role: {
        type: String,
    },
    tel: {
        type: String,
    },
    address: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('admin', adminSchema)