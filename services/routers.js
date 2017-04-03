const AuthenticationController = require('../controllers/authentication.controller')
const NewsController = require('../controllers/news.controller')
const EventController = require('../controllers/event.controller')

var router = require('express').Router()

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected').get(protected)

router.route('/signup').post(AuthenticationController.signup)

router.route('/createNews').post(NewsController.createNews)

router.route('/getNews').get(NewsController.getNews)

router.route('/getEvent').get(EventController.getEvent)

router.route('/createEvent').post(EventController.createEvent)

router.route('/getNewsByFaculty/:faculty').get(NewsController.getNewsByFaculty)

router.route('/addFavoriteNews').post(AuthenticationController.updateFavoriteNews)

router.route('/deleteFavoriteNews').post(AuthenticationController.undoFavoriteNews)

router.route('/checkFavoriteNews').post(AuthenticationController.checkFavoriteNews)

router.route('/getAllFavoriteNews/:id').get(AuthenticationController.getAllFavoriteNews)

router.route('/joinEvent').post(EventController.joinEvent)

router.route('/eventAvailable').post(EventController.eventAvailable)

router.route('/joinEventByCoupon').post(EventController.joinEventByCoupon)

router.route('/addEventCoupon').post(EventController.addEventCoupon)

module.exports = function(app) {
    app.use('/v1', router)
}