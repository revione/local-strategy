const mongoose = require('mongoose')

require('dotenv').config()
const DB_URI = process.env.NODE_ENV === 'production' ? process.env.DB_URI_PROD : process.env.DB_URI

const connection = mongoose.createConnection(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Expose the connection
module.exports = connection
