const { gql } = require('apollo-server')

module.exports = gql`
  type Payload {
    success: Boolean
    message: String
  }
`
