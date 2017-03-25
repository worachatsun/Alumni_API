const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    let db = mongoose.connect(config.mongoUri)
    
    require('../models/user')
    require('../models/news')
    require('../models/event')

    return db
}