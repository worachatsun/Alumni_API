const News = require('mongoose').model('news')

const newDate = new Date()

exports.createNews = function(req, res, next) {
    let news_title = req.body.news_title
    let news_text = req.body.news_text
    let category = req.body.category
    let news_role = req.body.news_role
    if (!news_title || !news_text || !category || !news_role) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let news = new News({
        news_title,
        news_text,
        category,
        news_role,
        created_at: newDate,
        updated_at: newDate
    })

    news.save(function(err) {
        if (err) { return next(err+"sd") }
        res.json({ news })
    })
}

exports.getNews = function(req, res, next) {
    News.find({}, function(err, news) {
        if (err) {
            return next(err)
        } else {
            res.json(news)
        }
    })
}