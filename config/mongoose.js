const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    let db = mongoose.connect(config.mongoUri)
    mongoose.set('debug', true)
    return db
}