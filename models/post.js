const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  subTitle: String,
  body: String,
  image: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model('post', postSchema)
