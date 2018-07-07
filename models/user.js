const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  googleId: String,
  email: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
  },
  avatar: String,
  jwt: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('user', userSchema)
