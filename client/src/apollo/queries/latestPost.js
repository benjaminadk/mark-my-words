import gql from 'graphql-tag'

export const LATEST_POST_QUERY = gql`
  query {
    latestPost {
      id
      title
      subTitle
      body
      image
      tags
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
          }
        }
      }
    }
  }
`
