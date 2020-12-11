const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const expressEjsLayout = require('express-ejs-layouts')
const MongoStore = require('connect-mongo')(session)
const dotenv = require('dotenv').config()

//mongoose
const connection = require('./config/db')

// Create the Express application
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//express session
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions'
})
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
  })
)

// EJS
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

// passport config:
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(3000)
