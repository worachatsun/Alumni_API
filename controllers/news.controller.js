const News = require('mongoose').model('news')

exports.createNews = function(req, res, next) {
    let news_title = req.body.news_title
    let news_text = req.body.news_text
    let category = req.body.category
    let news_role = req.body.news_role
    let picture = req.body.picture
    let youtube = req.body.youtube
    let link = req.body.link
    if (!news_title || !news_text || !category || !news_role) {
        return res.status(422).json({error: "You must provide an data"})
    }

    let news = new News({
        news_title,
        news_text,
        category,
        news_role,
        assets: {
            picture,
            video:{
                youtube
            },
            link
        }
    })

    news.save(function(err) {
        if (err) { return next(err) }
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