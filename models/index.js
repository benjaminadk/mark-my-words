const mongoose = require('mongoose')
require('./post')
require('./image')
require('./comment')
require('./user')
require('./notification')
const Post = mongoose.model('post')
const Image = mongoose.model('image')
const Comment = mongoose.model('comment')
const User = mongoose.model('user')
const Notification = mongoose.model('notification')

module.exports = {
  Post,
  Image,
  Comment,
  User,
  Notification
}
