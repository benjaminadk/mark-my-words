import gql from 'graphql-tag'

export const CREATE_SUB_COMMENT_MUTATION = gql`
  mutation($text: String, $commentId: ID) {
    createSubComment(text: $text, commentId: $commentId) {
      success
      message
    }
  }
`
