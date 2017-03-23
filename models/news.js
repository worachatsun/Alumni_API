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
    // assets: {
    //     picture: {
    //         type: String,
    //         required: "Insert picture"
    //     },
    //     video: {
    //         youtube: {
    //             type: String
    //         }
    //     },
    //     link: {
    //         type: String
    //     }
    // },
    created_at: { },
    updated_at: { }
})

module.exports = mongoose.model('news', newsSchema)