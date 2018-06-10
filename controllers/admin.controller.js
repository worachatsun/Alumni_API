const Admin = require('mongoose').model('admin')
const jwt = require('jwt-simple')
const config = require('../config')

exports.getAdminData = (req, res, next) => {
    if(req.headers.authorization){
        const authorization = req.headers.authorization
        try {
            decoded = jwt.decode(authorization, config.secret)
        } catch (e) {
            return res.json({auth: 'Unauthorized'})
        }
        Admin.findOne({ _id: decoded.user._id }, (err, user) => {
            if(err) { return next(err) }
            const dataCreateToken = Object.assign({}, user)
            delete dataCreateToken._doc.password
            return res.json({ user: dataCreateToken._doc })
        })
    }else{
        return res.status(500).json({auth: 'Server Error or Unauthorized'})
    }
}

exports.getAllAdmin = function(req, res, next) {
    Admin.find({}, (err, users) => {
        if (err) { 
            return next(err)
        } else {
            return res.json(users)
        }
    })
}

exports.updateAdminRole = function(req, res, next) {
    console.log(req.body)
    Admin.findByIdAndUpdate(req.body._id, {role: req.body.role}, {new: true}, (err, user) => {
        if (err) { return next(err) }
        Admin.find({}, (err, users) => {
            if (err) { 
                return next(err)
            } else {
                return res.json(users)
            }
        })
    })
}