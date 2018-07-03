import gql from 'graphql-tag'

export const ALL_IMAGES_QUERY = gql`
  query {
    allImages {
      id
      url
      title
      createdAt
    }
  }
`
