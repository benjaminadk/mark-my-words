const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  subTitle: String,
  body: String,
  image: String,
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

postSchema.plugin(AutoIncrement, { inc_field: 'id' })
mongoose.model('post', postSchema)
