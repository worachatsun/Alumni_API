const Event = require('mongoose').model('event')
const User = require('mongoose').model('user')
const mongoose = require('mongoose')

exports.createEvent = function(req, res, next) {
    const { 
        event_name, 
        event_description, 
        person_limit, 
        regis_date_begin, 
        regis_date_end, 
        event_date_begin, 
        event_date_end,
        location,
        event_owner_name,
        event_owner_surname,
        event_owner_tel,
        event_owner_email,
        event_owner_facebook,
        event_owner_line,
        picture,
        created_by
    } = req.body
    //let coupon = req.body.event_coupon
    // if (!event_name || !event_description || !person_limit || !created_by) {
    //     return res.status(422).json({error: "You must provide an data"})
    // }
    
    let event = new Event({
        event_name,
        event_description,
        person_limit,
        regis_date_begin,
        regis_date_end,
        event_date_begin,
        event_date_end,
        location,
        // coupon_available: [
        //     coupon
        // ],
        event_owner: {
            name: event_owner_name,
            surname: event_owner_surname,
            phone: event_owner_tel,
            email: event_owner_email,
            facebook: event_owner_facebook,
            line: event_owner_line
        },
        picture,
        created_by
    })

    event.save(function(err) {
        if (err) { return next(err) }
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
    }).sort({created_at: 'desc'})
}

exports.joinEvent = function(req, res, next) {
    let join_event = req.body.join_event
    let user_id = req.body.user_id
    let capacity = req.body.capacity
    Event.find({ _id: mongoose.Types.ObjectId(join_event), event_joiner: {$elemMatch: {user_id: user_id}}}, function(err, event_data) {
        if(err) {return next(err)}
        if(event_data[0]){
            res.json('joined') 
        }else{
            User.find({ _id: mongoose.Types.ObjectId(user_id), event_joiner: {$in: [mongoose.Types.ObjectId(join_event)]}}, function(err, event_data){
                if(err) {return next(err)}
                if(event_data[0]){
                    res.json('joined') 
                }else{
                    Event.find({ _id: mongoose.Types.ObjectId(join_event)}, { _id: false, person_limit: true, event_joiner: true }, function(err, person_limit) {
                        if (err) {
                            return next(err)
                        } else {
                            // const a = person_limit[0].event_joiner.map(data => data.capacity).reduce((sum, cur) => {
                            //     return sum + cur
                            // })
                            // console.log(a)
                            
                            if(person_limit[0].event_joiner.length > parseInt(person_limit[0].person_limit)){
                                return res.json('Out of length')
                            }else{
                                Event.update(
                                    { _id: mongoose.Types.ObjectId(join_event) },
                                    { $push: { event_joiner: {user_id: mongoose.Types.ObjectId(user_id), capacity} }},
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
            })
        }
    })
}

exports.eventAvailable = function(req, res, next) {
    let event_id = req.body.event_id
    Event.find({ _id: mongoose.Types.ObjectId(event_id)}, { _id: false, person_limit: true, event_joiner: true }, function(err, person_limit) {
        if (err) {
            return next(err)
        } else {
            console.log(person_limit[0].event_joiner.length, parseInt(person_limit[0].person_limit), 'naja')
            if(person_limit[0].event_joiner.length > parseInt(person_limit[0].person_limit)){
                return res.json(false)
            }
            return res.json(true)
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
        }
    )
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

exports.getEventByOffset = function(req, res, next) {
    let limit = req.params.offset || 0
    let offset = req.params.limit || 10
    Event.find({}, {}, { skip: parseInt(req.params.offset), limit: parseInt(req.params.limit) }, function(err, news) {
        if (err) {
            return next(err)
        } else {
            res.json(news)
        }
    }).sort({created_at: 'desc'})
}

exports.getEventsById = function(req, res, next) {
    Event.findById(req.params.id, function(err, events) {
        if (err) {  
            return next(err)
        } else {
            return res.json(events)
        }
    })
}

exports.editEvent = function(req, res, next) {
    const { 
        person_limit, 
        event_name, 
        event_description, 
        regis_date_begin, 
        regis_date_end, 
        event_date_begin, 
        event_date_end, 
        location, 
        _id,
        event_owner_name,
        event_owner_surname,
        event_owner_tel,
        event_owner_email,
        event_owner_facebook,
        event_owner_line,
        picture
    } = req.body
    Event.findByIdAndUpdate(_id, {
        $set: {person_limit, event_name, event_description, regis_date_begin, 
            regis_date_end, picture, event_date_begin, event_date_end, location, 
            event_owner: {name: event_owner_name, surname: event_owner_surname, phone: event_owner_tel, line: event_owner_line, facebook: event_owner_facebook, email: event_owner_email}}}
        , {new: true}, (err, event) => {
        if (err) {  
            return next(err)
        } else {
            return res.json(event)
        }
    })
}

exports.removeEvent = function(req, res, next) {
    const { array_id } = req.body
    Event.remove({_id: {$in: array_id}}, function(err) {
        if (err) { return next(err) }
        Event.find({}, function(err, event) {
            if (err) {
                return next(err)
            } else {
                return res.json(event)
            }
        }).sort({created_at: 'desc'})
    })
}

exports.getExpireEvent = (req, res) => {
    const now = new Date()
    const startOfToday = new Date()
    startOfToday.setDate(startOfToday.getDate() + parseInt(req.params.day))
    Event.find({event_date_end: {$gte: now, $lt: startOfToday }}, function (err, event) { 
        return res.json({event})
    })
}