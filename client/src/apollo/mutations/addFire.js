import gql from 'graphql-tag'

export const ADD_FIRE_MUTATION = gql`
  mutation($postId: ID, $plus: Int) {
    addFire(postId: $postId, plus: $plus) {
      success
      message
    }
  }
`
