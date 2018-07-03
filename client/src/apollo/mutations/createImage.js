import gql from 'graphql-tag'

export const CREATE_IMAGE_MUTATION = gql`
  mutation($url: String, $title: String) {
    createImage(url: $url, title: $title) {
      success
      message
    }
  }
`
