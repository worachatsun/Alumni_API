const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    let db = mongoose.connect(config.mongoUri, {
        useMongoClient: true
    }, function(error) {
        console.log(error)
    })
    
    require('../models/user')
    require('../models/news')
    require('../models/event')
    require('../models/donation')
    require('../models/career')
    require('../models/student')
    require('../models/inbox')
    require('../models/admin')

    const AuthenticationController = require('../controllers/authentication.controller')
    AuthenticationController.seedAdmin()

    return db
}