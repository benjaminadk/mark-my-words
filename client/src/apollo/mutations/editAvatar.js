import gql from 'graphql-tag'

export const EDIT_AVATAR_MUTATION = gql`
  mutation($avatar: String) {
    editAvatar(avatar: $avatar) {
      success
      message
    }
  }
`
