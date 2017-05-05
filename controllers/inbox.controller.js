const Inbox = require('mongoose').model('inbox')

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