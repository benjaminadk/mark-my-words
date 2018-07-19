const mongoose = require('mongoose')
const { Schema } = mongoose

const notificationSchema = new Schema({
  type: String,

  avatar: String,

  text: String,

  link: String,

  createdAt: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('notification', notificationSchema)
