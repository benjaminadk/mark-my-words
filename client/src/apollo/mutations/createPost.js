import gql from 'graphql-tag'

export const CREATE_POST_MUTATION = gql`
  mutation(
    $title: String
    $subTitle: String
    $body: String
    $words: Int
    $image: String
    $tags: [String]
  ) {
    createPost(
      title: $title
      subTitle: $subTitle
      body: $body
      words: $words
      image: $image
      tags: $tags
    ) {
      success
      message
    }
  }
`
