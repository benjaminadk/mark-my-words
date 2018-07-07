import gql from 'graphql-tag'

export const AUTOLOGIN_MUTATION = gql`
  mutation {
    autoLogin {
      success
      message
      user {
        id
        email
        username
        avatar
        jwt
        createdAt
      }
    }
  }
`
