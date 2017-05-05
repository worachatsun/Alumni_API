const mongoose = require('mongoose')
const Schema = mongoose.Schema

let inboxSchema = new Schema({
    room_id: {
        type: Schema.ObjectId,
        required: 'Please insert room Id'
    },
    inbox: [{
        createdAt: Date,
        text: String,
        user: {
            _id: { type: Schema.ObjectId },
            name: { type: String },
            avatar: { type: String }
        }
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

module.exports = mongoose.model('inbox', inboxSchema)