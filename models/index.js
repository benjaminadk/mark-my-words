const mongoose = require('mongoose')
require('./post')
require('./image')
require('./view')
require('./comment')
require('./user')
const Post = mongoose.model('post')
const Image = mongoose.model('image')
const View = mongoose.model('view')
const Comment = mongoose.model('comment')
const User = mongoose.model('user')

module.exports = {
  Post,
  Image,
  View,
  Comment,
  User
}
