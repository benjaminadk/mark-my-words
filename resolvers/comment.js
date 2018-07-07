module.exports = {
  Mutation: {
    createComment: async (root, { text, postId }, { models, user }) => {
      const comment = new models.Comment({
        text,
        reply: false,
        postedBy: user.id
      })
      try {
        const savedComment = await comment.save()
        const filter = { id: postId }
        const update = { $push: { comments: savedComment.id } }
        await models.Post.findOneAndUpdate(filter, update)
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
    }
  }
}