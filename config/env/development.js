module.exports = {
    mongoUri: process.env.MONGO_HOST+process.env.MONGO_TABLE || 'mongodb://localhost/Alumni',
    debug: true
}