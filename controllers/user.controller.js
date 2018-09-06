const axios = require('axios')
const jwt = require('jwt-simple')
const env = require('dotenv').config()

const User = require('mongoose').model('user')
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
        console.log(decoded.user._id)
        User.findOne({ _id: decoded.user._id }, (err, user) => {
            if(err) { return next(err) }
            console.log(user)
            return res.json({user})
        })
    }else{
        return res.json({auth: 'Server Error or Unauthorized'})
    }
}

exports.getProfileDetail = (req, res, next) => {
    if(req.headers.authorization){
        const authorization = req.headers.authorization
        try {
            decoded = jwt.decode(authorization, config.secret)
        } catch (e) {
            return res.json({auth: 'Unauthorized'})
        }
        User.findOne({ _id: decoded.user._id }, (err, user) => {
            if(err) { return next(err) }
            axios(`${process.env.API_3P_USER}${user.username}`).then(response => {
                return res.json(response.data)
            })
        })
    }else{
        return res.json({auth: 'Server Error or Unauthorized'})
    }
}

exports.getProfileWorkplace = (req, res, next) => {
    if(req.headers.authorization){
        const authorization = req.headers.authorization
        try {
            decoded = jwt.decode(authorization, config.secret)
        } catch (e) {
            return res.json({auth: 'Unauthorized'})
        }
        User.findOne({ _id: decoded.user._id }, (err, user) => {
            if(err) { return next(err) }
            axios(`${process.env.API_3P_USER}${user.username}/workplace`).then(response => {
                return res.json(response.data)
            })
        })
    }else{
        return res.json({auth: 'Server Error or Unauthorized'})
    }
}