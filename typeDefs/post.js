const { gql } = require('apollo-server')

module.exports = gql`
  type Post {
    id: ID
    title: String
    subTitle: String
    body: String
    image: String
    tags: [String]
    views: Int
    createdAt: String
  }

  type Edge {
    node: Post
    cursor: String
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type PaginationPayload {
    totalCount: Int
    edges: [Edge]
    pageInfo: PageInfo
  }

  type Query {
    allPosts: [Post]

    allPostsPaginated(first: Int, after: String): PaginationPayload

    postById(postId: ID): Post
  }

  type Mutation {
    createPost(
      title: String
      subTitle: String
      body: String
      image: String
      tags: [String]
    ): Payload

    updatePost(
      postId: ID
      title: String
      subTitle: String
      body: String
      image: String
      tags: [String]
    ): Payload

    deletePost(postId: ID): Payload

    addView(postId: ID): Payload

    dropDatabase: Payload
  }
`
