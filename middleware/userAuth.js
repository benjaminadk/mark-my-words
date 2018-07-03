const jwt = require('jsonwebtoken')
const keys = require('../config')
const models = require('../models')

module.exports = async token => {
  try {
    const decoded = await jwt.verify(token, keys.JWT_SECRET)
    const user = await models.User.findById(decoded.id)
    return user
  } catch (error) {
    return null
  }
}
