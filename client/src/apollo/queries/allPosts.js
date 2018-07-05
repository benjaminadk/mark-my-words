import gql from 'graphql-tag'

export const ALL_POSTS_QUERY = gql`
  query {
    allPosts {
      id
      title
      subTitle
      body
      tags
      image
      views
      createdAt
    }
  }
`
