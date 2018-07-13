const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    id: ID
    googleId: String
    email: String
    username: String
    avatar: String
    jwt: String
    createdAt: String
  }

  type UserPayload {
    success: Boolean
    message: String
    user: User
    admin: Boolean
  }

  type Query {
    userById(userId: ID): User
  }

  type Mutation {
    autoLogin: UserPayload
  }
`
