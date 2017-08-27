const User = require('mongoose').model('user')
const Admin = require('mongoose').model('admin')
const News = require('mongoose').model('news')
const Event = require('mongoose').model('event')
const Student = require('mongoose').model('student')
const Inbox = require('mongoose').model('inbox')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')
const config = require('../config')

function tokenForUser (user) {
    const {_id, uid, name, surname, assets} = user
    let timestamp = new Date().getTime()
    return jwt.encode({
        user: user,
        iat: timestamp
    }, config.secret)
}

exports.signin = function(req, res, next) {
    let user = req.user
    res.send({token: tokenForUser(user), user_id: user._id})
}

exports.adminSignin = function(req, res, next) {
    const { username, password } = req.body 

    Admin.findOne({username}, (err, user) => {
        if(err) { return res.json(err) }
        if(user) {
            bcrypt.compare(password, user.password, (err, isValid) => {
                if(isValid) {
                    const dataCreateToken = Object.assign({}, user)
                    delete dataCreateToken._doc.password
                    return res.json({ token: tokenForUser(dataCreateToken._doc), user: dataCreateToken._doc })
                }else
                    return res.json('Incorrect password') 
            })
        }else
            return res.json('Incorrect username or email') 
    })
}

exports.adminRegister = (req, res) => {
    const { username, password } = req.body 

    const admin = new Admin({
        username
    })

    bcrypt.hash(password, 10).then((hash) => {
        admin.password = hash
        admin.save((err, user) => {
            if(err) { return res.json(err) }
            const dataCreateToken = Object.assign({}, user)
            delete dataCreateToken._doc.password
            return res.json({ token: tokenForUser(dataCreateToken._doc), user: dataCreateToken._doc }).code(201)
        })
    })
}

exports.signinLdap = function(req, res, next) {
    let name = req.user.displayName
    let surname = req.user.givenName
    let uid = req.user.uid
    let email = req.user.mail
    let role = 'alumni'
    let picture = "https://www4.sit.kmutt.ac.th/files/story_pictures/IMG_0027.jpg"
    let faculty = req.user.homeDirectory.split("/")[2]
    if (!uid || !name || !surname) {
        return res.status(422).json({error: "You must provide an uid, name and surname"})
    }

    User.findOne({uid}, function(err, existingUser) {
        if (err) { return next(err) }
        const {_id, uid, name, surname, assets} = existingUser
        if (existingUser) { 
            return res.json({user: existingUser, token: tokenForUser({_id, uid, name, surname, assets})})
        }
        let user = new User({
            uid,
            name,
            surname,
            email,
            role,
            faculty,
            assets: {
                picture
            }
        })
        user.save(function(err, user) {
            if (err) { return next(err) }
            let inbox = new Inbox({
                room_id: user._id
            })

            inbox.save(function(err) {
                
            })
            return res.json({user, token: tokenForUser(user)})
        })
    })
}

exports.signup = function(req, res, next) {
    let email = req.body.email
    let password = req.body.password
    let name = req.body.name
    let surname = req.body.surname
    let tel = req.body.tel
    let address = req.body.address
    let picture = req.body.picture
    if (!email || !password) {
        return res.status(422).json({error: "You must provide an email and password"})
    }

    User.findOne({email: email}, function(err, existingUser) {
        if (err) { return next(err) }
        if (existingUser) { return res.status(422).json({error: "Email taken"})}
        let user = new User({
            email,
            password,
            name,
            surname,
            tel,
            address,
            assets: {
                picture
            }
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
            else{
                User.find({ _id: mongoose.Types.ObjectId(user_id) }, { _id: false, favorite_news: true}, function(err, news) {
                    if (err) {
                        return next(err)
                    } else {
                        let favorite = news[0].favorite_news.map((id) => mongoose.Types.ObjectId(id))
                        News.update(
                            { _id: mongoose.Types.ObjectId(favorite_news) },
                            { $push: { news_favorite: mongoose.Types.ObjectId(user_id) }}, function(err) {
                            if (err) {return next(err)}}
                        )
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
            else{
                User.find({ _id: mongoose.Types.ObjectId(user_id) }, { _id: false, favorite_news: true}, function(err, news) {
                    if (err) {
                        return next(err)
                    } else {
                        let favorite = news[0].favorite_news.map((id) => mongoose.Types.ObjectId(id))
                        News.update(
                            { _id: mongoose.Types.ObjectId(favorite_news) },
                            { $pull: { news_favorite: mongoose.Types.ObjectId(user_id) }}, function(err) {
                            if (err) {return next(err)}}
                        )
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

exports.getJoinedEvent = function(req, res, next) {
    User.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { _id: false, join_events: true}, function(err, event) {
        if (err) {
            return next(err)
        } else {
            let joined = event[0].join_events.map((id) => mongoose.Types.ObjectId(id))
            Event.find({ _id: {$in: joined }}, function(err, join_events) {
                if (err) {
                    return next(err)
                } else {
                    res.json(join_events)
                }
            })
        }
    })
}