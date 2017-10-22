const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')
const LdapStrategy = require('passport-ldapauth')

const User = require('mongoose').model('user')
const Student = require('mongoose').model('student')
const config = require('../config')

let localOptions = {
    usernameField: 'email'
}

let localStrategy = new LocalStrategy(localOptions, function(email, password, done) {
    User.findOne({
        $or: [
            { email: email.toLowerCase() },
            { username: email }
        ]
        }, function(err, user){
        if (err) { return done(err) }
        if (!user) { return done(null, false) }
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err) }
            if (!isMatch) { return done(null, false) }
            return done(null, user)
        })
    })
})

let jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
}

let jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
    Student.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false) }
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

let jwtStrategyLdap = new JwtStrategy(jwtOptions, function(payload, done) {
    Student.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false) }
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

let OPTS = {
  server: {
    url: 'ldap://10.1.130.12:389',
    // bindDn: 'uid=kmuttalumni,ou=admin,dc=kmutt,dc=ac,dc=th',
    // bindCredentials: 'dgG#5DTFS?UgP',
    searchBase: 'ou=people,ou=st,dc=kmutt,dc=ac,dc=th',
    searchFilter: '(uid={{username}})'
  }
}

let ldapstrategy = new LdapStrategy(OPTS, function(user, done) {
    return done(null, user)
})

passport.use(localStrategy)
passport.use(jwtStrategy)
passport.use(ldapstrategy)