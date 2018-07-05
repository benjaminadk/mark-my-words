import gql from 'graphql-tag'

export const DELETE_IMAGE_MUTATION = gql`
  mutation($imageId: ID, $imageUrl: String) {
    deleteImage(imageId: $imageId, imageUrl: $imageUrl) {
      success
      message
    }
  }
`
