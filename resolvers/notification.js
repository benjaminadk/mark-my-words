module.exports = {
  Mutation: {
    markAsSeen: async (root, { notificationId }, { models, user }) => {
      try {
        const filter = { _id: user._id }
        const update = { $push: { seen: notificationId } }
        await models.User.findOneAndUpdate(filter, update)
        return {
          success: true,
          message: 'notification marked as seen'
        }
      } catch (error) {
        return {
          success: false,
          message: 'error marking notification as seen'
        }
      }
    }
  }
}
