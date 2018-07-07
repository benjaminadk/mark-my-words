const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const autopopulate = require('mongoose-autopopulate')
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: String,
  subTitle: String,
  body: String,
  image: String,
  tags: [String],
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'comment',
    autopopulate: true
  },
  views: {
    type: [Schema.Types.ObjectId],
    ref: 'view'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

postSchema.plugin(AutoIncrement, { inc_field: 'id' })
postSchema.plugin(autopopulate)
mongoose.model('post', postSchema)
