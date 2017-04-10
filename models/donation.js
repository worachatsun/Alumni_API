const mongoose = require('mongoose')
const Schema = mongoose.Schema

const donationSchema = new Schema({
    project_name: {
        type: String,
        required: 'Please insert project donation'
    },
    project_description: {
        type: String,
        required: 'Please insert donation description'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: String,
        required: 'Please insert creater'
    },
})

module.exports = mongoose.model('donation', donationSchema)