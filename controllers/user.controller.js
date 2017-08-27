const User = require('mongoose').model('user')
const jwt = require('jwt-simple')
const config = require('../config')

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

exports.getUserData = (req, res, next) => {
    if(req.headers.authorization){
        const authorization = req.headers.authorization
        try {
            decoded = jwt.decode(authorization, config.secret)
        } catch (e) {
            return res.json({auth: 'Unauthorized'})
        }
        User.findOne({ _id: decoded._id }, (err, user) => {
            if(err) { return next(err) }
            return res.json({user})
        })
    }else{
        return res.json({auth: 'Server Error or Unauthorized'})
    }
}