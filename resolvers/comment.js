const keys = require('../config')

module.exports = {
  Mutation: {
    createComment: async (root, { text, postId }, { models, user }) => {
      const comment = new models.Comment({
        text,
        reply: false,
        postedBy: user.id
      })
      try {
        // save comment and add it to post
        const savedComment = await comment.save()
        const filter = { id: postId }
        const update = { $push: { comments: savedComment.id } }
        await models.Post.findOneAndUpdate(filter, update)

        // create new notification save it and add it to my admin user
        const notification = new models.Notification({
          type: 'New Comment',
          avatar: user.avatar,
          text: `${user.username} commented on a post`,
          link: `/post/${postId}`
        })
        const savedNotification = await notification.save()
        const filter2 = { googleId: keys.GOOGLE_ID }
        const update2 = { $push: { notifications: savedNotification._id } }
        await models.User.findOneAndUpdate(filter2, update2)

        // return payload based on success or error
        return {
          success: true,
          message: 'comment created successfully'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error creating comment'
        }
      }
    },

    createSubComment: async (root, { text, commentId }, { models, user }) => {
      const comment = new models.Comment({
        text,
        reply: true,
        postedBy: user.id
      })
      try {
        const savedComment = await comment.save()
        const filter = { _id: commentId }
        const update = { $push: { subComments: savedComment.id } }
        await models.Comment.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: 'reply created successfully'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error creating comment'
        }
      }
    }
  }
}
