const { gql } = require('apollo-server')

module.exports = gql`
  type Notification {
    id: ID
    type: String
    avatar: String
    text: String
    link: String
    createdAt: String
  }

  type Mutation {
    markAsSeen(notificationId: ID): Payload
  }
`
