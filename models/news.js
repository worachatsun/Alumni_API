const mongoose = require('mongoose')
const Schema = mongoose.Schema

var newsSchema = new Schema({
    news_title: {
        type: String,
        required: 'Please insert title.'
    },
    news_text: {
        type: String,
        required: 'Please insert news description'
    },
    category: {
        type: String,
        required: 'Please choose caregory of news'
    },
    news_role: {
        type: String,
        required: 'Please choose news role'
    },
    news_favorite: [{
            type: String
    }],
    picture: {
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

module.exports = mongoose.model('news', newsSchema)