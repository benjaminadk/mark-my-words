import gql from 'graphql-tag'

export const POST_QUERY = gql`
  query($postId: ID) {
    postById(postId: $postId) {
      id
      title
      body
      image
      createdAt
    }
  }
`
