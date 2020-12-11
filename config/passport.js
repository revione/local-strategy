const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.getAuthenticated(email, password, function (err, user, reason) {
        if (err) throw err

        if (user) {
          return done(null, user)
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin
        switch (reason) {
          case reasons.NOT_FOUND:
            return done(null, false, { message: 'email not registered' })
          case reasons.PASSWORD_INCORRECT:
            return done(null, false, { message: 'password incorrect' })
          case reasons.MAX_ATTEMPTS:
            return done(null, false, { message: 'account is temporarily locked' })
          // console.log('account is temporarily locked')
          // send email or otherwise notify user that account is
          // temporarily locked
        }
      })
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
}
