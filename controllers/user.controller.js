const User = require('mongoose').model('user')

exports.getAllUser = function(req, res, next) {
    User.find({}, (err, users) => {
        if (err) { 
            return next(err)
        } else {
            return res.json(users)
        }
    })
}

exports.getUserById = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) {  
            return next(err)
        } else {
            return res.json(user)
        }
    })
}