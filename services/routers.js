const passport = require('passport')

const AuthenticationController = require('../controllers/authentication.controller')
const NewsController = require('../controllers/news.controller')
const EventController = require('../controllers/event.controller')
const DonateController = require('../controllers/donation.controller')
const CareerController = require('../controllers/career.controller')
const InboxController = require('../controllers/inbox.controller')
const passportService = require('./passport')

let requireAuth = passport.authenticate('jwt', {session: false})
let requireLogin = passport.authenticate('local', {session: false})
let requireLdapLogin = passport.authenticate('ldapauth', {session: false})
let router = require('express').Router()

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected').get(requireAuth, protected)

router.route('/signup').post(AuthenticationController.signup)
router.route('/signin').post([requireLogin, AuthenticationController.signin])
router.route('/signinLdap').post([requireLdapLogin, AuthenticationController.signinLdap])
router.route('/addFavoriteNews').post(AuthenticationController.updateFavoriteNews)
router.route('/deleteFavoriteNews').post(AuthenticationController.undoFavoriteNews)
router.route('/checkFavoriteNews').post(AuthenticationController.checkFavoriteNews)
router.route('/getAllFavoriteNews/:id').get(AuthenticationController.getAllFavoriteNews)
router.route('/getJoinedEvent/:id').get(AuthenticationController.getJoinedEvent)

router.route('/createNews').post(NewsController.createNews)
router.route('/getNews/:offset/:limit').get(NewsController.getNewsByOffset)
router.route('/getNews').get(NewsController.getNews)
router.route('/getNewsByFaculty/:faculty/:offset/:limit').get(NewsController.getNewsByFaculty)

router.route('/joinEvent').post(EventController.joinEvent)
router.route('/eventAvailable').post(EventController.eventAvailable)
router.route('/joinEventByCoupon').post(EventController.joinEventByCoupon)
router.route('/addEventCoupon').post(EventController.addEventCoupon)
router.route('/getEvent').get(EventController.getEvent)
router.route('/getEvent/:offset/:limit').get(EventController.getEventByOffset)
router.route('/createEvent').post(EventController.createEvent)

router.route('/createDonation').post(DonateController.createDonation)
router.route('/getDonation/:offset/:limit').get(DonateController.getDonation)
router.route('/getDonation').get(DonateController.getAllDonation)

router.route('/createCareer').post(CareerController.createCareer)
router.route('/getCareer').get(CareerController.getAllCareer)
router.route('/getCareer/:offset/:limit').get(CareerController.getCareer)

router.route('/createChatRoom').post(InboxController.createRoomChat)
router.route('/pushChat').post(InboxController.updateInboxChat)
router.route('/fetchChat').post(InboxController.fetchInboxChat)

module.exports = function(app) {
    app.use('/v1', router)
}