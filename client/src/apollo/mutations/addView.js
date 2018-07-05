import gql from 'graphql-tag'

export const ADD_VIEW_MUTATION = gql`
  mutation($postId: ID) {
    addView(postId: $postId) {
      success
      message
    }
  }
`
