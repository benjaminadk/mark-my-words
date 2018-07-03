const { gql } = require('apollo-server')

module.exports = gql`
  type Post {
    id: ID
    title: String
    body: String
    image: String
    tags: [String]
    createdAt: String
  }

  type Query {
    allPosts: [Post]
    postById(postId: ID): Post
  }

  type Mutation {
    createPost(
      title: String
      body: String
      image: String
      tags: [String]
    ): Payload
    dropDatabase: Payload
  }
`
