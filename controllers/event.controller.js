const Event = require('mongoose').model('event')
const User = require('mongoose').model('user')
const mongoose = require('mongoose')

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
    let coupon = req.body.event_coupon
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
        coupon,
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

exports.joinEvent = function(req, res, next) {
    let join_event = req.body.join_event
    let user_id = req.body.user_id
    Event.find({ _id: mongoose.Types.ObjectId(join_event)}, { _id: false, person_limit: true, event_joiner: true }, function(err, person_limit) {
        if (err) {
            return next(err)
        } else {
            if(person_limit[0].event_joiner.length > parseInt(person_limit[0].person_limit)){
                res.json('Out of length')
            }else{
                Event.update(
                    { _id: mongoose.Types.ObjectId(join_event) },
                    { $push: { event_joiner: mongoose.Types.ObjectId(user_id) }},
                    function(err) {
                        if (err) { return next(err) }
                    }
                )
                User.update(
                { _id: mongoose.Types.ObjectId(user_id) },
                { $push: { join_events: mongoose.Types.ObjectId(join_event) }},
                function(err) {
                    if (err) { return next(err) }
                    User.find({ _id: mongoose.Types.ObjectId(user_id) }, { _id: false, join_events: true}, function(err, event) {
                            if (err) {
                                return next(err)
                            } else {
                                let join = event[0].join_events.map((id) => mongoose.Types.ObjectId(id))
                                Event.find({ _id: {$in: join }}, function(err, join_events) {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        res.json(join_events)
                                    }
                                })
                            }
                        })
                    }
                )
            }
        }
    })
}

exports.eventAvailable = function(req, res, next) {
    let event_id = req.body.event_id
    Event.find({ _id: mongoose.Types.ObjectId(event_id)}, { _id: false, person_limit: true, event_joiner: true }, function(err, person_limit) {
        if (err) {
            return next(err)
        } else {
            if(person_limit[0].event_joiner.length > parseInt(person_limit[0].person_limit)){
                res.json(true)
            }
            res.json(false)
        }
    })
}

exports.joinEventByCoupon = function(req, res, next) {
    let event_id = req.body.event_id
    let coupon = req.body.coupon
    Event.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(event_id), coupon_available: {$in: [coupon]}},
        { $pop: { coupon_available: coupon}},
        { _id: true, coupon_available: true },
        function(err, coupon_found){
            if(err) {return next(err)}
            res.json(coupon_found)
        })
}

exports.addEventCoupon = function(req, res, next) {
    let event_id = req.body.event_id
    let coupon = req.body.coupon
    Event.update(
        { _id: mongoose.Types.ObjectId(event_id) },
        { $push: { coupon_available: coupon }},
        function(err) {
            if (err) { return next(err) }
            res.json(true)
        }
    )
}