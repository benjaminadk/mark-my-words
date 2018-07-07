import gql from 'graphql-tag'

export const CREATE_COMMENT_MUTATION = gql`
  mutation($text: String, $postId: ID) {
    createComment(text: $text, postId: $postId) {
      success
      message
    }
  }
`
