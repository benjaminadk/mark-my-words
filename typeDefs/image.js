const { gql } = require('apollo-server')

module.exports = gql`
  type Image {
    id: ID
    url: String
    title: String
    createdAt: String
  }

  type S3Payload {
    requestUrl: String
    imageUrl: String
  }

  type Query {
    allImages: [Image]
  }

  type Mutation {
    createImage(url: String, title: String): Payload
    s3Sign(filename: String, filetype: String): S3Payload
    deleteImage(imageId: ID, imageUrl: String): Payload
  }
`
