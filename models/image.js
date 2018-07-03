const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
  url: String,
  title: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('image', imageSchema)
