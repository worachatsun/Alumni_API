const mongoose = require('mongoose')
const Schema = mongoose.Schema

let donationSchema = new Schema({
    project_name: {
        type: String,
        required: 'Please insert project donation'
    },
    project_description: {
        type: String,
        required: 'Please insert donation description'
    },
    picture: {
        type: String,
        required: 'Please choose cover image'
    },
    ways_to_donate: {
        type: String 
    },
    slip_upload: [{
        user_id: {
            type: Schema.ObjectId
        },
        image_url: {
            type: String
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: Schema.ObjectId,
        required: 'Please insert creater'
    },
})

module.exports = mongoose.model('donation', donationSchema)