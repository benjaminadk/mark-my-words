const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
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

  notifications: {
    type: [Schema.Types.ObjectId],
    ref: 'notification',
    autopopulate: { maxDepth: 2 }
  },

  seen: [String],

  createdAt: {
    type: Date,
    default: Date.now()
  }
})

userSchema.plugin(autopopulate)
mongoose.model('user', userSchema)
