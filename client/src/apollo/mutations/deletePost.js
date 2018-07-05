import gql from 'graphql-tag'

export const DELETE_POST_MUTATION = gql`
  mutation($postId: ID) {
    deletePost(postId: $postId) {
      success
      message
    }
  }
`
