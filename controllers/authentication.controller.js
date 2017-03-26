const User = require('mongoose').model('user')
const News = require('mongoose').model('news')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser (user) {
    let timestamp = new Date().getTime()
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret)
}

exports.signup = function(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    if (!email || !password) {
        return res.status(422).json({error: "You must provide an email and password"})
    }

    User.findOne({email: email}, function(err, existingUser) {
        if (err) { return next(err) }
        if (existingUser) { return res.status(422).json({error: "Email taken"})}
        let user = new User({
            email: email,
            password: password
        })
        user.save(function(err) {
            if (err) { return next(err) }
            res.json({ user_id: user._id, token: tokenForUser(user)})
        })
    })
}

exports.updateFavoriteNews = function(req, res, next) {
    let favorite_news = req.body.favorite_news
    let user_id = req.body.user_id
    if (!user_id || !favorite_news) {
        return res.status(422).json({error: "You must provide an user_id and favorite_news"})
    }

    User.update(
        { _id: mongoose.Types.ObjectId(user_id) },
        { $push: { favorite_news: mongoose.Types.ObjectId(favorite_news) }},
        function(err, users) {
            if (err) { return next(err) }
            res.json(users)
        }
    )
}

exports.undoFavoriteNews = function(req, res, next) {
    let favorite_news = req.body.favorite_news
    let user_id = req.body.user_id
    if (!user_id || !favorite_news) {
        return res.status(422).json({error: "You must provide an user_id and favorite_news"})
    }

    User.update(
        { _id: mongoose.Types.ObjectId(user_id) },
        { $pull: { favorite_news: mongoose.Types.ObjectId(favorite_news) }},
        function(err, users) {
            if (err) { return next(err) }
            res.json(users)
        }
    )
}

exports.checkFavoriteNews = function(req, res, next) {
    let favorite_news = req.body.favorite_news
    let user_id = req.body.user_id
    if (!user_id || !favorite_news) {
        return res.status(422).json({error: "You must provide an user_id and favorite_news"})
    }

    User.find({$and : [{_id:mongoose.Types.ObjectId(user_id)},{favorite_news:mongoose.Types.ObjectId(favorite_news)}]},
    function(err, User){
        if (err) { return next(err) }
        if (User!="") { res.json(true) }
        else {res.json(false)}
    })
}

exports.getAllFavoriteNews = function(req, res, next) {
    User.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { _id: false, favorite_news: true}, function(err, news) {
        if (err) {
            return next(err)
        } else {
            let favorite = news[0].favorite_news.map((id) => mongoose.Types.ObjectId(id))
            News.find({ _id: {$in: favorite }}, function(err, favorite_news) {
                if (err) {
                    return next(err)
                } else {
                    res.json(favorite_news)
                }
            })
        }
    })
}