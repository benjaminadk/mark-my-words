const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const autopopulate = require('mongoose-autopopulate')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  subTitle: String,
  body: String,
  words: Number,
  image: String,
  tags: [String],
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'comment',
    autopopulate: { maxDepth: 2 }
  },
  views: {
    type: [Schema.Types.ObjectId],
    ref: 'view'
  },
  fire: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

postSchema.plugin(AutoIncrement, { inc_field: 'id' })
postSchema.plugin(autopopulate)
mongoose.model('post', postSchema)
