process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'

const mongoose = require('./config/mongoose')
const express = require('./config/express')

const db = mongoose()
const app = express()

const server = app.listen(PORT,HOST)
const io = require('./config/socketio')(server, db)

console.log('Listening on', HOST, PORT)