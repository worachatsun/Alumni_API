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
        return res.json({auth: 'Server Error or Unauthorized'})
    }
}