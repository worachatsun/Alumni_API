const AuthenticationController = require('../controllers/authentication.controller')
const NewsController = require('../controllers/news.controller')

var router = require('express').Router()

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected')
    .get(protected)

router.route('/signup')
    .post(AuthenticationController.signup)

router.route('/createNews')
    .post(NewsController.createNews)

module.exports = function(app) {
    app.use('/v1', router)
}