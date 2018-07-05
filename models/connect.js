const mongoose = require('mongoose')
const keys = require('../config')

module.exports = async () => {
  try {
    mongoose.connect(
      keys.MLAB_URI,
      () => console.log('MONGO UP')
    )
    mongoose.Promise = global.Promise
    mongoose.set('debug', true)
  } catch (error) {
    console.log(error)
  }
}
