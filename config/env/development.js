module.exports = {
    mongoUri: process.env.MONGO_HOST+process.env.MONGO_TABLE || 'mongodb://db/Alumni',
    debug: true
}
