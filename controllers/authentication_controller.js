const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser (user) {
    var timestamp = new Date().getTime()
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret)
}

exports.signup = function(req, res, next) {
    console.log(req)
    var email = req.body.email
    var password = req.body.password
    if (!email || !password) {
        return res.status(422).json({error: "You must provide an email and password"})
    }

    User.findOne({email: email}, function(err, existingUser) {
        if (err) { return next(err) }
        if (existingUser) { return res.status(422).json({error: "Email taken"})}
        var user = new User({
            email: email,
            password: password
        })
        user.save(function(err) {
            if (err) { return next(err) }
            res.json({ user_id: user._id, token: tokenForUser(user)})
        })
    })
}