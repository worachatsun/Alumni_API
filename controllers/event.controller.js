const Event = require('mongoose').model('event')

exports.createEvent = function(req, res, next) {
    let event_name = req.body.event_name
    let event_description = req.body.event_description
    let person_limit = req.body.person_limit
    let regis_date_begin = req.body.regis_date_begin
    let regis_date_end = req.body.regis_date_end
    let event_date_begin = req.body.event_date_begin
    let event_date_end = req.body.event_date_end
    let location = req.body.location
    let event_owner_id = req.body.event_owner_id
    let picture = req.body.picture
    let created_by = req.body.created_by
    if (!event_name || !event_description || !person_limit || !created_by) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let event = new Event({
        event_name,
        event_description,
        person_limit,
        regis_date_begin,
        regis_date_end,
        event_date_begin,
        event_date_end,
        location,
        event_owner: {
            owner_id: event_owner_id
        },
        assets: {
            picture,
        },
        created_by
    })

    event.save(function(err) {
        if (err) { return next(err+"asd") }
        res.json({ event })
    })
}

exports.getEvent = function(req, res, next) {
    Event.find({}, function(err, event) {
        if (err) {
            return next(err)
        } else {
            res.json(event)
        }
    })
}