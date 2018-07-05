const aws = require('aws-sdk')
const keys = require('../config')

const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'us-west-1',
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
})
const s3Bucket = 'simple-blogger-react'

module.exports = {
  Query: {
    allImages: async (root, args, { models }) => await models.Image.find()
  },

  Mutation: {
    createImage: async (root, { url, title }, { models }) => {
      const image = new models.Image({
        url,
        title
      })
      try {
        await image.save()
        return {
          success: true,
          message: 'image saved'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error saving image'
        }
      }
    },

    s3Sign: async (root, { filename, filetype }, { models }) => {
      const s3Params = {
        Bucket: s3Bucket,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: 'public-read'
      }
      try {
        const requestUrl = await s3.getSignedUrl('putObject', s3Params)
        const imageUrl = `https://${s3Bucket}.s3.amazonaws.com/${filename}`
        return { requestUrl, imageUrl }
      } catch (error) {
        return null
      }
    },

    deleteImage: async (root, { imageId, imageUrl }, { models }) => {
      try {
        const params = {
          Bucket: s3Bucket,
          Key: imageUrl
        }
        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err)
        })
        await models.Image.deleteOne({ _id: imageId })
        return {
          success: true,
          message: 'image deleted successfully'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error deleting image'
        }
      }
    }
  }
}
