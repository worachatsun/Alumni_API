process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var PORT = process.env.PORT || 3000
var HOST = process.env.HOST || '127.0.0.1'

let mongoose = require('./config/mongoose')
let express = require('./config/express')

let db = mongoose()
var app = express()

var router = require('./services/routers')

app.listen(PORT,HOST)

console.log('Listening on', HOST, PORT)