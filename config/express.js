const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')

module.exports = function () {
    let app = express()
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    } else {
        app.use(compression)
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())

    require('../services/routers')(app)
    return app
}