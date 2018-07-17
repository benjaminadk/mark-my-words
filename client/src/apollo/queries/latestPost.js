import gql from 'graphql-tag'

export const LATEST_POST_QUERY = gql`
  query {
    latestPost {
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
