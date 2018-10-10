const { gql } = require('apollo-server')

module.exports = gql`
  type Post {
    _id: ID
    id: ID
    title: String
    subTitle: String
    body: String
    words: Int
    image: String
    tags: [String]
    views: Int
    fire: Int
    comments: [Comment]
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

    latestPost: Post
  }

  type Mutation {
    createPost(
      title: String
      subTitle: String
      body: String
      words: Int
      image: String
      tags: [String]
    ): Payload

    updatePost(
      postId: ID
      title: String
      subTitle: String
      body: String
      words: Int
      image: String
      tags: [String]
    ): Payload

    deletePost(postId: ID): Payload

    addView(postId: ID): Payload

    addFire(postId: ID, plus: Int): Payload

    dropDatabase: Payload
  }
`
