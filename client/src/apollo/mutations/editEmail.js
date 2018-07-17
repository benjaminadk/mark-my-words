import gql from 'graphql-tag'

export const EDIT_EMAIL_MUTATION = gql`
  mutation($email: String) {
    editEmail(email: $email) {
      success
      message
    }
  }
`
