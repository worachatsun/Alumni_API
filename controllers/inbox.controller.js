const Inbox = require('mongoose').model('inbox')
const mongoose = require('mongoose')

exports.createRoomChat = function(req, res, next) {
    let room_id = req.body.room_id
    if (!room_id) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let inbox = new Inbox({
        room_id,
    })

    inbox.save(function(err) {
        if (err) { return next(err) }
        res.json({ inbox })
    })
}

exports.updateInboxChat = function(req, res, next) {
    let room_id = req.body.room_id
    let inbox = req.body.inbox

    Inbox.update(
        {room_id: mongoose.Types.ObjectId(room_id)},
        { $push: { inbox } },
        function(err, inbox) {
            if (err) { return next(err) }
            else{
                Inbox.find({ room_id: mongoose.Types.ObjectId(room_id) }, {_id: false, inbox: true}, function(err, inbox) {
                    if (err) {
                        return next(err)
                    } else {
                        return res.json(inbox[0].inbox.reverse())
                    }
                })
            }
        }
    )
}

exports.fetchInboxChat = function(req, res, next){
    let room_id = req.body.room_id

    Inbox.find({ room_id: mongoose.Types.ObjectId(room_id) }, {_id: false, inbox: true}, function(err, inbox) {
        if (err) {
            return next(err)
        } else {
            return res.json(inbox[0].inbox.reverse())
        }
    })
}