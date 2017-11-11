const passport = require('passport')
const multer = require('multer')
//const upload = multer({ dest: 'public/uploads/' })

const AuthenticationController = require('../controllers/authentication.controller')
const NewsController = require('../controllers/news.controller')
const EventController = require('../controllers/event.controller')
const DonateController = require('../controllers/donation.controller')
const CareerController = require('../controllers/career.controller')
const InboxController = require('../controllers/inbox.controller')
const UserController = require('../controllers/user.controller')
const AdminController = require('../controllers/admin.controller')
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
router.route('/adminSignup').post(AuthenticationController.adminRegister)
router.route('/adminChangePass').post(AuthenticationController.adminChangePassword)
router.route('/signin').post([requireLogin, AuthenticationController.signin])
router.route('/adminSignin').post( AuthenticationController.adminSignin)
router.route('/signinLdap').post([requireLdapLogin, AuthenticationController.signinLdap])
router.route('/addFavoriteNews').post(AuthenticationController.updateFavoriteNews)
router.route('/deleteFavoriteNews').post(AuthenticationController.undoFavoriteNews)
router.route('/checkFavoriteNews').post(AuthenticationController.checkFavoriteNews)
router.route('/getAllFavoriteNews/:id').get(AuthenticationController.getAllFavoriteNews)
router.route('/getJoinedEvent/:id').get(AuthenticationController.getJoinedEvent)
router.route('/updateUserData').post(AuthenticationController.updateUserData)

router.route('/getAllUser').get(UserController.getAllUser)
router.route('/getUserById/:id').get(UserController.getUserById)
router.route('/getUserData').post(UserController.getUserData)

router.route('/getAdminData').post(AdminController.getAdminData)

router.route('/createNews').post(NewsController.createNews)
router.route('/getNews/:offset/:limit').get(NewsController.getNewsByOffset)
router.route('/getNews').get(NewsController.getNews)
router.route('/getNewsByFaculty/:faculty/:offset/:limit').get(NewsController.getNewsByFaculty)
router.route('/getFavoriteCount/:id').get(NewsController.getFavoriteCount)
router.route('/getNewsById/:id').get(NewsController.getNewsById)
router.route('/editNews').post(NewsController.editNews)
router.route('/removeNews').post(NewsController.removeNews)
router.route('/getExpireNews/:day').get(NewsController.getExpireNews)

router.route('/joinEvent').post(EventController.joinEvent)
router.route('/eventAvailable').post(EventController.eventAvailable)
router.route('/joinEventByCoupon').post(EventController.joinEventByCoupon)
router.route('/addEventCoupon').post(EventController.addEventCoupon)
router.route('/getEvent').get(EventController.getEvent)
router.route('/getEvent/:offset/:limit').get(EventController.getEventByOffset)
router.route('/createEvent').post(EventController.createEvent)
router.route('/getEventsById/:id').get(EventController.getEventsById)
router.route('/editEvent').post(EventController.editEvent)
router.route('/removeEvent').post(EventController.removeEvent)
router.route('/getExpireEvent/:day').get(EventController.getExpireEvent)

router.route('/createDonation').post(DonateController.createDonation)
router.route('/getDonation/:offset/:limit').get(DonateController.getDonation)
router.route('/getDonation').get(DonateController.getAllDonation)
router.route('/getDonationById/:id').get(DonateController.getDonationById)
router.route('/editDonation').post(DonateController.editDonation)
router.route('/removeDonation').post(DonateController.removeDonation)

router.route('/createCareer').post(CareerController.createCareer)
router.route('/getCareer').get(CareerController.getAllCareer)
router.route('/getCareer/:offset/:limit').get(CareerController.getCareer)
router.route('/getCareerById/:id').get(CareerController.getCareerById)
router.route('/editCareer').post(CareerController.editCareer)
router.route('/removeCareer').post(CareerController.removeCareer)

router.route('/createChatRoom').post(InboxController.createRoomChat)
router.route('/pushChat').post(InboxController.updateInboxChat)
router.route('/fetchChat').post(InboxController.fetchInboxChat)
router.route('/getAllChat').get(InboxController.getAllChat)
router.route('/getRoomChat/:id').get(InboxController.getRoomChatById)

router.route('/upload').post(function(req, res) {
    let img = ''
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            const fn = file.originalname.split('.')
            img = `${fn[0]}-${Date.now()}.${fn[fn.length-1]}`
            cb(null, img)
        }
    })
    const upload = multer({ storage: storage }).single('cover')
	upload(req, res, function(err) {
        if(err) {return console.log(err)}
		res.json({ img: `static/uploads/${img}` })
	})
})

router.route('/upload/editor/').post(function(req, res) {
    let img = ''
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/editors/')
        },
        filename: function (req, file, cb) {
            const fn = file.originalname.split('.')
            img = `${fn[0]}-${Date.now()}.${fn[fn.length-1]}`
            cb(null, img)
        }
    })
    const upload = multer({ storage: storage }).single('editor')
	upload(req, res, function(err) {
        if(err) {return console.log(err)}
        console.log({ img: `static/editors/${img}` })
		return res.json({ img: `static/editors/${img}` })
	})
})

// router.post('/upload', upload.single('cover'), function (req, res, next) {
//     try {
//         res.json({ status: 'success' })
//     } catch (err) {
//         res.sendStatus(400)
//     }
// })

module.exports = function(app) {
    app.use('/v1', router)
}