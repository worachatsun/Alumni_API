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
        type: String
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
    career_owner: {
        name: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String
        },
        facebook: {
            type: String
        },
        phone: {
            type: String
        },
        line: {
            type: String
        }
    },
    picture: {
        type: String
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
        type: Schema.ObjectId,
        required: 'Please insert creater'
    },
    expiry_date: {
        type: Date,
    }
})

module.exports = mongoose.model('career', carrerSchema)