const mongoose = require('mongoose')
const { Schema } = mongoose

const viewSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('view', viewSchema)
