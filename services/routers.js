const AuthenticationController = require('../controllers/authentication_controller')

var router = require('express').Router()

function protected (req, res, next) {
    res.send('Here is the secret!')
}

router.route('/protected')
    .get(protected)

router.route('/signup')
    .post(AuthenticationController.signup)

module.exports = router