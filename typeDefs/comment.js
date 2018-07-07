const { gql } = require('apollo-server')

module.exports = gql`
  type Comment {
    _id: ID
    text: String
    reply: Boolean
    subComments: [Comment]
    postedBy: User
    createdAt: String
  }

  type Mutation {
    createComment(text: String, postId: ID): Payload
  }
`
