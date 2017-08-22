const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    let db = mongoose.connect(config.mongoUri, {
        useMongoClient: true
    })
    
    require('../models/user')
    require('../models/news')
    require('../models/event')
    require('../models/donation')
    require('../models/career')
    require('../models/student')
    require('../models/inbox')

    return db
}