import gql from 'graphql-tag'

export const EDIT_USERNAME_MUTATION = gql`
  mutation($username: String) {
    editUsername(username: $username) {
      success
      message
    }
  }
`
