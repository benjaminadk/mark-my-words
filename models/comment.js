const mongoose = require('mongoose')
const { Schema } = mongoose
const autopopulate = require('mongoose-autopopulate')

const commentSchema = new Schema({
  text: String,
  reply: Boolean,
  subComments: {
    type: [Schema.Types.ObjectId],
    ref: 'comment',
    autopopulate: { maxDepth: 3 }
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    autopopulate: { maxDepth: 1 }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

commentSchema.plugin(autopopulate)
mongoose.model('comment', commentSchema)
