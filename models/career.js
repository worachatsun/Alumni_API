const mongoose = require('mongoose')
const Schema = mongoose.Schema

let carrerSchema = new Schema({
    career_name: {
        type: String,
        required: 'Please insert career name'
    },
    career_description: {
        type: String,
        required: 'Please insert description'
    },
    qualification: {
        type: String,
        required: 'Please insert Qualification'
    },
    position: {
        type: String,
        required: 'Please insert Position'
    },
    company: {
        type: String,
        required: 'Please insert Company'
    },
    capacity: {
        type: String
    },
    salary: {
        type: String,
    },
    career_joiner: [{
        _id: {
            type: Schema.ObjectId,
        },
        name: {
            type: String,
        }
    }],
    assets: {
        picture: {
            type: String,
            required: 'Please choose cover image'
        }
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
        _id: {
            type: Schema.ObjectId,
            required: 'Please insert creater'
        },
        name: {
            type: String,
            required: 'Please insert creater name'
        }
    },
})

module.exports = mongoose.model('career', carrerSchema)