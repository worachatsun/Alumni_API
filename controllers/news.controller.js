const News = require('mongoose').model('news')
const mongoose = require('mongoose')

exports.createNews = function(req, res, next) {
    const { 
        news_title, 
        news_text, 
        category, 
        news_role, 
        picture, 
        expiry_date,
        news_owner_surname,
        news_owner_name,
        news_owner_tel,
        news_owner_facebook,
        news_owner_line,
        news_owner_email
    } = req.body
    if (!news_title || !news_text || !category || !news_role) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let news = new News({
        news_title,
        news_text,
        category,
        news_role,
        picture,
        expiry_date,
        news_owner: {
            name: news_owner_name,
            surname: news_owner_surname,
            phone: news_owner_tel,
            email: news_owner_email,
            facebook: news_owner_facebook,
            line: news_owner_line,
        }
    })

    news.save(function(err) {
        if (err) { return next(err) }
        res.json({ news })
    })
}

exports.getNewsByOffset = function(req, res, next) {
    let limit = req.params.offset || 0
    let offset = req.params.limit || 10
    const now = new Date().toISOString()
    console.log(new Date())
    News.find({}, {}, { skip: parseInt(req.params.offset), limit: parseInt(req.params.limit), expiry_date: {$gte: new Date()} }, function(err, news) {
        if (err) {
            return next(err)
        } else {
            res.json(news)
        }
    }).sort({created_at: 'desc'})
}

exports.getNews = function(req, res, next) {
    News.find({}, function(err, news) {
        if (err) {
            return next(err)
        } else {
            res.json(news)
        }
    }).sort({created_at: 'desc'})
}

exports.getNewsByFaculty = function(req, res, next) {
    let limit = req.params.offset || 0
    let offset = req.params.limit || 10
    News.find({ news_role: req.params.faculty}, {}, { skip: parseInt(req.params.offset), limit: parseInt(req.params.limit) }, function(err, news) {
        if (err) {
            return next(err)
        } else {
            res.json(news)
        }
    }).sort({created_at: 'desc'})
}


exports.getFavoriteCount = function(req, res, next) {
    News.find({ _id: mongoose.Types.ObjectId(req.params.id)}, { _id: false, news_favorite: true }, function(err, news) {
        if (err) {
            return next(err)
        } else {
            return res.json(news[0].news_favorite.length)
        }
    })
}

exports.getNewsById = function(req, res, next) {
    News.findById(req.params.id, function(err, news) {
        if (err) {  
            return next(err)
        } else {
            return res.json(news)
        }
    })
}

exports.editNews = function(req, res, next) {
    const { 
        news_title, 
        news_text, 
        news_role, 
        category, 
        expiry_date,
        news_owner_surname,
        news_owner_name,
        news_owner_tel,
        news_owner_facebook,
        news_owner_line,
        news_owner_email
    } = req.body
    News.findByIdAndUpdate(req.body._id, {$set: {news_title, news_text, news_role, category, expiry_date,
        news_owner: {name: news_owner_name, surname: news_owner_surname, phone: news_owner_tel, line: news_owner_line, facebook: news_owner_facebook, email: news_owner_email}}}, {new: true}, (err, news) => {
        if (err) {  
            return next(err)
        } else {
            return res.json(news)
        }
    })
}

exports.removeNews = function(req, res) {
    const { array_id } = req.body
    News.remove({_id: {$in: array_id}}, function(err) {
        if (err) { return next(err) }
        return res.json({ status: 'success' })
    })
}