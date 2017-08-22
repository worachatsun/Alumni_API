const mongoose = require('mongoose')
const Schema = mongoose.Schema

var eventSchema = new Schema({
    event_name: {
        type: String,
        required: 'Please insert title.'
    },
    event_description: {
        type: String,
        required: 'Please insert news description'
    },
    person_limit: {
        type: String,
        default: 'Unlimit'
    },
    regis_date_begin: {
        type: Date,
        required: 'Please choose Register Date'
    },
    regis_date_end: {
        type: Date,
        required: 'Please choose Register Date'
    },
    event_date_begin: {
        type: Date,
        required: 'Please choose Event Date'
    },
    event_date_end: {
        type: Date,
        required: 'Please choose Event Date'
    },
    location: {
        type: String,
        required: 'Please insert location'
    },
    event_owner: {
        id: {
            type: String,
        },
        name: {
            type: String,
            required: 'Please insert event owner'
        },
        surname: {
            type: String,
            required: 'Please insert event owner'
        },
        email: {
            type: String,
        },
        facebook: {
            type: String,
        },
        phone: {
            type: String,
        },
        line: {
            type: String,
        }
    },
    picture: {
        type: String,
    },
    event_joiner: [{
            type: String
    }],
    coupon_available: [{
        type: String
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

module.exports = mongoose.model('event', eventSchema)