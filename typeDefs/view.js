const { gql } = require('apollo-server')

module.exports = gql`
  type View {
    id: ID
    createdAt: String
  }
`
