import gql from 'graphql-tag'

export const POST_QUERY = gql`
  query($postId: ID) {
    postById(postId: $postId) {
      id
      title
      subTitle
      body
      words
      image
      tags
      fire
      createdAt
      comments {
        _id
        text
        createdAt
        postedBy {
          username
          avatar
        }
        subComments {
          _id
          text
          createdAt
          postedBy {
            username
            avatar
            createdAt
          }
        }
      }
    }
  }
`
