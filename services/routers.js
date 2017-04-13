const AuthenticationController = require('../controllers/authentication.controller')
const NewsController = require('../controllers/news.controller')
const EventController = require('../controllers/event.controller')
const DonateController = require('../controllers/donation.controller')
const CareerController = require('../controllers/career.controller')

var router = require('express').Router()

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected').get(protected)

router.route('/signup').post(AuthenticationController.signup)
router.route('/addFavoriteNews').post(AuthenticationController.updateFavoriteNews)
router.route('/deleteFavoriteNews').post(AuthenticationController.undoFavoriteNews)
router.route('/checkFavoriteNews').post(AuthenticationController.checkFavoriteNews)
router.route('/getAllFavoriteNews/:id').get(AuthenticationController.getAllFavoriteNews)
router.route('/getJoinedEvent/:id').get(AuthenticationController.getJoinedEvent)

router.route('/createNews').post(NewsController.createNews)
router.route('/getNews').get(NewsController.getNews)
router.route('/getNewsByFaculty/:faculty').get(NewsController.getNewsByFaculty)

router.route('/joinEvent').post(EventController.joinEvent)
router.route('/eventAvailable').post(EventController.eventAvailable)
router.route('/joinEventByCoupon').post(EventController.joinEventByCoupon)
router.route('/addEventCoupon').post(EventController.addEventCoupon)
router.route('/getEvent').get(EventController.getEvent)
router.route('/createEvent').post(EventController.createEvent)

router.route('/createDonation').post(DonateController.createDonation)
router.route('/getDonation').get(DonateController.getDonation)

router.route('/createCareer').post(CareerController.createCareer)
router.route('/getCareer').get(CareerController.getCareer)

module.exports = function(app) {
    app.use('/v1', router)
}