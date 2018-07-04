const mongoose = require('mongoose')

module.exports = {
  Query: {
    allPosts: async (root, args, { models }) => await models.Post.find(),

    postById: async (root, { postId }, { models }) =>
      await models.Post.findById(postId)
  },

  Mutation: {
    createPost: async (
      root,
      { title, subTitle, body, image, tags },
      { models }
    ) => {
      try {
        const post = new models.Post({
          title,
          subTitle,
          body,
          image,
          tags
        })
        await post.save()
        return {
          success: true,
          message: 'new post created'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error creating post'
        }
      }
    },
    dropDatabase: async () => {
      try {
        await mongoose.connection.dropDatabase()
        return {
          success: true,
          message: 'database dropped'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error dropping database'
        }
      }
    }
  }
}
