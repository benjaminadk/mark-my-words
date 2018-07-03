import gql from 'graphql-tag'

export const CREATE_POST_MUTATION = gql`
  mutation($title: String, $body: String, $image: String, $tags: [String]) {
    createPost(title: $title, body: $body, image: $image, tags: $tags) {
      success
      message
    }
  }
`
