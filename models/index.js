const mongoose = require('mongoose')
require('./post')
require('./image')
const Post = mongoose.model('post')
const Image = mongoose.model('image')

module.exports = {
  Post,
  Image
}
