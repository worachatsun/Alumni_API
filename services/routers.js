var router = require('express').Router()

const AuthenticationController = require('../controllers/authentication_controller')

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected').get(protected)

router.route('/signup')
    .post(AuthenticationController.signup)

module.exports = router