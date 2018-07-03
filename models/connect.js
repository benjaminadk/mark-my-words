const mongoose = require('mongoose')
const keys = require('../config')

module.exports = async () => {
  try {
    await mongoose.connect(
      keys.MLAB_URI,
      () => console.log('MONGO UP')
    )
  } catch (error) {
    console.log(error)
  }
}
